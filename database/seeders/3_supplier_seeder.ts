import Supplier from '#models/supplier'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Supplier.createMany([
      { name: 'PT Kalbe Farma Tbk', contact: '021-42873888', address: 'Gedung KALBE, Jl. Letjen Suprapto, Jakarta Pusat' },
      { name: 'PT Sanbe Farma', contact: '022-6031640', address: 'Jl. Taman Sari No. 10, Bandung, Jawa Barat' },
      { name: 'PT Kimia Farma Tbk', contact: '021-3847709', address: 'Jl. Veteran No. 9, Jakarta Pusat' },
      { name: 'PT Dexa Medica', contact: '021-7454111', address: 'Titan Center, Bintaro Jaya, Tangerang Selatan' },
      { name: 'Bayer Indonesia', contact: '021-30491111', address: 'MidPlaza 1, Jl. Jend. Sudirman Kav 10-11, Jakarta' }
    ])
  }
}
