import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    email: vine.string().email().unique(async (db, value) => {
      const match = await db.from('users').select('id').where('email', value).first()
      return !match
    }),
    phone: vine.string().trim().optional(),
    role: vine.enum(['admin', 'pharmacist', 'cashier', 'customer'] as const).optional(),
    password: vine.string().minLength(8).confirmed()
  })
)
