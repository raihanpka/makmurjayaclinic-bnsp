import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ReportService from '#services/report_service'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'

@inject()
export default class ReportsController {
  constructor(private readonly reportService: ReportService) {}

  async index({ view }: HttpContext) {
    return view.render('admin/reports/index')
  }

  async store({ request, response }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        startDate: vine.string(),
        endDate: vine.string(),
      })
    )
    const payload = await request.validateUsing(schema)

    const startDate = DateTime.fromISO(payload.startDate).startOf('day')
    const endDate = DateTime.fromISO(payload.endDate).endOf('day')

    const pdfBuffer = await this.reportService.generateSalesReport(startDate, endDate)

    response.header('Content-type', 'application/pdf')
    response.header('Content-Disposition', `attachment; filename="sales-report-${payload.startDate}-${payload.endDate}.pdf"`)
    return response.send(pdfBuffer)
  }
}
