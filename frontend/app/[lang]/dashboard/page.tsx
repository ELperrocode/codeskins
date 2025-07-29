'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { useDictionary } from '../../../lib/hooks/useDictionary';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;

  useEffect(() => {
    if (!user) {
      router.push(`/${lang}/login`);
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push(`/${lang}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t.ui.loading}</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const getRoleContent = () => {
    switch (user.role) {
      case 'customer':
        return t.dashboard.customer;
      case 'admin':
        return t.dashboard.admin;
      default:
        return t.dashboard.customer;
    }
  };

  const roleContent = getRoleContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary">
                {t.dashboard.title}
              </h1>
              <p className="text-secondary/70 mt-2">
                Hello, {user.username} ({user.role})
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
            >
              {t.auth.logout}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.dashboard.accountStatus}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {user.isActive ? 'Active' : 'Inactive'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.dashboard.role}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold capitalize">{user.role}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.dashboard.memberSince}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{roleContent.title}</CardTitle>
                <CardDescription>{roleContent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roleContent.features.map((feature, index) => (
                    <p key={index} className="text-muted-foreground">• {feature}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 