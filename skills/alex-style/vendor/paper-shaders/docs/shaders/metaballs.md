> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Metaballs

> Up to 20 colored gooey balls that merge into smooth organic shapes

The Metaballs shader creates up to 20 colored gooey balls that move around and merge into smooth organic shapes. Perfect for creating liquid effects, blob animations, and organic motion graphics with up to 8 different colors.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { Metaballs } from '@paper-design/shaders-react';

  function App() {
    return (
      <Metaballs
        colorBack="#000000"
        colors={['#6e33cc', '#ff5500', '#ffc105', '#ffc800', '#f585ff']}
        count={10}
        size={0.83}
        speed={1}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, metaballsFragmentShader } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    metaballsFragmentShader,
    {
      u_colorBack: [0, 0, 0, 1],
      u_colors: [
        [0.43, 0.2, 0.8, 1],
        [1, 0.33, 0, 1],
        [1, 0.76, 0.02, 1],
        [1, 0.78, 0, 1],
        [0.96, 0.52, 1, 1]
      ],
      u_colorsCount: 5,
      u_count: 10,
      u_size: 0.83,
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
  Background color in hex format. Visible outside the metaballs.
</ParamField>

<ParamField path="colors" type="string[]" default="['#6e33cc', '#ff5500', '#ffc105', '#ffc800', '#f585ff']">
  Array of base colors for the balls in hex format. Supports up to 8 colors. Colors are assigned cyclically to the balls.
</ParamField>

<ParamField path="count" type="number" default="10">
  Number of balls (1 to 20). More balls create denser, more complex blob patterns.
</ParamField>

<ParamField path="size" type="number" default="0.83">
  Size of the balls (0 to 1). Larger values create bigger balls that merge more easily.
</ParamField>

<ParamField path="speed" type="number" default="1">
  Animation speed multiplier. Controls how fast the balls move and merge.
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

### Default

```tsx theme={null}
<Metaballs
  colorBack="#000000"
  colors={['#6e33cc', '#ff5500', '#ffc105', '#ffc800', '#f585ff']}
  count={10}
  size={0.83}
  speed={1}
/>
```

### Ink Drops

```tsx theme={null}
<Metaballs
  colorBack="#ffffff00"
  colors={['#000000']}
  count={18}
  size={0.1}
  speed={2}
/>
```

### Solar

```tsx theme={null}
<Metaballs
  colorBack="#102f84"
  colors={['#ffc800', '#ff5500', '#ffc105']}
  count={7}
  size={0.75}
  speed={1}
/>
```

### Background

```tsx theme={null}
<Metaballs
  colorBack="#2a273f"
  colors={['#ae00ff', '#00ff95', '#ffc105']}
  count={13}
  size={0.81}
  scale={4.0}
  offsetX={-0.3}
  speed={0.5}
/>
```

## Technical Details

* **Max Balls**: 20
* **Max Colors**: 8
* **Algorithm**: Inverse distance field blending
* **Motion**: Noise-based procedural movement
* **Blending**: Smooth merging using power curves
* **Anti-aliasing**: Uses `fwidth` for smooth edges
* **Texture**: Requires noise texture for movement randomization
* **Coordinates**: Uses object UV coordinates

The shader creates metaballs by:

1. Positioning each ball using noise-based procedural motion
2. Computing inverse distance fields for each ball
3. Accumulating color contributions weighted by field strength
4. Applying power curves to create the characteristic gooey merging effect
5. Smoothing edges with anti-aliasing

Fractional ball counts are supported - the last ball will have reduced size/opacity based on the fractional part.
