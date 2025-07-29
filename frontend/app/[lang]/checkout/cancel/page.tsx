'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Payment was not completed</h3>
                  <p className="text-gray-600 text-sm">
                    You cancelled the payment process before it was completed. No money was charged.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Your cart is still available</h3>
                  <p className="text-gray-600 text-sm">
                    The items you selected are still in your cart. You can try the payment again anytime.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Need help?</h3>
                  <p className="text-gray-600 text-sm">
                    If you encountered any issues during checkout, our support team is here to help.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push('/checkout')}
            className="flex-1"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => router.push('/cart')}
            variant="outline"
            className="flex-1"
          >
            View Cart
          </Button>
          <Button 
            onClick={() => router.push('/templates')}
            variant="outline"
            className="flex-1"
          >
            Browse Templates
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
        </div>
      </div>
    </div>
  );
} 