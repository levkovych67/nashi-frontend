import type { LayerProps } from 'react-map-gl/maplibre';

/**
 * Get Ukraine border layer styles based on theme
 * Dark theme: Glowing amber border
 * Light theme: Solid charcoal border
 */
export function getUkraineBorderLayers(isDark: boolean): LayerProps[] {
  if (isDark) {
    // Dark Theme: "Luminous Amber" with glow effect
    return [
      // Outer glow layer
      {
        id: 'ukraine-border-glow-outer',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#F5C647', // Luminous amber
          'line-width': 8,
          'line-opacity': 0.3,
          'line-blur': 4,
        },
      },
      // Main stroke layer
      {
        id: 'ukraine-border-main',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#F5C647', // Luminous amber
          'line-width': 3,
          'line-opacity': 0.9,
        },
      },
      // Inner highlight layer
      {
        id: 'ukraine-border-highlight',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#FFFFFF', // White highlight
          'line-width': 1.5,
          'line-opacity': 0.4,
        },
      },
    ];
  } else {
    // Light Theme: "Sovereign Charcoal" solid border
    return [
      // White outline for definition
      {
        id: 'ukraine-border-outline',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 3.5,
          'line-opacity': 0.6,
        },
      },
      // Main charcoal stroke
      {
        id: 'ukraine-border-main',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#28282B', // Deep charcoal
          'line-width': 2.5,
          'line-opacity': 1.0,
        },
      },
    ];
  }
}
