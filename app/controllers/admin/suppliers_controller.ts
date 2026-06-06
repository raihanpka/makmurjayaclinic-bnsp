import type { HttpContext } from '@adonisjs/core/http'
import Supplier from '#models/supplier'
import { createSupplierValidator, updateSupplierValidator } from '#validators/admin/supplier'

export default class SuppliersController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    const suppliers = await Supplier.query().orderBy('id', 'desc').paginate(page, limit)
    
    suppliers.baseUrl('/admin/suppliers')

    return view.render('admin/suppliers/index', { suppliers })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/suppliers/create')
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createSupplierValidator)
    await Supplier.create(payload)

    session.flash('success', 'Supplier berhasil ditambahkan.')
    return response.redirect().toRoute('admin_suppliers.index')
  }

  async show({ params, view }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    return view.render('admin/suppliers/show', { supplier })
  }

  async edit({ params, view }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    return view.render('admin/suppliers/edit', { supplier })
  }

  async update({ params, request, response, session }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    const payload = await request.validateUsing(updateSupplierValidator)

    await supplier.merge(payload).save()

    session.flash('success', 'Supplier berhasil diperbarui.')
    return response.redirect().toRoute('admin_suppliers.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    
    await supplier.delete()

    session.flash('success', 'Supplier berhasil dihapus.')
    return response.redirect().toRoute('admin_suppliers.index')
  }
}
