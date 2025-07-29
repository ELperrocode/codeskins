'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { getAnalytics } from '../../../../lib/api';
import { 
  IconUsers, 
  IconShoppingCart, 
  IconTemplate, 
  IconTrendingUp,
  IconCreditCard,
  IconPackage,
  IconStar,
  IconDownload,
  IconEye,
  IconArrowRight,
  IconCalendar,
  IconUser,
  IconSparkles,
  IconChartBar,
  IconCurrencyDollar
} from '@tabler/icons-react';

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <IconUser className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{getGreeting()}, {user?.username}!</h1>
            <p className="text-blue-100">Welcome to your admin dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">
                  {analytics ? formatCurrency(analytics.totalSales) : '$0.00'}
                </p>
              </div>
              <IconCurrencyDollar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">
                  {analytics ? analytics.totalOrders : 0}
                </p>
              </div>
              <IconShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Users</p>
                <p className="text-2xl font-bold text-purple-900">
                  {analytics ? analytics.totalUsers : 0}
                </p>
              </div>
              <IconUsers className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Templates</p>
                <p className="text-2xl font-bold text-orange-900">
                  {analytics ? analytics.totalTemplates : 0}
                </p>
              </div>
              <IconTemplate className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest platform activity</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/${lang}/dashboard/admin/orders`)}
            >
              View All
              <IconArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentOrders.slice(0, 5).map((order: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconPackage className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customerId?.username || 'Unknown'} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                    <Badge className={`capitalize ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IconShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Templates */}
      {analytics?.topTemplates && analytics.topTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Performing Templates</CardTitle>
                <CardDescription>Most popular and highest-rated templates</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/${lang}/dashboard/admin/templates`)}
              >
                Manage Templates
                <IconArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.topTemplates.slice(0, 6).map((template: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{template.title}</h3>
                      <span className="text-lg font-bold text-green-600">{formatCurrency(template.price)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <IconStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{(template.rating || 0).toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconDownload className="w-4 h-4" />
                        <span>{template.downloads}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{template.sales} sales</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/${lang}/dashboard/admin/templates/${template._id}/edit`)}
                      >
                        <IconEye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${lang}/dashboard/admin/templates/new`)}
            >
              <IconTemplate className="w-6 h-6" />
              <span>Add Template</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${lang}/dashboard/admin/users`)}
            >
              <IconUsers className="w-6 h-6" />
              <span>Manage Users</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${lang}/dashboard/admin/analytics`)}
            >
              <IconChartBar className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => router.push(`/${lang}/dashboard/admin/licenses`)}
            >
              <IconPackage className="w-6 h-6" />
              <span>Manage Licenses</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 