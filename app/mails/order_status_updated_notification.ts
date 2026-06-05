import { BaseMail } from '@adonisjs/mail'
import Order from '#models/order'

export default class OrderStatusUpdatedNotification extends BaseMail {
  constructor(private readonly order: Order) {
    super()
  }

  /**
   * The "prepare" method is used to configure the mail message
   * before it is sent.
   */
  async prepare() {
    await this.order.load('user')
    
    this.message
      .to(this.order.user.email)
      .subject(`Update Pesanan #${this.order.id} - ${this.order.status}`)
      .htmlView('emails/order_status_updated', {
        order: this.order
      })
  }
}
