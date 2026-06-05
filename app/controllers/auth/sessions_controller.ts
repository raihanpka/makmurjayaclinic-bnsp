import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth/login'

export default class SessionsController {
  async show({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const { email, password, remember } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user, !!remember)

    session.flash('success', 'Logged in successfully')
    
    // Redirect based on role
    if (user.isAdmin) {
      return response.redirect().toRoute('admin.dashboard')
    } else if (user.isPharmacist) {
      return response.redirect().toRoute('pharmacy.dashboard')
    } else if (user.isCashier) {
      return response.redirect().toRoute('cashier.dashboard')
    }
    
    return response.redirect().toRoute('shop_catalog.index')
  }

  async destroy({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Logged out successfully')
    return response.redirect().toRoute('auth.login.show')
  }
}
