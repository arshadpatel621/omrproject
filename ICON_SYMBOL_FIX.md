# IconSymbol Error Fix

## Issue
The app was throwing a `ReferenceError: Property 'IconSymbol' doesn't exist` error because the `IconSymbol` component wasn't properly imported in some pages.

## Fixes Applied

### 1. Added Missing Imports
- **Results page**: Added `import { IconSymbol } from '@/components/ui/icon-symbol';`
- **Upload page**: Added `import { IconSymbol } from '@/components/ui/icon-symbol';`
- **Exam Details page**: Already had the import ✅
- **Home page**: Already had the import ✅

### 2. Enhanced Icon Mappings
Updated the `MAPPING` object in `components/ui/icon-symbol.tsx` to include all SF Symbol names used in the app:

```typescript
const MAPPING = {
  // Basic navigation
  'house.fill': 'home',
  'house': 'home',
  
  // Tab navigation icons
  'square.and.arrow.up': 'file-upload',
  'square.and.arrow.up.fill': 'file-upload',
  'gearshape.2.fill': 'admin-panel-settings',
  'gearshape.2': 'settings',
  'chart.bar.fill': 'bar-chart',
  'chart.bar': 'bar-chart',
  'person.2.fill': 'school',
  'person.2': 'school',
  
  // Document and text icons
  'doc.text.fill': 'description',
  'doc.text': 'description',
  'text.alignleft': 'format-align-left',
  
  // UI and form icons
  'info.circle.fill': 'info',
  'number.circle.fill': 'looks-one',
  'checkmark.circle.fill': 'check-circle',
  'checkmark.circle': 'check-circle-outline',
  'person.circle.fill': 'account-circle',
  'gearshape.fill': 'settings',
  'clock.fill': 'access-time',
  'clock': 'schedule',
  
  // Chart and analytics icons
  'chart.line.uptrend.xyaxis': 'trending-up',
  'trophy.fill': 'emoji-events',
  'person.3.fill': 'group',
}
```

### 3. iOS SF Symbol Mappings
Updated the iOS version (`components/ui/icon-symbol.ios.tsx`) with proper SF Symbol mappings:

```typescript
const SF_SYMBOL_MAPPING: Record<string, string> = {
  'chart.line.uptrend.xyaxis': 'chart.xyaxis.line',
  'trophy.fill': 'trophy.fill',
  'person.3.fill': 'person.3.fill',
  // ... other mappings
};
```

## Result
The `IconSymbol` component now properly renders on both iOS (using SF Symbols) and Android/Web (using Material Icons) with all the icons used throughout the app.

## Icons Used in the App
- **Dashboard**: chart.line.uptrend.xyaxis, doc.text.fill, clock.fill, checkmark.circle.fill, chart.bar.fill, square.and.arrow.up.fill
- **Exam Details**: doc.text.fill, info.circle.fill, number.circle.fill, text.alignleft, checkmark.circle.fill
- **Upload**: gearshape.fill  
- **Results**: chart.bar.fill, trophy.fill, chart.line.uptrend.xyaxis, person.3.fill

All these icons are now properly mapped and should render correctly across all platforms.