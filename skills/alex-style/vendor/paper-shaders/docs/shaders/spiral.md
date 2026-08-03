> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Spiral

> Single-colored animated spiral with morphing shapes

A single-colored animated spiral that morphs across a wide range of shapes - from crisp, thin-lined geometry to flowing whirlpool forms and wavy, abstract rings.

## React Usage

```tsx theme={null}
import { Spiral } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <Spiral
      colorBack="#001429"
      colorFront="#79D1FF"
      density={1}
      distortion={0}
      strokeWidth={0.5}
      strokeTaper={0}
      strokeCap={0}
      speed={1}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountSpiral } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountSpiral(canvas, {
  colorBack: '#001429',
  colorFront: '#79D1FF',
  density: 1,
  distortion: 0,
  strokeWidth: 0.5,
  strokeTaper: 0,
  strokeCap: 0,
  speed: 1,
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colorBack" type="string" default="'#001429'">
  Background color in hex format.
</ParamField>

<ParamField path="colorFront" type="string" default="'#79D1FF'">
  Foreground (spiral) color in hex format.
</ParamField>

<ParamField path="density" type="number" default="1">
  Spacing falloff simulating perspective. 0 creates a flat spiral. Range: 0 to 1.
</ParamField>

<ParamField path="distortion" type="number" default="0">
  Power of shape distortion applied along the spiral. Range: 0 to 1.
</ParamField>

<ParamField path="strokeWidth" type="number" default="0.5">
  Thickness of the spiral curve. Range: 0 to 1.
</ParamField>

<ParamField path="strokeTaper" type="number" default="0">
  How much the stroke loses width away from center. 0 maintains full visibility. Range: 0 to 1.
</ParamField>

<ParamField path="strokeCap" type="number" default="0">
  Extra stroke width at the center. No effect when strokeWidth is 0.5. Range: 0 to 1.
</ParamField>

<ParamField path="noise" type="number" default="0">
  Noise distortion applied over the canvas. No effect when noiseFrequency is 0. Range: 0 to 1.
</ParamField>

<ParamField path="noiseFrequency" type="number" default="0">
  Frequency of noise distortion. No effect when noise is 0. Range: 0 to 1.
</ParamField>

<ParamField path="softness" type="number" default="0">
  Color transition sharpness. 0 creates hard edges, 1 creates smooth gradients. Range: 0 to 1.
</ParamField>

<ParamField path="speed" type="number" default="1">
  Animation speed multiplier. Set to 0 to pause animation.
</ParamField>

<ParamField path="frame" type="number" default="0">
  Specific frame to display when speed is 0.
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

The Spiral shader comes with several built-in presets:

* **Default**: Clean blue spiral on dark background
* **Droplet**: Pink noisy spiral with tapered stroke
* **Jungle**: Green organic spiral with heavy noise
* **Swirl**: Navy blue smooth whirlpool

```tsx theme={null}
import { Spiral, junglePreset } from '@paper-design/shaders-react';

<Spiral {...junglePreset.params} />
```
