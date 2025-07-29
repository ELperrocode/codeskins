'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../lib/auth-context';
import { useDictionary } from '../../../../lib/hooks/useDictionary';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { getOrders, getCustomerAnalytics } from '../../../../lib/api';
import { IconDownload, IconShoppingCart, IconHeart, IconHistory, IconUser, IconSettings } from '@tabler/icons-react';

interface CustomerOrder {
  _id: string;
  items: Array<{
    templateId: {
      _id: string;
      title: string;
      price: number;
      category: string;
    };
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}

interface CustomerAnalytics {
  totalSpent: number;
  totalOrders: number;
  recentOrders: CustomerOrder[];
  favoriteCategories: Array<{
    _id: string;
    count: number;
  }>;
}

export default function CustomerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'customer')) {
      router.push(`/${lang}/login`);
    }
  }, [user, authLoading, router, lang]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const [ordersResponse, analyticsResponse] = await Promise.all([
          getOrders(),
          getCustomerAnalytics()
        ]);

        if (analyticsResponse.success && analyticsResponse.data) {
          setAnalytics(analyticsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'customer') {
      fetchCustomerData();
    }
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t.ui.loading}</div>
      </div>
    );
  }

  if (!user || user.role !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">
            {t.dashboard.customer.title}
          </h1>
          <p className="text-secondary/70 mt-2">
            Welcome back, {user.username}. Manage your purchases and downloads.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <IconShoppingCart className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analytics?.totalSpent || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                All time purchases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <IconHistory className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {analytics?.totalOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                All time orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <IconDownload className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {analytics?.recentOrders?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Available downloads
              </p>
              <Button
                onClick={() => router.push(`/${lang}/dashboard/customer/downloads`)}
                size="sm"
                className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                View Downloads
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">Order #{order._id.slice(-6)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-600">{item.templateId?.category || 'Template'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(item.price)}</p>
                              {order.status === 'completed' && item.templateId?._id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-1"
                                  onClick={() => router.push(`/${lang}/templates/${item.templateId._id}`)}
                                >
                                  <IconDownload className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <IconShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No orders yet</p>
                  <Button 
                    onClick={() => router.push(`/${lang}/templates`)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Browse Templates
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favorite Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Favorite Categories</CardTitle>
              <CardDescription>Categories you purchase most</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.favoriteCategories && analytics.favoriteCategories.length > 0 ? (
                <div className="space-y-4">
                  {analytics.favoriteCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{category._id}</p>
                        <p className="text-sm text-gray-600">
                          {category.count} {category.count === 1 ? 'purchase' : 'purchases'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/${lang}/templates?category=${category._id}`)}
                      >
                        Browse More
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <IconHeart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No favorite categories yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Start purchasing templates to see your preferences
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push(`/${lang}/templates`)}
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <IconShoppingCart className="w-6 h-6" />
                <span>Browse Templates</span>
              </Button>
              
              <Button
                onClick={() => router.push(`/${lang}/dashboard/customer/profile`)}
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-500 hover:bg-green-600 text-white"
              >
                <IconUser className="w-6 h-6" />
                <span>My Profile</span>
              </Button>
              
              <Button
                onClick={() => router.push(`/${lang}/dashboard/customer/settings`)}
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-500 hover:bg-purple-600 text-white"
              >
                <IconSettings className="w-6 h-6" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 