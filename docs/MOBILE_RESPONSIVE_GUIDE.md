# Mobile-First Responsive Design Guide

## Overview
This document outlines the mobile-first responsive design improvements implemented across the Nashi frontend application. The changes follow Apple's Human Interface Guidelines and modern web best practices for touch-optimized, mobile-first interfaces.

---

## 🎯 Key Improvements

### 1. **Dynamic Viewport Height (100dvh)**
**Problem:** On iOS Safari, the browser address bar causes layout issues with `100vh`, cutting off bottom UI elements.

**Solution:** Implemented `100dvh` (Dynamic Viewport Height) which automatically adjusts for browser chrome.

#### Implementation:
```css
/* src/styles/globals.css */
.min-h-screen-mobile {
  min-height: 100vh;
  min-height: 100dvh; /* Fallback for browsers that don't support dvh */
}

.h-screen-mobile {
  height: 100vh;
  height: 100dvh;
}
```

#### Usage:
- **Layout.tsx**: Updated root container to use `min-h-screen-mobile`
- **MapPage.tsx**: Uses inline style for dynamic viewport: `style={{ height: 'calc(100dvh - 4rem)' }}`

---

### 2. **Touch Optimization (44x44px Minimum)**
**Standard:** Apple HIG requires minimum 44x44px touch targets for optimal usability.

**Solution:** Updated all interactive elements to meet this standard.

#### Button Component (`src/components/ui/button.tsx`)
```typescript
size: {
  default: "min-h-[44px] h-11 px-4 py-2",      // 44px minimum
  sm: "min-h-[44px] h-11 rounded-md px-3",     // 44px minimum
  lg: "min-h-[44px] h-12 rounded-md px-8",     // 48px for larger
  icon: "min-h-[44px] min-w-[44px] h-11 w-11", // 44x44px square
}
```

#### Input Fields (`src/components/ui/input.tsx`)
```typescript
className: "min-h-[44px] h-11 ... touch-manipulation"
```
- Added `touch-manipulation` CSS to prevent zoom on double-tap

#### Textarea (`src/components/ui/textarea.tsx`)
```typescript
className: "min-h-[88px] ... touch-manipulation"
```
- Minimum 88px height (2x touch target for comfortable text input)

#### Sheet Close Button (`src/components/ui/sheet.tsx`)
```typescript
className: "... min-h-[44px] min-w-[44px] flex items-center justify-center"
```

---

### 3. **Fluid Typography System**
**Problem:** Fixed font sizes break on small screens, causing text overflow and poor readability.

**Solution:** Implemented `clamp()` functions for responsive typography that scales smoothly.

#### Implementation (`src/styles/globals.css`)
```css
h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem); /* 28px → 56px */
  line-height: 1.2;
}

h2 {
  font-size: clamp(1.5rem, 3vw + 0.75rem, 2.5rem); /* 24px → 40px */
  line-height: 1.3;
}

h3 {
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.875rem); /* 20px → 30px */
  line-height: 1.4;
}

h4 {
  font-size: clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem); /* 18px → 24px */
  line-height: 1.5;
}

h5 {
  font-size: clamp(1rem, 1vw + 0.5rem, 1.25rem); /* 16px → 20px */
  line-height: 1.5;
}

h6 {
  font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1.125rem); /* 14px → 18px */
  line-height: 1.5;
}
```

**How it works:**
- `clamp(MIN, PREFERRED, MAX)`
- MIN: Minimum size at smallest screens
- PREFERRED: Fluid calculation based on viewport width
- MAX: Maximum size at largest screens

---

### 4. **Mobile-First Layout Conversion**

#### Map Page Stack Layout
**Desktop:** Two-column layout (sidebar + map)
**Mobile:** Full-screen map with floating filters and bottom sheet drawer

