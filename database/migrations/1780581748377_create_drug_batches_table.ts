import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'drug_batches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('drug_id').unsigned().references('id').inTable('drugs').onDelete('CASCADE').notNullable()
      table.string('batch_number').notNullable()
      table.integer('quantity').notNullable().defaultTo(0)
      table.timestamp('expires_at').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      
      table.index(['drug_id', 'expires_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
