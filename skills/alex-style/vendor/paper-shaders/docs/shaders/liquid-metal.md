> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Liquid Metal

> Futuristic liquid metal material with animated stripe patterns

Futuristic liquid metal material applied to uploaded logos or abstract shapes. Creates fluid motion with animated stripe patterns that distort along shape edges, perfect for sci-fi and modern aesthetics.

## Features

* Animated metallic stripe patterns
* Chromatic aberration (RGB shift)
* Edge-aware distortion
* Multiple predefined shapes (when no image)
* Customizable color tinting
* Softness and blur controls
* Image preprocessing for optimal results

## Basic Usage

<CodeGroup>
  ```tsx React theme={null}
  import { LiquidMetal } from '@paper-design/shaders-react';

  function App() {
    return (
      <LiquidMetal
        image="/path/to/logo.png"
        colorBack="#AAAAAC"
        colorTint="#ffffff"
        repetition={2.0}
        shiftRed={0.3}
        shiftBlue={0.3}
        contour={0.4}
        softness={0.1}
        distortion={0.07}
        angle={70}
        speed={1}
      />
    );
  }
  ```

  ```js Vanilla JavaScript theme={null}
  import { mountShader, liquidMetalFragmentShader, toProcessedLiquidMetal, LiquidMetalShapes } from '@paper-design/shaders';

  // First, preprocess the image
  const processed = await toProcessedLiquidMetal('/path/to/logo.png');
  const processedUrl = URL.createObjectURL(processed.pngBlob);

  const canvas = document.getElementById('canvas');
  const mount = mountShader(canvas, {
    fragmentShader: liquidMetalFragmentShader,
    uniforms: {
      u_image: processedUrl,
      u_isImage: true,
      u_colorBack: [0.667, 0.667, 0.675, 1],
      u_colorTint: [1, 1, 1, 1],
      u_repetition: 2.0,
      u_shiftRed: 0.3,
      u_shiftBlue: 0.3,
      u_contour: 0.4,
      u_softness: 0.1,
      u_distortion: 0.07,
      u_angle: 70,
      u_shape: LiquidMetalShapes.diamond, // Used when no image
      // Sizing uniforms
      u_fit: 1, // 0=none, 1=contain, 2=cover
      u_scale: 0.6,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
    },
  });

  // Start animation
  mount.play();
  ```
</CodeGroup>

## Parameters

### Visual Parameters

<ParamField path="image" type="string | HTMLImageElement" default="''">
  Source image/logo to apply the liquid metal effect to. Leave empty to use predefined shapes. The image will be preprocessed automatically in React.
</ParamField>

<ParamField path="colorBack" type="string" default="'#AAAAAC'">
  Background color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorTint" type="string" default="'#ffffff'">
  Overlay color tint in hex, rgb, or rgba format (uses color burn blending)
</ParamField>

<ParamField path="repetition" type="number" default="2.0" min="1" max="10">
  Density of pattern stripes
</ParamField>

<ParamField path="shiftRed" type="number" default="0.3" min="-1" max="1">
  Red channel chromatic aberration/dispersion
</ParamField>

<ParamField path="shiftBlue" type="number" default="0.3" min="-1" max="1">
  Blue channel chromatic aberration/dispersion
</ParamField>

<ParamField path="contour" type="number" default="0.4" min="0" max="1">
  Strength of distortion on the shape edges
</ParamField>

<ParamField path="softness" type="number" default="0.1" min="0" max="1">
  Color transition sharpness (0 = hard edge, 1 = smooth gradient)
</ParamField>

<ParamField path="distortion" type="number" default="0.07" min="0" max="1">
  Noise distortion over the stripe pattern
</ParamField>

<ParamField path="angle" type="number" default="70" min="0" max="360">
  Direction of pattern animation in degrees
</ParamField>

<ParamField path="shape" type="'none' | 'circle' | 'daisy' | 'diamond' | 'metaballs'" default="'diamond'">
  Predefined shape when no image is provided:

  * `none`: Fill entire canvas
  * `circle`: Simple circle
  * `daisy`: Flower-like shape
  * `diamond`: Diamond/rhombus shape
  * `metaballs`: Animated organic blobs
</ParamField>

<ParamField path="suspendWhenProcessingImage" type="boolean" default="false">
  (React only) Suspends the component when the image is being processed. Useful with React Suspense.
</ParamField>

### Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'contain'">
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

### Animation Parameters

<ParamField path="speed" type="number" default="1">
  Animation speed multiplier
</ParamField>

<ParamField path="frame" type="number" default="0">
  Manual frame control for animation
