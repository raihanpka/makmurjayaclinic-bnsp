import { CartSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import CartItem from '#models/cart_item'

export default class Cart extends CartSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => CartItem)
  declare items: HasMany<typeof CartItem>
}
