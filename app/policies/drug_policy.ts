import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'

export default class DrugPolicy extends BasePolicy {
  async view(_user: User): Promise<boolean> {
    return true // Everyone can view
  }

  async create(user: User): Promise<boolean> {
    return user.isAdmin
  }

  async update(user: User): Promise<boolean> {
    return user.isAdmin
  }

  async delete(user: User): Promise<boolean> {
    return user.isAdmin
  }
}
