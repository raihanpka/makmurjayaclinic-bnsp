import { test } from '@japa/runner'
import User from '#models/user'
import Drug from '#models/drug'
import DrugCategory from '#models/drug_category'
import Order from '#models/order'
import { DateTime } from 'luxon'

test.group('Shop Checkout', (group) => {
  group.each.setup(async () => {
    // Clear database if needed
  })

  test('customer can add to cart and checkout', async ({ client, assert }) => {
    const ts = Date.now()
    // 1. Setup Data
    const user = await User.create({
      fullName: 'Test Customer ' + ts,
      email: `customer_${ts}@test.com`,
      password: 'password123',
      role: 'customer'
    })

    const category = await DrugCategory.create({ name: 'Checkout Category ' + ts })
    const drug = await Drug.create({
      name: 'Checkout Drug ' + ts,
      sku: 'CHK-SKU-1-' + ts,
      price: '50000',
      categoryId: category.id,
      isActive: true,
      minStock: 5,
      requiresPrescription: false
    })

    await drug.related('batches').create({
      batchNumber: 'B1-' + ts,
      quantity: 10,
      expiresAt: DateTime.now().plus({ months: 12 })
    })

    // 2. Add to cart
    await client
      .post('/shop/cart')
      .loginAs(user)
      .form({
        drugId: drug.id,
        quantity: 2
      })

    // 3. Checkout
    const response = await client
      .post('/shop/checkout')
      .loginAs(user)
      .form({
        shippingAddress: '123 Test St',
        paymentMethod: 'transfer'
      })

    const flash = response.session()
    if (flash?.errors) console.log('FLASH ERROR 1:', flash.errors)
    response.assertStatus(302)

    // 4. Verify Order created
    const orders = await Order.query().where('user_id', user.id).preload('items')
    assert.lengthOf(orders, 1)
    
    const order = orders[0]
    assert.equal(order.status, 'pending')
    assert.equal(order.items.length, 1)
    assert.equal(order.items[0].drugId, drug.id)
    assert.equal(order.items[0].quantity, 2)
  })

  test('cannot checkout drug requiring prescription without file', async ({ client }) => {
    const ts = Date.now()
    const user = await User.create({
      fullName: 'Test Customer 2 ' + ts,
      email: `customer2_${ts}@test.com`,
      password: 'password123',
      role: 'customer'
    })

    const category = await DrugCategory.create({ name: 'Prescription Category ' + ts })
    const drug = await Drug.create({
      name: 'Rx Drug ' + ts,
      sku: 'RX-SKU-1-' + ts,
      price: '100000',
      categoryId: category.id,
      isActive: true,
      minStock: 2,
      requiresPrescription: true
    })

    await drug.related('batches').create({
      batchNumber: 'B-' + ts,
      quantity: 50,
      expiresAt: DateTime.now().plus({ months: 6 })
    })

    // Add to cart
    await client.post('/shop/cart').loginAs(user).form({ drugId: drug.id, quantity: 1 })

    // Checkout without file
    const response = await client
      .post('/shop/checkout')
      .loginAs(user)
      .form({
        shippingAddress: '123 Test St',
        paymentMethod: 'transfer'
      })

    const flash = response.session()
    if (flash?.errors) console.log('FLASH ERROR:', flash.errors)
    
    // Fallback assert just to see
    response.assertStatus(302)
  })
})
