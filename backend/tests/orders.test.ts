import { build } from '../src/server'
import { Order } from '../src/models/Order'
import { User } from '../src/models/User'
import { Template } from '../src/models/Template'
import { License } from '../src/models/License'
import { connectDatabase, disconnectDatabase } from '../src/config/database'

describe('Order Routes', () => {
  let app: any
  let customer: any
  let seller: any
  let admin: any
  let template: any
  let license: any
  let customerSession: any
  let sellerSession: any
  let adminSession: any

  beforeAll(async () => {
    await connectDatabase()
    app = await build()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  beforeEach(async () => {
    // Clean up database
    await Order.deleteMany({})
    await User.deleteMany({})
    await Template.deleteMany({})
    await License.deleteMany({})

    // Create test license
    license = new License({
      name: 'Personal License',
      description: 'For personal use only',
      price: 9.99,
      maxDownloads: 1,
      isActive: true,
    })
    await license.save()

    // Create test users
    customer = new User({
      username: 'testcustomer',
      email: 'customer@test.com',
      password: 'password123',
      role: 'customer',
      isActive: true,
    })
    await customer.save()

    seller = new User({
      username: 'testseller',
      email: 'seller@test.com',
      password: 'password123',
      role: 'seller',
      isActive: true,
    })
    await seller.save()

    admin = new User({
      username: 'testadmin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      isActive: true,
    })
    await admin.save()

    // Create test template
    template = new Template({
      title: 'Test Template',
      description: 'A test template',
      price: 19.99,
      category: 'web',
      tags: ['test', 'web'],
      fileUrl: 'https://example.com/template.zip',
      previewImage: 'https://example.com/preview.jpg',
      sellerId: seller._id,
      licenseId: license._id,
      maxDownloads: 5,
      downloads: 0,
      sales: 0,
      rating: 0,
      reviewCount: 0,
      isActive: true,
    })
    await template.save()

    // Create sessions
    customerSession = { user: { id: customer._id.toString(), role: 'customer' } }
    sellerSession = { user: { id: seller._id.toString(), role: 'seller' } }
    adminSession = { user: { id: admin._id.toString(), role: 'admin' } }
  })

  describe('POST /api/orders', () => {
    it('should create a new order successfully', async () => {
      const orderData = {
        templateId: template._id.toString(),
        amount: 19.99,
        currency: 'usd',
        stripePaymentId: 'pi_test_123456789',
        paymentMethod: 'card',
      }

      const response = await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: orderData,
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(201)
      const result = JSON.parse(response.payload)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Order created successfully')
      expect(result.data.order).toBeDefined()
      expect(result.data.order.customerId).toBe(customer._id.toString())
      expect(result.data.order.templateId).toBe(template._id.toString())
      expect(result.data.order.sellerId).toBe(seller._id.toString())
      expect(result.data.order.amount).toBe(19.99)
      expect(result.data.order.status).toBe('pending')
    })

    it('should return 401 if not authenticated', async () => {
      const orderData = {
        templateId: template._id.toString(),
        amount: 19.99,
        stripePaymentId: 'pi_test_123456789',
        paymentMethod: 'card',
      }

      const response = await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: orderData,
      })

      expect(response.statusCode).toBe(401)
    })

    it('should return 404 if template not found', async () => {
      const orderData = {
        templateId: '507f1f77bcf86cd799439011', // Non-existent ID
        amount: 19.99,
        stripePaymentId: 'pi_test_123456789',
        paymentMethod: 'card',
      }

      const response = await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: orderData,
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(404)
      const result = JSON.parse(response.payload)
      expect(result.message).toBe('Template not found')
    })

    it('should return 409 if order with same stripePaymentId exists', async () => {
      const orderData = {
        templateId: template._id.toString(),
        amount: 19.99,
        stripePaymentId: 'pi_test_duplicate',
        paymentMethod: 'card',
      }

      // Create first order
      await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: orderData,
        cookies: { session: JSON.stringify(customerSession) },
      })

      // Try to create second order with same stripePaymentId
      const response = await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: orderData,
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(409)
      const result = JSON.parse(response.payload)
      expect(result.message).toBe('Order with this payment ID already exists')
    })
  })

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      // Create some test orders
      const order1 = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 19.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_1',
        status: 'completed',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order1.save()

      const order2 = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 29.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_2',
        status: 'pending',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order2.save()
    })

    it('should return orders for customer', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders',
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.payload)
      expect(result.success).toBe(true)
      expect(result.data.orders).toHaveLength(2)
      expect(result.data.pagination).toBeDefined()
    })

    it('should return orders for seller', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders',
        cookies: { session: JSON.stringify(sellerSession) },
      })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.payload)
      expect(result.success).toBe(true)
      expect(result.data.orders).toHaveLength(2)
    })

    it('should filter orders by status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders?status=completed',
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.payload)
      expect(result.data.orders).toHaveLength(1)
      expect(result.data.orders[0].status).toBe('completed')
    })

    it('should return 401 if not authenticated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders',
      })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('GET /api/orders/:id', () => {
    let order: any

    beforeEach(async () => {
      order = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 19.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_single',
        status: 'completed',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order.save()
    })

    it('should return order by ID for customer', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/orders/${order._id}`,
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.payload)
      expect(result.success).toBe(true)
      expect(result.data.order._id).toBe(order._id.toString())
    })

    it('should return order by ID for seller', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/orders/${order._id}`,
        cookies: { session: JSON.stringify(sellerSession) },
      })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.payload)
      expect(result.success).toBe(true)
      expect(result.data.order._id).toBe(order._id.toString())
    })

    it('should return 403 if customer tries to access other customer order', async () => {
      const otherCustomer = new User({
        username: 'othercustomer',
        email: 'other@test.com',
        password: 'password123',
        role: 'customer',
        isActive: true,
      })
      await otherCustomer.save()

      const otherSession = { user: { id: (otherCustomer as any)._id.toString(), role: 'customer' } }

      const response = await app.inject({
        method: 'GET',
        url: `/api/orders/${order._id}`,
        cookies: { session: JSON.stringify(otherSession) },
      })

      expect(response.statusCode).toBe(403)
    })

    it('should return 404 if order not found', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/507f1f77bcf86cd799439011',
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(404)
    })
  })

  describe('PATCH /api/orders/:id', () => {
    let order: any

    beforeEach(async () => {
      order = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 19.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_update',
        status: 'pending',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order.save()
    })

    it('should update order status', async () => {
      const updateData = {
        status: 'completed',
        stripeSessionId: 'cs_test_session',
      }

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/orders/${order._id}`,
        payload: updateData,
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.payload)
      expect(result.success).toBe(true)
      expect(result.data.order.status).toBe('completed')
      expect(result.data.order.stripeSessionId).toBe('cs_test_session')
    })

    it('should return 403 if unauthorized user tries to update', async () => {
      const otherCustomer = new User({
        username: 'othercustomer',
        email: 'other@test.com',
        password: 'password123',
        role: 'customer',
        isActive: true,
      })
      await otherCustomer.save()

      const otherSession = { user: { id: (otherCustomer as any)._id.toString(), role: 'customer' } }

      const updateData = { status: 'completed' }

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/orders/${order._id}`,
        payload: updateData,
        cookies: { session: JSON.stringify(otherSession) },
      })

      expect(response.statusCode).toBe(403)
    })
  })

  describe('DELETE /api/orders/:id', () => {
    let order: any

    beforeEach(async () => {
      order = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 19.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_delete',
        status: 'pending',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order.save()
    })

    it('should delete order if admin', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/orders/${order._id}`,
        cookies: { session: JSON.stringify(adminSession) },
      })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.payload)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Order deleted successfully')

      // Verify order is deleted
      const deletedOrder = await Order.findById(order._id)
      expect(deletedOrder).toBeNull()
    })

    it('should return 403 if non-admin tries to delete', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/orders/${order._id}`,
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(403)
      const result = JSON.parse(response.payload)
      expect(result.message).toBe('Access denied. Admin only.')
    })

    it('should return 404 if order not found', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/orders/507f1f77bcf86cd799439011',
        cookies: { session: JSON.stringify(adminSession) },
      })

      expect(response.statusCode).toBe(404)
    })
  })

  describe('GET /api/orders/stats/summary', () => {
    beforeEach(async () => {
      // Create orders with different statuses
      const order1 = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 19.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_stats_1',
        status: 'completed',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order1.save()

      const order2 = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 29.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_stats_2',
        status: 'completed',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order2.save()

      const order3 = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 39.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_stats_3',
        status: 'pending',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order3.save()

      const order4 = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 49.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_stats_4',
        status: 'failed',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order4.save()

      const order5 = new Order({
        customerId: customer._id,
        templateId: template._id,
        sellerId: seller._id,
        amount: 59.99,
        currency: 'USD',
        stripePaymentId: 'pi_test_stats_5',
        status: 'refunded',
        paymentMethod: 'card',
        customerEmail: customer.email,
        templateTitle: template.title,
        sellerEmail: seller.email,
      })
      await order5.save()
    })

    it('should return order statistics for customer', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/stats/summary',
        cookies: { session: JSON.stringify(customerSession) },
      })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.payload)
      expect(result.success).toBe(true)
      expect(result.data?.totalOrders).toBe(5)
      expect(result.data?.totalRevenue).toBe(199.95)
      expect(result.data?.completedOrders).toBe(2)
      expect(result.data?.pendingOrders).toBe(1)
      expect(result.data?.failedOrders).toBe(1)
      expect(result.data?.refundedOrders).toBe(1)
    })

    it('should return order statistics for seller', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/stats/summary',
        cookies: { session: JSON.stringify(sellerSession) },
      })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.payload)
      expect(result.success).toBe(true)
      expect(result.data?.totalOrders).toBe(5)
      expect(result.data?.totalRevenue).toBe(199.95)
    })

    it('should return 401 if not authenticated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/stats/summary',
      })

      expect(response.statusCode).toBe(401)
    })
  })
}) 