# 🗺️ Map Marker Clustering - "Stacked Elegance" Pattern

## Overview

This document describes the implementation of the "Stacked Elegance" interaction pattern for handling overlapping map markers in the Наші platform. The solution elegantly handles multiple artists/events at identical coordinates while maintaining the Heritage Modern design aesthetic.

---

## 🎨 Design Philosophy

**"Stacked Elegance"** creates a premium, intuitive experience that feels like shuffling through a deck of Ukrainian cultural cards. The interaction is:

- **Elegant**: Smooth animations with premium physics
- **Contextual**: Desktop hover vs. mobile tap behaviors
- **Heritage Modern**: Uses gold accents, warm shadows, and the existing design system

---

## 📐 Architecture

### Component Structure

```
MapContainer.tsx
  └── StackMarker.tsx (for each location group)
        ├── Main marker display (with badge if stacked)
        └── MarkerList.tsx (popover/sheet based on device)
              └── MarkerListItem.tsx (for each pin)
```

### Key Files Created

1. **`src/lib/utils/groupPinsByLocation.ts`**
   - Groups pins by exact coordinates (rounded to 6 decimal places)
   - Returns `PinGroup[]` with location and stack information

2. **`src/features/map/components/StackMarker.tsx`**
   - Renders individual marker with optional count badge
   - Handles hover/click interactions
   - Manages list visibility state

3. **`src/features/map/components/MarkerList.tsx`**
   - Desktop: Floating popover above marker
   - Mobile: Bottom sheet with swipe-to-close
   - Custom scrollbar with gold accent

4. **`src/features/map/components/MarkerListItem.tsx`**
   - Individual list item card
   - Thumbnail + name + style/type
   - Staggered animation on appearance
   - Gold accent on hover

5. **`src/styles/globals.css`**
   - Custom scrollbar styling
   - Keyframe animations: `slideIn`, `stackBadgePop`

---

## 🎯 Visual States

### State 1: Stack Indicator (Default)

**Single Pin:**
- Standard circular marker (artist avatar or event icon)
- Subtle shadow for depth

**Multiple Pins:**
- Same marker style as primary pin
- Gold badge at top-right with count number
- Enhanced depth shadow (layered effect)
- Badge animates in with "pop" spring physics

