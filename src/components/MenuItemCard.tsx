import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { PlusCircle } from 'lucide-react';

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (item: { id: string | number; name: string; price: number }) => void; // or onCustomize
  requiresCustomization?: boolean;
  onCustomize?: (id: string | number) => void;
  className?: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  requiresCustomization = false,
  onCustomize,
  className,
}) => {
  console.log("Rendering MenuItemCard:", name);

  const handleAction = () => {
    if (requiresCustomization && onCustomize) {
      onCustomize(id);
    } else {
      onAddToCart({ id, name, price });
    }
  };

  return (
    <Card className={`flex flex-col overflow-hidden ${className}`}>
      {imageUrl && (
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
        </CardHeader>
      )}
      <CardContent className="p-4 space-y-1 flex-grow">
        <h4 className="text-md font-semibold">{name}</h4>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="font-semibold text-primary">${price.toFixed(2)}</span>
        <Button size="sm" onClick={handleAction}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {requiresCustomization ? 'Customize' : 'Add'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;