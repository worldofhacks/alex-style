> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Static Radial Gradient

> Radial gradient with focal point control, shape distortion, and advanced mixing modes

The Static Radial Gradient creates sophisticated radial gradients with up to 10 colors, featuring focal point controls, shape distortion patterns, and grain effects. Perfect for creating dynamic focal points, spotlight effects, and organic radial compositions.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { StaticRadialGradient } from '@paper-design/shaders-react';

  function App() {
    return (
      <StaticRadialGradient
        colorBack="#000000"
        colors={['#00bbff', '#00ffe1', '#ffffff']}
        radius={0.8}
        focalDistance={0.99}
        focalAngle={0}
        falloff={0.24}
        mixing={0.5}
        distortion={0}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, staticRadialGradientFragmentShader } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    staticRadialGradientFragmentShader,
    {
      u_colorBack: [0, 0, 0, 1],
      u_colors: [
        [0, 0.73, 1, 1],
        [0, 1, 0.88, 1],
        [1, 1, 1, 1]
      ],
      u_colorsCount: 3,
      u_radius: 0.8,
      u_focalDistance: 0.99,
      u_focalAngle: 0,
      u_falloff: 0.24,
      u_mixing: 0.5,
      u_distortion: 0,
      u_distortionShift: 0,
      u_distortionFreq: 12,
      u_grainMixer: 0,
      u_grainOverlay: 0,
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
    0   // speed
  );
  ```
</CodeGroup>

## Parameters

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format. Visible outside the gradient radius.
</ParamField>

<ParamField path="colors" type="string[]" default="['#00bbff', '#00ffe1', '#ffffff']">
  Array of gradient colors in hex format. Supports up to 10 colors. Colors radiate from the focal point outward.
</ParamField>

<ParamField path="radius" type="number" default="0.8">
  Size of the radial shape (0 to 3). Controls the overall size of the gradient.
</ParamField>

<ParamField path="focalDistance" type="number" default="0.99">
  Distance of the focal point from center (0 to 3). 0 creates a centered radial, higher values shift the focal point.
</ParamField>

<ParamField path="focalAngle" type="number" default="0">
  Angle of the focal point in degrees (0 to 360). Effective when focalDistance > 0.
</ParamField>

<ParamField path="falloff" type="number" default="0.24">
  Gradient decay rate (-1 to 1). 0 = linear gradient, positive values create faster falloff, negative creates slower falloff.
</ParamField>

<ParamField path="mixing" type="number" default="0.5">
  Blending behavior between colors (0 to 1). 0 = hard stripes, 1 = smooth gradient.
</ParamField>

<ParamField path="distortion" type="number" default="0">
  Strength of radial distortion pattern (0 to 1). Creates wave-like ripples in the gradient.
</ParamField>

<ParamField path="distortionShift" type="number" default="0">
  Radial distortion offset (-1 to 1). Effective when distortion > 0. Shifts the distortion pattern.
</ParamField>

<ParamField path="distortionFreq" type="number" default="12">
  Radial distortion frequency (0 to 20). Effective when distortion > 0. Controls the number of waves.
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

<ParamField path="rotation" type="number" default="0">
  Rotation angle in degrees (0 to 360).
</ParamField>

## Presets

### Default

```tsx theme={null}
<StaticRadialGradient
  colorBack="#000000"
  colors={['#00bbff', '#00ffe1', '#ffffff']}
  radius={0.8}
  focalDistance={0.99}
  focalAngle={0}
  falloff={0.24}
  mixing={0.5}
/>
```

### Lo-Fi

```tsx theme={null}
<StaticRadialGradient
  colorBack="#2e1f27"
  colors={['#d72638', '#3f88c5', '#f49d37']}
  radius={1}
  focalDistance={0}
  falloff={0.9}
  mixing={0.7}
  grainMixer={1}
  grainOverlay={0.5}
/>
```

### Cross Section

```tsx theme={null}
<StaticRadialGradient
  colorBack="#3d348b"
  colors={['#7678ed', '#f7b801', '#f18701', '#37a066']}
  radius={1}
  focalDistance={0}
  falloff={0}
  mixing={0}
  distortion={1}
  distortionFreq={12}
/>
```

### Radial

```tsx theme={null}
<StaticRadialGradient
  colorBack="#264653"
  colors={['#9c2b2b', '#f4a261', '#ffffff']}
  radius={1}
  focalDistance={0}
  falloff={0}
  mixing={1}
/>
```

## Technical Details

* **Max Colors**: 10
* **Animation**: Designed for static use (speed=0 by default)
* **Focal Point**: Ray-tracing algorithm for accurate focal point rendering
* **Distortion**: Sine/cosine wave patterns at variable frequencies
* **Blending**: Advanced mixing modes with power curve adjustments
* **Coordinates**: Uses object UV coordinates scaled by 2

The shader uses ray-circle intersection math to create accurate radial gradients from an offset focal point, applies optional sinusoidal distortion, and blends colors with configurable sharpness and power curves.
