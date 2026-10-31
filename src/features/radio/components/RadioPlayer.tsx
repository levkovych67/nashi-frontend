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
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-[#9cc6ec] shadow-elegant">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title || ''}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="aero-heading truncate text-xl">{currentTrack.title}</h3>
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
          aria-label="Позиція в треку"
          className="aero-range w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground/70 mt-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button variant="outline" size="icon" onClick={playPrevious} aria-label="Попередній трек">
          <SkipBack className="w-5 h-5" />
        </Button>

        {/* The round glass play button of the era's media players */}
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Пауза' : 'Грати'}
          className="aero-orb flex h-16 w-16 items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="relative z-[2] h-7 w-7" fill="currentColor" aria-hidden="true" />
          ) : (
            <Play className="relative z-[2] ml-1 h-7 w-7" fill="currentColor" aria-hidden="true" />
          )}
        </button>

        <Button variant="outline" size="icon" onClick={playNext} aria-label="Наступний трек">
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
          aria-label={volume > 0 ? 'Вимкнути звук' : 'Увімкнути звук'}
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
          aria-label="Гучність"
          className="aero-range flex-1"
        />
      </div>
    </Card>
  );
}
