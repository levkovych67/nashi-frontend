import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import type { components } from '@/lib/api/generated/types';
import { MarkerList } from './MarkerList';

type MapPinDTO = components['schemas']['MapPinDTO'];

interface StackMarkerProps {
  pins: MapPinDTO[];
  onPinClick: (pin: MapPinDTO) => void;
  isMobile: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export function StackMarker({ pins, onPinClick, isMobile, onHoverChange }: StackMarkerProps) {
  const [isListOpen, setIsListOpen] = useState(false);

  const displayPin = pins[0];
  const stackCount = pins.length;
  const isStack = stackCount > 1;

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStack) {
      setIsListOpen(!isListOpen);
    } else {
      onPinClick(displayPin);
    }
  };

  const label = isStack
    ? `${displayPin.name} та ще ${stackCount - 1} — показати всіх у цій точці`
    : `${displayPin.type === 'EVENT' ? 'Подія' : 'Артист'}: ${displayPin.name}`;

  return (
    <div className="relative" onMouseEnter={() => onHoverChange?.(true)} onMouseLeave={() => onHoverChange?.(false)}>
      {/* Main marker: a glass orb */}
      <button
        type="button"
        onClick={handleMarkerClick}
        aria-label={label}
        aria-expanded={isStack ? isListOpen : undefined}
        className={`relative block rounded-full transition-transform duration-200 ${isListOpen ? 'scale-110' : ''}`}
      >
        {displayPin.type === 'ARTIST' ? (
          <span className="aero-pin h-11 w-11">
            <span className="aero-pin__face font-semibold">
              {displayPin.avatarUrl ? (
                <img src={displayPin.avatarUrl} alt="" />
              ) : (
                <span aria-hidden="true">{displayPin.name?.charAt(0) || '?'}</span>
              )}
            </span>
          </span>
        ) : (
          <span className="aero-orb aero-orb--grass flex h-9 w-9 items-center justify-center">
            <CalendarDays className="relative z-[2] h-[18px] w-[18px]" strokeWidth={2.3} aria-hidden="true" />
          </span>
        )}

        {/* How many share this spot: a small aqua gel bubble */}
        {isStack && (
          <span
            className="aero-gel absolute -right-1.5 -top-1.5 z-[3] flex h-5 min-w-5 items-center justify-center px-1 text-[10px] font-bold leading-none"
            style={{ animation: 'stackBadgePop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            aria-hidden="true"
          >
            {stackCount}
          </span>
        )}
      </button>

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
