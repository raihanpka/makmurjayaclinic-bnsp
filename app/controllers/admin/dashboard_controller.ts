import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import Drug from '#models/drug'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  async index({ view }: HttpContext) {
    const startOfDay = DateTime.now().startOf('day').toSQL()
    const startOfMonth = DateTime.now().startOf('month').toSQL()

    // Revenue Statistics
    const todayRevenue = await Order.query()
      .where('created_at', '>=', startOfDay as string)
      .where('status', '!=', 'cancelled')
      .sum('total_price as total')
      .first()

    const monthlyRevenue = await Order.query()
      .where('created_at', '>=', startOfMonth as string)
      .where('status', '!=', 'cancelled')
      .sum('total_price as total')
      .first()

    // Order counts
    const totalOrders = await Order.query().count('* as total').first()
    const pendingOrders = await Order.query().where('status', 'pending').count('* as total').first()
    const pendingVerification = await Order.query().where('status', 'pending_verification').count('* as total').first()

    // Stock Alerts
    const lowStockDrugs = await db.from('drugs')
      .leftJoin('drug_batches', 'drugs.id', 'drug_batches.drug_id')
      .select('drugs.name', 'drugs.min_stock')
      .groupBy('drugs.id', 'drugs.name', 'drugs.min_stock')
      .havingRaw('SUM(COALESCE(drug_batches.quantity, 0)) <= drugs.min_stock')
      .limit(5)

    // Chart Data (Last 7 days revenue)
    const chartData = await this.getWeeklyRevenueData()

    return view.render('admin/dashboard', {
      stats: {
        todayRevenue: Number(todayRevenue?.$extras.total || 0),
        monthlyRevenue: Number(monthlyRevenue?.$extras.total || 0),
        totalOrders: Number(totalOrders?.$extras.total || 0),
        pendingOrders: Number(pendingOrders?.$extras.total || 0),
        pendingVerification: Number(pendingVerification?.$extras.total || 0)
      },
      lowStockDrugs,
      chartData
    })
  }

  private async getWeeklyRevenueData() {
    const labels: string[] = []
    const data: number[] = []

    for (let i = 6; i >= 0; i--) {
      const day = DateTime.now().minus({ days: i })
      labels.push(day.toFormat('dd LLL'))
      
      const revenue = await Order.query()
        .whereBetween('created_at', [
          day.startOf('day').toSQL() as string,
          day.endOf('day').toSQL() as string
        ])
        .where('status', '!=', 'cancelled')
        .sum('total_price as total')
        .first()
      
      data.push(Number(revenue?.$extras.total || 0))
    }

    return { labels, data }
  }
}
