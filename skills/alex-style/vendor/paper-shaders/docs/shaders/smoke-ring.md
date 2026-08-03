> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Smoke Ring

> Radial multi-colored gradient shaped with layered noise for a natural, smoky aesthetic

The Smoke Ring shader creates a radial multi-colored gradient shaped with layered noise, producing a natural, smoky aesthetic. Perfect for creating halos, smoke effects, clouds, and organic ring shapes with up to 10 colors.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { SmokeRing } from '@paper-design/shaders-react';

  function App() {
    return (
      <SmokeRing
        colorBack="#000000"
        colors={['#ffffff']}
        radius={0.25}
        thickness={0.65}
        innerShape={0.7}
        noiseScale={3}
        noiseIterations={8}
        scale={0.8}
        speed={0.5}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, smokeRingFragmentShader } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    smokeRingFragmentShader,
    {
      u_colorBack: [0, 0, 0, 1],
      u_colors: [[1, 1, 1, 1]],
      u_colorsCount: 1,
      u_radius: 0.25,
      u_thickness: 0.65,
      u_innerShape: 0.7,
      u_noiseScale: 3,
      u_noiseIterations: 8,
      u_noiseTexture: noiseTextureImage,
      // Sizing uniforms
      u_fit: 2,
      u_scale: 0.8,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    },
    {}, // WebGL context attributes
    0.5 // speed
  );
  ```
</CodeGroup>

## Parameters

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format. Visible outside the smoke ring.
</ParamField>

<ParamField path="colors" type="string[]" default="['#ffffff']">
  Array of gradient colors for the ring in hex format. Supports up to 10 colors. Colors blend from inner to outer edge.
</ParamField>

<ParamField path="radius" type="number" default="0.25">
  Radius of the ring shape (0 to 1). Controls where the ring appears relative to the center.
</ParamField>

<ParamField path="thickness" type="number" default="0.65">
  Thickness of the ring (0.01 to 1). Larger values create wider rings.
</ParamField>

<ParamField path="innerShape" type="number" default="0.7">
  Ring inner fill amount (0 to 4). Controls how much the ring fills inward. Higher values create more solid centers.
</ParamField>

<ParamField path="noiseScale" type="number" default="3">
  Noise frequency (0.01 to 5). Controls the size/scale of the smoky distortion patterns.
</ParamField>

<ParamField path="noiseIterations" type="number" default="8">
  Number of noise layers (1 to 8). More layers create more detailed, complex smoke patterns but impact performance.
</ParamField>

<ParamField path="speed" type="number" default="0.5">
  Animation speed multiplier. Controls how fast the smoke flows and evolves.
</ParamField>

### Common Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="scale" type="number" default="0.8">
  Overall zoom level (0.01 to 4).
</ParamField>

<ParamField path="rotation" type="number" default="0">
  Rotation angle in degrees (0 to 360).
</ParamField>

<ParamField path="offsetX" type="number" default="0">
  Horizontal offset (-1 to 1).
</ParamField>

<ParamField path="offsetY" type="number" default="0">
  Vertical offset (-1 to 1).
</ParamField>

## Presets

### Default

```tsx theme={null}
<SmokeRing
  colorBack="#000000"
  colors={['#ffffff']}
  radius={0.25}
  thickness={0.65}
  innerShape={0.7}
  noiseScale={3}
  noiseIterations={8}
  scale={0.8}
  speed={0.5}
/>
```

### Solar

```tsx theme={null}
<SmokeRing
  colorBack="#000000"
  colors={['#ffffff', '#ffca0a', '#fc6203', '#fc620366']}
  radius={0.4}
  thickness={0.8}
  innerShape={4}
  noiseScale={2}
  noiseIterations={3}
  scale={2}
  offsetY={1}
  speed={1}
/>
```

### Line

```tsx theme={null}
<SmokeRing
  colorBack="#000000"
  colors={['#4540a4', '#1fe8ff']}
  radius={0.38}
  thickness={0.01}
  innerShape={0.88}
  noiseScale={1.1}
  noiseIterations={2}
  speed={4}
/>
```

### Cloud

```tsx theme={null}
<SmokeRing
  colorBack="#81ADEC"
  colors={['#ffffff']}
  radius={0.5}
  thickness={0.65}
  innerShape={0.85}
  noiseScale={3}
  noiseIterations={10}
  scale={2.5}
  speed={0.5}
/>
```

## Technical Details

* **Max Colors**: 10
* **Max Noise Iterations**: 8
* **Noise**: Uses FBM (Fractal Brownian Motion) with value noise
* **Animation**: Dual-cycle time blending for seamless loops
* **Texture**: Requires noise texture for randomization
* **Coordinates**: Uses object UV coordinates

The shader creates a ring using distance fields, applies multi-octave noise distortion with polar coordinates for organic smoke-like movement, and blends multiple time cycles smoothly for continuous animation.
