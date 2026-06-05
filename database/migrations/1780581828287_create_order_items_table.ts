import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE').notNullable()
      table.integer('drug_id').unsigned().references('id').inTable('drugs').onDelete('RESTRICT').notNullable()
      table.integer('quantity').notNullable()
      table.decimal('price_at_sale', 12, 2).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
