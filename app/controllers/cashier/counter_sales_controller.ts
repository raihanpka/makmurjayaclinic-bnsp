import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Drug from '#models/drug'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import StockService from '#services/stock_service'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class CounterSalesController {
  constructor(private readonly stockService: StockService) {}

  async create({ view }: HttpContext) {
    const drugs = await Drug.query().where('is_active', true).preload('category')
    return view.render('cashier/counter/create', { drugs })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const { items } = request.all() // Assume simplified JSON input for counter sales
    
    try {
      await db.transaction(async (trx) => {
        let total = 0
        const order = await Order.create({
          userId: auth.user!.id,
          totalPrice: '0',
          status: 'completed' // Counter sales are usually immediately completed
        }, { client: trx })

        for (const item of items) {
          const drug = await Drug.findOrFail(item.drugId, { client: trx })
          const subtotal = Number(drug.price) * item.quantity
          total += subtotal

          await OrderItem.create({
            orderId: order.id,
            drugId: drug.id,
            quantity: item.quantity,
            priceAtSale: String(drug.price)
          }, { client: trx })

          // Immediate stock deduction for counter sale
          await this.stockService.deductFromSale(drug.id, item.quantity, order.id, trx)
        }

        order.totalPrice = String(total)
        await order.save()

        // Create payment
        await order.related('payment').create({
          method: 'cash',
          amount: String(total),
          status: 'confirmed'
        }, { client: trx })
      })

      session.flash('success', 'Penjualan counter berhasil.')
    } catch (error: any) {
      session.flash('error', error.message)
    }

    return response.redirect().back()
  }
}
