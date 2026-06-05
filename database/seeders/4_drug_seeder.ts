import Drug from '#models/drug'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Drug.createMany([
      {
        sku: 'DRG-001',
        name: 'Paracetamol 500mg',
        description: 'Obat penurun panas dan pereda nyeri',
        composition: 'Paracetamol 500mg',
        dosage: 'Dewasa: 1-2 tablet tiap 4-6 jam',
        sideEffects: 'Mual, muntah',
        price: '5000',
        requiresPrescription: false,
        minStock: 50,
        categoryId: 2, // Obat Bebas
        supplierId: 1, // PT Kalbe Farma
        isActive: true,
      },
      {
        sku: 'DRG-002',
        name: 'Amoxicillin 500mg',
        description: 'Antibiotik untuk infeksi bakteri',
        composition: 'Amoxicillin 500mg',
        dosage: 'Sesuai petunjuk dokter',
        sideEffects: 'Diare, ruam kulit',
        price: '15000',
        requiresPrescription: true,
        minStock: 20,
        categoryId: 1, // Obat Resep
        supplierId: 2, // PT Sanbe Farma
        isActive: true,
      },
      {
        sku: 'DRG-003',
        name: 'Vitamin C 1000mg',
        description: 'Suplemen vitamin C',
        composition: 'Ascorbic Acid 1000mg',
        dosage: 'Dewasa: 1 tablet effervescent per hari',
        sideEffects: 'Gangguan pencernaan',
        price: '35000',
        requiresPrescription: false,
        minStock: 30,
        categoryId: 3, // Suplemen
        supplierId: 3, // PT Kimia Farma
        isActive: true,
      },
    ])
  }
}
