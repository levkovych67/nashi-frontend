import { useState, useMemo } from 'react';
import { ArtistCard } from '@/features/artists/components/ArtistCard';
import { useInfiniteArtists } from '@/lib/api/hooks/useArtists';
import { useRegions } from '@/lib/api/hooks/useLookup';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { components } from '@/lib/api/generated/types';

type Region = components['schemas']['EventCreateRequestDTO']['region'];

export function ArtistsListPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>();
  const { data: regions } = useRegions();
  
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteArtists({ region: selectedRegion, size: 20 });

  // Flatten all pages into a single array of artists
  const artists = useMemo(
    () => data?.pages.flatMap((page) => page.content || []) || [],
    [data]
  );

  // Intersection Observer sentinel for infinite scroll
  const sentinelRef = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
    rootMargin: '200px', // Start loading 200px before reaching the bottom
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-heading font-bold">Артисти</h1>

        {/* Region Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="region-filter" className="text-sm font-medium">
            Область:
          </label>
          <select
            id="region-filter"
            value={selectedRegion || ''}
            onChange={(e) => {
              setSelectedRegion(e.target.value || undefined);
            }}
            className="px-3 py-2 bg-background border border-accent/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          >
            <option value="">Усі області</option>
            {regions?.map((region) => (
              <option key={region.key} value={region.key}>
                {region.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Initial Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Завантаження артистів...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500 mb-2">Помилка завантаження</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && artists.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">Артистів не знайдено</p>
        </div>
      )}

      {/* Artists Grid */}
      {artists.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artists.map((artist, index) => (
              <ArtistCard 
                key={`${artist.id}-${index}`} 
                artist={artist} 
              />
            ))}
          </div>

          {/* Infinite Scroll Sentinel */}
          {hasNextPage && (
            <div ref={sentinelRef} className="flex justify-center py-12">
              {isFetchingNextPage && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto mb-3"></div>
                  <p className="text-sm text-muted-foreground">Завантаження...</p>
                </div>
              )}
            </div>
          )}

          {/* End of List Indicator */}
          {!hasNextPage && artists.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Це всі артисти {selectedRegion ? 'з обраної області' : ''}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
