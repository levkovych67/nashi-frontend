import { Button } from '@/components/ui/button';
import { useMapStore } from '@/stores/useMapStore';
import { useRegions } from '@/lib/api/hooks/useLookup';
import { X } from 'lucide-react';

export function MapFilters() {
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
    <div className="bg-background/95 md:bg-background/80 backdrop-blur-md border border-accent/20 rounded-card p-3 md:p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="font-heading text-base md:text-lg font-semibold">Фільтри</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 md:h-11">
            <X className="w-4 h-4 mr-1" />
            <span className="text-xs md:text-sm">Очистити</span>
          </Button>
        )}
      </div>

      {/* Type filters */}
      <div className="mb-3 md:mb-4">
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
          onChange={(e) => setRegion(e.target.value || null)}
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