</ParamField>

## Presets

The LiquidMetal shader comes with several built-in presets:

* **Default**: Classic liquid metal with chromatic aberration
* **Noir**: Black and white with high softness
* **Backdrop**: Full-screen canvas fill effect
* **Stripes**: High repetition with strong color shifts

<CodeGroup>
  ```tsx React Preset Usage theme={null}
  import { LiquidMetal, liquidMetalPresets } from '@paper-design/shaders-react';

  function App() {
    return <LiquidMetal {...liquidMetalPresets[0].params} image="/logo.png" />;
  }
  ```
</CodeGroup>

## Examples

### Classic Metal

```tsx theme={null}
<LiquidMetal
  image="/logo.png"
  colorBack="#AAAAAC"
  colorTint="#ffffff"
  repetition={2.0}
  shiftRed={0.3}
  shiftBlue={0.3}
  contour={0.4}
  softness={0.1}
  distortion={0.07}
  angle={70}
/>
```

### Black and White

```tsx theme={null}
<LiquidMetal
  image="/logo.png"
  colorBack="#000000"
  colorTint="#606060"
  repetition={1.5}
  shiftRed={0}
  shiftBlue={0}
  softness={0.45}
  contour={0}
  distortion={0}
  angle={90}
/>
```

### Rainbow Stripes

```tsx theme={null}
<LiquidMetal
  image="/logo.png"
  colorBack="#000000"
  colorTint="#2c5d72"
  repetition={6}
  shiftRed={1}
  shiftBlue={-1}
  softness={0.8}
  contour={0.4}
  distortion={0.4}
  shape="circle"
/>
```

### Full Screen Background

```tsx theme={null}
<LiquidMetal
  shape="none"
  scale={1.5}
  colorBack="#AAAAAC"
  colorTint="#ffffff"
  repetition={1.5}
  shiftRed={0.3}
  shiftBlue={0.3}
  softness={0.05}
  distortion={0.1}
  contour={0.4}
  angle={90}
  worldWidth={0}
  worldHeight={0}
/>
```

## Image Preprocessing

### React (Automatic)

In React, image preprocessing happens automatically:

```tsx theme={null}
<LiquidMetal image="/logo.png" suspendWhenProcessingImage={true} />
```

Set `suspendWhenProcessingImage` to `true` to use React Suspense during processing.

### Vanilla JavaScript (Manual)

For vanilla JavaScript, you must preprocess images manually:

```js theme={null}
import { toProcessedLiquidMetal } from '@paper-design/shaders';

const result = await toProcessedLiquidMetal('/logo.png');
const processedUrl = URL.createObjectURL(result.pngBlob);

// Use processedUrl as u_image uniform
```

### What Preprocessing Does

The preprocessing function:

1. Detects shape edges using Poisson equation
2. Creates distance gradient from edges
3. Optimizes for performance (512×512 working size)
4. Stores gradient in red channel, alpha in green channel

This allows the shader to create edge-aware distortions efficiently.

## Technical Details

### Shader Uniforms (Vanilla JS)

When using the vanilla JavaScript API:

```js theme={null}
import { LiquidMetalShapes } from '@paper-design/shaders';

{
  u_image: processedImageUrl, // Must be preprocessed if provided
  u_isImage: true, // Set to false when using predefined shapes
  u_shape: LiquidMetalShapes.diamond, // or 3
  u_colorBack: [r, g, b, a],
  u_colorTint: [r, g, b, a],
  u_repetition: 2.0,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_contour: 0.4,
  u_softness: 0.1,
  u_distortion: 0.07,
  u_angle: 70,
}
```

### Shape Types

* `none` (0): Fill entire canvas
* `circle` (1): Simple circle
* `daisy` (2): Flower pattern (animated)
* `diamond` (3): Rotated diamond
* `metaballs` (4): Animated organic blobs

### Animation

The shader animates:

* Flowing stripe patterns
* Metaballs movement (when using metaballs shape)
* Daisy rotation (when using daisy shape)
* Edge distortions

### Chromatic Aberration

The `shiftRed` and `shiftBlue` parameters create:

* RGB channel separation
* Rainbow edge effects
* Prism-like color dispersion
* More visible at shape edges and with higher `contour`

### Performance Notes

* Animated shader with continuous rendering
* Image preprocessing uses Poisson solver (\~100-500ms)
* Preprocessing optimized to 512×512 working resolution
* Runtime performance is excellent after preprocessing
* Predefined shapes have no preprocessing overhead
* Best with logo/icon images rather than photos
