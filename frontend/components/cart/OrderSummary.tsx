'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { IconShoppingCart } from '@tabler/icons-react';

interface OrderSummaryProps {
  items: Array<{
    templateId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  onProceedToCheckout: () => void;
  isUpdating: boolean;
  formatCurrency: (amount: number) => string;
}

export function OrderSummary({ 
  items, 
  total, 
  onProceedToCheckout, 
  isUpdating, 
  formatCurrency 
}: OrderSummaryProps) {
  return (
    <Card className="bg-card border-border sticky top-8 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="text-foreground text-2xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-base">
              <span className="text-muted-foreground flex-1 mr-4">
                {item.title} (x{item.quantity})
              </span>
              <span className="text-foreground font-semibold">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border pt-6">
          <div className="flex justify-between font-bold text-2xl">
            <span className="text-foreground">Total</span>
            <span className="text-foreground text-primary-600">{formatCurrency(total)}</span>
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            onClick={onProceedToCheckout}
            disabled={isUpdating || items.length === 0}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-4 text-xl font-bold rounded-lg"
          >
            <IconShoppingCart className="w-6 h-6 mr-3" />
            Proceed to Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 