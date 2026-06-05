import { inject } from '@adonisjs/core'
import { Job } from '@rlanz/bull-queue'
import Order from '#models/order'
import StockService from '#services/stock_service'
import db from '@adonisjs/lucid/services/db'

type Payload = {
  orderId: number
}

@inject()
export default class ProcessOrderJob extends Job {
  constructor(private readonly stockService: StockService) {
    super()
  }

  /**
   * The job unique identifier
   */
  static get $$filepath() {
    return import.meta.url
  }

  async handle(payload: Payload) {
    const order = await Order.query().where('id', payload.orderId).preload('items').firstOrFail()

    await db.transaction(async (trx) => {
      // Deduct stock for each item in the order (using FIFO)
      for (const item of order.items) {
        await this.stockService.deductFromSale(item.drugId, item.quantity, order.id, trx)
      }

      // Update order status to ready (or whatever is next in flow)
      order.useTransaction(trx)
      order.status = 'ready'
      await order.save()
    })
  }

  async rescue(_payload: Payload, _error: Error) {
    // Handle job failure
    console.error(`Job ProcessOrderJob failed for order ${_payload.orderId}: ${_error.message}`)
  }
}
