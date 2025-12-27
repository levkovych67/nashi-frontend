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
    <div className="bg-background/80 backdrop-blur-md border border-accent/20 rounded-card p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold">Фільтри</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Очистити
          </Button>
        )}
      </div>

      {/* Type filters */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Тип</label>
        <div className="flex gap-2">
          <Button
            variant={selectedTypes.includes('ARTIST') ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleType('ARTIST')}
          >
            Артисти
          </Button>
          <Button
            variant={selectedTypes.includes('EVENT') ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleType('EVENT')}
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
          onChange={(e) => setRegion(e.target.value || undefined)}
          className="w-full px-3 py-2 bg-background border border-accent/20 rounded-soft text-sm"
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
