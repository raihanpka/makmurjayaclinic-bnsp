import vine from '@vinejs/vine'

export const createSupplierValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    contact: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
  })
)

export const updateSupplierValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    contact: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
  })
)
