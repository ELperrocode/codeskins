'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../lib/auth-context';
import { addToFavorites, removeFromFavorites, checkFavorite } from '../../lib/api';
import { 
  IconStar, 
  IconDownload, 
  IconShoppingCart, 
  IconHeart,
  IconShare,
  IconCalendar,
  IconUser,
  IconTag,
  IconExternalLink
} from '@tabler/icons-react';

interface TemplateInfoProps {
  template: {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    tags: string[];
    downloads: number;
    sales: number;
    rating: number;
    reviewCount: number;
    createdAt: string;
    previewUrl?: string;
    licenseId?: {
      _id: string;
      name: string;
      price: number;
      maxSales?: number;
    };
    ownerId: {
      _id: string;
      username: string;
    };
  };
  onAddToCart: () => void;
  addingToCart: boolean;
}

export function TemplateInfo({ template, onAddToCart, addingToCart }: TemplateInfoProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  // Check if template is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          const response = await checkFavorite(template._id);
          if (response.success && response.data) {
            setIsInWishlist(response.data.isFavorited);
          }
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, template._id]);

  const handleWishlistToggle = async () => {
    if (!user) {
      // Get current language from URL or default to 'en'
      const pathname = window.location.pathname;
      const lang = pathname.split('/')[1] || 'en';
      router.push(`/${lang}/login`);
      return;
    }

    setIsUpdatingWishlist(true);
    try {
      if (isInWishlist) {
        // Remove from favorites
        await removeFromFavorites(template._id);
        setIsInWishlist(false);
      } else {
        // Add to favorites
        await addToFavorites(template._id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IconStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <IconStar key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <IconStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: template.title,
        text: template.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          {template.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-gray-600 leading-relaxed"
        >
          {template.description}
        </motion.p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-2">
            <IconDownload className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">{template.downloads}</span>
          </div>
          <p className="text-sm text-gray-600">Downloads</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-2">
            <IconShoppingCart className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">{template.sales}</span>
          </div>
          <p className="text-sm text-gray-600">Sales</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-2">
            {renderStars(template.rating)}
            <span className="text-lg font-bold text-gray-900 ml-1">
              {template.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600">{template.reviewCount} reviews</p>
        </div>
      </motion.div>

      {/* Meta Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <IconUser className="w-4 h-4" />
          <span>Created by <span className="font-medium text-gray-900">{template.ownerId.username}</span></span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <IconCalendar className="w-4 h-4" />
          <span>Published on <span className="font-medium text-gray-900">{formatDate(template.createdAt)}</span></span>
        </div>
      </motion.div>

      {/* Category and Tags */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <IconTag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Category</span>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {template.category}
          </Badge>
        </div>
        
        {template.tags && template.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconTag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Price and License */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="space-y-4"
      >
        <div className="text-4xl font-bold text-gray-900">
          {formatCurrency(template.price)}
        </div>
        
        {template.licenseId && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">L</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">{template.licenseId.name}</h4>
                  <p className="text-sm text-blue-700">
                    License includes unlimited downloads
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Availability Indicator */}
        {template.licenseId?.maxSales && template.licenseId.maxSales > 0 && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Availability</h4>
                  <span className={`font-medium text-sm px-3 py-1 rounded-full ${
                    template.sales >= template.licenseId.maxSales 
                      ? 'bg-red-100 text-red-800' 
                      : template.sales >= template.licenseId.maxSales * 0.8 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {template.sales >= template.licenseId.maxSales 
                      ? 'Sold Out' 
                      : `${template.licenseId.maxSales - template.sales}/${template.licenseId.maxSales} remaining`
                    }
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      template.sales >= template.licenseId.maxSales 
                        ? 'bg-red-500' 
                        : template.sales >= template.licenseId.maxSales * 0.8 
                          ? 'bg-orange-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (template.sales / template.licenseId.maxSales) * 100)}%` 
                    }}
                  />
                </div>
                
                <p className="text-xs text-gray-600">
                  {template.sales >= template.licenseId.maxSales 
                    ? 'This template has reached its sales limit and is no longer available for purchase.'
                    : template.sales >= template.licenseId.maxSales * 0.8 
                      ? 'Limited availability - only a few copies remaining!'
                      : 'This template is available for purchase.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="space-y-3"
      >
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
        
        <div className="flex gap-2">
          {template.previewUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(template.previewUrl, '_blank')}
              className="flex-1"
            >
              <IconExternalLink className="w-4 h-4 mr-2" />
              Live Preview
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleWishlistToggle}
            disabled={isUpdatingWishlist}
            className={`flex-1 ${isInWishlist ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : ''}`}
          >
            {isUpdatingWishlist ? (
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <IconHeart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
            )}
            {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex-1"
          >
            <IconShare className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 