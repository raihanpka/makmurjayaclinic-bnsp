import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import AuditLog from '#models/audit_log'
import Cart from '#models/cart'

export type UserRole = 'admin' | 'pharmacist' | 'cashier' | 'customer'

/**
 * User model represents a user in the application.
 * It extends UserSchema and includes authentication capabilities
 * through the withAuthFinder mixin.
 */
export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  
  declare role: UserRole

  @hasMany(() => AuditLog)
  declare auditLogs: HasMany<typeof AuditLog>

  @hasOne(() => Cart)
  declare cart: HasOne<typeof Cart>

  /**
   * Get the user's initials from their full name or email.
   * Returns the first letter of first and last name if available,
   * otherwise returns the first two characters of the email username.
   */
  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }

  get isAdmin() {
    return this.role === 'admin'
  }

  get isPharmacist() {
    return this.role === 'pharmacist'
  }

  get isCashier() {
    return this.role === 'cashier'
  }

  get isCustomer() {
    return this.role === 'customer'
  }
}
