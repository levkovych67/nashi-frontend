/**
 * Frutiger Aero palette for the MapTiler «dataviz-light» style: pale grassy land, aqua water, green forests and a blue
 * country border (spec docs/superpowers/specs/2026-10-31-aero-redesign-design.md). Applied on the map's `load` and
 * `styledata` events, so it survives a style reload. Kept free of app imports so tests can load it directly.
 */

export interface AeroMapLike {
  getStyle(): { layers?: { id: string; type: string }[] } | undefined;
  setPaintProperty(id: string, prop: string, value: unknown): void;
}

export interface LabelMapLike {
  getStyle(): { layers?: { id: string; type: string }[] } | undefined;
  setLayoutProperty(id: string, prop: string, value: unknown): void;
}

interface PaletteRule {
  test: RegExp;
  type: string;
  paint: Record<string, string>;
}

// First matching rule wins, so the more specific ids come first.
const PALETTE: PaletteRule[] = [
  { test: /^background$/i, type: 'background', paint: { 'background-color': '#eef6e8' } },
  { test: /^water shadow$/i, type: 'fill', paint: { 'fill-color': '#5fb4ea' } },
  { test: /^water$/i, type: 'fill', paint: { 'fill-color': '#8fd0f5' } },
  { test: /river|waterway/i, type: 'line', paint: { 'line-color': '#4fa3e8' } },
  { test: /forest|wood|park|grass/i, type: 'fill', paint: { 'fill-color': 'rgba(110, 190, 70, 0.2)' } },
  { test: /^landcover$/i, type: 'fill', paint: { 'fill-color': '#e2f1d3' } },
  { test: /^residential$/i, type: 'fill', paint: { 'fill-color': '#e6eef6' } },
  { test: /^building/i, type: 'fill', paint: { 'fill-color': '#dde8f2' } },
  { test: /road network outline|tunnel outline/i, type: 'line', paint: { 'line-color': '#c9d9ea' } },
  { test: /^country border$/i, type: 'line', paint: { 'line-color': '#4f86c6' } },
  { test: /other border|disputed border/i, type: 'line', paint: { 'line-color': '#9bb8d8' } },
  { test: /^(ocean|sea|lakeline) labels$/i, type: 'symbol', paint: { 'text-color': '#1f6fc5' } },
  { test: /^(city|country|state) labels$/i, type: 'symbol', paint: { 'text-color': '#1e2b3c', 'text-halo-color': '#ffffff' } },
  { test: /^(place|town|village|road) labels$/i, type: 'symbol', paint: { 'text-color': '#46586c', 'text-halo-color': '#ffffff' } },
];

const UKRAINIAN_NAME = ['coalesce', ['get', 'name:uk'], ['get', 'name']];

function layersOf(map: { getStyle(): { layers?: { id: string; type: string }[] } | undefined }) {
  return map.getStyle()?.layers ?? [];
}

/** Recolours the known layers; returns how many layers took at least one colour. */
export function applyAeroMapPalette(map: AeroMapLike): number {
  let changed = 0;
  for (const layer of layersOf(map)) {
    const rule = PALETTE.find((r) => r.type === layer.type && r.test.test(layer.id));
    if (!rule) continue;
    let took = false;
    for (const [prop, value] of Object.entries(rule.paint)) {
      try {
        map.setPaintProperty(layer.id, prop, value);
        took = true;
      } catch {
        // A layer without this property keeps its own colour.
      }
    }
    if (took) changed += 1;
  }
  return changed;
}

/** Shows the Ukrainian name on every label, falling back to the local name; returns how many layers switched. */
export function applyUkrainianLabels(map: LabelMapLike): number {
  let changed = 0;
  for (const layer of layersOf(map)) {
    if (layer.type !== 'symbol') continue;
    try {
      map.setLayoutProperty(layer.id, 'text-field', UKRAINIAN_NAME);
      changed += 1;
    } catch {
      // Icon-only layers have no text field.
    }
  }
  return changed;
}

export interface StyleEventsLike {
  isStyleLoaded(): boolean | void;
  on(type: 'style.load' | 'load', listener: () => void): unknown;
  off(type: 'style.load' | 'load', listener: () => void): unknown;
}

/**
 * Runs `apply` as soon as the style is parsed (`style.load`), instead of waiting for the map's `load`, which only fires
 * after every visible tile has arrived. `isStyleLoaded()` waits for tiles too, so a `style.load` missed before
 * subscribing is caught up on `load`. Applying twice is harmless. Returns the unsubscribe.
 */
export function onStyleReady(map: StyleEventsLike, apply: () => void): () => void {
  map.on('style.load', apply);
  map.on('load', apply);
  if (map.isStyleLoaded()) apply();
  return () => {
    map.off('style.load', apply);
    map.off('load', apply);
  };
}
