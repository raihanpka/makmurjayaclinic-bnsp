import type { HttpContext } from '@adonisjs/core/http'
import DrugCategory from '#models/drug_category'
import { createCategoryValidator, updateCategoryValidator } from '#validators/admin/category'

export default class CategoriesController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    const categories = await DrugCategory.query().orderBy('id', 'desc').paginate(page, limit)
    
    // Setting pagination base URL
    categories.baseUrl('/admin/categories')

    return view.render('admin/categories/index', { categories })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/categories/create')
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createCategoryValidator)
    await DrugCategory.create(payload)

    session.flash('success', 'Kategori obat berhasil ditambahkan.')
    return response.redirect().toRoute('admin_categories.index')
  }

  async show({ params, view }: HttpContext) {
    const category = await DrugCategory.findOrFail(params.id)
    return view.render('admin/categories/show', { category })
  }

  async edit({ params, view }: HttpContext) {
    const category = await DrugCategory.findOrFail(params.id)
    return view.render('admin/categories/edit', { category })
  }

  async update({ params, request, response, session }: HttpContext) {
    const category = await DrugCategory.findOrFail(params.id)
    const payload = await request.validateUsing(updateCategoryValidator, {
      meta: { categoryId: category.id },
    })

    await category.merge(payload).save()

    session.flash('success', 'Kategori obat berhasil diperbarui.')
    return response.redirect().toRoute('admin_categories.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const category = await DrugCategory.findOrFail(params.id)
    
    // TODO: Consider checking if there are drugs associated before deleting
    await category.delete()

    session.flash('success', 'Kategori obat berhasil dihapus.')
    return response.redirect().toRoute('admin_categories.index')
  }
}
