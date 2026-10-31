# Frutiger Aero Design System for Наші

Nashi uses **Frutiger Aero** (≈2004–2013): a day sky with aurora, grass and rising bubbles behind white glass, glossy gel
buttons, Windows 7 command buttons, fields and selection. One light look only — there is no dark theme.

- Spec: `docs/superpowers/specs/2026-10-31-aero-redesign-design.md`
- Source of the values: the Aero encyclopedia, chapter 11 «Переклад на веб» (`~/development/encyclopedia/aero/11-web.md`)
- Code: `src/styles/aero.css` (tokens, wallpaper, materials) and `src/styles/globals.css` (shadcn variables mapped onto them)
- Contrast of the tokens is tested: `tests/aero-contrast.test.mjs`

## Tokens (`--aero-*` in `aero.css`)

| Token | Value | Use |
|---|---|---|
| sky | `#1f6fc5 → #4fa3e8 → #9ad4f7 → #e8f7ff` | wallpaper, browser theme colour |
| aqua / aqua-deep | `#00a2e8` / `#0a6cc2` | main actions, focus glow, `--primary` |
| grass / grass-deep / grass-ink | `#5fbf2a` / `#2f8a10` / `#267a0b` | adding and sending (`grass-ink` under white text) |
| danger | `#c42b1c` | errors, destructive |
| text / text-2 | `#1e2b3c` / `#46586c` | body / secondary text |
| instruction | `#003399` | headings (Windows «main instruction» blue) |
| link / focus | `#0066cc` | links, `--accent`, 2 px focus ring with 2 px offset |

Font: the system stack `Segoe UI, Frutiger, Frutiger Linotype, Avenir Next, Avenir, Lucida Grande, Noto Sans, Open Sans,
Roboto, sans-serif` — no web fonts are loaded.

## Materials (component classes)

| Class | What it is |
|---|---|
| `aero-glass` | White glass for cards and panels (`Card` uses it) |
| `aero-frame` | Frame glass with 54° streaks (the header) |
| `aero-taskbar`, `aero-task` | Dark Windows 7 taskbar and its buttons (mobile menu) |
| `aero-window`, `aero-window__client`, `aero-close` | Aero window (Sheet, Dialog) with the red close button |
| `aero-gel` (+ `--grass`, `--red`) | Glossy pill: `Button` variants `default`, `grass`, `destructive` |
| `aero-cmd` | Windows 7 command button: `outline`, `secondary`; `aria-pressed="true"` shows it chosen |
| `aero-field` | Windows 7 text field: `Input`, `Textarea`, `Select`, native `<select>` |
| `aero-hover-row` | Explorer hover and selection (`aria-current="page"`, `aria-selected`, `data-state="active"`) |
| `aero-orb` (+ `--grass`) | Glossy sphere: logo, start button, play button, event pins |
| `aero-pin`, `aero-pin__face` | Glass ring around an artist photo on the map |
| `aero-tag` | Small light pill for genres and styles |
| `aero-progress`, `aero-progress__bar` | Windows 7 progress bar with a passing shine |
| `aero-spinner` | Busy ring |
| `aero-range` | Windows 7 slider |
| `aero-groupbox` | Group box around part of a form |
| `aero-lift` | Blue glow on hover for cards |
| `aero-heading`, `aero-glow-text`, `aero-link` | Instruction-blue heading, white halo on glass, Windows 7 link |

## Motion

Hover glow lights up in 0.3 s and fades in 1 s; windows appear in about 250 ms; bubbles drift for 30 s; the progress
shine passes every 3 s. `prefers-reduced-motion` stops the ambient motion. Without `backdrop-filter`, or with
`prefers-reduced-transparency`, glass turns solid.

## The map

`src/features/map/utils/aeroMapStyle.ts` recolours MapTiler `dataviz-light` as soon as its style is parsed (aqua water,
green landcover, blue borders) and switches every label to `name:uk` with a fallback to `name`. Tests:
`tests/aero-map-style.test.ts`.

## Rules

- Use the tokens and classes above; do not hard-code Tailwind palette colours (`red-500`, `blue-500`, …).
- Main action: aqua gel. Add or send: grass gel. Everything else: command buttons or Explorer rows.
- White text only on deep colours (`aqua-deep`, `grass-ink`, `danger`) with the gel's dark text shadow.
- No Microsoft, Windows or Apple logos or names in the interface: only the language of forms.
