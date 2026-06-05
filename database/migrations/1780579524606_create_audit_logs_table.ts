import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()
      table.string('action').notNullable()
      table.string('ip_address').nullable()
      table.string('user_agent').nullable()
      table.jsonb('payload').nullable()

      // We only need created_at for an audit log (append only)
      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
