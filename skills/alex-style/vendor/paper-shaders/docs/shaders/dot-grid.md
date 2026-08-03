> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Dot Grid

> Static grid pattern with circles, diamonds, squares or triangles

Static grid pattern made of circles, diamonds, squares or triangles. Features customizable size, spacing, stroke width, and random variations.

## React Usage

```tsx theme={null}
import { DotGrid } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <DotGrid
      colorBack="#000000"
      colorFill="#ffffff"
      colorStroke="#ffaa00"
      size={2}
      gapX={32}
      gapY={32}
      strokeWidth={0}
      sizeRange={0}
      opacityRange={0}
      shape="circle"
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountDotGrid } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountDotGrid(canvas, {
  colorBack: '#000000',
  colorFill: '#ffffff',
  colorStroke: '#ffaa00',
  size: 2,
  gapX: 32,
  gapY: 32,
  strokeWidth: 0,
  sizeRange: 0,
  opacityRange: 0,
  shape: 'circle',
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format.
</ParamField>

<ParamField path="colorFill" type="string" default="'#ffffff'">
  Shape fill color in hex format.
</ParamField>

<ParamField path="colorStroke" type="string" default="'#ffaa00'">
  Shape stroke color in hex format.
</ParamField>

<ParamField path="size" type="number" default="2">
  Base size of each shape in pixels. Range: 1 to 100.
</ParamField>

<ParamField path="gapX" type="number" default="32">
  Pattern horizontal spacing in pixels. Range: 2 to 500.
</ParamField>

<ParamField path="gapY" type="number" default="32">
  Pattern vertical spacing in pixels. Range: 2 to 500.
</ParamField>

<ParamField path="strokeWidth" type="number" default="0">
  Outline stroke width in pixels. Range: 0 to 50.
</ParamField>

<ParamField path="sizeRange" type="number" default="0">
  Random variation in shape size. 0 creates uniform sizes, higher values add randomness up to base size. Range: 0 to 1.
</ParamField>

<ParamField path="opacityRange" type="number" default="0">
  Random variation in shape opacity. 0 makes all shapes opaque, higher values add semi-transparency. Range: 0 to 1.
</ParamField>

<ParamField path="shape" type="'circle' | 'diamond' | 'square' | 'triangle'" default="'circle'">
  Shape type for the dots:

  * `circle`: Round dots
  * `diamond`: 45-degree rotated squares
  * `square`: Square dots
  * `triangle`: Triangular dots
</ParamField>

### Common Sizing Parameters

<ParamField path="scale" type="number" default="1">
  Overall zoom level of the graphics. Range: 0.01 to 4.
</ParamField>

<ParamField path="rotation" type="number" default="0">
  Rotation angle in degrees. Range: 0 to 360.
</ParamField>

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'contain'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="offsetX" type="number" default="0">
  Horizontal offset of the graphics center. Range: -1 to 1.
</ParamField>

<ParamField path="offsetY" type="number" default="0">
  Vertical offset of the graphics center. Range: -1 to 1.
</ParamField>

## Presets

The Dot Grid shader comes with several built-in presets:

* **Default**: White circles with orange stroke
* **Triangles**: Gray outlined triangles
* **Tree line**: Random sized green circles in vertical rows
* **Wallpaper**: Gold outlined diamonds on green

```tsx theme={null}
import { DotGrid, treeLinePreset } from '@paper-design/shaders-react';

<DotGrid {...treeLinePreset.params} />
```

## Notes

* This shader is static and does not animate
* Supports higher resolution rendering (up to 6016×3384 pixels)
* Use `sizeRange` and `opacityRange` to create organic, hand-drawn effects
