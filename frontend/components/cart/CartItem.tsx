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
    // Fallback image
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center';
  };

  return (
    <Card className="bg-card border-border hover:shadow-xl transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          {/* Template Image */}
          <div className="flex-shrink-0">
            <div 
              className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
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
            <div className="flex items-start justify-between mb-3">
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

                {/* Category and Tags */}
                <div className="flex items-center gap-3 mb-3">
                  {item.category && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
                      {item.category}
                    </span>
                  )}
                  {item.tags && item.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                  {item.tags && item.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{item.tags.length - 2} more
                    </span>
                  )}
                </div>

                {/* Price per item */}
                <p className="text-muted-foreground text-sm">
                  {formatCurrency(item.price)} each
                </p>
              </div>

              {/* View Template Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewTemplate}
                className="ml-4 border-border text-foreground hover:bg-accent"
              >
                <IconExternalLink className="w-4 h-4 mr-2" />
                View Template
              </Button>
            </div>
          </div>

          {/* Quantity Controls and Total */}
          <div className="flex items-center gap-8">
            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateQuantity(item.templateId, item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="border-border text-foreground hover:bg-accent w-10 h-10 p-0 rounded-lg"
              >
                <IconMinus className="w-5 h-5" />
              </Button>
              
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;
                  onUpdateQuantity(item.templateId, newQuantity);
                }}
                className="w-20 text-center border-border text-lg font-semibold"
                min="1"
                disabled={isUpdating}
              />
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateQuantity(item.templateId, item.quantity + 1)}
                disabled={isUpdating}
                className="border-border text-foreground hover:bg-accent w-10 h-10 p-0 rounded-lg"
              >
                <IconPlus className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Item Total */}
            <div className="text-right min-w-[120px]">
              <p className="font-bold text-foreground text-xl text-primary-600">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
            
            {/* Remove Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemove(item.templateId)}
              disabled={isUpdating}
              className="border-border text-destructive hover:bg-destructive/10 w-10 h-10 p-0 rounded-lg"
            >
              <IconTrash className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 