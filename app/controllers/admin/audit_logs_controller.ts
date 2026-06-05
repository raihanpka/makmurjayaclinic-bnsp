import type { HttpContext } from '@adonisjs/core/http'
import AuditLog from '#models/audit_log'

export default class AuditLogsController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 20
    const logs = await AuditLog.query()
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    logs.baseUrl('/admin/audit-logs')

    return view.render('admin/audit_logs/index', { logs })
  }
}
