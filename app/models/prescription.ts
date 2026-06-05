import { PrescriptionSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from '#models/order'

export type PrescriptionStatus = 'pending' | 'approved' | 'rejected'

export default class Prescription extends PrescriptionSchema {
  declare status: PrescriptionStatus

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}
