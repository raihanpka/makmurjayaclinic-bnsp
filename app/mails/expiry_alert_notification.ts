import { BaseMail } from '@adonisjs/mail'
import DrugBatch from '#models/drug_batch'

export default class ExpiryAlertNotification extends BaseMail {
  constructor(private readonly batch: DrugBatch, private readonly daysRemaining: number) {
    super()
  }

  /**
   * The "prepare" method is used to configure the mail message
   * before it is sent.
   */
  async prepare() {
    this.message
      .to('apoteker@makmurjaya.id')
      .subject(`Alert: Obat Mendekati Kedaluwarsa - ${this.batch.batchNumber}`)
      .htmlView('emails/expiry_alert', {
        batch: this.batch,
        daysRemaining: this.daysRemaining
      })
  }
}
