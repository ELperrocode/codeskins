'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth-context';
import { useDictionary } from '../../../../../lib/hooks/useDictionary';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Badge } from '../../../../../components/ui/badge';
import { getFavorites, removeFromFavorites } from '../../../../../lib/api';
import { 
  IconHeart, 
  IconHeartOff, 
  IconShoppingCart, 
  IconEye, 
  IconDownload,
  IconStar,
  IconTag,
  IconCategory
} from '@tabler/icons-react';

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
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push(`/${lang}/login`);
    }
  }, [user, router, lang]);

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

  const handleAddToCart = (templateId: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', templateId);
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
                : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">My Favorites</h1>
          <p className="text-secondary/70 mt-2">
            Your saved templates and wishlist
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Favorites</p>
                  <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
                </div>
                <IconHeart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(favorites.reduce((sum, fav) => sum + fav.templateId.price, 0))}
                  </p>
                </div>
                <IconShoppingCart className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-foreground">
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
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <IconHeart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Favorites Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring templates and add them to your favorites!
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite._id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <div className="relative">
                  {/* Preview Image */}
                  {favorite.templateId.previewImages && favorite.templateId.previewImages.length > 0 && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={favorite.templateId.previewImages[0]}
                        alt={favorite.templateId.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Remove Favorite Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 w-8 h-8 p-0"
                    onClick={() => handleRemoveFavorite(favorite.templateId._id)}
                    disabled={removing === favorite.templateId._id}
                  >
                    <IconHeartOff className="w-4 h-4" />
                  </Button>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-foreground text-lg line-clamp-2">
                        {favorite.templateId.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-2 mt-1">
                        {favorite.templateId.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <IconDownload className="w-4 h-4" />
                        {favorite.templateId.downloads}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
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
                      <IconCategory className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">
                        {favorite.templateId.category}
                      </Badge>
                    </div>
                    {favorite.templateId.tags && favorite.templateId.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <IconTag className="w-4 h-4 text-muted-foreground" />
                        {favorite.templateId.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {favorite.templateId.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{favorite.templateId.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xl font-bold text-foreground">
                      {formatCurrency(favorite.templateId.price)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewTemplate(favorite.templateId._id)}
                        className="border-border text-foreground hover:bg-accent"
                      >
                        <IconEye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(favorite.templateId._id)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <IconShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>

                  {/* Added Date */}
                  <div className="text-xs text-muted-foreground text-center">
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