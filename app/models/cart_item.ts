import { CartItemSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Cart from '#models/cart'
import Drug from '#models/drug'

export default class CartItem extends CartItemSchema {
  @belongsTo(() => Cart)
  declare cart: BelongsTo<typeof Cart>

  @belongsTo(() => Drug)
  declare drug: BelongsTo<typeof Drug>
}
