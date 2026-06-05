import type { HttpContext } from '@adonisjs/core/http'
import Drug from '#models/drug'
import DrugCategory from '#models/drug_category'

export default class CatalogsController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 12
    const categoryId = request.input('category')
    const sort = request.input('sort', 'name_asc')

    const query = Drug.query().where('is_active', true)

    if (categoryId) {
      query.where('category_id', categoryId)
    }

    switch (sort) {
      case 'price_asc':
        query.orderBy('price', 'asc')
        break
      case 'price_desc':
        query.orderBy('price', 'desc')
        break
      case 'name_desc':
        query.orderBy('name', 'desc')
        break
      case 'name_asc':
      default:
        query.orderBy('name', 'asc')
        break
    }

    const drugs = await query.paginate(page, limit)
    const categories = await DrugCategory.all()

    drugs.baseUrl('/shop/catalog')
    drugs.queryString(request.qs())

    return view.render('shop/catalog/index', { drugs, categories })
  }

  async show({ params, view }: HttpContext) {
    const drug = await Drug.query()
      .where('id', params.id)
      .where('is_active', true)
      .preload('category')
      .firstOrFail()

    return view.render('shop/catalog/show', { drug })
  }

  async search({ request, response }: HttpContext) {
    const term = request.input('q', '')
    if (!term || term.length < 2) {
      return response.json([])
    }

    // Basic ILIKE search for autocomplete
    const drugs = await Drug.query()
      .where('is_active', true)
      .where('name', 'ilike', `%${term}%`)
      .limit(10)

    return response.json(drugs)
  }
}
