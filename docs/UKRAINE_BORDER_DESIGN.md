# 🗺️ Ukraine Border Highlight Design Specification

## Design Philosophy: "Heritage Modern Cartography"

A professional, elegant border visualization that respects Ukrainian sovereignty while maintaining visual harmony with the "Наші" platform aesthetic.

---

## 🌙 **Dark Theme: "Luminous Amber"**

### Design Concept
**"Glowing Heritage"** - Inspired by candlelight and evening gold, the border glows with warm Ukrainian amber tones against the dark map, creating a sense of warmth and cultural identity.

### Design Tokens

```typescript
const darkThemeBorder = {
  // Primary stroke - Main visible line
  primaryStroke: {
    color: '#F5C647',        // Luminous Amber (matches --accent dark theme)
    width: 3,                // px
    opacity: 0.9,
  },
  
  // Outer glow - Creates luminous effect
  outerGlow: {
    color: '#F5C647',        // Same amber
    width: 8,                // px (halo width)
    opacity: 0.3,            // Soft glow
    blur: 4,                 // px (blur radius)
  },
  
  // Inner glow - Adds depth
  innerGlow: {
    color: '#FFFFFF',        // Pure white
    width: 1.5,              // px
    opacity: 0.4,            // Subtle highlight
  },
};
```

### Visual Effect
- **Main Line**: 3px golden amber stroke (high contrast on dark)
- **Outer Halo**: 8px soft amber glow (technological bioluminescence)
- **Inner Highlight**: 1.5px white accent (adds crispness)
- **Total Visual Width**: ~12px with glow

### Rationale
- Uses existing Heritage Modern gold accent for brand consistency
- Warm amber evokes Ukrainian wheat fields and cultural warmth
- Glow effect creates premium, technological feel
- High contrast ensures visibility on dark backgrounds

---

## ☀️ **Light Theme: "Sovereign Charcoal"**

### Design Concept
**"Atlas Precision"** - A deep, authoritative line reminiscent of professional cartography and printed atlases, conveying sovereignty and precision.

### Design Tokens

```typescript
const lightThemeBorder = {
  // Primary stroke - Solid, crisp line
  primaryStroke: {
    color: '#28282B',        // Deep Warm Iron-Gray (matches --foreground light)
    width: 2.5,              // px (slightly thinner for light bg)
    opacity: 1.0,            // Fully opaque
  },
  
  // Optional subtle outline for definition
  outline: {
    color: '#FFFFFF',        // White
    width: 0.5,              // px (hairline)
    opacity: 0.6,            // Semi-transparent
  },
  
  // No glow needed on light background
};
```

### Visual Effect
- **Main Line**: 2.5px deep charcoal stroke (strong contrast)
- **White Outline**: 0.5px hairline (adds definition and prevents bleeding)
- **Total Visual Width**: ~3px crisp and clean
- **Style**: Solid, authoritative, atlas-like

### Rationale
- Uses Heritage Modern foreground color for consistency
- Deep charcoal provides excellent readability on light backgrounds
- No glow (unnecessary and would look muddy)
- Hairline outline prevents visual bleeding into map features
- Professional, printed atlas aesthetic

---

## 📊 **Comparative Analysis**

| Aspect | Dark Theme | Light Theme |
|--------|-----------|-------------|
| **Primary Color** | `#F5C647` (Amber) | `#28282B` (Charcoal) |
| **Width** | 3px | 2.5px |
| **Glow** | Yes (8px halo) | No |
| **Opacity** | 0.9 | 1.0 |
| **Total Width** | ~12px (with glow) | ~3px |
| **Feel** | Luminous, warm | Solid, authoritative |
| **Inspiration** | Candlelight, amber | Atlas, precision |

---

## 💻 **MapLibre GL Implementation**

### React Component Integration

```typescript
// src/features/map/utils/ukraineBorderStyle.ts

import type { LayerSpecification } from 'maplibre-gl';

export function getUkraineBorderLayers(isDark: boolean): LayerSpecification[] {
  if (isDark) {
    return [
      // Dark Theme - Outer Glow
      {
        id: 'ukraine-border-glow-outer',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#F5C647',
          'line-width': 8,
          'line-opacity': 0.3,
          'line-blur': 4,
        },
      },
      // Dark Theme - Main Stroke
      {
        id: 'ukraine-border-main',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#F5C647',
          'line-width': 3,
          'line-opacity': 0.9,
        },
      },
      // Dark Theme - Inner Highlight
      {
        id: 'ukraine-border-highlight',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1.5,
          'line-opacity': 0.4,
        },
      },
    ];
  } else {
    return [
      // Light Theme - White Outline
      {
        id: 'ukraine-border-outline',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 3.5, // 2.5 + (2 * 0.5)
          'line-opacity': 0.6,
        },
      },
      // Light Theme - Main Stroke
      {
        id: 'ukraine-border-main',
        type: 'line',
        source: 'ukraine-border',
        paint: {
          'line-color': '#28282B',
          'line-width': 2.5,
          'line-opacity': 1.0,
        },
      },
    ];
  }
}
```

