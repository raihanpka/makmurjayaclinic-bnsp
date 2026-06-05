import vine from '@vinejs/vine'

export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).unique(async (db, value) => {
      const match = await db.from('drug_categories').where('name', value).first()
      return !match
    }),
    description: vine.string().trim().optional(),
  })
)

export const updateCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).unique(async (db, value, field) => {
      const match = await db.from('drug_categories')
        .where('name', value)
        .whereNot('id', field.meta.categoryId)
        .first()
      return !match
    }),
    description: vine.string().trim().optional(),
  })
)
