import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { authenticate } from '../middleware/auth';
import { User, IUser } from '../models/User';
import { Cart } from '../models/Cart';
import { Order } from '../models/Order';
import { Template } from '../models/Template';

// Initialize Stripe with secret key
const stripeKey = process.env['STRIPE_SECRET_KEY'];
console.log('Stripe key loaded:', stripeKey ? 'YES' : 'NO');
console.log('Stripe key starts with:', stripeKey?.substring(0, 10) + '...');

// Initialize Stripe with real test mode
let stripe: Stripe | null = null;
if (stripeKey) {
  stripe = new Stripe(stripeKey, {
    apiVersion: '2023-10-16',
  });
  console.log('Stripe initialized with:', stripeKey.startsWith('sk_test_') ? 'TEST MODE' : 'LIVE MODE');
}

interface StripeRequest extends FastifyRequest {
  user?: IUser;
}

interface CreateCheckoutSessionBody {
  items: Array<{
    templateId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
}

export const registerStripeRoutes = (fastify: FastifyInstance): void => {
  // Test route to verify registration
  fastify.get('/test', async () => {
    return { 
      success: true, 
      message: 'Stripe routes are registered',
      stripeMode: stripeKey?.startsWith('sk_test_') ? 'TEST' : 'LIVE'
    };
  });

  // Create checkout session with real Stripe
  fastify.post('/create-checkout-session', { preHandler: authenticate }, async (request: StripeRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user) {
        return reply.status(401).send({ success: false, message: 'Authentication required' });
      }

      if (!stripe) {
        return reply.status(500).send({ 
          success: false, 
          message: 'Stripe not configured properly'
        });
      }

      const { items } = request.body as CreateCheckoutSessionBody;
      
      if (!items || items.length === 0) {
        return reply.status(400).send({ success: false, message: 'No items provided' });
      }

      // Validate templates exist and get their details
      const templateIds = items.map(item => item.templateId);
      const templates = await Template.find({ _id: { $in: templateIds }, isActive: true });
      
      if (templates.length !== items.length) {
        return reply.status(400).send({ success: false, message: 'Some templates not found or inactive' });
      }

      // Create line items for Stripe
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: `Template: ${item.title}`,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env['FRONTEND_URL']}/en/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env['FRONTEND_URL']}/en/checkout/cancel`,
        customer_email: user.email,
        metadata: {
          userId: user._id?.toString() || '',
          templateIds: JSON.stringify(templateIds),
        },
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'MX', 'ES', 'FR', 'DE', 'IT', 'GB'],
        },
      });

      return {
        success: true,
        message: 'Checkout session created successfully',
        url: session.url,
        sessionId: session.id,
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to create checkout session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Webhook handler for Stripe events
  fastify.post('/webhook', async (request: FastifyRequest, reply: FastifyReply) => {
    console.log('Webhook endpoint hit!');
    
    if (!stripe) {
      console.error('Stripe not configured');
      return reply.status(500).send({ error: 'Stripe not configured' });
    }

    let event: Stripe.Event;

          try {
        // For development, we'll skip signature verification
        // In production, you should always verify the signature
        const body = await request.body;
        console.log('Webhook body received:', JSON.stringify(body, null, 2));
        event = body as Stripe.Event;
        
        console.log('Received webhook event:', event.type);
        console.log('Event data object:', JSON.stringify(event.data.object, null, 2));
    } catch (err) {
      console.error('Error parsing webhook body:', err);
      return reply.status(400).send({ error: 'Invalid webhook body' });
    }

          try {
        // Handle the event
        switch (event.type) {
                  case 'checkout.session.completed':
          console.log('Processing checkout.session.completed event');
          try {
            await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
            console.log('Finished processing checkout.session.completed event');
          } catch (error) {
            console.error('Error in handleCheckoutSessionCompleted:', error);
          }
          break;
          case 'payment_intent.succeeded':
            await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
            break;
          case 'payment_intent.payment_failed':
            await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
            break;
          case 'charge.succeeded':
          case 'charge.updated':
          case 'payment_intent.created':
          case 'product.created':
          case 'price.created':
            // These events are handled automatically by Stripe, just log them
            console.log(`Received ${event.type} event`);
            break;
          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
      } catch (error) {
        console.error('Error processing webhook:', error);
        return reply.status(500).send({ error: 'Webhook processing failed' });
      }
  });

  // Get payment intent details
  fastify.get('/payment-intent/:id', { preHandler: authenticate }, async (request: StripeRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      
      if (!stripe) {
        return reply.status(500).send({ 
          success: false, 
          message: 'Stripe not configured properly' 
        });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(id);
      
      return {
        success: true,
        data: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          created: paymentIntent.created,
        }
      };
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to retrieve payment intent' 
      });
    }
  });
};

// Webhook handlers
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('=== START: handleCheckoutSessionCompleted ===');
    console.log('Processing completed checkout session:', session.id);
    console.log('Session metadata:', session.metadata);
    console.log('Session customer details:', session.customer_details);
    
    // Extract user ID and template IDs from metadata
    let userId = session.metadata?.['userId'];
    const templateIdsStr = session.metadata?.['templateIds'];
    
    console.log('Extracted userId:', userId);
    console.log('Extracted templateIdsStr:', templateIdsStr);
    
    if (!userId) {
      console.log('No userId found in session metadata, using customer email to find user');
      // Try to find user by email
      const user = await User.findOne({ email: session.customer_details?.email });
      if (user) {
        userId = user._id?.toString() || '';
        console.log('Found user by email:', userId);
      } else {
        console.error('No user found by email either');
        return;
      }
    }
    
    let templateIds: string[] = [];
    if (templateIdsStr) {
      try {
        templateIds = JSON.parse(templateIdsStr);
        console.log('Parsed templateIds:', templateIds);
      } catch (error) {
        console.error('Error parsing templateIds:', error);
        return;
      }
    }
    
    if (!templateIds.length) {
      console.log('No templateIds found in session metadata, will create basic order');
      // Continue without template IDs
    }

    // Get cart items for this user
    const cart = await Cart.findOne({ userId });
    console.log('Found cart:', cart ? 'YES' : 'NO');
    
    if (!cart || cart.items.length === 0) {
      console.log('No cart found, creating order with template IDs');
      
      // If we have template IDs from metadata, use them
      if (templateIds.length > 0) {
        // Get template details from database
        const templates = await Template.find({ _id: { $in: templateIds } });
        console.log('Found templates:', templates.length);
        
        const order = new Order({
          customerId: userId,
          items: templates.map((template) => ({
            templateId: template._id,
            title: template.title,
            price: template.price,
            quantity: 1
          })),
          total: session.amount_total ? session.amount_total / 100 : templates.reduce((sum, t) => sum + t.price, 0),
          currency: session.currency?.toUpperCase() || 'USD',
          stripePaymentId: session.payment_intent as string,
          stripeSessionId: session.id,
          status: 'completed',
          paymentMethod: 'stripe',
          customerEmail: session.customer_details?.email || 'test@example.com',
          ownerId: userId,
        });

        try {
          await order.save();
          console.log('Order created successfully with templates:', order._id);
          console.log('=== END: handleCheckoutSessionCompleted ===');
          return;
        } catch (error: any) {
          if (error.code === 11000 && error.keyPattern?.stripePaymentId) {
            console.log('Order already exists with this payment intent, skipping creation');
            console.log('=== END: handleCheckoutSessionCompleted (DUPLICATE) ===');
            return;
          }
          throw error;
        }
      } else {
        console.log('No template IDs found, creating basic order');
        // Create a basic order with session info
        const order = new Order({
          customerId: userId,
          items: [{
            templateId: new mongoose.Types.ObjectId(), // Placeholder
            title: 'Template Purchase',
            price: session.amount_total ? session.amount_total / 100 : 0,
            quantity: 1
          }],
          total: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency?.toUpperCase() || 'USD',
          stripePaymentId: session.payment_intent as string,
          stripeSessionId: session.id,
          status: 'completed',
          paymentMethod: 'stripe',
          customerEmail: session.customer_details?.email || 'test@example.com',
          ownerId: userId,
        });

        try {
          await order.save();
          console.log('Basic order created successfully:', order._id);
          console.log('=== END: handleCheckoutSessionCompleted ===');
          return;
        } catch (error: any) {
          if (error.code === 11000 && error.keyPattern?.stripePaymentId) {
            console.log('Order already exists with this payment intent, skipping creation');
            console.log('=== END: handleCheckoutSessionCompleted (DUPLICATE) ===');
            return;
          }
          throw error;
        }
      }
    }

    // Create order with cart items
    const order = new Order({
      customerId: userId,
      items: cart.items,
      total: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
      currency: session.currency?.toUpperCase() || 'USD',
      stripePaymentId: session.payment_intent as string,
      stripeSessionId: session.id,
      status: 'completed',
      paymentMethod: 'stripe',
      customerEmail: session.customer_details?.email || '',
      ownerId: userId,
    });

    try {
      await order.save();

      // Clear cart
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], total: 0 } }
      );

      console.log('Order created successfully:', order._id);
      console.log('=== END: handleCheckoutSessionCompleted ===');
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.stripePaymentId) {
        console.log('Order already exists with this payment intent, skipping creation');
        console.log('=== END: handleCheckoutSessionCompleted (DUPLICATE) ===');
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('=== END: handleCheckoutSessionCompleted (ERROR) ===');
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment intent succeeded:', paymentIntent.id);
    
    // Update order status if needed
    const order = await Order.findOne({ stripePaymentId: paymentIntent.id });
    if (order && order.status !== 'completed') {
      order.status = 'completed';
      await order.save();
      console.log('Order status updated to completed:', order._id);
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment intent failed:', paymentIntent.id);
    
    // Update order status
    const order = await Order.findOne({ stripePaymentId: paymentIntent.id });
    if (order) {
      order.status = 'failed';
      await order.save();
      console.log('Order status updated to failed:', order._id);
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
} 