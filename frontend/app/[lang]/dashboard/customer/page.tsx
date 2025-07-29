'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { getOrders, getCustomerAnalytics, getTemplates } from '../../../../lib/api';
import { 
  IconShoppingCart, 
  IconHeart, 
  IconHistory, 
  IconTrendingUp,
  IconStar,
  IconDownload,
  IconEye,
  IconArrowRight,
  IconCalendar,
  IconCreditCard,
  IconPackage,
  IconSparkles,
  IconUser
} from '@tabler/icons-react';

interface CustomerOrder {
  _id: string;
  items: Array<{
    templateId: {
      _id: string;
      title: string;
      price: number;
      category: string;
      previewImages?: string[];
    };
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
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

interface Template {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  previewImages?: string[];
  downloads: number;
  sales: number;
  rating: number;
  reviewCount: number;
  ownerId: {
    _id: string;
    username: string;
  };
}

export default function CustomerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
  const [recommendedTemplates, setRecommendedTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not a customer
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'customer')) {
      router.push(`/${lang}/login`);
    }
  }, [user, authLoading, router, lang]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const [ordersResponse, templatesResponse] = await Promise.all([
          getOrders(),
          getTemplates({ limit: 6, sort: 'popular' })
        ]);

        if (ordersResponse.success && ordersResponse.data) {
          const orders = ordersResponse.data.orders;
          const totalSpent = orders
            .filter((order: any) => order.status === 'completed')
            .reduce((sum: number, order: any) => sum + order.total, 0);
          
          setAnalytics({
            totalSpent,
            totalOrders: orders.length,
            recentOrders: orders.slice(0, 5),
            favoriteCategories: []
          });
        }

        if (templatesResponse.success && templatesResponse.data) {
          setRecommendedTemplates(templatesResponse.data.templates);
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <IconUser className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{getGreeting()}, {user?.username}!</h1>
            <p className="text-yellow-100">Welcome back to your dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Spent</p>
                <p className="text-2xl font-bold text-blue-900">
                  {analytics ? formatCurrency(analytics.totalSpent, 'USD') : '$0.00'}
                </p>
              </div>
              <IconCreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Orders</p>
                <p className="text-2xl font-bold text-green-900">
                  {analytics ? analytics.totalOrders : 0}
                </p>
              </div>
              <IconShoppingCart className="w-8 h-8 text-green-600" />
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
              <CardDescription>Your latest purchases and downloads</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/${lang}/dashboard/customer/purchases`)}
            >
              View All
              <IconArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconPackage className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.items[0]?.title || 'Template'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(order.total, order.currency)}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IconHistory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet</p>
              <Button 
                className="mt-4"
                onClick={() => router.push(`/${lang}/templates`)}
              >
                Browse Templates
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recommended Templates</CardTitle>
              <CardDescription>Discover templates you might like</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/${lang}/templates`)}
            >
              Browse All
              <IconArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recommendedTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTemplates.map((template) => (
                <div key={template._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Template Image */}
                  <div className="relative aspect-video bg-gray-100">
                    {template.previewImages && template.previewImages.length > 0 ? (
                      <img 
                        src={template.previewImages[0]} 
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconPackage className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{template.title}</h3>
                      <span className="text-lg font-bold text-yellow-600">${template.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <IconStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{template.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconDownload className="w-4 h-4" />
                        <span>{template.downloads}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push(`/${lang}/templates/${template._id}`)}
                    >
                      <IconEye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IconSparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recommendations available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 