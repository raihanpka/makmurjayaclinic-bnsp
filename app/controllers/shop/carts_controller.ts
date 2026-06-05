import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import CartService from '#services/cart_service'
import { addToCartValidator, updateCartValidator } from '#validators/shop/cart'

@inject()
export default class CartsController {
  constructor(private readonly cartService: CartService) {}

  async index({ view, auth }: HttpContext) {
    const user = auth.user!
    const cart = await this.cartService.getCart(user)
    const total = this.cartService.calculateTotal(cart)

    return view.render('shop/cart/index', { cart, total })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(addToCartValidator)
    
    try {
      await this.cartService.addItem(user, payload.drugId, payload.quantity)
      session.flash('success', 'Produk berhasil ditambahkan ke keranjang.')
    } catch (error: any) {
      session.flash('error', error.message || 'Gagal menambahkan produk.')
    }

    return response.redirect().back()
  }

  async update({ params, request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(updateCartValidator)

    await this.cartService.updateItem(user, params.id, payload.quantity)
    session.flash('success', 'Keranjang berhasil diperbarui.')
    
    return response.redirect().back()
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    
    await this.cartService.removeItem(user, params.id)
    session.flash('success', 'Produk dihapus dari keranjang.')
    
    return response.redirect().back()
  }
}
