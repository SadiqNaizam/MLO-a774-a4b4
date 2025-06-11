import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisineTypes: string[]; // e.g., ['Italian', 'Pizza']
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., '25-35 min'
  onClick: (id: string | number) => void;
  className?: string;
  // Potentially add 'priceRange' (e.g., '$$') or 'isFeatured'
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  onClick,
  className,
}) => {
  console.log("Rendering RestaurantCard:", name);
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-shadow hover:shadow-lg w-full ${className}`}
      onClick={() => onClick(id)}
    >
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
      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <div className="text-xs text-muted-foreground truncate">
          {cuisineTypes.join(', ')}
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{deliveryTime}</span>
          </div>
        </div>
        {/* Example of a badge, could be for "New", "Offer", etc. */}
        {/* <Badge variant="outline" className="mt-1">Offer</Badge> */}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;