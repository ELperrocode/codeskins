'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useDictionary } from '../../../lib/hooks/useDictionary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { getCart, createCheckoutSession } from '../../../lib/api';
import { showError, showSuccess, handleNetworkError } from '../../../lib/toast';

interface CartItem {
  templateId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

function CheckoutContent() {
  const { user } = useAuth();
  const { t } = useDictionary();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeUrl, setStripeUrl] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await getCart();
      if (response.success && response.data) {
        setCart(response.data.cart);
      } else {
        showError(response.message || 'Failed to load cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      handleNetworkError(error, 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      showError('Cart is empty');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Creating checkout session with items:', cart.items);
      
      const response = await createCheckoutSession(cart.items);
      console.log('Checkout response:', response);
      
      // Handle both response formats (data.url and direct url)
      const stripeUrl = (response as any).url || response.data?.url;
      
      if (response.success && stripeUrl) {
        console.log('Redirecting to:', stripeUrl);
        showSuccess('Redirecting to payment...');
        
        // Force redirect after a short delay
        setTimeout(() => {
          console.log('Executing redirect...');
          if (stripeUrl) {
            // Try multiple redirect methods
            try {
              console.log('Trying window.location.href');
              window.location.href = stripeUrl;
            } catch (error) {
              console.error('window.location.href failed:', error);
              try {
                console.log('Trying window.location.replace');
                window.location.replace(stripeUrl);
              } catch (error2) {
                console.error('window.location.replace failed:', error2);
                console.log('Trying window.open');
                window.open(stripeUrl, '_self');
              }
            }
          }
        }, 1000);
        
        // Also show a direct link as backup
        setStripeUrl(stripeUrl);
      } else {
        console.error('Invalid response:', response);
        showError(response.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      handleNetworkError(error, 'Failed to create checkout session');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to checkout</h1>
          <Button onClick={() => router.push(`/${lang}/login`)}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some templates to checkout!</p>
          <Button onClick={() => router.push(`/${lang}/templates`)}>
            Browse Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.templateId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(cart.total || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${((cart.total || 0) * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${((cart.total || 0) * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Payment Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Secure payment powered by Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <p className="text-gray-600">
                    You'll be redirected to Stripe's secure checkout page where you can pay with:
                  </p>
                  <ul className="mt-2 text-sm text-gray-600">
                    <li>• Credit/Debit Cards</li>
                    <li>• Apple Pay</li>
                    <li>• Google Pay</li>
                    <li>• Other payment methods</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-800">Security</h3>
                  <p className="text-blue-700 text-sm">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-gradient-primary hover:bg-gradient-primary-hover"
                >
                  {isProcessing ? 'Processing...' : `Pay $${((cart.total || 0) * 1.08).toFixed(2)}`}
                </Button>
                
                {stripeUrl && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2">
                      If you weren't redirected automatically, click the link below:
                    </p>
                    <a
                      href={stripeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Continue to Stripe Checkout
                    </a>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${lang}/cart`)}
                  className="w-full"
                >
                  Back to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
} 