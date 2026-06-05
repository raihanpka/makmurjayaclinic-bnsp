import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'

export default class OrdersController {
  async index({ view, auth }: HttpContext) {
    const user = auth.user!
    const orders = await Order.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')

    return view.render('shop/orders/index', { orders })
  }

  async show({ params, view, auth, bouncer }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .preload('items', (q) => q.preload('drug'))
      .preload('payment')
      .preload('prescription')
      .firstOrFail()

    // Assuming a policy exists or adding a simple check here
    if (order.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return bouncer.deny('Anda tidak memiliki akses ke pesanan ini.')
    }

    return view.render('shop/orders/show', { order })
  }
}
