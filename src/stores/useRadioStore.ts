import { create } from 'zustand';
import type { components } from '@/lib/api/generated/types';

type TrackDTO = components['schemas']['TrackDTO'];

interface RadioStore {
  playlist: TrackDTO[];
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  setPlaylist: (tracks: TrackDTO[]) => void;
  setCurrentTrackIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  reset: () => void;
}

export const useRadioStore = create<RadioStore>((set, get) => ({
  playlist: [],
  currentTrackIndex: 0,
  isPlaying: false,
  volume: 0.7,

  setPlaylist: (tracks) => set({ playlist: tracks, currentTrackIndex: 0 }),

  setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),

  playNext: () => {
    const { currentTrackIndex, playlist } = get();
    if (currentTrackIndex < playlist.length - 1) {
      set({ currentTrackIndex: currentTrackIndex + 1 });
    } else {
      // Loop back to start
      set({ currentTrackIndex: 0 });
    }
  },

  playPrevious: () => {
    const { currentTrackIndex, playlist } = get();
    if (currentTrackIndex > 0) {
      set({ currentTrackIndex: currentTrackIndex - 1 });
    } else {
      // Loop to end
      set({ currentTrackIndex: playlist.length - 1 });
    }
  },

  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  reset: () => set({ playlist: [], currentTrackIndex: 0, isPlaying: false }),
}));
