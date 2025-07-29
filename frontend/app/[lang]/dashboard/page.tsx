'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';

export default function DashboardRedirectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  useEffect(() => {
    if (!user) {
      router.push(`/${lang}/login`);
      return;
    }

    // Redirigir según el rol del usuario
    const userRole = user.role || 'customer';
    router.push(`/${lang}/dashboard/${userRole}`);
  }, [user, router, lang]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecting to dashboard...</div>
    </div>
  );
} 