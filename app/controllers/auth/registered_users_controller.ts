import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/auth/register'

export default class RegisteredUsersController {
  async show({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      role: 'customer'
    })

    await auth.use('web').login(user)

    session.flash('success', 'Registration successful. Welcome!')
    return response.redirect().toRoute('shop_catalog.index')
  }
}