##### MapPage.tsx Changes
```tsx
// Mobile-optimized positioning
<div className="absolute bottom-20 left-2 md:bottom-4 md:left-4 z-10 
     w-[calc(100vw-1rem)] max-w-xs md:max-w-sm">
  <MapFilters />
</div>
```

**Key improvements:**
- `bottom-20` on mobile to avoid overlap with bottom navigation (64px = 16 × 4)
- `left-2` for minimal margin on small screens
- `w-[calc(100vw-1rem)]` ensures filters fit on screen with small margin
- `max-w-xs` on mobile, `max-w-sm` on desktop

#### PinPreviewDrawer (Bottom Sheet)
**Google Maps-style bottom sheet** with:
- 85% viewport height on mobile
- Rounded top corners (`rounded-t-3xl`)
- Visual drag handle indicator
- Smooth slide-up animation

```tsx
<SheetContent 
  side="bottom" 
  className="h-[85vh] max-h-[85vh] md:h-auto md:max-h-[90vh] 
             overflow-y-auto rounded-t-3xl md:rounded-t-xl"
>
  {/* Mobile drag handle */}
  <div className="flex justify-center mb-2 md:hidden">
    <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
  </div>
  
  <SheetHeader>
    <SheetTitle className="font-heading text-2xl md:text-3xl">
      {pin.name}
    </SheetTitle>
  </SheetHeader>
  
  <div className="mt-6 space-y-4 pb-safe">
    {/* Content with safe area padding */}
  </div>
</SheetContent>
```

---

### 5. **MapFilters Mobile Optimization**

#### Responsive Adjustments (`src/features/map/components/MapFilters.tsx`)
```tsx
<div className="bg-background/95 md:bg-background/80 backdrop-blur-md 
     border border-accent/20 rounded-card p-3 md:p-4 shadow-lg">
  
  {/* More opaque on mobile for better readability */}
  {/* Tighter padding on mobile */}
  
  <Button
    variant={selectedTypes.includes('ARTIST') ? 'default' : 'outline'}
    size="sm"
    className="flex-1 min-h-[44px] text-sm"
  >
    Артисти
  </Button>
  
  <select className="w-full min-h-[44px] px-3 py-2 ... touch-manipulation">
    {/* 44px minimum for select dropdown */}
  </select>
</div>
```

**Mobile improvements:**
- `bg-background/95` (more opaque) vs `bg-background/80` on desktop
- `p-3` on mobile vs `p-4` on desktop
- `flex-1` makes buttons equal width
- `touch-manipulation` prevents double-tap zoom

---

## 📱 Responsive Breakpoints

The application uses Tailwind CSS default breakpoints:

```
sm: 640px   // Small tablets
md: 768px   // Tablets (primary mobile/desktop breakpoint)
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large desktop
```

**Mobile-first approach:** 
- Base styles are for mobile
- Use `md:` prefix for tablet/desktop overrides

---

## 🎨 Visual Enhancements

### Active State Feedback
```typescript
// Button component
className: "... active:scale-95 transition-transform"
```
- Buttons scale down slightly when pressed (95% size)
- Provides tactile feedback on touch devices

### Focus Ring Enhancement
```typescript
// Enhanced focus visibility
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```
- Increased from `ring-1` to `ring-2` for better visibility
- Added `ring-offset-2` for better contrast

---

## 🧪 Testing Checklist

### Mobile Device Testing
- [ ] iPhone SE (smallest iPhone) - 375×667px
- [ ] iPhone 12/13/14 Pro - 390×844px
- [ ] iPhone 14 Pro Max - 430×932px
- [ ] Android (Samsung Galaxy S21) - 360×800px
- [ ] iPad Mini - 744×1133px
- [ ] iPad Pro - 1024×1366px

### Browser Testing
- [ ] iOS Safari (most important!)
- [ ] Chrome Mobile
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Interaction Testing
- [ ] All buttons are easily tappable (no accidental taps)
- [ ] Input fields don't zoom on focus
- [ ] Bottom sheet slides smoothly
- [ ] Map filters don't overlap navigation
- [ ] Typography is readable at all sizes
- [ ] No horizontal scrolling

