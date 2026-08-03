> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Grain Gradient

> Multi-color gradients with grainy noise texture in 7 animated abstract forms

The Grain Gradient shader creates multi-color gradients with grainy, noise-textured distortion available in 7 different animated abstract forms. Perfect for creating organic, textured backgrounds with a film-like quality.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { GrainGradient } from '@paper-design/shaders-react';

  function App() {
    return (
      <GrainGradient
        colorBack="#000000"
        colors={['#7300ff', '#eba8ff', '#00bfff', '#2a00ff']}
        shape="corners"
        softness={0.5}
        intensity={0.5}
        noise={0.25}
        speed={1}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, grainGradientFragmentShader, GrainGradientShapes } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    grainGradientFragmentShader,
    {
      u_colorBack: [0, 0, 0, 1],
      u_colors: [
        [0.45, 0, 1, 1],
        [0.92, 0.66, 1, 1],
        [0, 0.75, 1, 1],
        [0.16, 0, 1, 1]
      ],
      u_colorsCount: 4,
      u_shape: GrainGradientShapes.corners, // 4
      u_softness: 0.5,
      u_intensity: 0.5,
      u_noise: 0.25,
      u_noiseTexture: noiseTextureImage,
      // Sizing uniforms
      u_fit: 2,
      u_scale: 1,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    },
    {}, // WebGL context attributes
    1   // speed
  );
  ```
</CodeGroup>

## Parameters

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format.
</ParamField>

<ParamField path="colors" type="string[]" default="['#7300ff', '#eba8ff', '#00bfff', '#2a00ff']">
  Array of gradient colors in hex format. Supports up to 7 colors.
</ParamField>

<ParamField path="shape" type="string" default="'corners'">
  Shape type for the gradient animation. Available options:

  * `'wave'` - Flowing sine wave pattern
  * `'dots'` - Animated grid of dots
  * `'truchet'` - Truchet tile pattern
  * `'corners'` - Corner-based organic shapes
  * `'ripple'` - Concentric ripple effect
  * `'blob'` - Moving blob shapes
  * `'sphere'` - 3D sphere with lighting
</ParamField>

<ParamField path="softness" type="number" default="0.5">
  Color transition sharpness (0 to 1). 0 = hard edge, 1 = smooth gradient.
</ParamField>

<ParamField path="intensity" type="number" default="0.5">
  Distortion between color bands (0 to 1). Controls how much the grain affects color boundaries.
</ParamField>

<ParamField path="noise" type="number" default="0.25">
  Grainy noise overlay strength (0 to 1). Adds texture throughout the gradient.
</ParamField>

<ParamField path="speed" type="number" default="1">
  Animation speed multiplier.
</ParamField>

### Common Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="scale" type="number" default="1">
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

### Default (Corners)

```tsx theme={null}
<GrainGradient
  colorBack="#000000"
  colors={['#7300ff', '#eba8ff', '#00bfff', '#2a00ff']}
  shape="corners"
  softness={0.5}
  intensity={0.5}
  noise={0.25}
  speed={1}
/>
```

### Wave

```tsx theme={null}
<GrainGradient
  colorBack="#000a0f"
  colors={['#c4730b', '#bdad5f', '#d8ccc7']}
  shape="wave"
  softness={0.7}
  intensity={0.15}
  noise={0.5}
  speed={1}
/>
```

### Dots

```tsx theme={null}
<GrainGradient
  colorBack="#0a0000"
  colors={['#6f0000', '#0080ff', '#f2ebc9', '#33cc33']}
  shape="dots"
  softness={1}
  intensity={1}
  noise={0.7}
  scale={0.6}
  speed={1}
/>
```

### Truchet

```tsx theme={null}
<GrainGradient
  colorBack="#0a0000"
  colors={['#6f2200', '#eabb7c', '#39b523']}
  shape="truchet"
  softness={0}
  intensity={0.2}
  noise={1}
  speed={1}
/>
```

### Ripple

```tsx theme={null}
<GrainGradient
  colorBack="#140a00"
  colors={['#6f2d00', '#88ddae', '#2c0b1d']}
  shape="ripple"
  softness={0.5}
  intensity={0.5}
  noise={0.5}
  scale={0.5}
  speed={1}
/>
```

### Blob

```tsx theme={null}
<GrainGradient
  colorBack="#0f0e18"
  colors={['#3e6172', '#a49b74', '#568c50']}
  shape="blob"
  softness={0}
  intensity={0.15}
  noise={0.5}
  scale={1.3}
  speed={1}
/>
```

## Technical Details

* **Max Colors**: 7
* **Shapes**: 7 different animated patterns
* **Noise**: Combines simplex noise with FBM (Fractal Brownian Motion)
* **Grain**: Uses texture-based randomizer for consistent grain patterns
* **Coordinates**: Uses both pattern UV and object UV depending on shape
* **Special Note**: Grains are calculated using screen coordinates, so they don't scale with the shader's scale/fit properties

The shader generates animated shapes using various algorithms (sine waves, procedural patterns, blob motion), applies multi-octave noise for grain texture, and maps colors with configurable softness and distortion.
