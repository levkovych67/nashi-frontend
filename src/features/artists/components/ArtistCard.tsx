import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { MapPin } from 'lucide-react';
import type { components } from '@/lib/api/generated/types';

type ArtistDTOMinified = components['schemas']['ArtistDTOMinified'];

interface ArtistCardProps {
  artist: ArtistDTOMinified;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const mainImage = artist.imageUrls?.[0];

  return (
    <Link to={`/artists/${artist.slug}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Image */}
        {mainImage ? (
          <OptimizedImage
            src={mainImage}
            alt={artist.name || ''}
            containerClassName="h-64 bg-accent/10"
            className="group-hover:scale-105 transition-transform duration-300"
            fallback={
              <span className="text-6xl font-heading text-accent">
                {artist.name?.charAt(0) || '?'}
              </span>
            }
          />
        ) : (
          <div className="h-64 flex items-center justify-center bg-accent/20">
            <span className="text-6xl font-heading text-accent">
              {artist.name?.charAt(0) || '?'}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading text-xl font-semibold mb-2 line-clamp-1">
            {artist.name}
          </h3>

          {artist.city && (
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{artist.city}</span>
            </div>
          )}

          {/* Image count indicator */}
          {artist.imageUrls && artist.imageUrls.length > 1 && (
            <div className="text-xs text-muted-foreground/70">
              +{artist.imageUrls.length - 1} фото
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
