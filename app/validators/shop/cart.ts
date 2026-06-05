import vine from '@vinejs/vine'

export const addToCartValidator = vine.compile(
  vine.object({
    drugId: vine.number().positive(),
    quantity: vine.number().min(1).max(100),
  })
)

export const updateCartValidator = vine.compile(
  vine.object({
    quantity: vine.number().min(0).max(100),
  })
)
