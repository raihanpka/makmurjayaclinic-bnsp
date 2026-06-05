/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const SessionsController = () => import('#controllers/auth/sessions_controller')
const RegisteredUsersController = () => import('#controllers/auth/registered_users_controller')

router.get('/', async ({ view }) => {
  return view.render('welcome')
}).as('home')

// Authentication Routes
router.group(() => {
  router.get('/login', [SessionsController, 'show']).as('auth.login.show').use(middleware.guest())
  router.post('/login', [SessionsController, 'store']).as('auth.login.store').use(middleware.guest())
  
  router.get('/register', [RegisteredUsersController, 'show']).as('auth.register.show').use(middleware.guest())
  router.post('/register', [RegisteredUsersController, 'store']).as('auth.register.store').use(middleware.guest())
  
  router.post('/logout', [SessionsController, 'destroy']).as('auth.logout').use(middleware.auth())
})

// Admin Routes
const DashboardController = () => import('#controllers/admin/dashboard_controller')
const CategoriesController = () => import('#controllers/admin/categories_controller')
const SuppliersController = () => import('#controllers/admin/suppliers_controller')
const DrugsController = () => import('#controllers/admin/drugs_controller')
const CustomersController = () => import('#controllers/admin/customers_controller')
const ReportsController = () => import('#controllers/admin/reports_controller')

router.group(() => {
  router.get('/dashboard', [DashboardController, 'index']).as('admin.dashboard')
  
  router.resource('categories', CategoriesController).as('admin_categories')
  router.resource('suppliers', SuppliersController).as('admin_suppliers')
  router.resource('drugs', DrugsController).as('admin_drugs')
  router.resource('customers', CustomersController).as('admin_customers')
  
  router.get('/reports', [ReportsController, 'index']).as('admin_reports.index')
  router.post('/reports', [ReportsController, 'store']).as('admin_reports.store')
  
  router.get('/audit-logs', [() => import('#controllers/admin/audit_logs_controller'), 'index']).as('admin_audit_logs.index')
  router.get('/error-logs', [() => import('#controllers/admin/error_logs_controller'), 'index']).as('admin_error_logs.index')
  
  router.post('/drugs/import', [() => import('#controllers/admin/drug_imports_controller'), 'store']).as('admin_drugs.import')
}).prefix('/admin').use([middleware.auth(), middleware.role(['admin'])])

router.group(() => {
  router.get('/dashboard', async ({ response }) => { return response.redirect().toRoute('pharmacy_prescriptions.index') }).as('pharmacy.dashboard')
  
  router.get('/prescriptions', [() => import('#controllers/pharmacy/prescriptions_controller'), 'index']).as('pharmacy_prescriptions.index')
  router.get('/prescriptions/:id', [() => import('#controllers/pharmacy/prescriptions_controller'), 'show']).as('pharmacy_prescriptions.show')
  router.post('/prescriptions/:id/verify', [() => import('#controllers/pharmacy/prescriptions_controller'), 'verify']).as('pharmacy_prescriptions.verify')
}).prefix('/pharmacy').use([middleware.auth(), middleware.role(['pharmacist'])])

router.group(() => {
  router.get('/dashboard', async ({ response }) => { return response.redirect().toRoute('cashier_counter.create') }).as('cashier.dashboard')
  
  router.get('/payments', [() => import('#controllers/cashier/payments_controller'), 'index']).as('cashier_payments.index')
  router.post('/payments/:id/confirm', [() => import('#controllers/cashier/payments_controller'), 'confirm']).as('cashier_payments.confirm')
  
  router.get('/counter', [() => import('#controllers/cashier/counter_sales_controller'), 'create']).as('cashier_counter.create')
  router.post('/counter', [() => import('#controllers/cashier/counter_sales_controller'), 'store']).as('cashier_counter.store')
}).prefix('/cashier').use([middleware.auth(), middleware.role(['cashier'])])

// Shop Routes
const CatalogsController = () => import('#controllers/shop/catalogs_controller')
const CartsController = () => import('#controllers/shop/carts_controller')
const CheckoutsController = () => import('#controllers/shop/checkouts_controller')
const OrdersController = () => import('#controllers/shop/orders_controller')

const NotificationController = () => import('#controllers/notification_controller')

router.group(() => {
  router.get('/catalog', [CatalogsController, 'index']).as('shop_catalog.index')
  router.get('/catalog/search', [CatalogsController, 'search']).as('shop_catalog.search')
  router.get('/catalog/:id', [CatalogsController, 'show']).as('shop_catalog.show')

  // Auth required routes
  router.group(() => {
    // Notifications
    router.get('/api/notifications/sse', [NotificationController, 'sse']).as('notifications.sse')
    router.get('/api/notifications', [NotificationController, 'index']).as('notifications.index')
    router.post('/api/notifications/:id/read', [NotificationController, 'markAsRead']).as('notifications.read')

    router.get('/cart', [CartsController, 'index']).as('shop_cart.index')
    router.post('/cart', [CartsController, 'store']).as('shop_cart.store')
    router.patch('/cart/:id', [CartsController, 'update']).as('shop_cart.update')
    router.delete('/cart/:id', [CartsController, 'destroy']).as('shop_cart.destroy')

    router.get('/checkout', [CheckoutsController, 'show']).as('shop_checkout.show')
    router.post('/checkout', [CheckoutsController, 'store']).as('shop_checkout.store')

    router.get('/orders', [OrdersController, 'index']).as('shop_orders.index')
    router.get('/orders/:id', [OrdersController, 'show']).as('shop_orders.show')
  }).use(middleware.auth())
}).prefix('/shop')
