'use client';

import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { IconTrash, IconPlus, IconMinus } from '@tabler/icons-react';

interface CartItemProps {
  item: {
    templateId: string;
    title: string;
    price: number;
    quantity: number;
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
  return (
    <Card className="bg-card border-border hover:shadow-xl transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-base">
                  {formatCurrency(item.price)} each
                </p>
              </div>
            </div>
          
          <div className="flex items-center gap-8">
            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateQuantity(item.templateId, item.quantity - 1)}
                disabled={isUpdating}
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