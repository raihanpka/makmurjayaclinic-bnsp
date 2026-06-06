import { Job } from '@rlanz/bull-queue'
import xlsx from 'xlsx'
import Drug from '#models/drug'
import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs'

type Payload = {
  filePath: string
}

export default class ImportDrugsJob extends Job {
  /**
   * The job unique identifier
   */
  static get $$filepath() {
    return import.meta.url
  }

  async handle(payload: Payload) {
    const workbook = xlsx.readFile(payload.filePath)
    const sheetName = workbook.SheetNames[0]
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

    for (const row of data as any[]) {
      await db.transaction(async (trx) => {
        // Simple mapping from row to model
        // Assume CSV columns: sku, name, description, price, category_id, supplier_id, stock
        const drug = await Drug.updateOrCreate(
          { sku: row.sku },
          {
            name: row.name,
            description: row.description,
            price: String(row.price),
            categoryId: row.category_id,
            supplierId: row.supplier_id,
            minStock: row.min_stock !== undefined ? Number(row.min_stock) : 10,
            requiresPrescription: row.requires_prescription === 'true' || row.requires_prescription === 1 || row.requires_prescription === true,
            composition: row.composition || '',
            dosage: row.dosage || '',
            sideEffects: row.side_effects || '',
            isActive: true,
          },
          { client: trx }
        )

        // If 'stock' column is provided in the CSV and is greater than 0
        const stockQty = Number(row.stock || row.stok || 0)
        if (stockQty > 0) {
          const DrugBatch = (await import('#models/drug_batch')).default
          const StockMovement = (await import('#models/stock_movement')).default
          const { DateTime } = await import('luxon')

          // Create a new batch valid for 2 years
          const expiresAt = DateTime.now().plus({ years: 2 })
          const batchNumber = `IMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`

          await DrugBatch.create({
            drugId: drug.id,
            batchNumber,
            quantity: stockQty,
            expiresAt
          }, { client: trx })

          await StockMovement.create({
            drugId: drug.id,
            quantity: stockQty,
            type: 'restock',
            description: 'Import CSV/Excel'
          }, { client: trx })
        }
      })
    }

    // Clean up temporary file
    if (fs.existsSync(payload.filePath)) {
      fs.unlinkSync(payload.filePath)
    }
  }

  async rescue(_payload: Payload, _error: Error) {
    console.error(`ImportDrugsJob failed: ${_error.message}`)
  }
}
