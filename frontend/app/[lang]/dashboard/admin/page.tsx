'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../lib/auth-context';
import { useDictionary } from '../../../../lib/hooks/useDictionary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { getAnalytics } from '../../../../lib/api';
import { IconUsers, IconShoppingCart, IconTemplate, IconTrendingUp } from '@tabler/icons-react';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalTemplates: number;
  recentOrders: any[];
  topTemplates: any[];
  monthlySales: any[];
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push(`/${lang}/login`);
    }
  }, [user, authLoading, router, lang]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics();
        if (response.success && response.data) {
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t.ui.loading}</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const analyticsCards = [
    {
      title: 'Total Sales',
      value: `$${analytics?.totalSales?.toFixed(2) || '0.00'}`,
      description: 'Total revenue',
      icon: IconTrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Orders',
      value: analytics?.totalOrders?.toString() || '0',
      description: 'All time orders',
      icon: IconShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Users',
      value: analytics?.totalUsers?.toString() || '0',
      description: 'Registered users',
      icon: IconUsers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Templates',
      value: analytics?.totalTemplates?.toString() || '0',
      description: 'Available templates',
      icon: IconTemplate,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">
            {t.dashboard.admin.title}
          </h1>
          <p className="text-secondary/70 mt-2">
            Welcome back, {user.username}. Here's what's happening with your platform.
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        {analytics?.recentOrders && analytics.recentOrders.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recentOrders.slice(0, 5).map((order: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order._id?.slice(-6)}</p>
                        <p className="text-sm text-gray-600">
                          {order.customerId?.username || 'Unknown'} - ${order.total}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize">{order.status}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {analytics?.topTemplates && analytics.topTemplates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Templates</CardTitle>
                  <CardDescription>Most popular templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topTemplates.slice(0, 5).map((template: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{template.title}</p>
                          <p className="text-sm text-gray-600">
                            ${template.price} - {template.sales} sales
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">⭐ {(template.rating || 0).toFixed(1)}</p>
                          <p className="text-xs text-gray-500">
                            {template.downloads} downloads
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 