### iOS Safari Specific
- [ ] Address bar hide/show doesn't break layout
- [ ] Safe area (notch) is respected
- [ ] Home indicator area doesn't overlap content

---

## 🛠️ Development Guidelines

### Adding New Interactive Elements
Always ensure:
```tsx
// Minimum touch target size
className="min-h-[44px] min-w-[44px]"

// Touch optimization
className="touch-manipulation"

// Active state feedback
className="active:scale-95 transition-transform"

// Enhanced focus ring
className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### Responsive Spacing
Follow mobile-first pattern:
```tsx
// Mobile: small padding, Desktop: larger padding
className="p-3 md:p-6"

// Mobile: bottom nav clearance, Desktop: no clearance
className="pb-20 md:pb-0"
```

### Typography
Use semantic HTML headings (h1-h6) - they automatically scale with fluid typography:
```tsx
<h1>Main Heading</h1>  // Auto-scales 28px → 56px
<h2>Section</h2>       // Auto-scales 24px → 40px
<h3>Subsection</h3>    // Auto-scales 20px → 30px
```

---

## 📊 Performance Considerations

### CSS Properties Used
- `backdrop-blur-md`: Use sparingly, can impact performance
- `touch-manipulation`: Improves scroll performance
- `will-change`: Avoid unless necessary (already optimized in animations)

### Image Optimization
- Use responsive images with `srcset`
- Lazy load images below the fold
- Compress images (WebP format recommended)

---

## 🔧 Troubleshooting

### Layout Issues on iOS Safari
**Problem:** Bottom content cut off
**Solution:** Use `100dvh` instead of `100vh`

### Touch Targets Too Small
**Problem:** Users miss buttons
**Solution:** Ensure `min-h-[44px] min-w-[44px]`

### Text Overflow on Mobile
**Problem:** Long text breaks layout
**Solution:** Use fluid typography with `clamp()`

### Double-Tap Zoom on Input Focus
**Problem:** Browser zooms in on input focus
**Solution:** Add `touch-manipulation` class

---

## 📚 Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Touch Targets](https://m3.material.io/foundations/interaction/3d-space/position)
- [MDN: Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [CSS-Tricks: clamp()](https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/)
- [Web.dev: Safe Area Insets](https://web.dev/building-a-pwa-at-google-part-2/#safe-areas)

---

## 🎉 Summary of Changes

### Files Modified
1. ✅ `src/styles/globals.css` - Fluid typography + viewport helpers
2. ✅ `src/components/ui/button.tsx` - 44px touch targets + active states
3. ✅ `src/components/ui/input.tsx` - 44px height + touch optimization
4. ✅ `src/components/ui/textarea.tsx` - 88px height + touch optimization
5. ✅ `src/components/ui/sheet.tsx` - 44px close button
6. ✅ `src/components/layout/Layout.tsx` - Dynamic viewport height
7. ✅ `src/pages/MapPage.tsx` - Mobile-optimized layout + dvh
8. ✅ `src/features/map/components/MapFilters.tsx` - Responsive filters
9. ✅ `src/features/map/components/PinPreviewDrawer.tsx` - Bottom sheet UX

### Impact
- ✅ **Touch Optimization:** All interactive elements meet 44×44px minimum
- ✅ **Viewport Management:** iOS Safari address bar no longer cuts off content
- ✅ **Typography:** Fluid scaling prevents text overflow on all screen sizes
- ✅ **Layout:** Full mobile-first stack layout with Google Maps-style bottom sheet
- ✅ **Accessibility:** Enhanced focus rings and active states
- ✅ **Performance:** Touch manipulation CSS prevents unnecessary delays

---

**Last Updated:** December 27, 2025
**Author:** Senior Frontend Engineer & UI/UX Designer
**Version:** 1.0.0
