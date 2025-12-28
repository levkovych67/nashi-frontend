import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useMapStore } from '@/stores/useMapStore';
import { useRegions } from '@/lib/api/hooks/useLookup';
import { X, SlidersHorizontal } from 'lucide-react';

// Filters content component (shared between mobile drawer and desktop)
function FiltersContent() {
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
          className="w-full h-11"
        >
          <X className="w-4 h-4 mr-2" />
          Очистити фільтри
        </Button>
      )}

      {/* Type filters */}
      <div>
        <label className="text-sm font-medium mb-2 block">Тип</label>
        <div className="flex gap-2">
          <Button
            variant={selectedTypes.includes('ARTIST') ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleType('ARTIST')}
            className="flex-1 min-h-[44px] text-sm"
          >
            Артисти
          </Button>
          <Button
            variant={selectedTypes.includes('EVENT') ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleType('EVENT')}
            className="flex-1 min-h-[44px] text-sm"
          >
            Події
          </Button>
        </div>
      </div>

      {/* Region filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Область</label>
        <select
          value={selectedRegion || ''}
          onChange={(e) => setRegion(e.target.value ? (e.target.value as typeof selectedRegion) : undefined)}
          className="w-full min-h-[44px] px-3 py-2 bg-background border border-accent/20 rounded-soft text-sm touch-manipulation"
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
          className="bg-background/95 hover:bg-background/100 text-foreground border border-accent/20 shadow-lg min-h-[56px] px-4"
          size="lg"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          <span className="font-medium">Фільтри</span>
          {hasActiveFilters && (
            <span className="ml-2 bg-accent text-accent-foreground rounded-full w-2 h-2" />
          )}
        </Button>

        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent side="left" className="w-[85vw] sm:w-[400px]">
            <SheetHeader className="mb-6">
              <SheetTitle className="font-heading text-xl">Фільтри карти</SheetTitle>
            </SheetHeader>
            <FiltersContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Always visible filters */}
      <div className="hidden md:block bg-background/80 backdrop-blur-md border border-accent/20 rounded-card p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold">Фільтри</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-11">
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
