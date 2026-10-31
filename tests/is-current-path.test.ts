// The header and the taskbar mark the page the person is on.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isCurrentPath } from '../src/lib/utils/isCurrentPath.ts';

test('the map link is current only on the map itself', () => {
  assert.equal(isCurrentPath('/', '/'), true);
  assert.equal(isCurrentPath('/artists', '/'), false);
});

test('a section link is current on its own pages', () => {
  assert.equal(isCurrentPath('/artists', '/artists'), true);
  assert.equal(isCurrentPath('/artists/okean-elzy', '/artists'), true);
  assert.equal(isCurrentPath('/submit/event', '/submit'), true);
});

test('a section link is not current on a page that only shares its prefix', () => {
  assert.equal(isCurrentPath('/artistsfoo', '/artists'), false);
  assert.equal(isCurrentPath('/news', '/events'), false);
});
