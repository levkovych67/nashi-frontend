import { useRef, useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { config } from '@/lib/config';
import { useThemeStore } from '@/stores/useThemeStore';
import type { components } from '@/lib/api/generated/types';
import { groupPinsByLocation } from '@/lib/utils/groupPinsByLocation';
import { StackMarker } from './StackMarker';
import { getRegionBounds } from '../utils/ukraineRegions';

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
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const { theme } = useThemeStore();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredGroupKey, setHoveredGroupKey] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Handle map load callback
  const handleMapLoad = () => {
    setIsMapReady(true);
  };

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

  // Change map language to Ukrainian
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const handleLoad = () => {
      // Check if map has setLanguage method (MapTiler SDK feature)
      if (typeof (map as any).setLanguage === 'function') {
        try {
          (map as any).setLanguage('name:uk');
        } catch (error) {
          console.warn('setLanguage failed:', error);
        }
      } else {
        // Fallback: manually update text-field properties
        const style = map.getStyle();
        if (!style || !style.layers) return;

        style.layers.forEach((layer: any) => {
          if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
            try {
              map.setLayoutProperty(layer.id, 'text-field', ['get', 'name:uk']);
            } catch (error) {
              // Silently continue if property doesn't exist
            }
          }
        });
      }
    };

    if (map.loaded()) {
      handleLoad();
    } else {
      map.on('load', handleLoad);
    }

    return () => {
      map.off('load', handleLoad);
    };
  }, [theme]); // Re-run when theme changes

  // Group pins by location to handle overlapping markers
  const pinGroups = groupPinsByLocation(pins);

  // Map style based on theme with Ukrainian language
  const mapStyle = theme === 'dark'
    // DataViz dark style with Ukrainian language
    ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${config.mapTilerApiKey}&language=uk`
    // DataViz light style with Ukrainian language
    : `https://api.maptiler.com/maps/dataviz-light/style.json?key=${config.mapTilerApiKey}&language=uk`;
    
  // Alternative styles (commented out for reference):
  // Basic styles (clean, minimalist):
  // ? `https://api.maptiler.com/maps/basic-v2-dark/style.json?key=${config.mapTilerApiKey}&language=uk`
  // : `https://api.maptiler.com/maps/basic-v2/style.json?key=${config.mapTilerApiKey}&language=uk`;
  //
  // Streets styles (detailed street-level view):
  // ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${config.mapTilerApiKey}&language=uk`
  // : `https://api.maptiler.com/maps/streets-v2/style.json?key=${config.mapTilerApiKey}&language=uk`;

  return (
    <div className="w-full h-full">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onLoad={handleMapLoad}
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
