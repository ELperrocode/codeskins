'use client';

import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { IconTrash, IconPlus, IconMinus, IconExternalLink } from '@tabler/icons-react';
import { useRouter, useParams } from 'next/navigation';

interface CartItemProps {
  item: {
    templateId: string;
    title: string;
    description?: string;
    price: number;
    quantity: number;
    previewImages?: string[];
    category?: string;
    tags?: string[];
  };
  onUpdateQuantity: (templateId: string, quantity: number) => void;
  onRemove: (templateId: string) => void;
  isUpdating: boolean;
  formatCurrency: (amount: number) => string;
}

export function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isUpdating, 
  formatCurrency 
}: CartItemProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const handleViewTemplate = () => {
    router.push(`/${lang}/templates/${item.templateId}`);
  };

  const getPreviewImage = () => {
    if (item.previewImages && item.previewImages.length > 0) {
      return item.previewImages[0];
    }
    // Si no hay imagen, mostrar un placeholder más apropiado
    return 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=center';
  };

  return (
    <Card className="bg-card border-border hover:shadow-xl transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex items-start gap-8">
          {/* Template Image */}
          <div className="flex-shrink-0">
            <div 
              className="w-40 h-28 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-md"
              onClick={handleViewTemplate}
            >
              <img 
                src={getPreviewImage()} 
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Template Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-bold text-foreground text-xl mb-2 cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={handleViewTemplate}
                >
                  {item.title}
                </h3>
                
                {item.description && (
                  <p className="text-muted-foreground text-base line-clamp-2 mb-3">
                    {item.description}
                  </p>
                )}

                {/* Category only */}
                {item.category && (
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-md">
                      {item.category}
                    </span>
                  </div>
                )}

                {/* Price per item */}
                <p className="text-muted-foreground text-sm mb-3">
                  {formatCurrency(item.price)} each
                </p>

                {/* Quantity Display (Fixed at 1) */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-muted-foreground text-sm">Quantity:</span>
                  <span className="font-semibold text-foreground">1</span>
                  <span className="text-muted-foreground text-xs">(Fixed)</span>
                </div>

                {/* Item Total */}
                <div className="mb-3">
                  <p className="font-bold text-foreground text-lg text-primary-600">
                    Total: {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 ml-6">
                {/* View Template Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewTemplate}
                  className="border-border text-foreground hover:bg-accent px-4 py-2"
                >
                  <IconExternalLink className="w-4 h-4 mr-2" />
                  View Template
                </Button>
                
                {/* Remove Button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemove(item.templateId)}
                  disabled={isUpdating}
                  className="border-border text-destructive hover:bg-destructive/10 w-full px-4 py-2"
                >
                  <IconTrash className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 