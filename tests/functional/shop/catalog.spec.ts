import { test } from '@japa/runner'
import User from '#models/user'
import Drug from '#models/drug'
import DrugCategory from '#models/drug_category'

test.group('Shop Catalog', (group) => {
  group.each.setup(async () => {
    // Clear database or specific tables if needed
  })

  test('list drugs in catalog', async ({ client }) => {
    const category = await DrugCategory.create({ name: 'Test Category' })
    await Drug.create({
      name: 'Test Drug',
      sku: 'TEST-SKU-1',
      price: '10000',
      categoryId: category.id,
      isActive: true,
      minStock: 5
    })

    const response = await client.get('/shop/catalog')

    response.assertStatus(200)
    response.assertTextIncludes('Test Drug')
    response.assertTextIncludes('Rp10.000')
  })

  test('show drug details', async ({ client }) => {
    const category = await DrugCategory.create({ name: 'Test Category 2' })
    const drug = await Drug.create({
      name: 'Test Drug 2',
      sku: 'TEST-SKU-2',
      price: '20000',
      categoryId: category.id,
      isActive: true,
      minStock: 5,
      description: 'Detail description'
    })

    const response = await client.get(`/shop/catalog/${drug.id}`)

    response.assertStatus(200)
    response.assertTextIncludes('Test Drug 2')
    response.assertTextIncludes('Detail description')
  })
})
