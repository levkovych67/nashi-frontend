# Frutiger Aero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> Owner chose: native execution in one session, one fresh whole-branch review at the end.

**Goal:** replace the «Heritage Modern» look of the Nashi frontend with Frutiger Aero, light only.

**Architecture:** the shadcn HSL variables in `src/styles/globals.css` are remapped to Aero tokens, so most pages change
through Tailwind classes they already use; Aero materials (glass, gel, command button, Windows 7 field, sky wallpaper)
are CSS component classes (`.aero-*`) in a new `src/styles/aero.css`; shared `ui/*` components use them; the map
recolours MapTiler layers at load time through one pure function.

**Tech Stack:** React 19, Vite 7, Tailwind 3, shadcn/ui (Radix), MapLibre via react-map-gl, `node:test` (no new packages).

**Spec:** `docs/superpowers/specs/2026-10-31-aero-redesign-design.md`

## Global Constraints

- No new npm packages, web fonts or images; CSS gradients and inline SVG only; no Microsoft/Windows logos or names.
- Light only: no `.dark` rules, no `dark:` classes, no theme toggle.
- Font stack: `"Segoe UI", "Frutiger", "Frutiger Linotype", "Avenir Next", Avenir, "Lucida Grande", "Noto Sans", "Open Sans", Roboto, sans-serif`.
- Tokens from spec §3 verbatim (sky `#1f6fc5 → #4fa3e8 → #9ad4f7 → #e8f7ff`, aqua `#00a2e8`/`#0a6cc2`, grass `#5fbf2a`/`#2f8a10`, text `#1e2b3c`/`#46586c`, heading `#003399`, link `#0066cc`, focus 2 px `#0066cc` offset 2 px).
- Body text contrast ≥ 4.5 : 1, large text and UI ≥ 3 : 1, on the worst background under it.
- Motion: glow in 0.3 s / out 1 s, window appear ≈ 250 ms, bubbles 12–30 s; `prefers-reduced-motion` stops ambient motion; `prefers-reduced-transparency` and no `backdrop-filter` → solid glass.
- Ukrainian copy. Touch targets stay ≥ 44 px. No push to `main` (push = production deploy).
- Never run `nashi-backend` locally; verify against the scratchpad mock API.

## Review Focus

1. Text on glass over the busy sky or the map — every text colour must keep contrast on its worst background (covered by `tests/aero-contrast.test.mjs`).
2. iPhone Safari: `backdrop-filter` needs `-webkit-` prefix; fixed wallpaper must be layers, not `background-attachment: fixed`; bottom taskbar must respect `env(safe-area-inset-bottom)`.
3. The map recolour must not throw on styles whose layers lack the expected paint properties, and must re-apply after a style reload (covered by `tests/aero-map-style.test.ts`).
4. Radix portals (Sheet, Dialog, Select, Dropdown, Toast) render outside `#root`; Aero classes must not depend on an ancestor.
5. Keyboard: visible focus on every interactive element, including map markers and the start orb.

---

### Task 1: Foundation — tokens, wallpaper, materials, shared UI

**Files:**
- Create: `src/styles/aero.css`, `tests/aero-contrast.test.mjs`
- Modify: `src/styles/globals.css`, `tailwind.config.js`, `src/main.tsx` (drop `index.css`), `index.html` (theme-color `#1f6fc5`), `package.json` (`"test": "node --test tests/"`), `src/stores/useThemeStore.ts` (delete), `src/components/ui/{button,card,input,textarea,select,tabs,sheet,dialog,dropdown-menu,toast}.tsx`
- Delete: `src/index.css`, `src/App.css` if unused

**Interfaces:**
- Produces CSS classes: `.aero-glass` (white card glass), `.aero-frame` (Aero frame glass with 54° streaks), `.aero-gel` + modifiers `.aero-gel--aqua|--grass|--red`, `.aero-cmd` (Windows 7 command button), `.aero-field` (Windows 7 text field), `.aero-hover-row` / `[aria-selected=true]` (Explorer hover/selection), `.aero-orb` (glossy sphere), `.aero-progress` (bar with shine), `.aero-heading` (instruction blue), `.aero-glow-text`.
- Produces CSS variables `--aero-*` (names as in radio-zubylia `src/aero/base.css`).
- Button variants keep their names (`default|destructive|outline|secondary|ghost|link`); new variant `grass` for submit actions.

- [ ] Write `tests/aero-contrast.test.mjs`: parse `--aero-*` hex values from `src/styles/aero.css`; assert WCAG ratio ≥ 4.5 for text `#1e2b3c`, `#46586c`, `#003399`, `#0066cc` on white and on `#e8f7ff`; ≥ 4.5 for `#fff` on `#0a6cc2`, `#2f8a10`; ≥ 3 for focus `#0066cc` on white.
- [ ] Run `npm test` → FAIL (file missing).
- [ ] Create `aero.css` (tokens, wallpaper on `body::before/::after`, materials, reduced-motion/transparency fallbacks), import it from `globals.css`; remap shadcn variables; remove Google Fonts and `.dark`.
- [ ] `npm test` → PASS.
- [ ] Restyle the ten `ui/*` components with the materials; remove `useThemeStore`; `npm run type-check && npm run lint` clean.
- [ ] Commit `feat(aero): tokens, wallpaper and shared components`.

