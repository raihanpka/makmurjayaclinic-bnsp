import type { HttpContext } from '@adonisjs/core/http'
import queue from '@rlanz/bull-queue/services/main'
import ImportDrugsJob from '#jobs/import_drugs_job'
import app from '@adonisjs/core/services/app'

export default class DrugImportsController {
  async store({ request, response, session }: HttpContext) {
    const file = request.file('file', {
      size: '5mb',
      extnames: ['csv', 'xlsx', 'xls']
    })

    if (!file) {
      session.flash('error', 'Pilih file terlebih dahulu.')
      return response.redirect().back()
    }

    if (!file.isValid) {
      session.flash('error', 'File tidak valid.')
      return response.redirect().back()
    }

    // Move to a temporary location
    const fileName = `${Date.now()}.${file.extname}`
    await file.move(app.tmpPath('uploads'), {
      name: fileName
    })

    // Dispatch job
    await queue.dispatch(ImportDrugsJob, {
      filePath: app.tmpPath('uploads', fileName)
    })

    session.flash('success', 'File sedang diproses di latar belakang.')
    return response.redirect().back()
  }
}
