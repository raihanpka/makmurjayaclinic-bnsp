import { inject } from '@adonisjs/core'
import { Job } from '@rlanz/bull-queue'
import ReportService from '#services/report_service'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'

type Payload = {
  startDate: string
  endDate: string
  adminEmail: string
}

@inject()
export default class GenerateReportJob extends Job {
  constructor(private readonly reportService: ReportService) {
    super()
  }

  static get $$filepath() {
    return import.meta.url
  }

  async handle(payload: Payload) {
    const startDate = DateTime.fromISO(payload.startDate)
    const endDate = DateTime.fromISO(payload.endDate)

    const pdfBuffer = await this.reportService.generateSalesReport(startDate, endDate)

    // In a real background job, we would save to Drive and send a link via email
    // For this prototype, we'll simulate sending it as attachment
    await mail.send((message) => {
      message
        .to(payload.adminEmail)
        .subject('Laporan Penjualan Siap')
        .htmlView('emails/report_ready', { startDate: payload.startDate, endDate: payload.endDate })
        .attachData(pdfBuffer, { filename: `report-${payload.startDate}.pdf`, contentType: 'application/pdf' })
    })
  }

  async rescue(error: any) {
    console.error('GenerateReportJob failed', error)
  }
}
