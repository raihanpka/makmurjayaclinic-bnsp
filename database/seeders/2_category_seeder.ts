import DrugCategory from '#models/drug_category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await DrugCategory.createMany([
      { name: 'Obat Resep', description: 'Obat yang memerlukan resep dokter.' },
      { name: 'Obat Bebas', description: 'Obat yang dapat dibeli bebas tanpa resep.' },
      { name: 'Suplemen', description: 'Vitamin dan suplemen kesehatan.' },
      { name: 'Alat Kesehatan', description: 'Peralatan dan perlengkapan medis.' },
    ])
  }
}
