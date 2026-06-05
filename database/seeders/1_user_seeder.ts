import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'Admin Clinic',
        email: 'admin@makmurjaya.id',
        password: 'password123',
        role: 'admin',
      },
      {
        fullName: 'Apoteker',
        email: 'apoteker@makmurjaya.id',
        password: 'password123',
        role: 'pharmacist',
      },
      {
        fullName: 'Kasir',
        email: 'kasir@makmurjaya.id',
        password: 'password123',
        role: 'cashier',
      },
      {
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'customer',
      },
    ])
  }
}
