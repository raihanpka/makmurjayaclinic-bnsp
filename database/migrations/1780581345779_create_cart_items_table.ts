import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('cart_id').unsigned().references('id').inTable('carts').onDelete('CASCADE').notNullable()
      table.integer('drug_id').unsigned().references('id').inTable('drugs').onDelete('CASCADE').notNullable()
      table.integer('quantity').notNullable().defaultTo(1)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      
      table.unique(['cart_id', 'drug_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
