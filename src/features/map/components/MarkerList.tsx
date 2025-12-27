import { useEffect, useRef } from 'react';
import type { components } from '@/lib/api/generated/types';
import { MarkerListItem } from './MarkerListItem';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

type MapPinDTO = components['schemas']['MapPinDTO'];

interface MarkerListProps {
  pins: MapPinDTO[];
  isOpen: boolean;
  onClose: () => void;
  onPinClick: (pin: MapPinDTO) => void;
  isMobile: boolean;
}

export function MarkerList({
  pins,
  isOpen,
  onClose,
  onPinClick,
  isMobile,
}: MarkerListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close (desktop only)
  useEffect(() => {
    if (!isMobile && isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (listRef.current && !listRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      // Small delay to prevent immediate closing from the marker click
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, isMobile, onClose]);

  // Desktop: floating popover
  if (!isMobile) {
    return (
      <div
        ref={listRef}
        className={`
          absolute left-1/2 -translate-x-1/2 bottom-full mb-4
          w-[280px] max-h-[320px]
          bg-card border border-border rounded-xl shadow-elegant-lg
          backdrop-blur-sm
          overflow-hidden
          transition-all duration-300
          ${
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }
        `}
        style={{
          zIndex: 20,
        }}
      >
        {/* List container with custom scrollbar */}
        <div className="marker-list overflow-y-auto max-h-[320px] p-2">
          {pins.map((pin, index) => (
            <MarkerListItem
              key={pin.id}
              pin={pin}
              onClick={() => {
                onPinClick(pin);
                onClose();
              }}
              index={index}
            />
          ))}
        </div>

        {/* Arrow pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
          style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid hsl(var(--border))',
          }}
        />
      </div>
    );
  }

  // Mobile: bottom sheet
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle className="font-heading text-lg">
            {pins.length} {pins.length === 1 ? 'Location' : 'Locations'} at this
            spot
          </SheetTitle>
          <SheetDescription className="sr-only">
            Список локацій на карті
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-1 overflow-y-auto max-h-[60vh]">
          {pins.map((pin, index) => (
            <MarkerListItem
              key={pin.id}
              pin={pin}
              onClick={() => {
                onPinClick(pin);
                onClose();
              }}
              index={index}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
