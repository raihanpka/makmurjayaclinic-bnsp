import type { HttpContext } from '@adonisjs/core/http'
import ErrorLog from '#models/error_log'

export default class ErrorLogsController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 20
    const logs = await ErrorLog.query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    logs.baseUrl('/admin/error-logs')

    return view.render('admin/error_logs/index', { logs })
  }
}
