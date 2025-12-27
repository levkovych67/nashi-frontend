import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { useRadioStore } from '@/stores/useRadioStore';

export function RadioPlayer() {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    volume,
    playNext,
    playPrevious,
    togglePlayPause,
    setVolume,
  } = useRadioStore();

  const howlRef = useRef<Howl | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = playlist[currentTrackIndex];

  // Initialize Howler when track changes
  useEffect(() => {
    if (!currentTrack?.audioUrl) return;

    // Cleanup previous howl
    if (howlRef.current) {
      howlRef.current.unload();
    }

    // Create new howl
    const howl = new Howl({
      src: [currentTrack.audioUrl],
      html5: true,
      volume: volume,
      onload: function () {
        setDuration(howl.duration());
      },
      onend: function () {
        playNext();
      },
      onplay: function () {
        requestAnimationFrame(updateProgress);
      },
    });

    howlRef.current = howl;

    return () => {
      howl.unload();
    };
  }, [currentTrack?.audioUrl]);

  // Handle play/pause
  useEffect(() => {
    if (!howlRef.current) return;

    if (isPlaying) {
      howlRef.current.play();
    } else {
      howlRef.current.pause();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  const updateProgress = () => {
    if (howlRef.current && isPlaying) {
      setProgress(howlRef.current.seek());
      requestAnimationFrame(updateProgress);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (howlRef.current) {
      howlRef.current.seek(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Виберіть область для завантаження плейлиста</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Track Info */}
      <div className="flex items-center gap-4 mb-6">
        {currentTrack.coverUrl && (
          <div className="w-20 h-20 rounded-card overflow-hidden flex-shrink-0">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title || ''}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-xl font-semibold truncate">{currentTrack.title}</h3>
          {currentTrack.artistName && (
            <p className="text-sm text-muted-foreground truncate">{currentTrack.artistName}</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          className="w-full h-2 bg-accent/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
        />
        <div className="flex justify-between text-xs text-muted-foreground/70 mt-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button variant="outline" size="icon" onClick={playPrevious}>
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button size="icon" className="w-14 h-14" onClick={togglePlayPause}>
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>

        <Button variant="outline" size="icon" onClick={playNext}>
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
        >
          {volume > 0 ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-accent/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
        />
      </div>
    </Card>
  );
}
