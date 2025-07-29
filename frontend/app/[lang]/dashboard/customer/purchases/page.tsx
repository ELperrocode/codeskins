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
  IconAlertCircle
} from '@tabler/icons-react';
import DownloadButton from '../../../../../components/DownloadButton';

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

  const handleGoToDownloads = () => {
    router.push(`/${lang}/dashboard/customer/downloads`);
  };

  if (authLoading) {
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
          <h1 className="text-3xl font-bold text-secondary">My Purchases</h1>
          <p className="text-secondary/70 mt-2">
            View and manage your purchased templates
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                </div>
                <IconShoppingCart className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                  </p>
                </div>
                <IconCreditCard className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {orders.filter(order => order.status === 'completed').length}
                  </p>
                </div>
                <IconCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Templates</p>
                  <p className="text-2xl font-bold text-foreground">
                    {orders.reduce((sum, order) => sum + order.items.length, 0)}
                  </p>
                </div>
                <IconDownload className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <IconShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Purchases Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any purchases yet. Start exploring our template collection!
              </p>
              <Button
                onClick={() => router.push(`/${lang}/templates`)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-foreground">
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
                      <CardDescription className="text-muted-foreground">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <IconCalendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconCreditCard className="w-4 h-4" />
                            {order.paymentMethod}
                          </span>
                          {order.stripePaymentId && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              ID: {order.stripePaymentId.slice(-8)}
                            </span>
                          )}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(order.total, order.currency)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4 flex-1">
                          {item.templateId?.previewImages && item.templateId.previewImages.length > 0 && (
                            <img
                              src={item.templateId.previewImages[0]}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.templateId?.category || 'Template'}</p>
                            <p className="text-xs text-muted-foreground">
                              Quantity: {item.quantity} • {formatCurrency(item.price, order.currency)} each
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {formatCurrency(item.price * item.quantity, order.currency)}
                          </span>
                          <div className="flex gap-2">
                            {item.templateId?._id && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewTemplate(item.templateId._id)}
                                className="border-border text-foreground hover:bg-accent"
                              >
                                View
                              </Button>
                            )}
                            {order.status === 'completed' && item.templateId?._id && (
                              <DownloadButton
                                templateId={item.templateId._id}
                                templateTitle={item.title}
                                className="border-border text-foreground hover:bg-accent"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Email: {order.customerEmail}</span>
                        <span>Updated: {new Date(order.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'completed' && (
                          <div className="flex gap-2">
                            {order.items.map((item, index) => (
                              item.templateId?._id && (
                                <DownloadButton
                                  key={index}
                                  templateId={item.templateId._id}
                                  templateTitle={item.title}
                                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                                />
                              )
                            ))}
                          </div>
                        )}
                        <Button
                          variant="outline"
                          className="border-border text-foreground hover:bg-accent"
                        >
                          <IconReceipt className="w-4 h-4 mr-2" />
                          Receipt
                        </Button>
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