### Task 2: Shell — header, taskbar, search, submission progress

**Files:** `src/components/layout/{Header,MobileNav,SearchBar,SubmissionProgressWidget,Layout}.tsx`

**Interfaces:** consumes Task 1 classes. Header height stays 64 px (`4rem`), MapPage relies on it.

- [ ] Header: `.aero-frame` bar, `.aero-orb` logo + «Наші» with `.aero-glow-text`, nav links as Explorer hover rows with the current route selected (`aria-current="page"`), no theme button.
- [ ] MobileNav: dark-glass taskbar (gradient from spec §11 «Скло рамок»), `pb-[env(safe-area-inset-bottom)]`, the «+» button becomes a grass `.aero-orb` start button; the submit sheet becomes an Aero window.
- [ ] SearchBar as Windows 7 search field; results dropdown as white glass with hover rows.
- [ ] SubmissionProgressWidget uses `.aero-progress`.
- [ ] Screenshot 390 and 1440 px; `npm run type-check && npm run lint`; commit `feat(aero): glass header and taskbar`.

### Task 3: Map

**Files:**
- Create: `src/features/map/utils/aeroMapStyle.ts`, `tests/aero-map-style.test.ts`
- Modify: `src/features/map/components/{MapContainer,StackMarker,MarkerList,MarkerListItem,MapFilters,PinPreviewDrawer}.tsx`, `src/features/map/utils/ukraineBorderStyle.ts`, `src/pages/MapPage.tsx`

**Interfaces:**
- Produces `applyAeroMapPalette(map: AeroMapLike): number` — recolours layers by id/type (background → `#eef7fd`, water → `#8fd0f5`, waterway lines → `#4fa3e8`, park/grass/wood/landcover → greens around `#bfe6a0`, roads → white, boundaries → `#4f86c6`), returns how many layers were changed; `AeroMapLike = { getStyle(): { layers?: {id: string; type: string}[] } | undefined; setPaintProperty(id: string, prop: string, value: unknown): void }`; must not throw when `setPaintProperty` throws.
- `getUkraineBorderLayers(): LayerProps[]` (no `isDark` argument): white halo + `#0a6cc2` line + soft aqua glow.

- [ ] Write `tests/aero-map-style.test.ts` (fake map): water fill gets the aqua colour; a `park` layer gets green; unknown layers untouched; a throwing `setPaintProperty` is swallowed and the rest still applied; empty style returns 0.
- [ ] `npm test` → FAIL; implement; `npm test` → PASS.
- [ ] MapContainer: one style URL (`dataviz-light`), call `applyAeroMapPalette` on `load` and `styledata`, add the Ukraine border source from `src/assets/ukraine-border.json` with the new layers.
- [ ] Markers: artist — glass ring orb with avatar, event — grass gel orb with a lucide `CalendarDays` icon, stack badge — aqua gel bubble; markers become `<button>` with `aria-label`.
- [ ] Filters: white glass panel, type toggles as command buttons with selected state, region `<select>` as `.aero-field`. Marker list and pin drawer as Aero windows; loading → aqua busy ring; error text uses the token red.
- [ ] Screenshots; type-check, lint, test; commit `feat(aero): sky map, glass markers and filters`.

### Task 4: Pages and cards

**Files:** `src/features/{artists,events,news,radio}/components/*.tsx`, `src/pages/*.tsx`

- [ ] Cards (`ArtistCard`, `EventCard`, `NewsCard`) — `.aero-glass`, hover glow, tags as small aqua gel pills.
- [ ] List pages (Artists, Events, News) — headings `.aero-heading`, filters as command buttons/fields, empty/loading states in Aero.
- [ ] Artist profile — glass panels, gallery, members, social links as command buttons.
- [ ] Radio — player as glass panel with a round aqua play orb and progress `.aero-progress`; playlist rows as hover/selection rows.
- [ ] Submit pages (artist, event, choice) — Windows 7 task-dialog look: instruction-blue headings, `.aero-field` inputs, grass gel submit; replace hard-coded colours.
- [ ] About, NotFound — glass panels.
- [ ] `grep -rnE 'dark:|font-heading|font-nav|bg-blue-|text-red-500'` → only intended hits; screenshots 390/1440 of every route; commit `feat(aero): pages and cards`.

### Task 5: Verification and review

- [ ] `npm test && npm run type-check && npm run lint && npm run build` clean.
- [ ] Screenshots of every route at 390 and 1440 px on the mock API; check reduced motion.
- [ ] Update `DESIGN_SYSTEM.md` to describe the Aero system (short), and `CLAUDE.md` lines that mention dark mode/fonts.
- [ ] Fresh-context review of the branch (superpowers:requesting-code-review); fix findings; commit.
