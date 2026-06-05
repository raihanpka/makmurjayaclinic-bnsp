import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class CustomersController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    const customers = await User.query()
      .where('role', 'customer')
      .orderBy('id', 'desc')
      .paginate(page, limit)
    
    customers.baseUrl('/admin/customers')

    return view.render('admin/customers/index', { customers })
  }

  async show({ params, view }: HttpContext) {
    const customer = await User.query()
      .where('role', 'customer')
      .where('id', params.id)
      .firstOrFail()
      
    return view.render('admin/customers/show', { customer })
  }

  // Edit and Update could be added later if Admin needs to update customer details
  async destroy({ params, response, session }: HttpContext) {
    const customer = await User.query()
      .where('role', 'customer')
      .where('id', params.id)
      .firstOrFail()
    
    await customer.delete()

    session.flash('success', 'Pelanggan berhasil dihapus.')
    return response.redirect().toRoute('admin_customers.index')
  }
}
