# SVG Transform Explanation

## How SVG Transforms Work

SVG transforms are applied **right to left** (the last transform is applied first).

### Current Transform: `translate(20, 20) scale(0.85)`

This means:
1. First: Scale by 0.85 (makes everything 85% smaller)
2. Then: Translate by (20, 20) (moves 20px right, 20px down)

## Understanding the Material Icon Coordinates

The Material icon path uses coordinates where:
- **X-axis**: 0 to 960 (centered at 480)
- **Y-axis**: -960 to 0 (centered at -480, but after `translate(0, 960)` becomes centered at 480)

## How to Center Properly

### Step 1: Coordinate System Translation
The Material icon's Y-axis goes from -960 to 0. Our viewBox is 0 to 960.
- `translate(0, 960)` moves the Y coordinate system: -960 → 0, 0 → 960

### Step 2: Scaling
- `scale(0.85)` makes the icon 85% of its original size
- Original size: 960 × 960
- Scaled size: 816 × 816 (960 × 0.85)

### Step 3: Centering Calculation
To center an 816×816 icon in a 960×960 viewBox:
- Padding needed: (960 - 816) / 2 = 72 pixels on each side
- Center point: (480, 480)

### Correct Transform for Centering

```svg
<g transform="translate(480, 480) scale(0.85) translate(0, 960)">
```

This means:
1. Translate to center (480, 480)
2. Scale to 0.85
3. Translate Material icon Y-coordinates (0, 960)

OR simpler approach:

```svg
<g transform="translate(0, 960) scale(0.85) translate(72, 72)">
```

This means:
1. Translate Material icon Y-coordinates (0, 960)
2. Scale to 0.85
3. Translate to add padding (72, 72) to center it

## Visual Guide

```
ViewBox: 0,0 to 960,960
Center: (480, 480)

After scale(0.85):
  Icon size: 816 × 816
  Padding: 72px on each side
  
To center:
  translate(72, 72) - adds padding from top-left
  OR
  translate(480, 480) - centers at viewBox center, then adjust
```

## Testing Centering

To verify centering, you can:
1. Add a temporary rectangle to see bounds:
   ```svg
   <rect x="0" y="0" width="960" height="960" fill="none" stroke="red" stroke-width="2"/>
   ```

2. Check if icon extends beyond viewBox edges
3. Adjust translate values until icon is centered

