import DrugCategory from '#models/drug_category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await DrugCategory.createMany([
      { name: 'Obat Resep', description: 'Obat keras yang hanya dapat dibeli dengan resep dokter asli.' },
      { name: 'Obat Bebas', description: 'Obat yang dapat dibeli bebas tanpa resep dokter untuk gejala ringan.' },
      { name: 'Suplemen & Vitamin', description: 'Kumpulan multivitamin untuk menjaga daya tahan tubuh.' },
      { name: 'Ibu & Bayi', description: 'Perlengkapan kesehatan, susu, dan obat khusus ibu dan bayi.' },
      { name: 'P3K & Antiseptik', description: 'Peralatan pertolongan pertama pada kecelakaan dan luka.' },
      { name: 'Perawatan Kulit', description: 'Produk dermatologi klinis dan salep kulit.' },
    ])
  }
}
