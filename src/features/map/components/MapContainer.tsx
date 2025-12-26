import { useRef, useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { config } from '@/lib/config';
import { useThemeStore } from '@/stores/useThemeStore';
import type { components } from '@/lib/api/generated/types';
import { groupPinsByLocation } from '@/lib/utils/groupPinsByLocation';
import { StackMarker } from './StackMarker';

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
  const { theme } = useThemeStore();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredGroupKey, setHoveredGroupKey] = useState<string | null>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Group pins by location to handle overlapping markers
  const pinGroups = groupPinsByLocation(pins);

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

        {pinGroups.map((group) => {
          const groupKey = `group-${group.latitude}-${group.longitude}`;
          const isHovered = hoveredGroupKey === groupKey;
          
          return (
            <Marker
              key={groupKey}
              latitude={group.latitude}
              longitude={group.longitude}
              anchor="bottom"
              style={{
                zIndex: isHovered ? 1000 : 1,
              }}
            >
              <StackMarker
                pins={group.pins}
                onPinClick={(pin) => onPinClick?.(pin)}
                isMobile={isMobile}
                onHoverChange={(hovered) => 
                  setHoveredGroupKey(hovered ? groupKey : null)
                }
              />
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
