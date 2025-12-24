import type { components } from '@/lib/api/generated/types';

type MapPinDTO = components['schemas']['MapPinDTO'];

interface MarkerListItemProps {
  pin: MapPinDTO;
  onClick: () => void;
  index: number;
}

export function MarkerListItem({ pin, onClick, index }: MarkerListItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-secondary group"
      style={{
        animation: `slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 50}ms both`,
      }}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        {pin.type === 'ARTIST' ? (
          <div className="w-14 h-14 rounded-lg border-2 border-accent/20 group-hover:border-accent shadow-sm overflow-hidden bg-card transition-colors">
            {pin.avatarUrl ? (
              <img
                src={pin.avatarUrl}
                alt={pin.name || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent font-heading text-xl">
                {pin.name?.charAt(0) || '?'}
              </div>
            )}
          </div>
        ) : (
          <div className="w-14 h-14 rounded-lg bg-blue-500/20 border-2 border-blue-500/40 group-hover:border-blue-500 shadow-sm flex items-center justify-center transition-colors">
            <span className="text-2xl">🎭</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-sm text-foreground group-hover:text-accent transition-colors leading-tight truncate">
          {pin.name}
        </p>
        {pin.style && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {pin.style}
          </p>
        )}
        {!pin.style && pin.type && (
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            {pin.type.toLowerCase()}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      <div className="flex-shrink-0 text-muted-foreground group-hover:text-accent transition-colors">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
