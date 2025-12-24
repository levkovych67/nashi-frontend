import { useRef, useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { config } from '@/lib/config';
import { useThemeStore } from '@/stores/useThemeStore';
import type { components } from '@/lib/api/generated/types';

type MapPinDTO = components['schemas']['MapPinDTO'];

interface MapContainerProps {
  pins: MapPinDTO[];
  onPinClick?: (pin: MapPinDTO) => void;
}

// Ukraine center coordinates
const INITIAL_VIEW_STATE = {
  latitude: 48.3794,
  longitude: 31.1656,
  zoom: 6,
};

// Ukraine geographic boundaries (approximate)
// Southwest: [22.1371, 44.3614], Northeast: [40.2275, 52.3791]
const UKRAINE_BOUNDS = {
  minLng: 22.1371,
  minLat: 44.3614,
  maxLng: 40.2275,
  maxLat: 52.3791,
};

export function MapContainer({ pins, onPinClick }: MapContainerProps) {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [hoveredPin, setHoveredPin] = useState<MapPinDTO | null>(null);
  const { theme } = useThemeStore();

  // Map style based on theme
  const mapStyle = theme === 'dark'
    ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${config.mapTilerApiKey}`
    : `https://api.maptiler.com/maps/dataviz-light/style.json?key=${config.mapTilerApiKey}`;

  return (
    <div className="w-full h-full">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
        maxBounds={[
          [UKRAINE_BOUNDS.minLng, UKRAINE_BOUNDS.minLat], // Southwest
          [UKRAINE_BOUNDS.maxLng, UKRAINE_BOUNDS.maxLat], // Northeast
        ]}
        minZoom={5.5}
        maxZoom={18}
      >
        <NavigationControl position="top-right" />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            latitude={pin.latitude || 0}
            longitude={pin.longitude || 0}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onPinClick?.(pin);
            }}
          >
            <div
              className="cursor-pointer transform transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              {pin.type === 'ARTIST' ? (
                <div className="w-10 h-10 rounded-full border-2 border-accent shadow-lg overflow-hidden bg-white">
                  {pin.avatarUrl ? (
                    <img src={pin.avatarUrl} alt={pin.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent font-heading text-sm">
                      {pin.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs">🎭</span>
                </div>
              )}
            </div>
          </Marker>
        ))}

        {/* Hover Tooltip */}
        {hoveredPin && (
          <Popup
            latitude={hoveredPin.latitude || 0}
            longitude={hoveredPin.longitude || 0}
            closeButton={false}
            closeOnClick={false}
            anchor="top"
            offset={20}
            className="map-tooltip"
          >
            <div className="px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg shadow-lg min-w-[120px] animate-in fade-in zoom-in-95 duration-200">
              <p className="font-heading font-semibold text-sm text-white leading-tight">{hoveredPin.name}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
