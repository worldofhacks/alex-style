> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Dot Orbit

> Animated multi-color dots orbiting around cell centers

Animated multi-color dots pattern with each dot orbiting around its cell center. Supports up to 10 colors and various shape and motion controls.

## React Usage

```tsx theme={null}
import { DotOrbit } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <DotOrbit
      colorBack="#000000"
      colors={['#ffc96b', '#ff6200', '#ff2f00', '#421100', '#1a0000']}
      size={1}
      sizeRange={0}
      spreading={1}
      stepsPerColor={4}
      speed={1.5}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountDotOrbit } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountDotOrbit(canvas, {
  colorBack: '#000000',
  colors: ['#ffc96b', '#ff6200', '#ff2f00', '#421100', '#1a0000'],
  size: 1,
  sizeRange: 0,
  spreading: 1,
  stepsPerColor: 4,
  speed: 1.5,
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format.
</ParamField>

<ParamField path="colors" type="string[]" default="['#ffc96b', '#ff6200', '#ff2f00', '#421100', '#1a0000']">
  Array of up to 10 base colors in hex format.
</ParamField>

<ParamField path="size" type="number" default="1">
  Dot radius relative to cell size. Range: 0 to 1.
</ParamField>

<ParamField path="sizeRange" type="number" default="0">
  Random variation in shape size. 0 creates uniform sizes, higher values add randomness up to base size. Range: 0 to 1.
</ParamField>

<ParamField path="spreading" type="number" default="1">
  Maximum orbit distance around cell center. Range: 0 to 1.
</ParamField>

<ParamField path="stepsPerColor" type="number" default="4">
  Number of extra colors between base colors. 1 equals N colors, 2 equals 2×N colors, etc. Range: 1 to 4.
</ParamField>

<ParamField path="speed" type="number" default="1.5">
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

The Dot Orbit shader comes with several built-in presets:

* **Default**: Warm orange to black gradient dots
* **Shine**: Small white, blue, and yellow dots
* **Bubbles**: Single color gray bubbles with size variation
* **Hallucinatory**: Black dots on yellow with rapid motion

```tsx theme={null}
import { DotOrbit, bubblesPreset } from '@paper-design/shaders-react';

<DotOrbit {...bubblesPreset.params} />
```
