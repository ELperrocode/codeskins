'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BackgroundGradient } from '../../../../components/ui/aceternity/background-gradient';
import { BackgroundBeams } from '../../../../components/ui/aceternity/background-beams';
import { Button } from '../../../../components/ui/button';
import { getTemplate, addToCart } from '../../../../lib/api';
import { useCart } from '../../../../lib/cart-context';
import { showCartSuccess, showCartError, handleNetworkError } from '../../../../lib/toast';
import ReviewSection from '../../../../components/ReviewSection';
import { 
  TemplateGallery, 
  TemplateInfo, 
  TemplateFeatures, 
  TemplateCTA 
} from '../../../../components/templates';
import { IconArrowLeft } from '@tabler/icons-react';

type Template = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  previewImages?: string[];
  previewUrl?: string;
  features: string[];
  downloads: number;
  sales: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  licenseId?: {
    _id: string;
    name: string;
    maxDownloads: number;
  };
  ownerId: {
    _id: string;
    username: string;
  };
};

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;
  const templateId = params.id as string;
  const { incrementCartCount } = useCart();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await getTemplate(templateId);
        if (response.success && response.data?.template) {
          const templateData = response.data.template as any;
          setTemplate({
            _id: templateData._id,
            title: templateData.title,
            description: templateData.description,
            price: templateData.price,
            category: templateData.category,
            tags: templateData.tags || [],
            previewImages: templateData.previewImages || [],
            previewUrl: templateData.previewUrl,
            features: templateData.features || [],
            downloads: templateData.downloads || 0,
            sales: templateData.sales || 0,
            rating: templateData.rating || 0,
            reviewCount: templateData.reviewCount || 0,
            createdAt: templateData.createdAt || new Date().toISOString(),
            licenseId: templateData.licenseId,
            ownerId: templateData.ownerId || { _id: '', username: 'Unknown' }
          });
        }
      } catch (error) {
        console.error('Error fetching template:', error);
        handleNetworkError(error, 'Failed to load template details');
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const handleAddToCart = async () => {
    if (!template) return;
    
    setAddingToCart(true);
    try {
      const response = await addToCart(template._id, 1);
      if (response.success) {
        incrementCartCount(1);
        showCartSuccess(template.title);
      } else {
        showCartError(response.message || 'Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      handleNetworkError(error, 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative z-10">
          {/* Header */}
          <div className="px-4 py-6">
            <div className="max-w-7xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-600 hover:bg-gray-100 mb-6"
              >
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            </div>
          </div>

          {/* Loading skeleton */}
          <div className="px-4 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image skeleton */}
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-6">
                  <div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                  
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <p className="text-gray-600 mb-6">The template you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push(`/${lang}/templates`)}>
            Browse Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <BackgroundGradient className="fixed inset-0 opacity-30" />
      <BackgroundBeams className="fixed inset-0 opacity-20" />
      
      <div className="relative z-10">
        {/* Header with back button */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-6"
        >
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-600 hover:bg-gray-100 mb-6"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </div>
        </motion.div>

        {/* Hero Section */}
        <section className="px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <TemplateGallery 
                  images={template.previewImages || []} 
                  title={template.title}
                  previewUrl={template.previewUrl}
                />
              </motion.div>

              {/* Template Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <TemplateInfo 
                  template={template}
                  onAddToCart={handleAddToCart}
                  addingToCart={addingToCart}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <TemplateFeatures features={template.features} />

        {/* Reviews Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <ReviewSection templateId={template._id} />
          </div>
        </section>

        {/* Call-to-Action Section */}
        <TemplateCTA 
          template={template}
          onAddToCart={handleAddToCart}
          addingToCart={addingToCart}
        />
      </div>
    </div>
  );
} 