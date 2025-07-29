'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth-context';
import { useDictionary } from '../../../../../lib/hooks/useDictionary';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Badge } from '../../../../../components/ui/badge';
import { getOrders } from '../../../../../lib/api';
import { 
  IconShoppingCart, 
  IconDownload, 
  IconReceipt, 
  IconCalendar, 
  IconCreditCard,
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle,
  IconPackage,
  IconEye,
  IconArrowRight
} from '@tabler/icons-react';
import DownloadButton from '../../../../../components/DownloadButton';
import ReceiptPDF from '../../../../../components/ReceiptPDF';

interface OrderItem {
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
}

interface CustomerOrder {
  _id: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentId?: string;
  stripeSessionId?: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerPurchasesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'customer')) {
      router.push(`/${lang}/login`);
    }
  }, [user, authLoading, router, lang]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        if (response.success && response.data) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'customer') {
      fetchOrders();
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <IconCheck className="w-4 h-4" />;
      case 'pending':
        return <IconClock className="w-4 h-4" />;
      case 'failed':
        return <IconX className="w-4 h-4" />;
      case 'refunded':
        return <IconAlertCircle className="w-4 h-4" />;
      default:
        return <IconClock className="w-4 h-4" />;
    }
  };

  const handleViewTemplate = (templateId: string) => {
    router.push(`/${lang}/templates/${templateId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Purchases
              </h1>
              <p className="text-lg text-gray-600">
                View and manage your purchased templates
              </p>
            </div>
            <Button
              onClick={() => router.push(`/${lang}/templates`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse More Templates
              <IconArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
                </div>
                <IconShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Spent</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                  </p>
                </div>
                <IconCreditCard className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Completed</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {orders.filter(order => order.status === 'completed').length}
                  </p>
                </div>
                <IconCheck className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Templates</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {orders.reduce((sum, order) => sum + order.items.length, 0)}
                  </p>
                </div>
                <IconPackage className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="py-16 text-center">
              <IconShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Purchases Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't made any purchases yet. Start exploring our amazing template collection and find the perfect design for your next project!
              </p>
              <Button
                onClick={() => router.push(`/${lang}/templates`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Browse Templates
                <IconArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(order.status)} flex items-center gap-1`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600">
                        <div className="flex items-center gap-6 text-sm">
                          <span className="flex items-center gap-1">
                            <IconCalendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconCreditCard className="w-4 h-4" />
                            {order.paymentMethod}
                          </span>
                          {order.stripePaymentId && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              ID: {order.stripePaymentId.slice(-8)}
                            </span>
                          )}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(order.total, order.currency)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                      <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {item.templateId?.previewImages && item.templateId.previewImages.length > 0 && (
                              <img
                                src={item.templateId.previewImages[0]}
                                alt={item.title}
                                className="w-20 h-20 object-cover rounded-lg shadow-sm"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">{item.title}</h4>
                              <p className="text-sm text-gray-600 mb-1">{item.templateId?.category || 'Template'}</p>
                              <p className="text-xs text-gray-500">
                                Quantity: {item.quantity} • {formatCurrency(item.price, order.currency)} each
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900 text-lg">
                              {formatCurrency(item.price * item.quantity, order.currency)}
                            </span>
                            <div className="flex gap-2">
                              {item.templateId?._id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewTemplate(item.templateId._id)}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                  <IconEye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              )}
                              {order.status === 'completed' && item.templateId?._id && (
                                <DownloadButton
                                  templateId={item.templateId._id}
                                  templateTitle={item.title}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>Email: {order.customerEmail}</span>
                        <span>Updated: {new Date(order.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-3">
                        <ReceiptPDF order={order} user={user} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 