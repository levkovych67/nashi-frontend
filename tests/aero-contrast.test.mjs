// Text on Aero glass must stay readable: the token pairs below keep WCAG contrast on their worst background.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/aero.css', import.meta.url), 'utf8');

function token(name) {
  const m = css.match(new RegExp(`--aero-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  assert.ok(m, `token --aero-${name} is defined as a 6-digit hex colour`);
  return m[1];
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('token values match the spec', () => {
  assert.equal(token('sky-top').toLowerCase(), '#1f6fc5');
  assert.equal(token('horizon').toLowerCase(), '#e8f7ff');
  assert.equal(token('aqua-deep').toLowerCase(), '#0a6cc2');
  assert.equal(token('grass-deep').toLowerCase(), '#2f8a10');
  assert.equal(token('text').toLowerCase(), '#1e2b3c');
  assert.equal(token('text-2').toLowerCase(), '#46586c');
  assert.equal(token('instruction').toLowerCase(), '#003399');
  assert.equal(token('link').toLowerCase(), '#0066cc');
  assert.equal(token('focus').toLowerCase(), '#0066cc');
});

for (const name of ['text', 'text-2', 'instruction', 'link']) {
  for (const bg of ['#ffffff', 'horizon']) {
    test(`--aero-${name} on ${bg} is at least 4.5 : 1`, () => {
      const back = bg.startsWith('#') ? bg : token(bg);
      assert.ok(contrast(token(name), back) >= 4.5, `${token(name)} on ${back}: ${contrast(token(name), back).toFixed(2)}`);
    });
  }
}

for (const name of ['aqua-deep', 'grass-ink', 'danger']) {
  test(`white on --aero-${name} is at least 4.5 : 1`, () => {
    assert.ok(contrast('#ffffff', token(name)) >= 4.5, `white on ${token(name)}: ${contrast('#ffffff', token(name)).toFixed(2)}`);
  });
}

test('focus ring is at least 3 : 1 on white', () => {
  assert.ok(contrast(token('focus'), '#ffffff') >= 3);
});

// A gel label sits across the middle of the pill (about 39–61 % of its height). Under it the browser paints the gloss
// cap over the base gradient; white text must keep 4.5 : 1 on that mix, not just on the deepest colour.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (rgb) => '#' + rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');

function glossStops() {
  const decl = css.match(/--aero-gloss:([^;]+);/);
  assert.ok(decl, '--aero-gloss is defined');
  return [...decl[1].matchAll(/rgba\(255, 255, 255, ([\d.]+)\) (\d+)%/g)].map((m) => [Number(m[2]) / 100, Number(m[1])]);
}

function alphaAt(stops, y) {
  if (y <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [p0, a0] = stops[i - 1];
    const [p1, a1] = stops[i];
    if (y <= p1) return a0 + ((a1 - a0) * (y - p0)) / (p1 - p0 || 1);
  }
  return stops[stops.length - 1][1];
}

function gelBase() {
  const m = css.match(/\.aero-gel \{[^}]*background:[^;]*linear-gradient\(180deg, var\(--gel-top\), var\(--gel\)(?: (\d+)%)?\)/);
  assert.ok(m, '.aero-gel paints a gel-top → gel gradient');
  return m[1] ? Number(m[1]) / 100 : 1;
}

function gelTop(selector) {
  const block = css.match(new RegExp(`\\${selector} \\{([^}]*)\\}`));
  assert.ok(block, `${selector} block exists`);
  const m = block[1].match(/--gel-top:\s*(#[0-9a-fA-F]{6})/);
  assert.ok(m, `${selector} sets --gel-top`);
  return m[1];
}

for (const [selector, deep] of [['.aero-gel', 'aqua-deep'], ['.aero-gel--grass', 'grass-ink'], ['.aero-gel--red', 'danger']]) {
  test(`white label on ${selector} keeps 4.5 : 1 across the text band`, () => {
    const top = hex(gelTop(selector));
    const bottom = hex(token(deep));
    const stop = gelBase();
    const gloss = glossStops();
    for (let y = 0.39; y <= 0.611; y += 0.01) {
      const t = Math.min(1, y / stop);
      const base = top.map((c, i) => c + (bottom[i] - c) * t);
      const a = alphaAt(gloss, y);
      const under = toHex(base.map((c) => c * (1 - a) + 255 * a));
      assert.ok(contrast('#ffffff', under) >= 4.5, `at ${Math.round(y * 100)} %: white on ${under} is ${contrast('#ffffff', under).toFixed(2)}`);
    }
  });
}
