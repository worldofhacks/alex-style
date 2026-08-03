> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Static Mesh Gradient

> Multi-point mesh gradient with wave distortion and adjustable blend sharpness

The Static Mesh Gradient creates a multi-point gradient with up to 10 color spots, enhanced by two-direction wave distortion, adjustable blend sharpness, and grain controls. Unlike the animated Mesh Gradient, this shader is designed for static or controlled positioning of color spots.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { StaticMeshGradient } from '@paper-design/shaders-react';

  function App() {
    return (
      <StaticMeshGradient
        colors={['#ffad0a', '#6200ff', '#e2a3ff', '#ff99fd']}
        positions={2}
        waveX={1.0}
        waveXShift={0.6}
        waveY={1.0}
        waveYShift={0.21}
        mixing={0.93}
        rotation={270}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, staticMeshGradientFragmentShader } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    staticMeshGradientFragmentShader,
    {
      u_colors: [
        [1, 0.68, 0.04, 1],
        [0.38, 0, 1, 1],
        [0.89, 0.64, 1, 1],
        [1, 0.6, 0.99, 1]
      ],
      u_colorsCount: 4,
      u_positions: 2,
      u_waveX: 1.0,
      u_waveXShift: 0.6,
      u_waveY: 1.0,
      u_waveYShift: 0.21,
      u_mixing: 0.93,
      u_grainMixer: 0,
      u_grainOverlay: 0,
      // Sizing uniforms
      u_fit: 2,
      u_scale: 1,
      u_rotation: 270,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    },
    {}, // WebGL context attributes
    0   // speed
  );
  ```
</CodeGroup>

## Parameters

<ParamField path="colors" type="string[]" default="['#ffad0a', '#6200ff', '#e2a3ff', '#ff99fd']">
  Array of gradient colors in hex format. Supports up to 10 colors. Each color becomes a spot in the mesh.
</ParamField>

<ParamField path="positions" type="number" default="2">
  Color spots placement seed (0 to 100). Different values create different arrangements of color spots.
</ParamField>

<ParamField path="waveX" type="number" default="1.0">
  Strength of sine wave distortion along X axis (0 to 1). Creates horizontal wave effects.
</ParamField>

<ParamField path="waveXShift" type="number" default="0.6">
  Phase offset applied to the X-axis wave (0 to 1). Shifts the horizontal wave pattern.
</ParamField>

<ParamField path="waveY" type="number" default="1.0">
  Strength of sine wave distortion along Y axis (0 to 1). Creates vertical wave effects.
</ParamField>

<ParamField path="waveYShift" type="number" default="0.21">
  Phase offset applied to the Y-axis wave (0 to 1). Shifts the vertical wave pattern.
</ParamField>

<ParamField path="mixing" type="number" default="0.93">
  Blending behavior between colors (0 to 1). 0 = hard stripes, 0.5 = smooth, 1 = gradual blend.
</ParamField>

<ParamField path="grainMixer" type="number" default="0">
  Strength of grain distortion applied to shape edges (0 to 1).
</ParamField>

<ParamField path="grainOverlay" type="number" default="0">
  Post-processing black/white grain overlay (0 to 1).
</ParamField>

<ParamField path="speed" type="number" default="0">
  Animation speed multiplier. Default is 0 for static appearance.
</ParamField>

### Common Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="scale" type="number" default="1">
  Overall zoom level (0.01 to 4).
</ParamField>

<ParamField path="rotation" type="number" default="270">
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
<StaticMeshGradient
  colors={['#ffad0a', '#6200ff', '#e2a3ff', '#ff99fd']}
  positions={2}
  waveX={1.0}
  waveXShift={0.6}
  waveY={1.0}
  waveYShift={0.21}
  mixing={0.93}
  rotation={270}
/>
```

### Sea

```tsx theme={null}
<StaticMeshGradient
  colors={['#013b65', '#03738c', '#a3d3ff', '#f2faef']}
  positions={0}
  waveX={0.53}
  waveY={0.95}
  waveYShift={0.64}
  mixing={0.5}
/>
```

### 1960s

```tsx theme={null}
<StaticMeshGradient
  colors={['#000000', '#082400', '#b1aa91', '#8e8c15']}
  positions={42}
  waveX={0.45}
  waveY={1.0}
  mixing={0.0}
  grainMixer={0.37}
  grainOverlay={0.78}
/>
```

### Sunset

```tsx theme={null}
<StaticMeshGradient
  colors={['#264653', '#9c2b2b', '#f4a261', '#ffffff']}
  positions={0}
  waveX={0.6}
  waveXShift={0.7}
  waveY={0.7}
  waveYShift={0.7}
  mixing={0.5}
/>
```

## Technical Details

* **Max Colors**: 10
* **Animation**: Designed for static use (speed=0 by default)
* **Wave Distortion**: Independent X and Y wave controls
* **Blending**: Variable mixing modes from hard edges to smooth gradients
* **Coordinates**: Uses object UV coordinates

The shader positions color spots based on a seed value, applies sine wave distortion in both X and Y directions, then blends colors with configurable sharpness using inverse distance weighting.
