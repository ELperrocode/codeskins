'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
      maxDownloads: number;
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
                    {template.licenseId.maxDownloads === -1 
                      ? 'Unlimited downloads' 
                      : `${template.licenseId.maxDownloads} downloads included`
                    }
                  </p>
                </div>
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
          disabled={addingToCart}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg font-semibold"
        >
          <IconShoppingCart className="w-5 h-5 mr-2" />
          {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
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
            className="flex-1"
          >
            <IconHeart className="w-4 h-4 mr-2" />
            Wishlist
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