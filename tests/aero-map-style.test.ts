// The MapTiler style is recoloured at load time into the Aero sky palette, and its labels switch to Ukrainian.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyAeroMapPalette, applyUkrainianLabels, onStyleReady } from '../src/features/map/utils/aeroMapStyle.ts';

type Layer = { id: string; type: string };
type Call = [string, string, unknown];

function fakeMap(layers: Layer[] | undefined, failOn: string[] = []) {
  const paint: Call[] = [];
  const layout: Call[] = [];
  return {
    paint,
    layout,
    getStyle: () => (layers ? { layers } : undefined),
    setPaintProperty(id: string, prop: string, value: unknown) {
      if (failOn.includes(id)) throw new Error(`no ${prop} on ${id}`);
      paint.push([id, prop, value]);
    },
    setLayoutProperty(id: string, prop: string, value: unknown) {
      if (failOn.includes(id)) throw new Error(`no ${prop} on ${id}`);
      layout.push([id, prop, value]);
    },
  };
}

function colourOf(map: ReturnType<typeof fakeMap>, id: string, prop: string) {
  return map.paint.find(([layer, p]) => layer === id && p === prop)?.[2];
}

function rgb(value: unknown): [number, number, number] {
  const s = String(value);
  const hex = s.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16)) as [number, number, number];
  const fn = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  assert.ok(fn, `colour ${s} is hex or rgb()`);
  return [Number(fn[1]), Number(fn[2]), Number(fn[3])];
}

test('water is filled with the Aero aqua', () => {
  const map = fakeMap([{ id: 'Water', type: 'fill' }]);
  applyAeroMapPalette(map);
  assert.equal(colourOf(map, 'Water', 'fill-color'), '#8fd0f5');
});

test('rivers are drawn in sky blue', () => {
  const map = fakeMap([{ id: 'River', type: 'line' }]);
  applyAeroMapPalette(map);
  assert.equal(colourOf(map, 'River', 'line-color'), '#4fa3e8');
});

test('forest and landcover turn green', () => {
  const map = fakeMap([
    { id: 'Forest', type: 'fill' },
    { id: 'Landcover', type: 'fill' },
  ]);
  applyAeroMapPalette(map);
  for (const id of ['Forest', 'Landcover']) {
    const [r, g, b] = rgb(colourOf(map, id, 'fill-color'));
    assert.ok(g > r && g > b, `${id} is green, got ${r},${g},${b}`);
  }
});

test('the land background is light', () => {
  const map = fakeMap([{ id: 'Background', type: 'background' }]);
  applyAeroMapPalette(map);
  const [r, g, b] = rgb(colourOf(map, 'Background', 'background-color'));
  assert.ok(Math.min(r, g, b) > 220, `background is light, got ${r},${g},${b}`);
});

test('the country border is Aero blue', () => {
  const map = fakeMap([{ id: 'Country border', type: 'line' }]);
  applyAeroMapPalette(map);
  assert.equal(colourOf(map, 'Country border', 'line-color'), '#4f86c6');
});

test('layers the palette does not know are left alone', () => {
  const map = fakeMap([{ id: 'Aeroway', type: 'line' }, { id: 'Stadium', type: 'fill' }]);
  assert.equal(applyAeroMapPalette(map), 0);
  assert.deepEqual(map.paint, []);
});

test('a layer that refuses a property does not stop the others', () => {
  const map = fakeMap(
    [
      { id: 'Water', type: 'fill' },
      { id: 'River', type: 'line' },
    ],
    ['Water'],
  );
  assert.equal(applyAeroMapPalette(map), 1);
  assert.equal(colourOf(map, 'River', 'line-color'), '#4fa3e8');
});

test('a style without layers changes nothing', () => {
  assert.equal(applyAeroMapPalette(fakeMap(undefined)), 0);
  assert.equal(applyAeroMapPalette(fakeMap([])), 0);
});

test('every symbol layer shows the Ukrainian name, falling back to the local one', () => {
  const map = fakeMap([
    { id: 'City labels', type: 'symbol' },
    { id: 'Water', type: 'fill' },
    { id: 'Road labels', type: 'symbol' },
  ]);
  assert.equal(applyUkrainianLabels(map), 2);
  assert.deepEqual(map.layout, [
    ['City labels', 'text-field', ['coalesce', ['get', 'name:uk'], ['get', 'name']]],
    ['Road labels', 'text-field', ['coalesce', ['get', 'name:uk'], ['get', 'name']]],
  ]);
});

test('a symbol layer without text does not stop the label switch', () => {
  const map = fakeMap(
    [
      { id: 'Icons', type: 'symbol' },
      { id: 'City labels', type: 'symbol' },
    ],
    ['Icons'],
  );
  assert.equal(applyUkrainianLabels(map), 1);
});

// The palette goes on as soon as the style is parsed, not after every tile has loaded.
function fakeEvented(loaded: boolean) {
  const listeners = new Map<string, Set<() => void>>();
  return {
    isStyleLoaded: () => loaded,
    on(type: string, fn: () => void) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(fn);
    },
    off(type: string, fn: () => void) {
      listeners.get(type)?.delete(fn);
    },
    fire(type: string) {
      listeners.get(type)?.forEach((fn) => fn());
    },
    count: (type: string) => listeners.get(type)?.size ?? 0,
  };
}

test('a style that is already loaded is painted at once', () => {
  const map = fakeEvented(true);
  let calls = 0;
  onStyleReady(map, () => calls++);
  assert.equal(calls, 1);
});

test('a style still loading is painted when style.load fires', () => {
  const map = fakeEvented(false);
  let calls = 0;
  onStyleReady(map, () => calls++);
  assert.equal(calls, 0);
  map.fire('style.load');
  assert.equal(calls, 1);
});

test('unsubscribing stops later style loads from painting', () => {
  const map = fakeEvented(false);
  let calls = 0;
  const stop = onStyleReady(map, () => calls++);
  stop();
  map.fire('style.load');
  assert.equal(calls, 0);
  assert.equal(map.count('style.load'), 0);
});

test('a style.load that fired before subscribing is caught up on the map load', () => {
  const map = fakeEvented(false);
  let calls = 0;
  onStyleReady(map, () => calls++);
  map.fire('load');
  assert.equal(calls, 1);
});

test('unsubscribing also drops the load fallback', () => {
  const map = fakeEvented(false);
  const stop = onStyleReady(map, () => {});
  stop();
  assert.equal(map.count('load'), 0);
});
