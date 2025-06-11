import React from 'react';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface FoodCategoryChipProps {
  categoryName: string;
  imageUrl?: string;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

const FoodCategoryChip: React.FC<FoodCategoryChipProps> = ({
  categoryName,
  imageUrl,
  onClick,
  isActive = false,
  className,
}) => {
  console.log("Rendering FoodCategoryChip:", categoryName);
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center space-y-1 p-2 rounded-lg border transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "min-w-[80px] text-center",
        isActive ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-accent",
        className
      )}
      aria-pressed={isActive}
    >
      {imageUrl && (
        <div className="w-12 h-12 rounded-md overflow-hidden">
          <AspectRatio ratio={1 / 1}>
            <img src={imageUrl} alt={categoryName} className="object-cover w-full h-full" />
          </AspectRatio>
        </div>
      )}
      <span className="text-xs font-medium">{categoryName}</span>
    </button>
  );
};

export default FoodCategoryChip;