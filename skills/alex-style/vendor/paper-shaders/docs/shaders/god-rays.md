> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# God Rays

> Animated rays of light radiating from center

Animated rays of light radiating from the center, blended with up to 5 colors. Features adjustable density, brightness, center glow, and bloom effects.

## React Usage

```tsx theme={null}
import { GodRays } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <GodRays
      colorBack="#000000"
      colorBloom="#0000ff"
      colors={['#a600ff6e', '#6200fff0', '#ffffff', '#33fff5']}
      density={0.3}
      spotty={0.3}
      midIntensity={0.4}
      midSize={0.2}
      intensity={0.8}
      bloom={0.4}
      speed={0.75}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountGodRays } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountGodRays(canvas, {
  colorBack: '#000000',
  colorBloom: '#0000ff',
  colors: ['#a600ff6e', '#6200fff0', '#ffffff', '#33fff5'],
  density: 0.3,
  spotty: 0.3,
  midIntensity: 0.4,
  midSize: 0.2,
  intensity: 0.8,
  bloom: 0.4,
  speed: 0.75,
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format.
</ParamField>

<ParamField path="colorBloom" type="string" default="'#0000ff'">
  Color overlay blended with the rays in hex format.
</ParamField>

<ParamField path="colors" type="string[]" default="['#a600ff6e', '#6200fff0', '#ffffff', '#33fff5']">
  Array of up to 5 ray colors in hex format. Supports alpha channel.
</ParamField>

<ParamField path="density" type="number" default="0.3">
  The number of rays. Higher values create more rays. Range: 0 to 1.
</ParamField>

<ParamField path="spotty" type="number" default="0.3">
  The length of the rays. Higher values create more spots and shorter rays. Range: 0 to 1.
</ParamField>

<ParamField path="intensity" type="number" default="0.8">
  Visibility and strength of the rays. Range: 0 to 1.
</ParamField>

<ParamField path="midSize" type="number" default="0.2">
  Size of the circular glow shape in the center. Range: 0 to 1.
</ParamField>

<ParamField path="midIntensity" type="number" default="0.4">
  Brightness and intensity of the central glow. Range: 0 to 1.
</ParamField>

<ParamField path="bloom" type="number" default="0.4">
  Power of glow effect. 0 uses alpha blending, 1 uses additive blending. Range: 0 to 1.
</ParamField>

<ParamField path="speed" type="number" default="0.75">
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

<ParamField path="offsetY" type="number" default="-0.55">
  Vertical offset of the graphics center. Range: -1 to 1.
</ParamField>

## Presets

The God Rays shader comes with several built-in presets:

* **Default**: Purple and blue rays with bright center
* **Warp**: Pink, orange, and white with higher density
* **Linear**: White rays with additive bloom
* **Ether**: Blue ethereal glow with low density

```tsx theme={null}
import { GodRays, warpPreset } from '@paper-design/shaders-react';

<GodRays {...warpPreset.params} />
```
