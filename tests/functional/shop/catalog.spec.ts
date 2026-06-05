import { test } from '@japa/runner'
import Drug from '#models/drug'
import DrugCategory from '#models/drug_category'

test.group('Shop Catalog', (group) => {
  group.each.setup(async () => {
    // Clear database or specific tables if needed
  })

  test('list drugs in catalog', async ({ client }) => {
    const ts = Date.now()
    const category = await DrugCategory.create({ name: 'Test Category ' + ts })
    await Drug.create({
      name: 'Test Drug ' + ts,
      sku: 'TEST-SKU-1-' + ts,
      price: '10000',
      categoryId: category.id,
      isActive: true,
      minStock: 5
    })

    const response = await client.get(`/shop/catalog?q=Test Drug ${ts}`)

    response.assertStatus(200)
    response.assertTextIncludes('Test Drug ' + ts)
    response.assertTextIncludes('Rp10.000')
  })

  test('show drug details', async ({ client }) => {
    const ts = Date.now()
    const category = await DrugCategory.create({ name: 'Test Category 2 ' + ts })
    const drug = await Drug.create({
      name: 'Test Drug 2 ' + ts,
      sku: 'TEST-SKU-2-' + ts,
      price: '20000',
      categoryId: category.id,
      isActive: true,
      minStock: 5,
      description: 'Detail description ' + ts
    })

    const response = await client.get(`/shop/catalog/${drug.id}`)

    response.assertStatus(200)
    response.assertTextIncludes('Test Drug 2 ' + ts)
    response.assertTextIncludes('Detail description ' + ts)
  })
})
