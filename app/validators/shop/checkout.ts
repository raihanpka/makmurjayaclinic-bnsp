import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    paymentMethod: vine.enum(['transfer', 'cash', 'qris']),
    prescriptionFile: vine.file({
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'pdf']
    }).optional()
  })
)
