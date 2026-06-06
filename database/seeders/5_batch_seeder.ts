import DrugBatch from '#models/drug_batch'
import StockMovement from '#models/stock_movement'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // 1: Aspirin, 2: Amoxicillin, 3: Panadol, 4: Enervon, 5: Betadine
    const batches = [
      { drugId: 1, batchNumber: 'BATCH-ASP-01', quantity: 150, expiresAt: DateTime.now().plus({ months: 24 }) },
      { drugId: 2, batchNumber: 'BATCH-AMX-01', quantity: 200, expiresAt: DateTime.now().plus({ months: 18 }) },
      { drugId: 2, batchNumber: 'BATCH-AMX-02', quantity: 50, expiresAt: DateTime.now().plus({ months: 3 }) }, // Expiring soon
      { drugId: 3, batchNumber: 'BATCH-PCT-01', quantity: 500, expiresAt: DateTime.now().plus({ months: 36 }) },
      { drugId: 4, batchNumber: 'BATCH-VIT-01', quantity: 80, expiresAt: DateTime.now().plus({ months: 12 }) },
      { drugId: 5, batchNumber: 'BATCH-BTR-01', quantity: 100, expiresAt: DateTime.now().plus({ months: 48 }) },
    ]

    for (const batch of batches) {
      const createdBatch = await DrugBatch.create(batch)
      
      await StockMovement.create({
        drugId: batch.drugId,
        type: 'restock',
        quantity: batch.quantity,
        description: `Initial seed restock for batch ${batch.batchNumber}`
      })
    }
  }
}
