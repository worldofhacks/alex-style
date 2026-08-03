> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Neuro Noise

> Glowing web-like structure of fluid lines and soft intersections

The Neuro Noise shader creates a glowing, web-like structure of fluid lines and soft intersections. Great for creating atmospheric, organic-yet-futuristic visuals inspired by neural networks and biological systems.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { NeuroNoise } from '@paper-design/shaders-react';

  function App() {
    return (
      <NeuroNoise
        colorFront="#ffffff"
        colorMid="#47a6ff"
        colorBack="#000000"
        brightness={0.05}
        contrast={0.3}
        speed={1}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, neuroNoiseFragmentShader } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    neuroNoiseFragmentShader,
    {
      u_colorFront: [1, 1, 1, 1],
      u_colorMid: [0.28, 0.65, 1, 1],
      u_colorBack: [0, 0, 0, 1],
      u_brightness: 0.05,
      u_contrast: 0.3,
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

<ParamField path="colorFront" type="string" default="'#ffffff'">
  Graphics highlight color in hex format. Used for the brightest intersection points of the neural web.
</ParamField>

<ParamField path="colorMid" type="string" default="'#47a6ff'">
  Graphics main color in hex format. The primary color of the neural web structure.
</ParamField>

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format. Visible in the dark areas between the neural lines.
</ParamField>

<ParamField path="brightness" type="number" default="0.05">
  Luminosity of the crossing points (0 to 1). Higher values make the intersections glow brighter.
</ParamField>

<ParamField path="contrast" type="number" default="0.3">
  Sharpness of the bright-dark transition (0 to 1). Higher values create more defined, sharper lines.
</ParamField>

<ParamField path="speed" type="number" default="1">
  Animation speed multiplier. Controls how fast the neural pattern flows.
</ParamField>

### Common Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="scale" type="number" default="1">
  Overall zoom level (0.01 to 4). Affects the density of the neural pattern.
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
<NeuroNoise
  colorFront="#ffffff"
  colorMid="#47a6ff"
  colorBack="#000000"
  brightness={0.05}
  contrast={0.3}
  speed={1}
/>
```

### Sensation

```tsx theme={null}
<NeuroNoise
  colorFront="#00c8ff"
  colorMid="#fbff00"
  colorBack="#8b42ff"
  brightness={0.19}
  contrast={0.12}
  scale={3}
  speed={1}
/>
```

### Bloodstream

```tsx theme={null}
<NeuroNoise
  colorFront="#ff0000"
  colorMid="#ff0000"
  colorBack="#ffffff"
  brightness={0.24}
  contrast={0.17}
  scale={0.7}
  speed={1}
/>
```

### Ghost

```tsx theme={null}
<NeuroNoise
  colorFront="#ffffff"
  colorMid="#000000"
  colorBack="#ffffff"
  brightness={0.0}
  contrast={1.0}
  scale={0.55}
  speed={1}
/>
```

## Technical Details

* **Algorithm**: Iterative sine/cosine accumulation with rotation
* **Iterations**: 15 layers for complex web structure
* **Coordinates**: Uses pattern UV coordinates scaled by 0.13
* **Color Blending**: Premultiplied alpha with highlight mixing
* **Performance**: Optimized for real-time animation
* **Original Algorithm**: Based on [zozuar's shader](https://x.com/zozuar/status/1625182758745128981/)

The shader creates the neural web by accumulating rotated sine and cosine waves across 15 iterations, each with increasing scale. The result is squared and raised to a power based on contrast, then colors are mixed based on intensity thresholds.
