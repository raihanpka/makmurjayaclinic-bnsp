import { StockMovementSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Drug from '#models/drug'

export default class StockMovement extends StockMovementSchema {
  @belongsTo(() => Drug)
  declare drug: BelongsTo<typeof Drug>
}
