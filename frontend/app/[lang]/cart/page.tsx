'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useCart } from '../../../lib/cart-context';
import { useDictionary } from '../../../lib/hooks/useDictionary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../../lib/api';
import { showCartUpdate, showCartError, showOperationSuccess, handleNetworkError } from '../../../lib/toast';
import { IconTrash, IconShoppingCart, IconArrowLeft } from '@tabler/icons-react';
import { CartItem, OrderSummary } from '../../../components/cart';

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

export default function CartPage() {
  const { user } = useAuth();
  const { t } = useDictionary();
  const { updateCartCount, decrementCartCount } = useCart();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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
        showCartError(response.message || 'Failed to load cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      handleNetworkError(error, 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (templateId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(templateId);
      return;
    }

    try {
      setIsUpdating(true);
      const response = await updateCartItem(templateId, quantity);
      if (response.success && response.data) {
        setCart(response.data.cart);
        await updateCartCount();
        showCartUpdate(`Quantity updated successfully`);
      } else {
        showCartError(response.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      handleNetworkError(error, 'Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (templateId: string) => {
    try {
      setIsUpdating(true);
      const response = await removeFromCart(templateId);
      if (response.success && response.data) {
        setCart(response.data.cart);
        await updateCartCount();
        showCartUpdate('Item removed from cart');
      } else {
        showCartError(response.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      handleNetworkError(error, 'Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsUpdating(true);
      const response = await clearCart();
      if (response.success) {
        setCart(null);
        await updateCartCount();
        showOperationSuccess('Cart cleared');
      } else {
        showCartError(response.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      handleNetworkError(error, 'Failed to clear cart');
    } finally {
      setIsUpdating(false);
    }
  };

  const proceedToCheckout = () => {
    router.push(`/${lang}/checkout`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Card className="bg-card border-border">
              <CardContent className="py-12">
                <IconShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-4">Please log in to view your cart</h1>
                <p className="text-muted-foreground mb-6">
                  You need to be logged in to access your shopping cart.
                </p>
                <Button 
                  onClick={() => router.push(`/${lang}/login`)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground text-lg">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 pt-8">
            <div>
              <h1 className="text-4xl font-bold text-secondary mb-3">Shopping Cart</h1>
              <p className="text-secondary/70 text-lg">
                {cart?.items.length || 0} {cart?.items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/${lang}/templates`)}
              className="border-border text-foreground hover:bg-accent px-6 py-3"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {!cart || cart.items.length === 0 ? (
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="py-16 text-center">
                <IconShoppingCart className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Start adding some templates to your cart!
                </p>
                <Button
                  onClick={() => router.push(`/${lang}/templates`)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-semibold"
                >
                  Browse Templates
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.items.map((item, index) => (
                  <CartItem
                    key={index}
                    item={item}
                    onUpdateQuantity={updateItemQuantity}
                    onRemove={removeItem}
                    isUpdating={isUpdating}
                    formatCurrency={formatCurrency}
                  />
                ))}
                
                {/* Clear Cart Button */}
                <div className="flex justify-end pt-8">
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    disabled={isUpdating}
                    className="border-border text-destructive hover:bg-destructive/10 px-8 py-3"
                  >
                    <IconTrash className="w-4 h-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary
                  items={cart.items}
                  total={cart.total}
                  onProceedToCheckout={proceedToCheckout}
                  isUpdating={isUpdating}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 