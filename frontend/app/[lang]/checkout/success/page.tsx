'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const { updateCartCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Limpiar el carrito inmediatamente
    updateCartCount();
    
    // Redirigir al dashboard de compras después de 3 segundos
    const timer = setTimeout(() => {
      router.push('/en/dashboard/customer/purchases');
    }, 3000);

    return () => clearTimeout(timer);
  }, [updateCartCount, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Please log in to view this page</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl text-green-800">¡Pago Exitoso!</CardTitle>
          <p className="text-gray-600 mt-2">
            Gracias por tu compra. Tu orden ha sido confirmada.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Serás redirigido a tus órdenes en 3 segundos...
          </p>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Session ID:</strong> {sessionId}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push('/en/dashboard/customer/purchases')}
              className="bg-green-600 hover:bg-green-700"
            >
              Ver Mis Órdenes
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/en')}
            >
              Continuar Comprando
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 