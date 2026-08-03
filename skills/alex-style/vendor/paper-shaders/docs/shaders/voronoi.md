> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Voronoi

> Animated cellular pattern with smooth customizable edges and glow effects

The Voronoi shader creates an anti-aliased animated cellular pattern with smooth and customizable edges. Features up to 5 colors, optional glow effects, and adjustable gap width. Perfect for creating organic cell patterns, stained glass effects, or abstract geometric animations.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { Voronoi } from '@paper-design/shaders-react';

  function App() {
    return (
      <Voronoi
        colors={['#ff8247', '#ffe53d']}
        stepsPerColor={3}
        colorGlow="#ffffff"
        colorGap="#2e0000"
        distortion={0.4}
        gap={0.04}
        glow={0}
        scale={0.5}
        speed={0.5}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, voronoiFragmentShader } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    voronoiFragmentShader,
    {
      u_colors: [
        [1, 0.51, 0.28, 1],
        [1, 0.9, 0.24, 1]
      ],
      u_colorsCount: 2,
      u_stepsPerColor: 3,
      u_colorGlow: [1, 1, 1, 1],
      u_colorGap: [0.18, 0, 0, 1],
      u_distortion: 0.4,
      u_gap: 0.04,
      u_glow: 0,
      u_noiseTexture: noiseTextureImage,
      // Sizing uniforms
      u_fit: 2,
      u_scale: 0.5,
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

<ParamField path="colors" type="string[]" default="['#ff8247', '#ffe53d']">
  Array of base cell colors in hex format. Supports up to 5 colors. Colors are distributed across cells based on their random values.
</ParamField>

<ParamField path="stepsPerColor" type="number" default="3">
  Number of extra colors between base colors (1 to 3). 1 = N colors, 2 = 2×N colors, etc. Creates posterization effect.
</ParamField>

<ParamField path="colorGlow" type="string" default="'#ffffff'">
  Color tint for radial inner shadow inside cells in hex format. Effective when glow > 0.
</ParamField>

<ParamField path="colorGap" type="string" default="'#2e0000'">
  Color used for cell borders/gaps in hex format. Visible when gap > 0.
</ParamField>

<ParamField path="distortion" type="number" default="0.4">
  Strength of noise-driven displacement of cell centers (0 to 0.5). Creates organic, flowing movement of cells.
</ParamField>

<ParamField path="gap" type="number" default="0.04">
  Width of the border/gap between cells (0 to 0.1). 0 creates seamless cells, higher values create more pronounced borders.
</ParamField>

<ParamField path="glow" type="number" default="0">
  Strength of the radial inner shadow inside cells (0 to 1). Creates a gradient from cell edges to centers.
</ParamField>

<ParamField path="speed" type="number" default="0.5">
  Animation speed multiplier. Controls how fast the cell pattern morphs.
</ParamField>

### Common Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="scale" type="number" default="0.5">
  Overall zoom level (0.01 to 4). Affects the size of cells and is used for anti-aliasing calculations.
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
<Voronoi
  colors={['#ff8247', '#ffe53d']}
  stepsPerColor={3}
  colorGlow="#ffffff"
  colorGap="#2e0000"
  distortion={0.4}
  gap={0.04}
  glow={0}
  scale={0.5}
  speed={0.5}
/>
```

### Lights

```tsx theme={null}
<Voronoi
  colors={['#fffffffc', '#bbff00', '#00ffff']}
  stepsPerColor={2}
  colorGlow="#ff00d0"
  colorGap="#ff00d0"
  distortion={0.38}
  gap={0.0}
  glow={1.0}
  scale={3.3}
  speed={0.5}
/>
```

### Cells

```tsx theme={null}
<Voronoi
  colors={['#ffffff']}
  stepsPerColor={1}
  colorGlow="#ffffff"
  colorGap="#000000"
  distortion={0.5}
  gap={0.03}
  glow={0.8}
  scale={0.5}
  speed={0.5}
/>
```

### Bubbles

```tsx theme={null}
<Voronoi
  colors={['#83c9fb']}
  stepsPerColor={1}
  colorGlow="#ffffff"
  colorGap="#ffffff"
  distortion={0.4}
  gap={0}
  glow={1}
  scale={0.75}
  speed={0.5}
/>
```

## Technical Details

* **Max Colors**: 5
* **Algorithm**: Double-pass Voronoi with edge detection
* **Anti-aliasing**: Scale-aware edge smoothing
* **Distortion**: Sine wave displacement of cell centers
* **Texture**: Requires noise texture for randomization
* **Coordinates**: Uses pattern UV coordinates scaled by 1.25
* **Original Algorithm**: Based on [ldl3W8 shader](https://www.shadertoy.com/view/ldl3W8)
* **Note**: Small gaps may appear due to natural Voronoi cell border artifacts

The shader creates Voronoi cells by:

1. Computing the nearest cell center for each pixel (first pass)
2. Finding the distance to the nearest cell edge (second pass)
3. Applying sine wave distortion to cell center positions over time
4. Coloring cells based on their random values with posterization
5. Adding optional radial glow within cells
6. Drawing anti-aliased gaps between cells
