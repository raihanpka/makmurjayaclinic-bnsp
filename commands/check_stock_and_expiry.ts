import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Drug from '#models/drug'
import DrugBatch from '#models/drug_batch'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import LowStockAlertNotification from '#mails/low_stock_alert_notification'
import ExpiryAlertNotification from '#mails/expiry_alert_notification'
import db from '@adonisjs/lucid/services/db'

export default class CheckStockAndExpiryCommand extends BaseCommand {
  static commandName = 'check:stock-and-expiry'
  static description = 'Check for low stock and near expiry drugs and send alerts'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Starting stock and expiry check...')

    // 1. Check Low Stock
    const lowStockDrugs = await db.from('drugs')
      .leftJoin('drug_batches', 'drugs.id', 'drug_batches.drug_id')
      .select('drugs.*')
      .groupBy('drugs.id')
      .havingRaw('SUM(COALESCE(drug_batches.quantity, 0)) <= drugs.min_stock')

    for (const drugData of lowStockDrugs) {
      const drug = await Drug.find(drugData.id)
      if (drug) {
        const currentStock = await this.getCurrentStock(drug.id)
        await mail.send(new LowStockAlertNotification(drug, currentStock))
        this.logger.info(`Low stock alert sent for: ${drug.name}`)
      }
    }

    // 2. Check Expiry (30, 60, 90 days)
    const expiryThresholds = [30, 60, 90]
    for (const days of expiryThresholds) {
      const targetDate = DateTime.now().plus({ days }).toISODate()
      const batches = await DrugBatch.query()
        .where('expires_at', '=', targetDate as string)
        .where('quantity', '>', 0)
        .preload('drug')

      for (const batch of batches) {
        await mail.send(new ExpiryAlertNotification(batch, days))
        this.logger.info(`Expiry alert (${days} days) sent for batch: ${batch.batchNumber}`)
      }
    }

    this.logger.success('Check completed.')
  }

  private async getCurrentStock(drugId: number): Promise<number> {
    const result = await DrugBatch.query()
      .where('drug_id', drugId)
      .where('expires_at', '>', DateTime.now().toSQL())
      .sum('quantity as total')
      .first()

    return Number(result?.$extras.total || 0)
  }
}
