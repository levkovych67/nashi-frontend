import { useEffect, useState } from 'react';
import { RadioPlayer } from '@/features/radio/components/RadioPlayer';
import { Playlist } from '@/features/radio/components/Playlist';
import { useRadioMix } from '@/lib/api/hooks/useRadio';
import { useRegions } from '@/lib/api/hooks/useLookup';
import { useRadioStore } from '@/stores/useRadioStore';
import { SEO } from '@/components/SEO';
import type { components } from '@/lib/api/generated/types';

type Region = components['schemas']['EventCreateRequestDTO']['region'];

export function RadioPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>();
  const { data: regions } = useRegions();
  const { data: tracks, isLoading, error } = useRadioMix(selectedRegion);
  const { setPlaylist, reset } = useRadioStore();

  // Load playlist when tracks change
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setPlaylist(tracks);
    } else {
      reset();
    }
  }, [tracks]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RadioStation',
    name: 'Наше Радіо',
    description: 'Українське незалежне радіо з музикою від українських артистів',
    genre: 'Ukrainian Music',
  };

  return (
    <>
      <SEO
        title="Наше Радіо - Українська музика"
        description="Слухайте кращу українську музику від незалежних артистів. Онлайн радіо з українськими треками."
        keywords="українське радіо, українська музика, онлайн радіо, незалежні артисти, українські пісні"
        structuredData={structuredData}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-4">Наше Радіо</h1>
          <p className="text-muted-foreground">
            Слухайте кращу українську музику від незалежних артистів
          </p>
        </div>

        {/* Region Filter */}
        <div className="mb-8">
          <label htmlFor="region-select" className="text-sm font-medium block mb-2">
            Область:
          </label>
          <select
            id="region-select"
            value={selectedRegion || ''}
            onChange={(e) => setSelectedRegion((e.target.value || undefined) as Region | undefined)}
            className="w-full px-4 py-3 bg-background border border-accent/20 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Уся Україна</option>
            {regions?.map((region) => (
              <option key={region.key} value={region.key}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Завантаження треків...</p>
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

        {/* Player and Playlist */}
        {!isLoading && !error && tracks && tracks.length > 0 && (
          <div className="space-y-6">
            <RadioPlayer />
            <Playlist />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!tracks || tracks.length === 0) && (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              {selectedRegion
                ? 'Треків для цієї області не знайдено'
                : 'Виберіть область для завантаження плейлиста'}
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
