import { CalendarDays, ChevronRight } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import type { components } from '@/lib/api/generated/types';

type MapPinDTO = components['schemas']['MapPinDTO'];

interface MarkerListItemProps {
  pin: MapPinDTO;
  onClick: () => void;
  index: number;
}

export function MarkerListItem({ pin, onClick, index }: MarkerListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="aero-hover-row group flex w-full items-center gap-3 p-2 text-left"
      style={{ animation: `slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 50}ms both` }}
    >
      {/* Thumbnail */}
      <span className="flex-shrink-0">
        {pin.type === 'ARTIST' ? (
          <span className="aero-pin h-12 w-12">
            <span className="aero-pin__face text-lg font-semibold">
              {pin.avatarUrl ? (
                <OptimizedImage
                  src={pin.avatarUrl}
                  alt=""
                  containerClassName="w-full h-full"
                  fallback={<span>{pin.name?.charAt(0) || '?'}</span>}
                />
              ) : (
                <span aria-hidden="true">{pin.name?.charAt(0) || '?'}</span>
              )}
            </span>
          </span>
        ) : (
          <span className="aero-orb aero-orb--grass flex h-12 w-12 items-center justify-center">
            <CalendarDays className="relative z-[2] h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </span>

      {/* Info */}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-tight text-[var(--aero-instruction)]">{pin.name}</span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {pin.style || (pin.type === 'EVENT' ? 'Подія' : 'Артист')}
        </span>
      </span>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--aero-link)]" aria-hidden="true" />
    </button>
  );
}
