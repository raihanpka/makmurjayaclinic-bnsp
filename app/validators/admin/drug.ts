import vine from '@vinejs/vine'

export const createDrugValidator = vine.compile(
  vine.object({
    sku: vine.string().trim().unique(async (db, value) => {
      const match = await db.from('drugs').where('sku', value).first()
      return !match
    }),
    name: vine.string().trim().minLength(3),
    description: vine.string().trim().optional(),
    composition: vine.string().trim().optional(),
    dosage: vine.string().trim().optional(),
    sideEffects: vine.string().trim().optional(),
    price: vine.number().min(0),
    requiresPrescription: vine.boolean().optional(),
    minStock: vine.number().min(0).optional(),
    categoryId: vine.number().exists(async (db, value) => {
      const match = await db.from('drug_categories').where('id', value).first()
      return !!match
    }),
    supplierId: vine.number().exists(async (db, value) => {
      const match = await db.from('suppliers').where('id', value).first()
      return !!match
    }).optional(),
    isActive: vine.boolean().optional(),
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional(),
  })
)

export const updateDrugValidator = vine.compile(
  vine.object({
    sku: vine.string().trim().unique(async (db, value, field) => {
      const match = await db.from('drugs')
        .where('sku', value)
        .whereNot('id', field.meta.drugId)
        .first()
      return !match
    }),
    name: vine.string().trim().minLength(3),
    description: vine.string().trim().optional(),
    composition: vine.string().trim().optional(),
    dosage: vine.string().trim().optional(),
    sideEffects: vine.string().trim().optional(),
    price: vine.number().min(0),
    requiresPrescription: vine.boolean().optional(),
    minStock: vine.number().min(0).optional(),
    categoryId: vine.number().exists(async (db, value) => {
      const match = await db.from('drug_categories').where('id', value).first()
      return !!match
    }),
    supplierId: vine.number().exists(async (db, value) => {
      const match = await db.from('suppliers').where('id', value).first()
      return !!match
    }).optional(),
    isActive: vine.boolean().optional(),
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional(),
  })
)
