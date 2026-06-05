import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'drugs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('sku').notNullable().unique()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.text('composition').nullable()
      table.text('dosage').nullable()
      table.text('side_effects').nullable()
      table.decimal('price', 12, 2).notNullable()
      table.boolean('requires_prescription').defaultTo(false).notNullable()
      table.integer('min_stock').defaultTo(0).notNullable()
      
      table.integer('category_id').unsigned().references('id').inTable('drug_categories').onDelete('RESTRICT').notNullable()
      table.integer('supplier_id').unsigned().references('id').inTable('suppliers').onDelete('SET NULL').nullable()
      
      table.string('image_url').nullable()
      table.boolean('is_active').defaultTo(true).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
