import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { UserRole } from '#models/user'

/**
 * Role middleware is used to restrict access to certain routes
 * based on the authenticated user's role.
 */
export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    allowedRoles: UserRole[]
  ) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized('You must be logged in to access this resource')
    }

    if (!allowedRoles.includes(user.role)) {
      return ctx.response.forbidden('You do not have permission to access this resource')
    }

    return next()
  }
}
