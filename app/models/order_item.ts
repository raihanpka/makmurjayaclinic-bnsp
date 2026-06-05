import { OrderItemSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from '#models/order'
import Drug from '#models/drug'

export default class OrderItem extends OrderItemSchema {
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Drug)
  declare drug: BelongsTo<typeof Drug>
}
