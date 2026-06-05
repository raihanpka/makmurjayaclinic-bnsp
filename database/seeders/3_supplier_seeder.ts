import Supplier from '#models/supplier'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Supplier.createMany([
      { name: 'PT Kalbe Farma', contact: '08111222333', address: 'Jakarta' },
      { name: 'PT Sanbe Farma', contact: '08111222444', address: 'Bandung' },
      { name: 'PT Kimia Farma', contact: '08111222555', address: 'Jakarta' },
    ])
  }
}
