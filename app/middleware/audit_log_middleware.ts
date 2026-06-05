import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import AuditLog from '#models/audit_log'

export default class AuditLogMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Wait for the request to be processed
    await next()

    // Log the request if it's a write action and the response is successful
    const isWriteAction = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(ctx.request.method())
    const isSuccessful = ctx.response.getStatus() >= 200 && ctx.response.getStatus() < 400

    if (isWriteAction && isSuccessful) {
      const user = ctx.auth.user

      // Capture payload (excluding sensitive info like passwords)
      const payload = { ...ctx.request.all() }
      if (payload.password) delete payload.password
      if (payload.password_confirmation) delete payload.password_confirmation

      // Insert log asynchronously
      // Note: we're using create without awaiting if we want it completely background,
      // but typical Adonis approach inside middleware is to await it to ensure it writes.
      await AuditLog.create({
        userId: user ? user.id : null,
        action: `${ctx.request.method()} ${ctx.request.url()}`,
        ipAddress: ctx.request.ip(),
        userAgent: ctx.request.header('user-agent'),
        payload,
      })
    }
  }
}