**Colors:**
- Badge Background: Gold accent (#F5C647 dark / #CD9C26 light)
- Badge Text: Accent foreground (dark text on light badge)
- Badge Border: 2px background color for separation

---

### State 2: Expanded List (Click)

**Desktop Behavior:**
- Opens on click (toggle behavior)
- Floats above marker with 16px offset
- Closes when clicking outside the list
- Closes when selecting an item

**Mobile Behavior:**
- Opens on tap in bottom sheet
- Backdrop overlay for focus
- Swipe down to dismiss
- Uses existing shadcn/ui Sheet component

**List Design:**
- Width: 280px
- Max Height: 320px (~4 items visible)
- Background: Card color with border
- Rounded: 12px
- Shadow: `shadow-elegant-lg` (light) / border only (dark)
- Arrow pointer for desktop popover

**List Items:**
- 56x56px thumbnail (rounded 8px)
- Artist: avatar with gold border on hover
- Event: emoji badge with blue theme
- Name: Semibold, changes to gold on hover
- Subtitle: Style or type in muted color
- Arrow indicator on right
- Hover state: Secondary background tint

---

## ⚡ Animations

### Badge Pop-In
```css
@keyframes stackBadgePop {
  0%: scale(0.5), opacity 0
  50%: scale(1.1) /* overshoot */
  100%: scale(1), opacity 1
}
```
- Duration: 400ms
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` - spring overshoot

### List Slide-In
```css
@keyframes slideIn {
  from: translateY(-8px), opacity 0
  to: translateY(0), opacity 1
}
```
- Duration: 300ms per item
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` - smooth deceleration
- Stagger: 50ms delay between items (cascading effect)

### Marker Scale
- Hover: `scale(1.05)`
- List open: `scale(1.1)`
- Transition: 200ms ease

---

## 🔧 Technical Implementation

### Pin Grouping Algorithm

```typescript
// Groups pins by exact coordinates
const pinGroups = groupPinsByLocation(pins);

// Groups have this structure:
interface PinGroup {
  latitude: number;
  longitude: number;
  pins: MapPinDTO[];
  isStack: boolean; // true if pins.length > 1
}
```

### Mobile Detection

```typescript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

### Z-Index Layering

```typescript
const Z_LAYERS = {
  mapBase: 0,
  markers: 10,
  stackIndicator: 15,
  hoverList: 20,      // Desktop popover
  mobileSheet: 30      // Mobile bottom sheet
}
```

---

## 🎨 Design System Integration

### Colors Used

**Gold Accent (Stack Badge):**
- Light: `hsl(42, 68%, 48%)` - #CD9C26 "Antique Wheat"
- Dark: `hsl(45, 90%, 60%)` - #F5C647 "Luminous Amber"

**List Background:**
- Light: `hsl(0, 0%, 100%)` - #FFFFFF with elegant shadow
- Dark: `hsl(240, 4%, 16%)` - #27272A with border

**Hover States:**
- Secondary background: `hsl(30, 20%, 96%)` light / `hsl(240, 4%, 20%)` dark
- Text accent: Gold on hover
- Border accent: Gold on thumbnail hover

### Typography

- **Names:** Manrope Semibold, 14px, foreground color
- **Subtitles:** Manrope Regular, 12px, muted-foreground
- **Badge Count:** Bold, 10px, accent-foreground

### Shadows

- **Light Mode:** `shadow-elegant-lg` for list
- **Dark Mode:** 1px border instead of shadow (as per design system)
- **Marker:** Custom drop-shadow filter for depth

---

## 🔄 User Interactions

### Desktop Flow

1. **Idle State:** Marker visible with badge if stacked
2. **Click Stack:** Marker scales up, list appears
3. **List Appears:** Slides down with fade-in, items cascade in
4. **Item Hover:** Background tint, gold text, gold borders
5. **Item Click:** Triggers `onPinClick`, closes list, navigates
6. **Click Outside:** Clicking anywhere outside the list closes it
7. **Click Marker Again:** Toggles list closed

### Mobile Flow

1. **Idle State:** Marker visible with badge if stacked
2. **Tap Stack:** Opens bottom sheet with backdrop
3. **Sheet Slides Up:** From bottom of screen
4. **Items Cascade:** Same animation as desktop
5. **Item Tap:** Triggers `onPinClick`, closes sheet, navigates
6. **Swipe Down or Backdrop Tap:** Dismisses sheet

### Single Pin (No Stack)

- **Desktop:** Direct click triggers `onPinClick`
- **Mobile:** Direct tap triggers `onPinClick`
- No list shown, no badge shown

---

## 🎁 Premium Details

### The "Golden Thread" Philosophy
- Badge color uses gold sparingly for impact
- Only appears when truly needed (stacks)
- Creates visual hierarchy and importance

### Smooth Physics
- Spring overshoot on badge (playful premium feel)
- Smooth deceleration on list (no abruptness)
- Stagger effect creates "unfolding deck" metaphor

### Custom Scrollbar
- Slim 4px width (unobtrusive)
- Gold thumb color (brand consistency)
- Transparent track (clean aesthetic)

### Depth Layering
- Multiple drop-shadows for 3D stack effect
- Proper z-index management prevents overlap issues
- Arrow pointer grounds desktop popover

---

## 🧪 Testing Checklist

- [x] Single pins work correctly (direct click)
- [x] Stacked pins show badge with correct count
- [x] Desktop hover shows popover with delay
- [x] Mobile tap opens bottom sheet
- [x] List items cascade in with stagger
- [x] Hover states work (gold accents, background)
- [x] Clicking list item navigates correctly
- [x] List closes properly on mouse leave (desktop)
- [x] Sheet dismisses on swipe/backdrop (mobile)
- [x] Animations are smooth and match design
- [x] Custom scrollbar appears when needed
- [x] Works in both light and dark themes
- [x] Z-index layering prevents overlap issues

---

## 🚀 Future Enhancements

### Possible Improvements

1. **Priority Sorting:** Show most important pin first (featured artists, upcoming events)
2. **Search/Filter:** Quick search within stack list if many items
3. **Pin Preview:** Show thumbnail preview on badge hover (tooltip)
4. **Cluster by Proximity:** Group nearby pins (not just exact coordinates) at lower zoom levels
5. **Animation Options:** User preference for reduced motion
6. **Keyboard Navigation:** Tab through list items for accessibility
7. **Voice Over Support:** Enhanced ARIA labels for screen readers

---

## 📚 References

- **Design System:** `/DESIGN_SYSTEM.md` - Heritage Modern palette and principles
- **MapLibre GL:** [react-map-gl documentation](https://visgl.github.io/react-map-gl/)
- **Shadcn/ui Sheet:** [Sheet component docs](https://ui.shadcn.com/docs/components/sheet)
- **Animation Curves:** [cubic-bezier.com](https://cubic-bezier.com)

---

**Version:** 1.0  
**Last Updated:** December 24, 2025  
**Design Pattern:** "Stacked Elegance" for Наші Platform
