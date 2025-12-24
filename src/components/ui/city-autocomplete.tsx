import { useState, useEffect } from 'react';
import { useCities } from '@/lib/api/hooks/useLookup';
import { Input } from './input';
import { Label } from './label';
import type { components } from '@/lib/api/generated/types';

type Region = components['schemas']['EventCreateRequestDTO']['region'];
type CityLookupResponse = components['schemas']['CityLookupResponse'];

interface CityAutocompleteProps {
  region: Region | '';
  onCitySelect: (city: CityLookupResponse) => void;
  value?: string;
  error?: string;
}

export function CityAutocomplete({ region, onCitySelect, value, error }: CityAutocompleteProps) {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const { data: cities, isLoading } = useCities(region as Region, query);

  useEffect(() => {
    if (value) {
      setQuery(value);
    }
  }, [value]);

  const handleSelect = (city: CityLookupResponse) => {
    setQuery(city.name);
    setIsOpen(false);
    onCitySelect(city);
  };

  return (
    <div className="relative">
      <Label htmlFor="city-search">Населений пункт *</Label>
      <Input
        id="city-search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={region ? "Почніть вводити назву..." : "Спочатку виберіть область"}
        disabled={!region}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      
      {isOpen && cities && cities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-accent/20 rounded-card shadow-lg max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-2 text-sm text-muted-foreground">Завантаження...</div>
          )}
          {cities.map((city, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-2 hover:bg-accent/10 transition-colors text-sm"
            >
              <div className="font-medium">{city.name}</div>
              <div className="text-xs text-muted-foreground">{city.regionUA}</div>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && query.length >= 2 && cities?.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-accent/20 rounded-card shadow-lg px-4 py-2 text-sm text-muted-foreground">
          Нічого не знайдено
        </div>
      )}
    </div>
  );
}
