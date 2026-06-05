import { PaymentSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from '#models/order'

export type PaymentMethod = 'transfer' | 'cash' | 'qris'
export type PaymentStatus = 'pending' | 'confirmed' | 'failed'

export default class Payment extends PaymentSchema {
  declare method: PaymentMethod
  declare status: PaymentStatus

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}
