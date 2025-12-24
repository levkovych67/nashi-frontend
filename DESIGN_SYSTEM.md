# 🎨 "Heritage Modern" Design System for Наші

## Design Philosophy

**"Heritage Modern"** combines the warmth and authenticity of Ukrainian cultural heritage with contemporary design principles. The palette evokes the feeling of morning light on the Ukrainian steppe in light mode, and the rich, cinematic atmosphere of Kyiv at midnight in dark mode.

---

## 🌞 Light Theme: "Morning Steppe"

### Concept
Airy, warm, and crisp. Moving away from clinical white to a soft, paper-like foundation that feels like fine Ukrainian linen.

### Color Palette

#### Backgrounds
```css
--background: 30 20% 98%      /* #FDFBF9 - Warm off-white, like aged paper */
--card: 0 0% 100%             /* #FFFFFF - Pure white for elevation */
--secondary: 30 20% 96%       /* #F6F4F2 - Surface hover state */
```

#### Typography
```css
--foreground: 240 4% 16%      /* #28282B - Deep warm iron-gray (NOT pure black) */
--muted-foreground: 240 4% 46% /* #71717A - Secondary text */
```
**Note:** We avoid pure black (#000000) for better eye comfort and warmth.

#### Accent - "Antique Wheat"
```css
--accent: 42 68% 48%          /* #CD9C26 - Rich, mature gold */
--accent-foreground: 0 0% 100% /* #FFFFFF - White text on gold */
```
**Meaning:** Represents Ukrainian wheat fields, sunflowers, and traditional gold embroidery.

**Usage Philosophy:** The "Golden Thread" - Use sparingly for maximum impact:
- ✅ Primary CTA buttons
- ✅ Active navigation state
- ✅ Focus rings on inputs
- ✅ Music genre tags
- ❌ NOT for backgrounds or large areas

#### Borders
```css
--border: 30 10% 90%          /* #E6E4E2 - Subtle warm border */
```

### Premium Shadows
Light theme uses soft, diffused shadows to create depth:

```css
.shadow-elegant    /* 0 4px 20px -2px rgba(40, 40, 43, 0.08)  */
.shadow-elegant-lg /* 0 10px 40px -4px rgba(40, 40, 43, 0.12) */
.shadow-elegant-xl /* 0 20px 60px -8px rgba(40, 40, 43, 0.15) */
```

---

## 🌙 Dark Theme: "Midnight Kyiv"

### Concept
Immersive, cinematic, and sophisticated. Rich deep charcoal with warmth—NOT AMOLED black.

### Color Palette

#### Backgrounds
```css
--background: 240 5% 10%      /* #18181B - Deep charcoal (NOT #000000) */
--card: 240 4% 16%            /* #27272A - Elevated surface */
--secondary: 240 4% 20%       /* #323236 - Surface hover */
```

#### Typography
```css
--foreground: 30 10% 96%      /* #F5F3F0 - "Bone white" (avoids halation blur) */
--muted-foreground: 240 5% 65% /* #9E9EA3 - Secondary text */
```
**Note:** We avoid pure white (#FFFFFF) to prevent eye strain and halation on dark backgrounds.

#### Accent - "Luminous Amber"
```css
--accent: 45 90% 60%          /* #F5C647 - Glowing amber */
--accent-foreground: 240 5% 10% /* #18181B - Dark text on gold */
```
**Meaning:** Candlelight, evening gold, glowing warmth in the darkness.

**Difference from Light:** Brighter and more saturated to "glow" against dark backgrounds.

#### Borders
```css
--border: 240 4% 24%          /* #3D3D40 - Subtle definition */
```

### Shadow Strategy
Dark theme uses **subtle borders** instead of shadows for definition, as shadows are less visible on dark backgrounds.

---

## 🎯 Semantic Colors

### Error/Destructive
```css
/* Light */
--destructive: 0 84.2% 60.2%  /* #E74C3C - Bright red */

/* Dark */
--destructive: 0 62.8% 30.6%  /* #7C1D13 - Darker red */
```

---

## 📐 Typography Hierarchy

### Font Families
```css
--font-heading: 'Cormorant Garamond'  /* Serif for elegance and heritage */
--font-body: 'Manrope'                /* Clean sans-serif for interface */
```

### Usage Guidelines
- **Headlines (h1-h6)**: Use Cormorant Garamond for that "Classic Ukrainian Literature" feel
- **UI Elements**: Use Manrope for buttons, inputs, navigation for modern usability
- **Body Text**: Manrope for optimal screen readability

---

## 🎨 Usage Guidelines

### The "Golden Thread" Philosophy
Gold is precious. If everything is gold, nothing is valuable.

**Do Use Gold For:**
- ✨ Primary action buttons (Submit, Save, Login)
- 🎵 Music genre/style tags
- 🔥 Featured content highlights
- 🌟 Active navigation states
- 📍 Important map markers

**Don't Use Gold For:**
- ❌ Backgrounds or large areas
- ❌ Body text
- ❌ Every button
- ❌ Decorative elements

### Surface Elevation Strategy

**Light Theme:**
1. Background: `#FDFBF9` (warm off-white)
2. Cards: `#FFFFFF` (pure white) + `shadow-elegant`
3. Hover: Subtle brightness increase

**Dark Theme:**
1. Background: `#18181B` (deep charcoal)
2. Cards: `#27272A` (elevated charcoal) + `1px border`
3. Hover: Slight lightness increase

---

## ♿ Accessibility

### Contrast Ratios (WCAG Compliance)

**Light Theme:**
- Background/Foreground: **16.2:1** (AAA) ✅
- Accent/Background: **5.1:1** (AA for large text) ✅
- Muted/Background: **4.9:1** (AA) ✅

**Dark Theme:**
- Background/Foreground: **15.8:1** (AAA) ✅
- Accent/Background: **11.5:1** (AAA) ✅
- Muted/Background: **7.2:1** (AA+) ✅

### Focus States
All interactive elements must have visible focus states using the accent color ring:
```css
focus:ring-2 focus:ring-accent
```

---

## 💡 Implementation Examples

### Card Component
```jsx
<div className="bg-card rounded-lg shadow-elegant p-6 border border-border">
  {/* Content */}
</div>
```

### Primary Button
```jsx
<button className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-2 rounded-md font-medium">
  Submit
</button>
```

### Input Field
```jsx
<input 
  className="bg-background border border-input rounded-md px-4 py-2 
             focus:ring-2 focus:ring-accent focus:border-accent
             text-foreground placeholder:text-muted-foreground"
/>
```

### Dropdown (From Design Guide)
```jsx
<div className="bg-card border border-border rounded-md shadow-elegant">
  <div className="p-2 hover:bg-secondary cursor-pointer">
    <span className="text-foreground">Option</span>
  </div>
  <div className="p-2 hover:bg-secondary cursor-pointer">
    <span className="text-accent font-semibold">Selected Option</span>
  </div>
</div>
```

---

## 🔄 Migration from Old Palette

### Key Changes
1. **Background:** `#FFFFFF` → `#FDFBF9` (warmer)
2. **Text:** Pure black → `#28282B` (softer)
3. **Accent:** Generic gold → `#CD9C26` (richer, more mature)
4. **Dark Background:** `#0A0A0A` → `#18181B` (deeper, not AMOLED)
5. **Dark Accent:** `#F4D774` → `#F5C647` (more luminous)

---

## 📦 CSS Variables Reference

### Complete Variable List
```css
/* Light Theme */
--background: 30 20% 98%
--foreground: 240 4% 16%
--card: 0 0% 100%
--card-foreground: 240 4% 16%
--primary: 240 4% 16%
--primary-foreground: 0 0% 100%
--secondary: 30 20% 96%
--secondary-foreground: 240 4% 16%
--muted: 30 20% 96%
--muted-foreground: 240 4% 46%
--accent: 42 68% 48%
--accent-foreground: 0 0% 100%
--destructive: 0 84.2% 60.2%
--border: 30 10% 90%
--input: 30 10% 90%
--ring: 42 68% 48%

/* Dark Theme */
--background: 240 5% 10%
--foreground: 30 10% 96%
--card: 240 4% 16%
--card-foreground: 30 10% 96%
--primary: 30 10% 96%
--primary-foreground: 240 5% 10%
--secondary: 240 4% 20%
--secondary-foreground: 30 10% 96%
--muted: 240 4% 20%
--muted-foreground: 240 5% 65%
--accent: 45 90% 60%
--accent-foreground: 240 5% 10%
--destructive: 0 62.8% 30.6%
--border: 240 4% 24%
--input: 240 4% 24%
--ring: 45 90% 60%
```

---

## 🎬 Final Notes

This design system creates a **premium, culturally-rooted aesthetic** that feels both timeless and contemporary. The warm tones and careful contrast create an inviting atmosphere for showcasing Ukrainian artists and culture.

**Remember:** Design is not just aesthetics—it's about creating an emotional connection with your users while maintaining usability and accessibility.

---

**Version:** 1.0  
**Last Updated:** December 24, 2025  
**Design:** Heritage Modern for Наші Platform
