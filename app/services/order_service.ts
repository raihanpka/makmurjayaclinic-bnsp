import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import CartService from '#services/cart_service'
import StockService from '#services/stock_service'
import queue from '@rlanz/bull-queue/services/main'
import ProcessOrderJob from '#jobs/process_order_job'
import mail from '@adonisjs/mail/services/main'
import OrderStatusUpdatedNotification from '#mails/order_status_updated_notification'

@inject()
export default class OrderService {
  constructor(
    private readonly cartService: CartService,
    private readonly stockService: StockService
  ) {}

  /**
   * Create an order from user's current cart
   */
  async createFromCart(
    user: User,
    paymentMethod: 'transfer' | 'cash' | 'qris',
    prescriptionPath?: string
  ): Promise<Order> {
    const cart = await this.cartService.getCart(user)
    
    if (cart.items.length === 0) {
      throw new Error('Keranjang belanja kosong.')
    }

    // Check if any item requires prescription
    const requiresPrescription = cart.items.some(item => item.drug.requiresPrescription)
    
    if (requiresPrescription && !prescriptionPath) {
      throw new Error('Beberapa obat memerlukan resep dokter. Silakan unggah resep Anda.')
    }

    const totalPrice = this.cartService.calculateTotal(cart)

    return await db.transaction(async (trx) => {
      const order = await Order.create({
        userId: user.id,
        totalPrice: String(totalPrice),
        status: requiresPrescription ? 'pending_verification' : 'pending'
      }, { client: trx })

      for (const item of cart.items) {
        // Quick stock check
        const currentStock = await this.stockService.getSummary(item.drugId)
        if (currentStock < item.quantity) {
          throw new Error(`Stok obat ${item.drug.name} tidak cukup. Tersedia: ${currentStock}`)
        }

        await OrderItem.create({
          orderId: order.id,
          drugId: item.drugId,
          quantity: item.quantity,
          priceAtSale: String(item.drug.price)
        }, { client: trx })
      }

      // Create prescription record if needed
      if (requiresPrescription && prescriptionPath) {
        await order.related('prescription').create({
          filePath: prescriptionPath,
          status: 'pending'
        }, { client: trx })
      }

      // Create initial payment record
      await order.related('payment').create({
        method: paymentMethod,
        amount: String(totalPrice),
        status: 'pending'
      }, { client: trx })

      // Clear the cart
      await this.cartService.clearCart(user)

      // Notify Admins
      const Notification = (await import('#models/notification')).default
      const UserModel = (await import('#models/user')).default
      const admins = await UserModel.query({ client: trx }).whereIn('role', ['admin', 'pharmacist'])
      
      for (const admin of admins) {
        await Notification.create({
          userId: admin.id,
          title: 'Pesanan Baru',
          message: `Pesanan baru #${order.id} oleh ${user.fullName}. Total: Rp${totalPrice}`,
          type: 'order',
          link: `/admin/dashboard`
        }, { client: trx })
      }

      return order
    })
  }

  /**
   * Confirm payment and dispatch processing job
   */
  async confirmPayment(orderId: number, proofPath?: string): Promise<Order> {
    const order = await Order.findOrFail(orderId)
    await order.load('payment')
    await order.load('items')

    if (order.status !== 'pending') {
      throw new Error('Hanya pesanan dengan status pending yang dapat dikonfirmasi pembayarannya.')
    }

    await db.transaction(async (trx) => {
      const payment = order.payment
      payment.useTransaction(trx)
      payment.status = 'confirmed'
      if (proofPath) payment.proofPath = proofPath
      await payment.save()

      // Deduct stock safely within transaction to prevent race conditions
      for (const item of order.items) {
        await this.stockService.deductFromSale(item.drugId, item.quantity, order.id, trx)
      }

      order.useTransaction(trx)
      order.status = 'processing'
      await order.save()
    })

    // Send notification
    await mail.send(new OrderStatusUpdatedNotification(order))

    // Dispatch background job for further processing (if any other heavy tasks exist)
    await queue.dispatch(ProcessOrderJob, { orderId: order.id })

    return order
  }
}
