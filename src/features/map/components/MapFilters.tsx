import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useMapStore } from '@/stores/useMapStore';
import { useRegions } from '@/lib/api/hooks/useLookup';
import { X, SlidersHorizontal } from 'lucide-react';

// Filters content component (shared between mobile drawer and desktop)
function FiltersContent() {
  const typeId = useId();
  const regionId = useId();
  const { data: regions } = useRegions();
  const {
    selectedRegion,
    selectedTypes,
    setRegion,
    setTypes,
    clearFilters,
  } = useMapStore();

  const hasActiveFilters = selectedRegion || selectedTypes.length > 0;

  const toggleType = (type: 'ARTIST' | 'EVENT') => {
    if (selectedTypes.includes(type)) {
      setTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Clear filters button - visible when there are active filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Очистити фільтри
        </Button>
      )}

      {/* Type filters */}
      <div>
        <span id={typeId} className="mb-2 block text-sm">Тип</span>
        <div className="flex gap-2" role="group" aria-labelledby={typeId}>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={selectedTypes.includes('ARTIST')}
            onClick={() => toggleType('ARTIST')}
            className="flex-1 text-sm"
          >
            Артисти
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={selectedTypes.includes('EVENT')}
            onClick={() => toggleType('EVENT')}
            className="flex-1 text-sm"
          >
            Події
          </Button>
        </div>
      </div>

      {/* Region filter */}
      <div>
        <label htmlFor={regionId} className="mb-2 block text-sm">Область</label>
        <select
          id={regionId}
          value={selectedRegion || ''}
          onChange={(e) => setRegion(e.target.value ? (e.target.value as typeof selectedRegion) : undefined)}
          className="aero-field w-full min-h-[44px] px-3 py-2 text-sm touch-manipulation"
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
  );
}

interface MapFiltersProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MapFilters({ isOpen = false, onOpenChange }: MapFiltersProps) {
  const { selectedRegion, selectedTypes, clearFilters } = useMapStore();
  const hasActiveFilters = selectedRegion || selectedTypes.length > 0;

  return (
    <>
      {/* Mobile: Filter button + drawer */}
      <div className="md:hidden">
        <Button
          onClick={() => onOpenChange?.(true)}
          variant="outline"
          className="min-h-[48px] px-4 shadow-elegant"
          size="lg"
        >
          <SlidersHorizontal className="mr-1 !h-5 !w-5" />
          <span>Фільтри</span>
          {hasActiveFilters && (
            <span className="ml-1 h-2.5 w-2.5 rounded-full bg-[var(--aero-grass)] shadow-[0_0_6px_rgba(95,191,42,0.9)]" aria-label="є активні фільтри" />
          )}
        </Button>

        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent side="left" className="w-[85vw] sm:w-[400px]">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-xl">Фільтри карти</SheetTitle>
            </SheetHeader>
            <FiltersContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Always visible filters */}
      <div className="aero-glass hidden w-64 p-4 md:block">
        <div className="flex items-center justify-between mb-4">
          <h3 className="aero-heading text-lg">Фільтри</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              <span className="text-sm">Очистити</span>
            </Button>
          )}
        </div>
        <FiltersContent />
      </div>
    </>
  );
}
