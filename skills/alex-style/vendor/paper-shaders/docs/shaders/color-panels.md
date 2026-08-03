> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Color Panels

> Pseudo-3D semi-transparent panels rotating around a central axis

Pseudo-3D semi-transparent panels rotating around a central axis. Supports up to 7 colors with adjustable density, skew angles, panel length, and gradient effects.

## React Usage

```tsx theme={null}
import { ColorPanels } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <ColorPanels
      colors={['#ff9d00', '#fd4f30', '#809bff', '#6d2eff', '#333aff', '#f15cff', '#ffd557']}
      colorBack="#000000"
      angle1={0}
      angle2={0}
      length={1.1}
      edges={false}
      blur={0}
      fadeIn={1}
      fadeOut={0.3}
      gradient={0}
      density={3}
      speed={0.5}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountColorPanels } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountColorPanels(canvas, {
  colors: ['#ff9d00', '#fd4f30', '#809bff', '#6d2eff', '#333aff', '#f15cff', '#ffd557'],
  colorBack: '#000000',
  angle1: 0,
  angle2: 0,
  length: 1.1,
  edges: false,
  blur: 0,
  fadeIn: 1,
  fadeOut: 0.3,
  gradient: 0,
  density: 3,
  speed: 0.5,
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colors" type="string[]" default="['#ff9d00', '#fd4f30', '#809bff', '#6d2eff', '#333aff', '#f15cff', '#ffd557']">
  Array of up to 7 RGBA colors used to color the panels.
</ParamField>

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format.
</ParamField>

<ParamField path="density" type="number" default="3">
  Angle between every 2 panels. Lower values create more densely packed panels. Range: 0.25 to 7.
</ParamField>

<ParamField path="angle1" type="number" default="0">
  Skew angle applied to left side of all panels. Creates perspective distortion. Range: -1 to 1.
</ParamField>

<ParamField path="angle2" type="number" default="0">
  Skew angle applied to right side of all panels. Creates perspective distortion. Range: -1 to 1.
</ParamField>

<ParamField path="length" type="number" default="1.1">
  Panel length relative to total height. Range: 0 to 3.
</ParamField>

<ParamField path="edges" type="boolean" default="false">
  Whether to show color highlights on panel edges for glass-like effect.
</ParamField>

<ParamField path="blur" type="number" default="0">
  Side blur amount. 0 creates sharp edges. Range: 0 to 0.5.
</ParamField>

<ParamField path="fadeIn" type="number" default="1">
  Transparency near central axis. Higher values make center more transparent. Range: 0 to 1.
</ParamField>

<ParamField path="fadeOut" type="number" default="0.3">
  Transparency near viewer. Higher values make foreground more transparent. Range: 0 to 1.
</ParamField>

<ParamField path="gradient" type="number" default="0">
  Color mixing within a panel. 0 creates solid colors, 1 creates gradients. Range: 0 to 1.
</ParamField>

<ParamField path="speed" type="number" default="0.5">
  Animation speed multiplier. Set to 0 to pause animation.
</ParamField>

<ParamField path="frame" type="number" default="0">
  Specific frame to display when speed is 0.
</ParamField>

### Common Sizing Parameters

<ParamField path="scale" type="number" default="0.8">
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

The Color Panels shader comes with several built-in presets:

* **Default**: Seven rainbow colors rotating slowly
* **Glass**: Four colors with edge highlights and blur
* **Gradient**: Soft gradient panels with high fadeOut
* **Opening**: Cyan panels opening like a camera iris

```tsx theme={null}
import { ColorPanels, glassPreset } from '@paper-design/shaders-react';

<ColorPanels {...glassPreset.params} />
```

## Notes

* The number of colors affects the panel arrangement:
  * 3 colors: 12 panels
  * 4 colors: 16 panels
  * 5 colors: 20 panels
  * 7 colors: 14 panels
* Use `edges={true}` with `blur` for a frosted glass effect
* Negative `angle1` and `angle2` values create an opening iris effect
* Combine `gradient={1}` with `fadeOut` for soft, ethereal transitions
