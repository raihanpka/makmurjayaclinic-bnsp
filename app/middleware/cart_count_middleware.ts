import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import CartService from '#services/cart_service'
import app from '@adonisjs/core/services/app'

export default class CartCountMiddleware {
  async handle({ auth, view }: HttpContext, next: NextFn) {
    let cartItemsCount = 0
    if (auth.isAuthenticated && auth.user && !auth.user.isAdmin && !auth.user.isPharmacist) {
      try {
        const cartService = await app.container.make(CartService)
        const cart = await cartService.getCart(auth.user)
        cartItemsCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0
      } catch (error) {
        console.error('Failed to get cart count', error)
      }
    }
    
    view.share({ cartItemsCount })
    await next()
  }
}
