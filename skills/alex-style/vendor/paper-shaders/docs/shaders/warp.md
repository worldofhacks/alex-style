> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Warp

> Animated color fields warped by noise and swirls

Animated color fields warped by noise and swirls, applied over base patterns (checks, stripes, or split edge). Blends up to 10 colors with adjustable distribution, softness, distortion, and swirl. Great for fluid, smoky, or marbled effects.

## React Usage

```tsx theme={null}
import { Warp } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <Warp
      colors={['#121212', '#9470ff', '#121212', '#8838ff']}
      proportion={0.45}
      softness={1}
      distortion={0.25}
      swirl={0.8}
      swirlIterations={10}
      shapeScale={0.1}
      shape="checks"
      speed={1}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountWarp } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountWarp(canvas, {
  colors: ['#121212', '#9470ff', '#121212', '#8838ff'],
  proportion: 0.45,
  softness: 1,
  distortion: 0.25,
  swirl: 0.8,
  swirlIterations: 10,
  shapeScale: 0.1,
  shape: 'checks',
  speed: 1,
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colors" type="string[]" default="['#121212', '#9470ff', '#121212', '#8838ff']">
  Array of up to 10 gradient colors in hex format. Colors are blended based on the underlying pattern.
</ParamField>

<ParamField path="proportion" type="number" default="0.45">
  Blend point between colors, where 0.5 equals equal distribution. Range: 0 to 1.
</ParamField>

<ParamField path="softness" type="number" default="1">
  Color transition sharpness. 0 creates hard edges, 1 creates smooth gradients. Range: 0 to 1.
</ParamField>

<ParamField path="shape" type="'checks' | 'stripes' | 'edge'" default="'checks'">
  Base pattern type:

  * `checks`: Checkerboard pattern
  * `stripes`: Horizontal stripes
  * `edge`: Split edge pattern
</ParamField>

<ParamField path="shapeScale" type="number" default="0.1">
  Zoom level of the base pattern. Range: 0 to 1.
</ParamField>

<ParamField path="distortion" type="number" default="0.25">
  Strength of noise-based distortion applied to the pattern. Range: 0 to 1.
</ParamField>

<ParamField path="swirl" type="number" default="0.8">
  Strength of the swirl distortion effect. Range: 0 to 1.
</ParamField>

<ParamField path="swirlIterations" type="number" default="10">
  Number of layered swirl passes. Only effective when swirl > 0. Range: 0 to 20.
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

The Warp shader comes with several built-in presets:

* **Default**: Purple and black checkerboard with moderate swirl
* **Cauldron**: Green, blue, and dark tones with edge pattern
* **Ink**: High contrast black and white with sharp edges
* **Kelp**: Organic green stripes with minimal swirl
* **Nectar**: Warm golden tones with edge pattern
* **Passion**: Deep red and orange with checks pattern

```tsx theme={null}
import { Warp, presetInk } from '@paper-design/shaders-react';

<Warp {...presetInk.params} />
```
