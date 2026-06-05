import { SupplierSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Drug from '#models/drug'

export default class Supplier extends SupplierSchema {
  @hasMany(() => Drug)
  declare drugs: HasMany<typeof Drug>
}
