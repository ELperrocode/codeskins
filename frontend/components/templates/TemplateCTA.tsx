'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useTranslation } from '../../lib/hooks/useTranslation';
import { 
  IconShoppingCart, 
  IconDownload, 
  IconShield, 
  IconClock,
  IconStar
} from '@tabler/icons-react';

interface TemplateCTAProps {
  template: {
    title: string;
    price: number;
    sales: number;
    licenseId?: {
      name: string;
      price: number;
      maxSales?: number;
    };
  };
  onAddToCart: () => void;
  addingToCart: boolean;
}

export function TemplateCTA({ template, onAddToCart, addingToCart }: TemplateCTAProps) {
  const { t } = useTranslation();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get instant access to {template.title} and start building your project today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <IconDownload className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Instant Download</h3>
                      <p className="text-sm text-gray-600">Get your files immediately after purchase</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconShield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                      <p className="text-sm text-gray-600">Your payment is protected by Stripe</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <IconClock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Lifetime Updates</h3>
                      <p className="text-sm text-gray-600">Get all future updates for free</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <IconStar className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Premium Support</h3>
                      <p className="text-sm text-gray-600">Get help when you need it</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Right: Purchase Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white border-2 border-primary-200 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-primary-600 mb-2">
                    {formatCurrency(template.price)}
                  </div>
                  <p className="text-gray-600">One-time payment</p>
                </div>

                {template.licenseId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">L</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900">{template.licenseId.name}</h4>
                        <p className="text-sm text-blue-700">
                          Unlimited downloads included
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Button
                    size="lg"
                    onClick={onAddToCart}
                    disabled={
                      addingToCart || 
                      !!(template.licenseId?.maxSales && template.licenseId.maxSales > 0 && template.sales >= template.licenseId.maxSales)
                    }
                    className={`w-full px-8 py-4 text-lg font-semibold ${
                      template.licenseId?.maxSales && template.licenseId.maxSales > 0 && template.sales >= template.licenseId.maxSales
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    <IconShoppingCart className="w-5 h-5 mr-2" />
                    {addingToCart 
                      ? 'Adding to Cart...' 
                      : (template.licenseId?.maxSales && template.licenseId.maxSales > 0 && template.sales >= template.licenseId.maxSales)
                        ? 'Sold Out'
                        : 'Add to Cart'
                    }
                  </Button>

                  {/* Availability info */}
                  {template.licenseId?.maxSales && template.licenseId.maxSales > 0 && (
                    <div className="text-center">
                      <p className={`text-sm font-medium ${
                        template.sales >= template.licenseId.maxSales 
                          ? 'text-red-600' 
                          : template.sales >= template.licenseId.maxSales * 0.8 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                      }`}>
                        {template.sales >= template.licenseId.maxSales 
                          ? 'This template is sold out'
                          : `${template.licenseId.maxSales - template.sales} copies remaining`
                        }
                      </p>
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      ✓ 30-day money-back guarantee
                    </p>
                    <p className="text-sm text-gray-600">
                      ✓ Instant download after purchase
                    </p>
                    <p className="text-sm text-gray-600">
                      ✓ Lifetime updates included
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Trusted by Thousands of Developers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                <p className="text-gray-600">Templates Available</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">4.9</div>
                <p className="text-gray-600">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                <p className="text-gray-600">Support Available</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 