import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Drug from '#models/drug'
import DrugCategory from '#models/drug_category'
import Supplier from '#models/supplier'
import { createDrugValidator, updateDrugValidator } from '#validators/admin/drug'
import { DateTime } from 'luxon'

export default class DrugsController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    const drugs = await Drug.query()
      .preload('category')
      .preload('supplier')
      .preload('batches', (q) => {
        q.where('expires_at', '>', DateTime.now().toSQL()!)
      })
      .orderBy('id', 'desc')
      .paginate(page, limit)
    
    drugs.baseUrl('/admin/drugs')

    return view.render('admin/drugs/index', { drugs })
  }

  async create({ view }: HttpContext) {
    const categories = await DrugCategory.all()
    const suppliers = await Supplier.all()
    return view.render('admin/drugs/create', { categories, suppliers })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createDrugValidator)

    let imageUrl: string | null = null
    if (payload.image) {
      const fileName = `${new Date().getTime()}.${payload.image.extname}`
      await payload.image.move(app.makePath('storage/drugs'), {
        name: fileName,
      })
      imageUrl = `drugs/${fileName}`
    }

    await Drug.create({
      sku: payload.sku,
      name: payload.name,
      description: payload.description,
      composition: payload.composition,
      dosage: payload.dosage,
      sideEffects: payload.sideEffects,
      price: String(payload.price),
      requiresPrescription: payload.requiresPrescription || false,
      minStock: payload.minStock || 0,
      categoryId: payload.categoryId,
      supplierId: payload.supplierId,
      isActive: payload.isActive ?? true,
      imageUrl,
    })

    session.flash('success', 'Obat berhasil ditambahkan.')
    return response.redirect().toRoute('admin_drugs.index')
  }

  async show({ params, view }: HttpContext) {
    const drug = await Drug.query()
      .where('id', params.id)
      .preload('category')
      .preload('supplier')
      .firstOrFail()
      
    return view.render('admin/drugs/show', { drug })
  }

  async edit({ params, view }: HttpContext) {
    const drug = await Drug.findOrFail(params.id)
    const categories = await DrugCategory.all()
    const suppliers = await Supplier.all()
    return view.render('admin/drugs/edit', { drug, categories, suppliers })
  }

  async update({ params, request, response, session }: HttpContext) {
    const drug = await Drug.findOrFail(params.id)
    const payload = await request.validateUsing(updateDrugValidator, {
      meta: { drugId: drug.id },
    })

    let imageUrl: string | null = drug.imageUrl
    if (payload.image) {
      const fileName = `${new Date().getTime()}.${payload.image.extname}`
      await payload.image.move(app.makePath('storage/drugs'), {
        name: fileName,
      })
      imageUrl = `drugs/${fileName}`
    }

    await drug.merge({
      sku: payload.sku,
      name: payload.name,
      description: payload.description,
      composition: payload.composition,
      dosage: payload.dosage,
      sideEffects: payload.sideEffects,
      price: String(payload.price),
      requiresPrescription: payload.requiresPrescription || false,
      minStock: payload.minStock || 0,
      categoryId: payload.categoryId,
      supplierId: payload.supplierId,
      isActive: payload.isActive ?? true,
      imageUrl,
    }).save()

    session.flash('success', 'Obat berhasil diperbarui.')
    return response.redirect().toRoute('admin_drugs.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const drug = await Drug.findOrFail(params.id)
    
    try {
      await drug.delete()
      session.flash('success', 'Obat berhasil dihapus.')
    } catch (error) {
      session.flash('error', 'Gagal menghapus obat. Obat ini mungkin sedang digunakan dalam pesanan atau riwayat stok.')
    }

    return response.redirect().toRoute('admin_drugs.index')
  }
}
