> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Paper Texture

> A realistic paper and cardboard texture shader with multiple noise layers

A static texture built from multiple noise layers, usable for realistic paper and cardboard surfaces. Can be used as an image filter or as a standalone texture.

## Features

* Multiple noise layers for realistic paper texture
* Fiber patterns and crumple effects
* Configurable folds and drops
* Roughness and grain control
* Works as an image filter or standalone

## Basic Usage

<CodeGroup>
  ```tsx React theme={null}
  import { PaperTexture } from '@paper-design/shaders-react';

  function App() {
    return (
      <PaperTexture
        image="/path/to/image.jpg"
        colorFront="#9fadbc"
        colorBack="#ffffff"
        contrast={0.3}
        roughness={0.4}
        fiber={0.3}
        fiberSize={0.2}
        crumples={0.3}
        crumpleSize={0.35}
        folds={0.65}
        foldCount={5}
      />
    );
  }
  ```

  ```js Vanilla JavaScript theme={null}
  import { mountShader, paperTextureFragmentShader } from '@paper-design/shaders';

  const canvas = document.getElementById('canvas');
  const mount = mountShader(canvas, {
    fragmentShader: paperTextureFragmentShader,
    uniforms: {
      u_image: '/path/to/image.jpg',
      u_colorFront: [0.624, 0.682, 0.737, 1],
      u_colorBack: [1, 1, 1, 1],
      u_contrast: 0.3,
      u_roughness: 0.4,
      u_fiber: 0.3,
      u_fiberSize: 0.2,
      u_crumples: 0.3,
      u_crumpleSize: 0.35,
      u_folds: 0.65,
      u_foldCount: 5,
      u_fade: 0,
      u_drops: 0.2,
      u_seed: 5.8,
      // Sizing uniforms
      u_fit: 2, // 0=none, 1=contain, 2=cover
      u_scale: 0.6,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
    },
  });
  ```
</CodeGroup>

## Parameters

### Visual Parameters

<ParamField path="image" type="string | HTMLImageElement" default="''">
  Optional source image to apply the paper texture filter to
</ParamField>

<ParamField path="colorFront" type="string" default="'#9fadbc'">
  Foreground color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorBack" type="string" default="'#ffffff'">
  Background color in hex, rgb, or rgba format
</ParamField>

<ParamField path="contrast" type="number" default="0.3" min="0" max="1">
  Blending behavior controlling sharpness vs smoothness of color transitions
</ParamField>

<ParamField path="roughness" type="number" default="0.4" min="0" max="1">
  Pixel noise intensity, related to canvas and not scalable
</ParamField>

<ParamField path="fiber" type="number" default="0.3" min="0" max="1">
  Curly-shaped noise intensity for paper fiber simulation
</ParamField>

<ParamField path="fiberSize" type="number" default="0.2" min="0" max="1">
  Scale of the curly-shaped fiber noise pattern
</ParamField>

<ParamField path="crumples" type="number" default="0.3" min="0" max="1">
  Cell-based crumple pattern intensity
</ParamField>

<ParamField path="crumpleSize" type="number" default="0.35" min="0" max="1">
  Scale of the cell-based crumple pattern
</ParamField>

<ParamField path="folds" type="number" default="0.65" min="0" max="1">
  Depth of the paper folds
</ParamField>

<ParamField path="foldCount" type="number" default="5" min="1" max="15">
  Number of fold lines in the paper texture
</ParamField>

<ParamField path="fade" type="number" default="0" min="0" max="1">
  Big-scale noise mask applied to the pattern for variation
</ParamField>

<ParamField path="drops" type="number" default="0.2" min="0" max="1">
  Visibility of speckle pattern on the paper surface
</ParamField>

<ParamField path="seed" type="number" default="5.8" min="0" max="1000">
  Random seed for folds, crumples, and dots pattern variation
</ParamField>

### Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions
</ParamField>

<ParamField path="scale" type="number" default="0.6" min="0.01" max="4">
  Overall zoom level of the graphics
</ParamField>

<ParamField path="rotation" type="number" default="0" min="0" max="360">
  Overall rotation angle in degrees
</ParamField>

<ParamField path="offsetX" type="number" default="0" min="-1" max="1">
  Horizontal offset of the graphics center
</ParamField>

<ParamField path="offsetY" type="number" default="0" min="-1" max="1">
  Vertical offset of the graphics center
</ParamField>

<ParamField path="originX" type="number" default="0.5" min="0" max="1">
  Horizontal reference point for positioning
</ParamField>

<ParamField path="originY" type="number" default="0.5" min="0" max="1">
  Vertical reference point for positioning
</ParamField>

### Animation Parameters

<ParamField path="speed" type="number" default="0">
  Animation speed multiplier (0 for static)
</ParamField>

<ParamField path="frame" type="number" default="0">
  Manual frame control for animation
</ParamField>

## Presets

The PaperTexture shader comes with several built-in presets:

* **Default**: Classic paper texture with balanced settings
* **Cardboard**: Brown cardboard appearance with fiber texture
* **Abstract**: Colorful abstract paper with strong folds
* **Details**: High-detail texture for close-up effects

<CodeGroup>
  ```tsx React Preset Usage theme={null}
  import { PaperTexture, paperTexturePresets } from '@paper-design/shaders-react';

  function App() {
    return <PaperTexture {...paperTexturePresets[0].params} />;
  }
  ```
</CodeGroup>

## Examples

### Cardboard Texture

```tsx theme={null}
<PaperTexture
  colorFront="#c7b89e"
  colorBack="#999180"
  contrast={0.4}
  fiber={0.35}
  fiberSize={0.14}
  crumples={0.7}
  crumpleSize={0.1}
  folds={0}
  drops={0.1}
/>
```

### Abstract Paper

```tsx theme={null}
<PaperTexture
  colorFront="#00eeff"
  colorBack="#ff0a81"
  contrast={0.85}
  fiber={0.1}
  folds={1}
  foldCount={3}
  drops={0.2}
  seed={2.2}
/>
```

## Technical Details

### Shader Uniforms (Vanilla JS)

When using the vanilla JavaScript API, colors are passed as RGBA arrays with values from 0 to 1:

```js theme={null}
{
  u_colorFront: [r, g, b, a], // e.g., [0.624, 0.682, 0.737, 1]
  u_colorBack: [r, g, b, a],
  u_contrast: 0.3,
  u_roughness: 0.4,
  u_fiber: 0.3,
  u_fiberSize: 0.2,
  u_crumples: 0.3,
  u_crumpleSize: 0.35,
  u_folds: 0.65,
  u_foldCount: 5,
  u_fade: 0,
  u_drops: 0.2,
  u_seed: 5.8,
}
```

### Performance Notes

* This shader is static by default (no animation)
* Uses multiple noise layers for realistic texture
* Requires a noise texture (automatically handled in React)
* Best performance with moderate `foldCount` values (5-10)
