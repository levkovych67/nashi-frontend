import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { useRadioStore } from '@/stores/useRadioStore';
import type { components } from '@/lib/api/generated/types';

type TrackDTO = components['schemas']['TrackDTO'];

export function Playlist() {
  const { playlist, currentTrackIndex, setCurrentTrackIndex } = useRadioStore();

  if (playlist.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="font-heading text-lg font-semibold mb-4">
        Плейлист ({playlist.length} треків)
      </h3>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {playlist.map((track, index) => (
          <button
            key={track.id || index}
            onClick={() => setCurrentTrackIndex(index)}
            className={`w-full flex items-center gap-3 p-3 rounded-soft transition-colors hover:bg-accent/10 ${
              index === currentTrackIndex ? 'bg-accent/20' : ''
            }`}
          >
            {/* Cover Image */}
            <div className="w-12 h-12 rounded-soft overflow-hidden flex-shrink-0 bg-accent/10 relative group">
              {track.coverUrl ? (
                <img
                  src={track.coverUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-accent">
                  🎵
                </div>
              )}
              {index === currentTrackIndex && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play className="w-5 h-5 text-white" fill="white" />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0 text-left">
              <p className="font-medium text-sm truncate">
                {track.title || 'Без назви'}
              </p>
              {track.artistName && (
                <p className="text-xs text-muted-foreground truncate">{track.artistName}</p>
              )}
            </div>

            {/* Track Number */}
            <span className="text-xs text-muted-foreground/70 flex-shrink-0">
              {index + 1}/{playlist.length}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
