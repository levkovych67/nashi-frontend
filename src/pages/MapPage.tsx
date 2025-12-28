import { useState } from 'react';
import { MapContainer } from '@/features/map/components/MapContainer';
import { MapFilters } from '@/features/map/components/MapFilters';
import { PinPreviewDrawer } from '@/features/map/components/PinPreviewDrawer';
import { useMapPins } from '@/lib/api/hooks/useMapPins';
import { useMapStore } from '@/stores/useMapStore';
import { SEO } from '@/components/SEO';
import type { components } from '@/lib/api/generated/types';

type MapPinDTO = components['schemas']['MapPinDTO'];

export function MapPage() {
  const { selectedRegion, selectedTypes } = useMapStore();
  const [selectedPin, setSelectedPin] = useState<MapPinDTO | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data: pins, isLoading, error } = useMapPins({
    region: selectedRegion,
    types: selectedTypes.length > 0 ? selectedTypes : undefined,
  });

  const handlePinClick = (pin: MapPinDTO) => {
    setSelectedPin(pin);
    setIsDrawerOpen(true);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'НАШІ - Карта культурних подій України',
    description: 'Інтерактивна карта українських митців та культурних подій',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UAH',
    },
  };

  return (

    <>
      <SEO
        title="Карта культурних подій"
        description="Інтерактивна карта українських митців, подій та культурних локацій. Відкрийте для себе культурну спадщину України."
        keywords="карта України, культурні події, українські митці, карта подій, культурна спадщина"
        structuredData={structuredData}
      />

      <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]" style={{ height: 'calc(100dvh - 4rem)' }}>
        {/* Filters */}
        <div className="absolute bottom-20 left-2 md:bottom-4 md:left-4 z-10">
          <MapFilters isOpen={isFiltersOpen} onOpenChange={setIsFiltersOpen} />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Завантаження карти...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
            <div className="text-center p-6">
              <p className="text-red-500 mb-2">Помилка завантаження даних</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        )}

        {/* Map */}
        {!isLoading && !error && (
          <MapContainer
            pins={pins || []}
            onPinClick={handlePinClick}
            selectedRegion={selectedRegion}
          />
        )}

        {/* Pin Preview Drawer */}
        <PinPreviewDrawer
          pin={selectedPin}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </>
  );
}
