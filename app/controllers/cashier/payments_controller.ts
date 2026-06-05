import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderService from '#services/order_service'

@inject()
export default class PaymentsController {
  constructor(private readonly orderService: OrderService) {}

  async index({ view }: HttpContext) {
    const orders = await Order.query()
      .where('status', 'pending')
      .preload('user')
      .preload('payment')
      .orderBy('created_at', 'asc')

    return view.render('cashier/payments/index', { orders })
  }

  async confirm({ params, response, session }: HttpContext) {
    try {
      await this.orderService.confirmPayment(params.id)
      session.flash('success', 'Pembayaran berhasil dikonfirmasi.')
    } catch (error: any) {
      session.flash('error', error.message)
    }

    return response.redirect().toRoute('cashier_payments.index')
  }
}
