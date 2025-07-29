'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth-context';
import { useDictionary } from '../../../../../lib/hooks/useDictionary';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Badge } from '../../../../../components/ui/badge';
import { getFavorites, removeFromFavorites, addToCart } from '../../../../../lib/api';
import { 
  IconHeart, 
  IconHeartOff, 
  IconShoppingCart, 
  IconEye, 
  IconDownload,
  IconStar,
  IconTag,
  IconCategory,
  IconArrowRight,
  IconTrash
} from '@tabler/icons-react';
import { showCartSuccess, showCartError } from '../../../../../lib/toast';

interface FavoriteTemplate {
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
  isActive: boolean;
}

interface FavoriteRecord {
  _id: string;
  templateId: FavoriteTemplate;
  createdAt: string;
}

export default function CustomerFavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'customer')) {
      router.push(`/${lang}/login`);
    }
  }, [user, authLoading, router, lang]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavorites();
        if (response.success && response.data) {
          setFavorites(response.data.favorites);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'customer') {
      fetchFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (templateId: string) => {
    setRemoving(templateId);
    
    try {
      const response = await removeFromFavorites(templateId);
      if (response.success) {
        setFavorites(prev => prev.filter(fav => fav.templateId._id !== templateId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleViewTemplate = (templateId: string) => {
    router.push(`/${lang}/templates/${templateId}`);
  };

  const handleAddToCart = async (templateId: string) => {
    setAddingToCart(templateId);
    
    try {
      const response = await addToCart(templateId, 1);
      if (response.success) {
        showCartSuccess('Template added to cart successfully!');
      } else {
        showCartError(response.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showCartError('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <IconStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  if (loading) {
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
                My Favorites
              </h1>
              <p className="text-lg text-gray-600">
                Your saved templates and wishlist
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Total Favorites</p>
                  <p className="text-2xl font-bold text-red-900">{favorites.length}</p>
                </div>
                <IconHeart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Value</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(favorites.reduce((sum, fav) => sum + fav.templateId.price, 0))}
                  </p>
                </div>
                <IconShoppingCart className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Categories</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {new Set(favorites.map(fav => fav.templateId.category)).size}
                  </p>
                </div>
                <IconCategory className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="py-16 text-center">
              <IconHeart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Favorites Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start exploring our amazing template collection and add your favorite designs to your wishlist!
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite._id} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 group">
                <div className="relative">
                  {/* Preview Image */}
                  {favorite.templateId.previewImages && favorite.templateId.previewImages.length > 0 ? (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={favorite.templateId.previewImages[0]}
                        alt={favorite.templateId.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                      <IconDownload className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Remove Favorite Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-3 right-3 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => handleRemoveFavorite(favorite.templateId._id)}
                    disabled={removing === favorite.templateId._id}
                  >
                    {removing === favorite.templateId._id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <IconTrash className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {favorite.templateId.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 line-clamp-2 mt-1">
                        {favorite.templateId.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-gray-500">
                        <IconDownload className="w-4 h-4" />
                        {favorite.templateId.downloads}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <IconShoppingCart className="w-4 h-4" />
                        {favorite.templateId.sales}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(favorite.templateId.rating)}
                    </div>
                  </div>

                  {/* Category and Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IconCategory className="w-4 h-4 text-gray-400" />
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {favorite.templateId.category}
                      </Badge>
                    </div>
                    {favorite.templateId.tags && favorite.templateId.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <IconTag className="w-4 h-4 text-gray-400" />
                        {favorite.templateId.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {tag}
                          </Badge>
                        ))}
                        {favorite.templateId.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{favorite.templateId.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(favorite.templateId.price)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewTemplate(favorite.templateId._id)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <IconEye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(favorite.templateId._id)}
                        disabled={addingToCart === favorite.templateId._id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {addingToCart === favorite.templateId._id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <IconShoppingCart className="w-4 h-4 mr-1" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Added Date */}
                  <div className="text-xs text-gray-500 text-center pt-2">
                    Added {new Date(favorite.createdAt).toLocaleDateString()}
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