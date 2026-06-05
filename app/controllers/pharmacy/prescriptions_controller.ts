import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import PrescriptionService from '#services/prescription_service'

@inject()
export default class PrescriptionsController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  async index({ view }: HttpContext) {
    const orders = await this.prescriptionService.getPending()

    return view.render('pharmacy/prescriptions/index', { orders })
  }

  async show({ params, view }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .preload('user')
      .preload('prescription')
      .preload('items', (q) => q.preload('drug'))
      .firstOrFail()

    return view.render('pharmacy/prescriptions/show', { order })
  }

  async verify({ params, request, response, session }: HttpContext) {
    const orderId = params.id
    const approved = request.input('status') === 'approve'
    const notes = request.input('notes')

    try {
      await this.prescriptionService.verify(orderId, approved, notes)
      session.flash('success', approved ? 'Resep disetujui.' : 'Resep ditolak.')
    } catch (error: any) {
      session.flash('error', error.message)
    }

    return response.redirect().toRoute('pharmacy_prescriptions.index')
  }
}
