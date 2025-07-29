'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useCart } from '../../lib/cart-context';
import { IconShoppingCart } from '@tabler/icons-react';

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className = '' }: CartIconProps) {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const handleCartClick = () => {
    if (user) {
      router.push(`/${lang}/cart`);
    } else {
      router.push(`/${lang}/login`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleCartClick}
        className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
        aria-label="Shopping Cart"
      >
        <IconShoppingCart className="w-6 h-6" />
        
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
    </div>
  );
} 