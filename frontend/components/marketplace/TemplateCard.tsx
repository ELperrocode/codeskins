'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { addToCart } from '../../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { IconShoppingCart, IconHeart, IconStar, IconDownload, IconEye, IconExternalLink } from '@tabler/icons-react';

interface TemplateCardProps {
  template: {
    _id: string;
    title: string;
    description: string;
    price: number;
    previewImages?: string[];
    previewUrl?: string;
    tags: string[];
    rating: number;
    reviewCount: number;
    downloads: number;
    category: string;
    features: string[];
    ownerId: {
      _id: string;
      username: string;
    };
  };
  isInWishlist?: boolean;
}

export function TemplateCard({ 
  template, 
  isInWishlist = false 
}: TemplateCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlistState, setIsInWishlistState] = useState(isInWishlist);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(template._id, 1);
      // You could show a success toast here
    } catch (error) {
      console.error('Error adding to cart:', error);
      // You could show an error toast here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInWishlistState(!isInWishlistState);
    // TODO: Implement wishlist functionality
  };

  const handleCardClick = () => {
    // Get current language from URL or default to 'en'
    const pathname = window.location.pathname;
    const lang = pathname.split('/')[1] || 'en';
    router.push(`/${lang}/templates/${template._id}`);
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Preview Image */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {template.previewImages && template.previewImages.length > 0 ? (
          <img 
            src={template.previewImages[0]} 
            alt={template.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-500">No preview</span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
        >
          <IconHeart 
            className={`w-5 h-5 ${isInWishlistState ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
          />
        </button>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/80 text-gray-700">
            {template.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {template.title}
          </CardTitle>
          <div className="text-right">
                         <div className="text-2xl font-bold text-primary-500">
               ${template.price}
             </div>
          </div>
        </div>

        {/* Description */}
        <CardDescription className="text-gray-600 mb-3 line-clamp-2">
          {template.description}
        </CardDescription>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <IconStar className="w-4 h-4 text-primary-500 fill-current" />
              <span>{(template.rating || 0).toFixed(1)}</span>
              <span>({template.reviewCount})</span>
            </div>
            <div className="flex items-center space-x-1">
              <IconDownload className="w-4 h-4" />
              <span>{template.downloads}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs">by {template.ownerId.username}</div>
          </div>
        </div>

        {/* Features */}
        {template.features.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Features:</div>
            <div className="flex flex-wrap gap-1">
              {template.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {template.features.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.features.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 bg-gradient-primary hover:bg-gradient-primary-hover"
          >
            <IconShoppingCart className="w-4 h-4 mr-2" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
          
          {template.previewUrl && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(template.previewUrl, '_blank');
              }}
              title="Live Preview"
            >
              <IconExternalLink className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/templates/${template._id}`);
            }}
            title="View Details"
          >
            <IconEye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 