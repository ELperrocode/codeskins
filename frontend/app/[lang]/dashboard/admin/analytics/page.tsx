'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth-context';
import { useDictionary } from '../../../../../lib/hooks/useDictionary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { getAnalytics } from '../../../../../lib/api';
import { IconTrendingUp, IconTrendingDown, IconUsers, IconShoppingCart, IconTemplate, IconCurrencyDollar } from '@tabler/icons-react';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalTemplates: number;
  recentOrders: any[];
  topTemplates: any[];
  monthlySales: Array<{
    _id: {
      year: number;
      month: number;
    };
    total: number;
    count: number;
  }>;
}

export default function AdminAnalyticsPage() {
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

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into your platform's performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Revenue</CardTitle>
              <IconCurrencyDollar className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">
                {formatCurrency(analytics?.totalSales || 0)}
              </div>
              <p className="text-xs text-gray-600">
                All time revenue
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Orders</CardTitle>
              <IconShoppingCart className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {analytics?.totalOrders || 0}
              </div>
              <p className="text-xs text-gray-600">
                All time orders
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Users</CardTitle>
              <IconUsers className="w-4 h-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-700">
                {analytics?.totalUsers || 0}
              </div>
              <p className="text-xs text-gray-600">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Templates</CardTitle>
              <IconTemplate className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">
                {analytics?.totalTemplates || 0}
              </div>
              <p className="text-xs text-gray-600">
                Available templates
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Sales Chart */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Monthly Sales</CardTitle>
              <CardDescription className="text-gray-600">Revenue trends over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.monthlySales && analytics.monthlySales.length > 0 ? (
                <div className="space-y-4">
                  {analytics.monthlySales.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">
                          {getMonthName(month._id.month)} {month._id.year}
                        </p>
                        <p className="text-sm text-gray-600">
                          {month.count} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-700">
                          {formatCurrency(month.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <IconTrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No sales data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Selling Templates */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Top Selling Templates</CardTitle>
              <CardDescription className="text-gray-600">Most popular templates by sales</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.topTemplates && analytics.topTemplates.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topTemplates.map((template, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">{template.title}</p>
                        <p className="text-sm text-gray-600">
                          {template.category} • {template.sales} sales
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-700">
                          {formatCurrency(template.price)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(template.rating || 0).toFixed(1)} ⭐
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <IconTemplate className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No template data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        {analytics?.recentOrders && analytics.recentOrders.length > 0 && (
          <Card className="mt-8 bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Orders</CardTitle>
              <CardDescription className="text-gray-600">Latest platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentOrders.slice(0, 10).map((order: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order._id?.slice(-6)}</p>
                      <p className="text-sm text-gray-600">
                        {order.customerId?.username || 'Unknown'} • {order.items?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-700">
                        {formatCurrency(order.total || 0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700">
                {analytics?.totalOrders && analytics.totalOrders > 0
                  ? formatCurrency(analytics.totalSales / analytics.totalOrders)
                  : formatCurrency(0)
                }
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Per completed order
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">
                {analytics?.totalUsers && analytics.totalUsers > 0
                  ? ((analytics.totalOrders / analytics.totalUsers) * 100).toFixed(1)
                  : '0.0'
                }%
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Orders per user
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Template Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">
                {analytics?.totalTemplates && analytics.totalTemplates > 0
                  ? (analytics.totalSales / analytics.totalTemplates).toFixed(0)
                  : '0'
                }
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Revenue per template
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 