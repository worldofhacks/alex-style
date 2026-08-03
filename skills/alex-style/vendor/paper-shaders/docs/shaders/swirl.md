> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Swirl

> Animated bands of color twisting and bending

Animated bands of color twisting and bending, producing spirals, arcs, and flowing circular patterns. Supports up to 10 colors with adjustable twist, center, and noise distortion.

## React Usage

```tsx theme={null}
import { Swirl } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <Swirl
      colorBack="#330000"
      colors={['#ffd1d1', '#ff8a8a', '#660000']}
      bandCount={4}
      twist={0.1}
      center={0.2}
      proportion={0.5}
      softness={0}
      speed={0.32}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountSwirl } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountSwirl(canvas, {
  colorBack: '#330000',
  colors: ['#ffd1d1', '#ff8a8a', '#660000'],
  bandCount: 4,
  twist: 0.1,
  center: 0.2,
  proportion: 0.5,
  softness: 0,
  speed: 0.32,
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colorBack" type="string" default="'#330000'">
  Background color in hex format.
</ParamField>

<ParamField path="colors" type="string[]" default="['#ffd1d1', '#ff8a8a', '#660000']">
  Array of up to 10 stripe colors in hex format.
</ParamField>

<ParamField path="bandCount" type="number" default="4">
  Number of color bands. Set to 0 for concentric ripples. Range: 0 to 15.
</ParamField>

<ParamField path="twist" type="number" default="0.1">
  Vortex power controlling the spiral effect. 0 creates straight sectoral shapes. Range: 0 to 1.
</ParamField>

<ParamField path="center" type="number" default="0.2">
  Distance from the center where swirl colors begin to appear. Range: 0 to 1.
</ParamField>

<ParamField path="proportion" type="number" default="0.5">
  Blend point between colors, where 0.5 equals equal distribution. Range: 0 to 1.
</ParamField>

<ParamField path="softness" type="number" default="0">
  Color transition sharpness. 0 creates hard edges, 1 creates smooth gradients. Range: 0 to 1.
</ParamField>

<ParamField path="noise" type="number" default="0.2">
  Strength of noise distortion. No effect when noiseFrequency is 0. Range: 0 to 1.
</ParamField>

<ParamField path="noiseFrequency" type="number" default="0.4">
  Frequency of noise distortion. No effect when noise is 0. Range: 0 to 1.
</ParamField>

<ParamField path="speed" type="number" default="0.32">
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

The Swirl shader comes with several built-in presets:

* **Default**: Red and pink gradient swirl
* **007**: James Bond-inspired gun barrel effect
* **Opening**: Warm orange iris opening effect
* **Candy**: Bright pastel rainbow swirl

```tsx theme={null}
import { Swirl, candyPreset } from '@paper-design/shaders-react';

<Swirl {...candyPreset.params} />
```
