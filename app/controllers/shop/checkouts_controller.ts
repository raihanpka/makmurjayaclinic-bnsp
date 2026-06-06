import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import CartService from '#services/cart_service'
import OrderService from '#services/order_service'
import { createOrderValidator } from '#validators/shop/checkout'

@inject()
export default class CheckoutsController {
  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService
  ) {}

  async show({ view, auth, response }: HttpContext) {
    const user = auth.user!
    const cart = await this.cartService.getCart(user)
    
    if (cart.items.length === 0) {
      return response.redirect().toRoute('shop_catalog.index')
    }
    const total = this.cartService.calculateTotal(cart)
    const requiresPrescription = cart.items.some(item => item.drug.requiresPrescription)

    return view.render('shop/checkout/show', { cart, total, requiresPrescription })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createOrderValidator)
    
    let prescriptionPath: string | undefined
    if (payload.prescriptionFile) {
      const fileName = `${new Date().getTime()}.${payload.prescriptionFile.extname}`
      await payload.prescriptionFile.move(app.makePath('storage/private'), {
        name: fileName,
      })
      prescriptionPath = `private/${fileName}`
    }

    try {
      const order = await this.orderService.createFromCart(
        user, 
        payload.paymentMethod, 
        prescriptionPath
      )
      
      session.flash('success', 'Pesanan berhasil dibuat. Silakan lakukan pembayaran.')
      return response.redirect().toRoute('shop_orders.show', { id: order.id })
    } catch (error: any) {
      session.flash('error', error.message || 'Gagal memproses pesanan.')
      return response.redirect().back()
    }
  }
}
