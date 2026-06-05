import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stock_movements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('drug_id').unsigned().references('id').inTable('drugs').onDelete('CASCADE').notNullable()
      table.integer('quantity').notNullable() // Negative for sale, positive for restock
      table.enum('type', ['sale', 'restock', 'adjustment', 'return']).notNullable()
      table.integer('order_id').nullable() // Will reference orders table later
      table.string('description').nullable()

      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
