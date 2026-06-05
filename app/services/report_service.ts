import puppeteer from 'puppeteer'
import edge from 'edge.js'
import { DateTime } from 'luxon'
import Order from '#models/order'

export default class ReportService {
  /**
   * Generate Sales Report PDF
   */
  async generateSalesReport(startDate: DateTime, endDate: DateTime): Promise<Buffer> {
    const orders = await Order.query()
      .whereBetween('created_at', [startDate.toSQL() as string, endDate.toSQL() as string])
      .preload('items', (q) => q.preload('drug'))
      .preload('user')
      .orderBy('created_at', 'asc')

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0)

    // Render HTML from Edge template
    const html = await edge.render('reports/sales_report', {
      orders,
      startDate: startDate.toFormat('dd LLL yyyy'),
      endDate: endDate.toFormat('dd LLL yyyy'),
      totalRevenue,
      generatedAt: DateTime.now().toFormat('dd LLL yyyy HH:mm')
    })

    // Convert HTML to PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'load' })
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    })

    await browser.close()
    return Buffer.from(pdf)
  }
}
