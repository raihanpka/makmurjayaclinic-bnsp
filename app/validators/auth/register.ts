import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    email: vine.string().email().unique(async (db, value) => {
      const match = await db.from('users').select('id').where('email', value).first()
      return !match
    }),
    password: vine.string().minLength(8).confirmed()
  })
)