### GeoJSON Source Setup

```typescript
// Add Ukraine border as GeoJSON source
map.addSource('ukraine-border', {
  type: 'geojson',
  data: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        // Ukraine border coordinates
        // Would come from a proper GeoJSON file
      ],
    },
  },
});

// Add layers based on theme
const layers = getUkraineBorderLayers(isDarkTheme);
layers.forEach(layer => map.addLayer(layer));
```

### React Map GL Usage

```tsx
// In MapContainer.tsx
import { Layer, Source } from 'react-map-gl/maplibre';
import ukraineBorderGeoJSON from '@/assets/ukraine-border.json';
import { useThemeStore } from '@/stores/useThemeStore';

export function MapContainer() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const layers = getUkraineBorderLayers(isDark);
  
  return (
    <Map {...props}>
      <Source
        id="ukraine-border"
        type="geojson"
        data={ukraineBorderGeoJSON}
      >
        {layers.map(layer => (
          <Layer key={layer.id} {...layer} />
        ))}
      </Source>
      {/* Other map content */}
    </Map>
  );
}
```

---

## 🎨 **CSS Variables Integration**

For consistency with Heritage Modern design system:

```css
/* Add to globals.css */
:root {
  --ukraine-border-light: 240 4% 16%;    /* #28282B - Deep charcoal */
  --ukraine-border-dark: 45 90% 60%;     /* #F5C647 - Luminous amber */
}
```

---

## 🔍 **Zoom-Dependent Styling (Optional)**

```typescript
// Adjust width based on zoom level for optimal visibility
export function getResponsiveBorderWidth(zoom: number, isDark: boolean): number {
  const baseWidth = isDark ? 3 : 2.5;
  
  // Scale width with zoom
  if (zoom < 6) return baseWidth * 0.7;      // Far out - thinner
  if (zoom < 9) return baseWidth;            // Normal
  if (zoom < 12) return baseWidth * 1.2;     // Closer - slightly thicker
  return baseWidth * 1.5;                    // Very close - thicker
}
```

---

## ✨ **Accessibility Considerations**

1. **Color Blindness**: Both themes use high-contrast colors that work for most color vision deficiencies
2. **WCAG Compliance**: Contrast ratios exceed AA standards for large graphics
3. **Motion**: No animated effects (static design)
4. **Focus**: Border visible in both themes without relying solely on color

---

## 📦 **Required Assets**

1. **GeoJSON File**: `ukraine-border.json`
   - Accurate border coordinates
   - Simplified geometry for performance
   - ~100-500 points (balance between accuracy and file size)

2. **TypeScript Types**: Border style configuration types
3. **Theme Integration**: Connect to existing `useThemeStore`

---

## 🎯 **Implementation Checklist**

- [ ] Create `ukraineBorderStyle.ts` utility
- [ ] Add Ukraine border GeoJSON to assets
- [ ] Integrate with MapContainer component
- [ ] Add theme-aware layer switching
- [ ] Test visibility on both themes
- [ ] Optimize for performance (simplify geometry if needed)
- [ ] Add zoom-dependent styling (optional)
- [ ] Document in component props

---

## 🎨 **Visual Preview**

**Dark Theme:**
```
━━━━━━━━━━━━━━━━━━━━
  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒    ← Amber outer glow (soft)
    ══════════════      ← Main amber line (3px)
      ──────────        ← White inner highlight
━━━━━━━━━━━━━━━━━━━━
```

**Light Theme:**
```
━━━━━━━━━━━━━━━━━━━━
    ░░░░░░░░░░░░        ← White outline (hairline)
      ████████          ← Deep charcoal line (2.5px)
━━━━━━━━━━━━━━━━━━━━
```

---

**Version**: 1.0  
**Last Updated**: December 26, 2025  
**Design**: Ukraine Border Visualization for Наші Platform
