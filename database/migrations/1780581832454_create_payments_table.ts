import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE').notNullable()
      table.enum('method', ['transfer', 'cash', 'qris']).notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.enum('status', ['pending', 'confirmed', 'failed']).defaultTo('pending').notNullable()
      table.string('proof_path').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
