import { useState } from 'react';
import type { components } from '@/lib/api/generated/types';
import { MarkerList } from './MarkerList';

type MapPinDTO = components['schemas']['MapPinDTO'];

interface StackMarkerProps {
  pins: MapPinDTO[];
  onPinClick: (pin: MapPinDTO) => void;
  isMobile: boolean;
}

export function StackMarker({ pins, onPinClick, isMobile }: StackMarkerProps) {
  const [isListOpen, setIsListOpen] = useState(false);

  // Get the first pin for display (or could be a priority logic)
  const displayPin = pins[0];
  const stackCount = pins.length;
  const isStack = stackCount > 1;

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStack) {
      // Toggle list for stacked markers
      setIsListOpen(!isListOpen);
    } else {
      // Single pin: direct click
      onPinClick(displayPin);
    }
  };

  return (
    <div className="relative">
      {/* Main Marker */}
      <div
        className={`
          cursor-pointer transform transition-all duration-200
          ${isListOpen ? 'scale-110' : 'hover:scale-105'}
        `}
        onClick={handleMarkerClick}
        style={{
          // Stacked shadow effect for depth
          filter: isStack
            ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.15)) drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
        }}
      >
        {displayPin.type === 'ARTIST' ? (
          <div className="w-10 h-10 rounded-full border-2 border-accent shadow-lg overflow-hidden bg-white">
            {displayPin.avatarUrl ? (
              <img
                src={displayPin.avatarUrl}
                alt={displayPin.name || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent font-heading text-sm">
                {displayPin.name?.charAt(0) || '?'}
              </div>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
            <span className="text-white text-xs">🎭</span>
          </div>
        )}

        {/* Stack Badge */}
        {isStack && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground border-2 border-background flex items-center justify-center shadow-md animate-in zoom-in-50 duration-300"
            style={{
              animation: 'stackBadgePop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <span className="text-[10px] font-bold leading-none">
              {stackCount}
            </span>
          </div>
        )}
      </div>

      {/* List for both Desktop and Mobile */}
      {isStack && (
        <MarkerList
          pins={pins}
          isOpen={isListOpen}
          onClose={() => setIsListOpen(false)}
          onPinClick={onPinClick}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
