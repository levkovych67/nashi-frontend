import { useState, useEffect } from 'react';
import { useCities } from '@/lib/api/hooks/useLookup';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from './input';
import { Label } from './label';
import { Loader2 } from 'lucide-react';
import type { components } from '@/lib/api/generated/types';

type Region = components['schemas']['EventCreateRequestDTO']['region'];
type CityLookupResponse = components['schemas']['CityLookupResponse'];

interface CityAutocompleteProps {
  region: Region | '';
  onCitySelect: (city: CityLookupResponse) => void;
  value?: string;
  error?: string;
}

const MIN_QUERY_LENGTH = 4;

export function CityAutocomplete({ region, onCitySelect, value, error }: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  
  // Debounce the query to reduce API calls (500ms delay)
  const debouncedQuery = useDebounce(inputValue, 500);
  
  const { data: cities, isFetching } = useCities(region as Region, debouncedQuery);

  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  const handleSelect = (city: CityLookupResponse) => {
    setInputValue(city.name);
    setIsOpen(false);
    onCitySelect(city);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
  };

  // Determine which state to show
  const showMinCharHint = isOpen && inputValue.length > 0 && inputValue.length < MIN_QUERY_LENGTH;
  const showLoading = isFetching && debouncedQuery.length >= MIN_QUERY_LENGTH;
  const showResults = isOpen && cities && cities.length > 0 && debouncedQuery.length >= MIN_QUERY_LENGTH;
  const showNoResults = isOpen && debouncedQuery.length >= MIN_QUERY_LENGTH && cities?.length === 0 && !isFetching;
  const isDebouncing = inputValue !== debouncedQuery && inputValue.length >= MIN_QUERY_LENGTH;

  return (
    <div className="relative">
      <Label htmlFor="city-search">
        Населений пункт *
      </Label>
      <div className="relative">
        <Input
          id="city-search"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow click on dropdown
          placeholder={region ? "Почніть вводити назву..." : "Спочатку виберіть область"}
          disabled={!region}
          className={isDebouncing ? 'pr-10' : ''}
        />
        
        {/* Typing indicator (while debouncing) */}
        {isDebouncing && !isFetching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          </div>
        )}
        
        {/* Loading spinner (during API call) */}
        {showLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-accent animate-spin" />
          </div>
        )}
      </div>
      
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      
      {/* Minimum character hint */}
      {showMinCharHint && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-elegant px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Введіть мінімум {MIN_QUERY_LENGTH} символи для пошуку
            <span className="text-accent ml-1">
              ({MIN_QUERY_LENGTH - inputValue.length} ще)
            </span>
          </p>
        </div>
      )}
      
      {/* Loading state */}
      {showLoading && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-elegant px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Завантаження міст...</span>
          </div>
        </div>
      )}
      
      {/* Results dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-elegant max-h-60 overflow-y-auto">
          {cities.map((city, idx) => (
            <button
              key={idx}
              type="button"
              onMouseDown={() => handleSelect(city)} // Use onMouseDown to prevent blur
              className="w-full text-left px-4 py-2.5 hover:bg-secondary transition-colors text-sm first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="font-medium text-foreground">{city.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{city.regionUA}</div>
            </button>
          ))}
        </div>
      )}
      
      {/* No results */}
      {showNoResults && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-elegant px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Нічого не знайдено для "{debouncedQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
