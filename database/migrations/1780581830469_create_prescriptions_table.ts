import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'prescriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE').notNullable()
      table.string('file_path').notNullable()
      table.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending').notNullable()
      table.text('pharmacist_notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
