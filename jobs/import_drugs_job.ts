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
        // Assume CSV columns: sku, name, description, price, category_id, supplier_id
        await Drug.updateOrCreate(
          { sku: row.sku },
          {
            name: row.name,
            description: row.description,
            price: String(row.price),
            categoryId: row.category_id,
            supplierId: row.supplier_id,
            isActive: true,
          },
          { client: trx }
        )
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
