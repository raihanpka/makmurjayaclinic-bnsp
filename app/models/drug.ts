import { DrugSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import DrugCategory from '#models/drug_category'
import Supplier from '#models/supplier'
import DrugBatch from '#models/drug_batch'
import StockMovement from '#models/stock_movement'

export default class Drug extends DrugSchema {
  @belongsTo(() => DrugCategory, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof DrugCategory>

  @belongsTo(() => Supplier, { foreignKey: 'supplierId' })
  declare supplier: BelongsTo<typeof Supplier>

  @hasMany(() => DrugBatch)
  declare batches: HasMany<typeof DrugBatch>

  @hasMany(() => StockMovement)
  declare stockMovements: HasMany<typeof StockMovement>
}
