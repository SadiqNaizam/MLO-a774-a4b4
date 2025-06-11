import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MapEmbedPlaceholderProps {
  centerMessage?: string; // e.g., "Map showing delivery address"
  className?: string;
  height?: string; // e.g., 'h-64' or '300px'
}

const MapEmbedPlaceholder: React.FC<MapEmbedPlaceholderProps> = ({
  centerMessage = "Map Area",
  className,
  height = 'h-64', // Default height
}) => {
  console.log("Rendering MapEmbedPlaceholder");
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className={`flex flex-col items-center justify-center p-4 bg-muted/50 ${height}`}>
        <MapPin className="w-12 h-12 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{centerMessage}</p>
        <p className="text-xs text-muted-foreground mt-1">(Map integration required)</p>
      </CardContent>
    </Card>
  );
};

export default MapEmbedPlaceholder;