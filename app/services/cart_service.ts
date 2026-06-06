import Cart from '#models/cart'
import CartItem from '#models/cart_item'
import Drug from '#models/drug'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class CartService {
  /**
   * Get or create a cart for the user
   */
  async getCart(user: User): Promise<Cart> {
    let cart = await Cart.query().where('user_id', user.id).preload('items', (q) => q.preload('drug')).first()
    
    if (!cart) {
      cart = await Cart.create({ userId: user.id })
      await cart.load('items')
    }

    return cart
  }

  /**
   * Add an item to the cart
   */
  async addItem(user: User, drugId: number, quantity: number): Promise<Cart> {
    const cart = await this.getCart(user)
    
    // Check drug existence and basic stock (detailed check done at checkout via StockService)
    await Drug.findOrFail(drugId)
    // Note: detailed FIFO stock check is done at checkout, but we can do a quick check here if needed.
    // For now, just add to cart.
    
    await db.transaction(async (trx) => {
      // Lock cart row to prevent concurrent race condition causing duplicate items
      await Cart.query({ client: trx }).where('id', cart.id).forUpdate().first()

      const existingItem = await CartItem.query({ client: trx })
        .where('cart_id', cart.id)
        .where('drug_id', drugId)
        .first()

      if (existingItem) {
        existingItem.quantity += quantity
        await existingItem.save()
      } else {
        await CartItem.create({
          cartId: cart.id,
          drugId: drugId,
          quantity: quantity
        }, { client: trx })
      }
    })

    await cart.refresh()
    await cart.load('items', (q) => q.preload('drug'))
    return cart
  }

  /**
   * Update quantity of a cart item
   */
  async updateItem(user: User, itemId: number, quantity: number): Promise<Cart> {
    const cart = await this.getCart(user)
    
    const item = await CartItem.query()
      .where('id', itemId)
      .where('cart_id', cart.id)
      .firstOrFail()

    if (quantity <= 0) {
      await item.delete()
    } else {
      item.quantity = quantity
      await item.save()
    }

    await cart.refresh()
    await cart.load('items', (q) => q.preload('drug'))
    return cart
  }

  /**
   * Remove an item from the cart
   */
  async removeItem(user: User, itemId: number): Promise<Cart> {
    const cart = await this.getCart(user)
    
    const item = await CartItem.query()
      .where('id', itemId)
      .where('cart_id', cart.id)
      .firstOrFail()

    await item.delete()

    await cart.refresh()
    await cart.load('items', (q) => q.preload('drug'))
    return cart
  }

  /**
   * Clear the entire cart
   */
  async clearCart(user: User): Promise<void> {
    const cart = await this.getCart(user)
    await CartItem.query().where('cart_id', cart.id).delete()
  }

  /**
   * Calculate total price of the cart
   */
  calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => {
      return total + (Number(item.drug.price) * item.quantity)
    }, 0)
  }
}
