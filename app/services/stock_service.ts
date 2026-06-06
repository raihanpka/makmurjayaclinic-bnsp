import db from '@adonisjs/lucid/services/db'
import DrugBatch from '#models/drug_batch'
import StockMovement from '#models/stock_movement'
import { DateTime } from 'luxon'

export default class StockService {
  /**
   * Get total stock for a drug
   */
  async getSummary(drugId: number): Promise<number> {
    const result = await DrugBatch.query()
      .where('drug_id', drugId)
      .where('expires_at', '>', DateTime.now().toSQL())
      .sum('quantity as total')
      .first()

    return Number(result?.$extras.total || 0)
  }

  /**
   * Deduct stock using FIFO (First In First Out) based on expiry date
   */
  async deductFromSale(drugId: number, quantity: number, orderId?: number, trx?: any): Promise<void> {
    const executeLogic = async (client: any) => {
      // Get active batches sorted by expiry date ascending (FIFO)
      const batches = await DrugBatch.query({ client })
        .where('drug_id', drugId)
        .where('expires_at', '>', DateTime.now().toSQL())
        .where('quantity', '>', 0)
        .orderBy('expires_at', 'asc')
        .forUpdate() // Lock rows for update

      let remaining = quantity
      for (const batch of batches) {
        if (remaining <= 0) break

        const deduction = Math.min(batch.quantity, remaining)
        batch.quantity -= deduction
        remaining -= deduction
        
        batch.useTransaction(client)
        await batch.save()
      }

      if (remaining > 0) {
        throw new Error(`Stok tidak mencukupi untuk obat ID: ${drugId}. Kurang: ${remaining}`)
      }

      // Record movement
      await StockMovement.create({
        drugId,
        quantity: -quantity,
        type: 'sale',
        orderId: orderId || null,
        description: `Penjualan ${orderId ? 'Order #' + orderId : ''}`
      }, { client })

      // Check for low stock
      const result = await DrugBatch.query({ client })
        .where('drug_id', drugId)
        .where('expires_at', '>', DateTime.now().toSQL())
        .sum('quantity as total')
        .first()
      const newStock = Number(result?.$extras.total || 0)

      const Drug = (await import('#models/drug')).default
      const drug = await Drug.findOrFail(drugId, { client })
      
      if (newStock < drug.minStock) {
        const User = (await import('#models/user')).default
        const Notification = (await import('#models/notification')).default
        const admins = await User.query({ client }).whereIn('role', ['admin', 'pharmacist'])
        
        for (const admin of admins) {
          await Notification.create({
            userId: admin.id,
            title: 'Stok Kritis',
            message: `Stok obat ${drug.name} tersisa ${newStock} (Di bawah ambang batas ${drug.minStock}).`,
            type: 'stock',
            link: `/admin/drugs/${drug.id}`
          }, { client })
        }
      }
    }

    if (trx) {
      await executeLogic(trx)
    } else {
      await db.transaction(executeLogic)
    }
  }

  /**
   * Add stock (Restock)
   */
  async addStock(drugId: number, quantity: number, batchNumber: string, expiresAt: DateTime): Promise<void> {
    await db.transaction(async (trx) => {
      // Lock the drug row to prevent concurrent race condition on batch creation
      const Drug = (await import('#models/drug')).default
      await Drug.query({ client: trx }).where('id', drugId).forUpdate().first()

      // Create or update batch
      const existingBatch = await DrugBatch.query({ client: trx })
        .where('drug_id', drugId)
        .where('batch_number', batchNumber)
        .first()

      if (existingBatch) {
        existingBatch.quantity += quantity
        await existingBatch.save()
      } else {
        await DrugBatch.create({
          drugId,
          batchNumber,
          quantity,
          expiresAt
        }, { client: trx })
      }

      // Record movement
      await StockMovement.create({
        drugId,
        quantity,
        type: 'restock',
        description: `Restock batch ${batchNumber}`
      }, { client: trx })
    })
  }
}
