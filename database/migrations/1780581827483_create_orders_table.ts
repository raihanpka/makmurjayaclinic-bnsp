import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('RESTRICT').notNullable()
      table.decimal('total_price', 12, 2).notNullable()
      table.enum('status', ['pending', 'pending_verification', 'processing', 'ready', 'completed', 'cancelled']).defaultTo('pending').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      
      table.index(['user_id', 'status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
