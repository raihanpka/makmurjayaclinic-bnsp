import { OrderSchema } from '#database/schema'
import { belongsTo, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import OrderItem from '#models/order_item'
import Prescription from '#models/prescription'
import Payment from '#models/payment'

export type OrderStatus = 'pending' | 'pending_verification' | 'processing' | 'ready' | 'completed' | 'cancelled'

export default class Order extends OrderSchema {
  declare status: OrderStatus

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @hasOne(() => Prescription)
  declare prescription: HasOne<typeof Prescription>

  @hasOne(() => Payment)
  declare payment: HasOne<typeof Payment>
}
