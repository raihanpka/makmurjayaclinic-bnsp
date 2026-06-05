import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ErrorLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare severity: 'critical' | 'warning' | 'info'

  @column()
  declare message: string

  @column()
  declare stack: string | null

  @column()
  declare context: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
