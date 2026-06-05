import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import Order from '#models/order'
import mail from '@adonisjs/mail/services/main'
import OrderStatusUpdatedNotification from '#mails/order_status_updated_notification'

@inject()
export default class PrescriptionService {
  /**
   * Verify a prescription
   */
  async verify(orderId: number, approved: boolean, notes?: string): Promise<Order> {
    const order = await Order.query()
      .where('id', orderId)
      .preload('prescription')
      .preload('user')
      .firstOrFail()

    if (order.status !== 'pending_verification') {
      throw new Error('Pesanan ini tidak memerlukan verifikasi resep.')
    }

    await db.transaction(async (trx) => {
      const prescription = order.prescription
      prescription.useTransaction(trx)
      prescription.status = approved ? 'approved' : 'rejected'
      if (notes) prescription.pharmacistNotes = notes
      await prescription.save()

      order.useTransaction(trx)
      order.status = approved ? 'pending' : 'cancelled'
      await order.save()
    })

    // Send notification
    await mail.send(new OrderStatusUpdatedNotification(order))

    return order
  }

  /**
   * Get pending prescriptions for pharmacist
   */
  async getPending() {
    return await Order.query()
      .where('status', 'pending_verification')
      .preload('user')
      .preload('prescription')
      .orderBy('created_at', 'asc')
  }
}
