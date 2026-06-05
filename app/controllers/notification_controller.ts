import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'

export default class NotificationController {
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    const notifications = await Notification.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(10)

    return response.json(notifications)
  }

  async markAsRead({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const notification = await Notification.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()

    notification.isRead = true
    await notification.save()

    return response.json({ success: true })
  }

  async sse({ auth, response, request }: HttpContext) {
    const user = auth.user!
    
    // Set headers for SSE
    response.response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    // Send an initial connected message
    response.response.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)

    // We'll use a simple polling mechanism every 5 seconds to find new unread notifications
    // A more robust approach would use Redis Pub/Sub or @adonisjs/transmit
    let lastCheckTime = new Date()

    const interval = setInterval(async () => {
      try {
        const newNotifications = await Notification.query()
          .where('user_id', user.id)
          .where('is_read', false)
          .where('created_at', '>', lastCheckTime)
          .orderBy('created_at', 'asc')

        for (const notif of newNotifications) {
          response.response.write(`data: ${JSON.stringify(notif)}\n\n`)
        }
        
        lastCheckTime = new Date()
      } catch (error) {
        // Handle error gracefully or ignore if connection drops
      }
    }, 5000)

    // Clean up when client disconnects
    request.request.on('close', () => {
      clearInterval(interval)
      response.response.end()
    })
  }
}