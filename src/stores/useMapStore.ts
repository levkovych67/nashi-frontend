import { create } from 'zustand';
import type { components } from '@/lib/api/generated/types';

type Region = components['schemas']['EventCreateRequestDTO']['region'];

interface MapStore {
  selectedRegion?: Region;
  selectedStyle?: string;
  selectedTags: string[];
  selectedTypes: ('EVENT' | 'ARTIST')[];
  setRegion: (region?: Region) => void;
  setStyle: (style?: string) => void;
  setTags: (tags: string[]) => void;
  setTypes: (types: ('EVENT' | 'ARTIST')[]) => void;
  clearFilters: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedRegion: undefined,
  selectedStyle: undefined,
  selectedTags: [],
  selectedTypes: [],
  setRegion: (region) => set({ selectedRegion: region }),
  setStyle: (style) => set({ selectedStyle: style }),
  setTags: (tags) => set({ selectedTags: tags }),
  setTypes: (types) => set({ selectedTypes: types }),
  clearFilters: () =>
    set({
      selectedRegion: undefined,
      selectedStyle: undefined,
      selectedTags: [],
      selectedTypes: [],
    }),
}));
