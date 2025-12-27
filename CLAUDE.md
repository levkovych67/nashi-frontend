# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nashi Cultural Platform Frontend - An elegant, responsive platform for Ukrainian cultural heritage. Built with React 19, TypeScript, Vite, and TanStack Query for data fetching. Features an interactive map (MapLibre GL) showcasing Ukrainian artists, events, and cultural locations, along with a radio player for Ukrainian music.

## Common Commands

### Development
```bash
npm run dev              # Start development server (Vite)
npm run build            # Type-check and build for production
npm run preview          # Preview production build locally
```

### Code Quality
```bash
npm run lint             # Run ESLint on all files
npm run format           # Format code with Prettier (src/**/*.{ts,tsx})
npm run type-check       # Run TypeScript compiler without emitting files
```

### API Types Generation
```bash
npm run generate:types   # Generate TypeScript types from swagger.json
                        # Output: src/lib/api/generated/types.ts
```

## Environment Configuration

Required environment variables (create `.env.local` from `.env.example`):
- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:8080)
- `VITE_MAPTILER_API_KEY` - MapTiler API key for map rendering

Configuration is centralized in `src/lib/config.ts` which reads from Vite's `import.meta.env`.

## Architecture

### State Management Strategy

**Zustand stores** (global state):
- `useMapStore` - Map filters (region, style, tags, types)
- `useRadioStore` - Radio player state (playlist, current track, play/pause, volume)
- `useThemeStore` - Theme preference (light/dark mode)

**TanStack Query** (server state):
- All API data fetching uses TanStack Query hooks
- Query client configured in `src/app/providers.tsx` with:
  - 5min staleTime, 10min gcTime
  - 1 retry, refetchOnWindowFocus disabled
  - React Query Devtools enabled in development

### API Layer Architecture

**Type generation flow**:
1. `swagger.json` (OpenAPI spec at project root)
2. Generate types: `npm run generate:types`
3. Output: `src/lib/api/generated/types.ts` (auto-generated, do not edit manually)

**API client** (`src/lib/api/client.ts`):
- `ApiClient` class with type-safe methods: `get()`, `post()`, `postFormData()`
- Singleton instance exported as `apiClient`
- Handles FormData vs JSON Content-Type automatically
- Error handling via custom `ApiError` class (`src/lib/api/errors.ts`)

**API hooks pattern** (`src/lib/api/hooks/`):
- One file per resource (useArtists, useEvents, useMapPins, useNews, useRadio, etc.)
- Use TanStack Query's `useQuery` for single fetches, `useInfiniteQuery` for pagination
- Query keys follow pattern: `['resource', 'action', params]`
- Example: `['artists', 'list', { region: 'KYIV', page: 0 }]`

### Routing & Code Splitting

**React Router** setup in `src/app/router.tsx`:
- All pages lazy-loaded with `React.lazy()` for optimal bundle size
- Routes wrapped in `<Suspense>` with custom `PageLoader` component
- Nested under shared `<Layout>` component
- Main routes: `/` (map), `/artists`, `/artists/:slug`, `/events`, `/news`, `/radio`, `/submit`, `/about`

### Map Architecture

**MapLibre GL integration** (`src/features/map/components/MapContainer.tsx`):
- Uses `react-map-gl/maplibre` wrapper around MapLibre GL
- Map styles from MapTiler API (dataviz-dark/light) with Ukrainian language (`&language=uk`)
- Constrained to Ukraine bounds with minZoom 5.5, maxZoom 18
- Initial view centered on Ukraine (48.3794°N, 31.1656°E, zoom 6)

**Pin clustering** (`src/lib/utils/groupPinsByLocation.ts`):
- Groups overlapping pins by lat/lng proximity
- Single pins vs. stacks displayed via `StackMarker` component
- Handles hover states with z-index elevation

**Region filtering**:
- Region bounds defined in `src/features/map/utils/ukraineRegions.ts`
- Map auto-zooms when region selected via `map.fitBounds()`

### Features Structure

Code organized by feature domains in `src/features/`:
- `artists/` - Artist cards and profiles
- `events/` - Event listings
- `map/` - Map container, filters, markers, pin preview drawer
- `news/` - News articles
- `radio/` - Radio player and playlist

Each feature contains its own `components/` subdirectory. Shared UI components in `src/components/ui/` (shadcn/ui based).

### Form Handling Pattern

Forms use:
- `react-hook-form` for form state
- `@hookform/resolvers` + `zod` for validation
- Custom `Form` component wrapper (`src/components/ui/form.tsx`)
- Submit via `apiClient.postFormData()` for file uploads or `apiClient.post()` for JSON

### Import Alias

TypeScript path alias configured:
- `@/*` maps to `./src/*`
- Set in both `tsconfig.json` and `vite.config.ts`

## Key Technical Details

**Styling**:
- Tailwind CSS via `src/styles/globals.css`
- CSS custom properties for theming (light/dark mode)
- shadcn/ui components styled with `class-variance-authority` and `tailwind-merge`

**Type safety**:
- All API types generated from OpenAPI spec
- Use `components['schemas']['TypeName']` from generated types
- Never manually define API response types

**Audio playback**:
- Howler.js for radio player audio management
- State managed in `useRadioStore` with track queue and playback controls

**Performance**:
- Route-based code splitting with lazy loading
- TanStack Query caching reduces redundant API calls
- Map markers optimized with clustering and hover elevation

## SEO Configuration

**SEO Component** (`src/components/SEO.tsx`):
- Custom React component for managing meta tags (compatible with React 19)
- No external dependencies - uses native DOM APIs via useEffect
- Automatically updates document title, meta tags, Open Graph, Twitter Cards, and structured data

**Usage pattern**:
```tsx
<SEO
  title="Page Title"  // Automatically appends "| НАШІ"
  description="Page description"
  keywords="comma, separated, keywords"
  ogImage="/path/to/image.png"  // Optional custom image
  structuredData={{  // Optional JSON-LD structured data
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    // ... schema.org properties
  }}
/>
```

**SEO assets**:
- `index.html` - Base meta tags, Open Graph, Twitter Cards
- `public/robots.txt` - Search engine crawling directives
- `public/site.webmanifest` - PWA manifest with Ukrainian localization

## Important Patterns

1. **API hooks must use generated types**: Import from `@/lib/api/generated/types` - do not manually type API responses
2. **FormData submissions**: Use `apiClient.postFormData()` for file uploads, not `post()` - client handles Content-Type automatically
3. **Map language**: MapTiler styles must include `&language=uk` query param for Ukrainian labels
4. **Query keys**: Follow `['resource', 'action', params]` pattern for proper cache invalidation
5. **Component organization**: Feature-specific components go in `src/features/[feature]/components/`, shared UI in `src/components/ui/`
6. **SEO on pages**: Every page component should include `<SEO>` component at the top with page-specific metadata and structured data
