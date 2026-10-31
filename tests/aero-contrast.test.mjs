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
