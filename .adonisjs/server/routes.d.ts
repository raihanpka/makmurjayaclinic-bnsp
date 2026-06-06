import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.local.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'auth.login.show': { paramsTuple?: []; params?: {} }
    'auth.login.store': { paramsTuple?: []; params?: {} }
    'auth.register.show': { paramsTuple?: []; params?: {} }
    'auth.register.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin_categories.index': { paramsTuple?: []; params?: {} }
    'admin_categories.create': { paramsTuple?: []; params?: {} }
    'admin_categories.store': { paramsTuple?: []; params?: {} }
    'admin_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.index': { paramsTuple?: []; params?: {} }
    'admin_suppliers.create': { paramsTuple?: []; params?: {} }
    'admin_suppliers.store': { paramsTuple?: []; params?: {} }
    'admin_suppliers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.index': { paramsTuple?: []; params?: {} }
    'admin_drugs.create': { paramsTuple?: []; params?: {} }
    'admin_drugs.store': { paramsTuple?: []; params?: {} }
    'admin_drugs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.index': { paramsTuple?: []; params?: {} }
    'admin_customers.create': { paramsTuple?: []; params?: {} }
    'admin_customers.store': { paramsTuple?: []; params?: {} }
    'admin_customers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_reports.index': { paramsTuple?: []; params?: {} }
    'admin_reports.store': { paramsTuple?: []; params?: {} }
    'admin_audit_logs.index': { paramsTuple?: []; params?: {} }
    'admin_error_logs.index': { paramsTuple?: []; params?: {} }
    'admin_drugs.import': { paramsTuple?: []; params?: {} }
    'pharmacy.dashboard': { paramsTuple?: []; params?: {} }
    'pharmacy_prescriptions.index': { paramsTuple?: []; params?: {} }
    'pharmacy_prescriptions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pharmacy_prescriptions.verify': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cashier.dashboard': { paramsTuple?: []; params?: {} }
    'cashier_payments.index': { paramsTuple?: []; params?: {} }
    'cashier_payments.confirm': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cashier_counter.create': { paramsTuple?: []; params?: {} }
    'cashier_counter.store': { paramsTuple?: []; params?: {} }
    'shop_catalog.index': { paramsTuple?: []; params?: {} }
    'shop_catalog.search': { paramsTuple?: []; params?: {} }
    'shop_catalog.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notifications.sse': { paramsTuple?: []; params?: {} }
    'notifications.index': { paramsTuple?: []; params?: {} }
    'notifications.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shop_cart.index': { paramsTuple?: []; params?: {} }
    'shop_cart.store': { paramsTuple?: []; params?: {} }
    'shop_cart.bulk_update': { paramsTuple?: []; params?: {} }
    'shop_cart.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shop_cart.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shop_checkout.show': { paramsTuple?: []; params?: {} }
    'shop_checkout.store': { paramsTuple?: []; params?: {} }
    'shop_orders.index': { paramsTuple?: []; params?: {} }
    'shop_orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'drive.local.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'auth.login.show': { paramsTuple?: []; params?: {} }
    'auth.register.show': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin_categories.index': { paramsTuple?: []; params?: {} }
    'admin_categories.create': { paramsTuple?: []; params?: {} }
    'admin_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.index': { paramsTuple?: []; params?: {} }
    'admin_suppliers.create': { paramsTuple?: []; params?: {} }
    'admin_suppliers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.index': { paramsTuple?: []; params?: {} }
    'admin_drugs.create': { paramsTuple?: []; params?: {} }
    'admin_drugs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.index': { paramsTuple?: []; params?: {} }
    'admin_customers.create': { paramsTuple?: []; params?: {} }
    'admin_customers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_reports.index': { paramsTuple?: []; params?: {} }
    'admin_audit_logs.index': { paramsTuple?: []; params?: {} }
    'admin_error_logs.index': { paramsTuple?: []; params?: {} }
    'pharmacy.dashboard': { paramsTuple?: []; params?: {} }
    'pharmacy_prescriptions.index': { paramsTuple?: []; params?: {} }
    'pharmacy_prescriptions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cashier.dashboard': { paramsTuple?: []; params?: {} }
    'cashier_payments.index': { paramsTuple?: []; params?: {} }
    'cashier_counter.create': { paramsTuple?: []; params?: {} }
    'shop_catalog.index': { paramsTuple?: []; params?: {} }
    'shop_catalog.search': { paramsTuple?: []; params?: {} }
    'shop_catalog.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notifications.sse': { paramsTuple?: []; params?: {} }
    'notifications.index': { paramsTuple?: []; params?: {} }
    'shop_cart.index': { paramsTuple?: []; params?: {} }
    'shop_checkout.show': { paramsTuple?: []; params?: {} }
    'shop_orders.index': { paramsTuple?: []; params?: {} }
    'shop_orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'drive.local.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'auth.login.show': { paramsTuple?: []; params?: {} }
    'auth.register.show': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin_categories.index': { paramsTuple?: []; params?: {} }
    'admin_categories.create': { paramsTuple?: []; params?: {} }
    'admin_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.index': { paramsTuple?: []; params?: {} }
    'admin_suppliers.create': { paramsTuple?: []; params?: {} }
    'admin_suppliers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.index': { paramsTuple?: []; params?: {} }
    'admin_drugs.create': { paramsTuple?: []; params?: {} }
    'admin_drugs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.index': { paramsTuple?: []; params?: {} }
    'admin_customers.create': { paramsTuple?: []; params?: {} }
    'admin_customers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_reports.index': { paramsTuple?: []; params?: {} }
    'admin_audit_logs.index': { paramsTuple?: []; params?: {} }
    'admin_error_logs.index': { paramsTuple?: []; params?: {} }
    'pharmacy.dashboard': { paramsTuple?: []; params?: {} }
    'pharmacy_prescriptions.index': { paramsTuple?: []; params?: {} }
    'pharmacy_prescriptions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cashier.dashboard': { paramsTuple?: []; params?: {} }
    'cashier_payments.index': { paramsTuple?: []; params?: {} }
    'cashier_counter.create': { paramsTuple?: []; params?: {} }
    'shop_catalog.index': { paramsTuple?: []; params?: {} }
    'shop_catalog.search': { paramsTuple?: []; params?: {} }
    'shop_catalog.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notifications.sse': { paramsTuple?: []; params?: {} }
    'notifications.index': { paramsTuple?: []; params?: {} }
    'shop_cart.index': { paramsTuple?: []; params?: {} }
    'shop_checkout.show': { paramsTuple?: []; params?: {} }
    'shop_orders.index': { paramsTuple?: []; params?: {} }
    'shop_orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.login.store': { paramsTuple?: []; params?: {} }
    'auth.register.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'admin_categories.store': { paramsTuple?: []; params?: {} }
    'admin_suppliers.store': { paramsTuple?: []; params?: {} }
    'admin_drugs.store': { paramsTuple?: []; params?: {} }
    'admin_customers.store': { paramsTuple?: []; params?: {} }
    'admin_reports.store': { paramsTuple?: []; params?: {} }
    'admin_drugs.import': { paramsTuple?: []; params?: {} }
    'pharmacy_prescriptions.verify': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cashier_payments.confirm': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cashier_counter.store': { paramsTuple?: []; params?: {} }
    'notifications.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shop_cart.store': { paramsTuple?: []; params?: {} }
    'shop_cart.bulk_update': { paramsTuple?: []; params?: {} }
    'shop_checkout.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'admin_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'admin_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shop_cart.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_suppliers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_drugs.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_customers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shop_cart.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}