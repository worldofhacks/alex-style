> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Simplex Noise

> Multi-color gradient mapped into smooth animated curves built with Simplex noise

The Simplex Noise shader creates multi-color gradients mapped into smooth, animated curves built as a combination of two Simplex noise functions. Supports up to 10 colors with adjustable stepping and softness for creating organic, flowing patterns.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { SimplexNoise } from '@paper-design/shaders-react';

  function App() {
    return (
      <SimplexNoise
        colors={['#4449CF', '#FFD1E0', '#F94446', '#FFD36B', '#FFFFFF']}
        stepsPerColor={2}
        softness={0}
        scale={0.6}
        speed={0.5}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, simplexNoiseFragmentShader } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    simplexNoiseFragmentShader,
    {
      u_colors: [
        [0.27, 0.29, 0.81, 1],
        [1, 0.82, 0.88, 1],
        [0.98, 0.27, 0.27, 1],
        [1, 0.84, 0.42, 1],
        [1, 1, 1, 1]
      ],
      u_colorsCount: 5,
      u_stepsPerColor: 2,
      u_softness: 0,
      // Sizing uniforms
      u_fit: 2,
      u_scale: 0.6,
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

<ParamField path="colors" type="string[]" default="['#4449CF', '#FFD1E0', '#F94446', '#FFD36B', '#FFFFFF']">
  Array of base colors in hex format. Supports up to 10 colors. The simplex noise creates flowing patterns between these colors.
</ParamField>

<ParamField path="stepsPerColor" type="number" default="2">
  Number of extra colors between base colors (1 to 10). 1 = N colors, 2 = 2×N colors, etc. Creates posterization effect when > 1.
</ParamField>

<ParamField path="softness" type="number" default="0">
  Color transition sharpness (0 to 1). 0 = hard edge with distinct bands, 1 = smooth gradient transitions.
</ParamField>

<ParamField path="speed" type="number" default="0.5">
  Animation speed multiplier. Controls how fast the noise pattern flows.
</ParamField>

### Common Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="scale" type="number" default="0.6">
  Overall zoom level (0.01 to 4). Affects the size of noise patterns.
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
<SimplexNoise
  colors={['#4449CF', '#FFD1E0', '#F94446', '#FFD36B', '#FFFFFF']}
  stepsPerColor={2}
  softness={0}
  scale={0.6}
  speed={0.5}
/>
```

### Bubblegum

```tsx theme={null}
<SimplexNoise
  colors={['#ffffff', '#ff9e9e', '#5f57ff', '#00f7ff']}
  stepsPerColor={1}
  softness={1.0}
  scale={1.6}
  speed={2}
/>
```

### Spots

```tsx theme={null}
<SimplexNoise
  colors={['#ff7b00', '#f9ffeb', '#320d82']}
  stepsPerColor={1}
  softness={0.0}
  scale={1.0}
  speed={0.6}
/>
```

### First Contact

```tsx theme={null}
<SimplexNoise
  colors={['#e8cce6', '#120d22', '#442c44', '#e6baba', '#fff5f5']}
  stepsPerColor={2}
  softness={0.0}
  scale={0.2}
  speed={2}
/>
```

## Technical Details

* **Max Colors**: 10
* **Noise Algorithm**: Dual-layer Simplex noise at different frequencies
* **Stepping**: Posterization effect with configurable steps
* **Anti-aliasing**: Uses `fwidth` for smooth edges on stepped transitions
* **Coordinates**: Uses pattern UV coordinates with scaling
* **Color Space**: Premultiplied alpha for proper transparency blending

The shader combines two simplex noise functions at different scales and offsets to create organic flowing patterns, maps the result to multiple colors with optional stepping, and applies anti-aliased transitions.
