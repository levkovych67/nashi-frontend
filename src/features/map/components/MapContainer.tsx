import { useCallback, useRef, useState, useEffect } from 'react';
import Map, { Marker, NavigationControl, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { config } from '@/lib/config';
import type { components } from '@/lib/api/generated/types';
import { groupPinsByLocation } from '@/lib/utils/groupPinsByLocation';
import { StackMarker } from './StackMarker';
import { getRegionBounds } from '../utils/ukraineRegions';
import { applyAeroMapPalette, applyUkrainianLabels, onStyleReady } from '../utils/aeroMapStyle';

type MapPinDTO = components['schemas']['MapPinDTO'];

interface MapContainerProps {
  pins: MapPinDTO[];
  onPinClick?: (pin: MapPinDTO) => void;
  selectedRegion?: string | null;
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

export function MapContainer({ pins, onPinClick, selectedRegion }: MapContainerProps) {
  const mapRef = useRef<MapRef | null>(null);
  // The map instance arrives after the first commit, so it is held in state and the effects below wait for it.
  const [mapInstance, setMapInstance] = useState<ReturnType<MapRef['getMap']> | null>(null);
  const setMapRef = useCallback((ref: MapRef | null) => {
    mapRef.current = ref;
    setMapInstance(ref ? ref.getMap() : null);
  }, []);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredGroupKey, setHoveredGroupKey] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const handleMapLoad = () => {
    setIsMapReady(true);
  };

  // Paint the style in the Aero palette and switch its labels to Ukrainian as soon as the style is parsed,
  // before the tiles arrive, so the grey English base map never shows.
  useEffect(() => {
    if (!mapInstance) return;
    return onStyleReady(mapInstance, () => {
      applyAeroMapPalette(mapInstance);
      applyUkrainianLabels(mapInstance);
    });
  }, [mapInstance]);

  // Zoom to region when selected (only when map is ready)
  useEffect(() => {
    if (!isMapReady) return;
    
    const map = mapRef.current?.getMap();
    if (!map) return;

    const regionBounds = getRegionBounds(selectedRegion || null);
    
    if (regionBounds) {
      // Zoom to specific region
      map.fitBounds(regionBounds.bounds, {
        padding: 50,
        duration: 1000,
      });
    } else {
      // Reset to Ukraine view
      map.flyTo({
        center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
        zoom: INITIAL_VIEW_STATE.zoom,
        duration: 1000,
      });
    }
  }, [selectedRegion, isMapReady]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Group pins by location to handle overlapping markers
  const pinGroups = groupPinsByLocation(pins);

  // One light style; aeroMapStyle.ts recolours it and switches its labels to Ukrainian.
  const mapStyle = `https://api.maptiler.com/maps/dataviz-light/style.json?key=${config.mapTilerApiKey}`;

  return (
    <div className="w-full h-full">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onLoad={handleMapLoad}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        ref={setMapRef}
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
