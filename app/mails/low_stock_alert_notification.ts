import { BaseMail } from '@adonisjs/mail'
import Drug from '#models/drug'

export default class LowStockAlertNotification extends BaseMail {
  constructor(private readonly drug: Drug, private readonly currentStock: number) {
    super()
  }

  /**
   * The "prepare" method is used to configure the mail message
   * before it is sent.
   */
  async prepare() {
    this.message
      .to('admin@makmurjaya.id')
      .subject(`Alert: Stok Rendah - ${this.drug.name}`)
      .htmlView('emails/low_stock_alert', {
        drug: this.drug,
        currentStock: this.currentStock
      })
  }
}
