> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Heatmap

> Glowing gradient animation flowing through an input shape

A glowing gradient of colors flowing through an input shape. The effect creates a smoothly animated wave of intensity across the image, perfect for creating attention-grabbing effects.

## Features

* Animated gradient flow
* Customizable color palette (up to 10 colors)
* Inner and outer glow controls
* Contour intensity adjustment
* Directional animation
* Image preprocessing for optimal results

## Basic Usage

<CodeGroup>
  ```tsx React theme={null}
  import { Heatmap } from '@paper-design/shaders-react';

  function App() {
    return (
      <Heatmap
        image="/path/to/logo.png"
        colors={[
          '#11206a',
          '#1f3ba2',
          '#2f63e7',
          '#6bd7ff',
          '#ffe679',
          '#ff991e',
          '#ff4c00',
        ]}
        colorBack="#000000"
        contour={0.5}
        angle={0}
        noise={0}
        innerGlow={0.5}
        outerGlow={0.5}
        speed={1}
      />
    );
  }
  ```

  ```js Vanilla JavaScript theme={null}
  import { mountShader, heatmapFragmentShader, toProcessedHeatmap } from '@paper-design/shaders';

  // First, preprocess the image
  const processed = await toProcessedHeatmap('/path/to/logo.png');
  const processedUrl = URL.createObjectURL(processed.blob);

  const canvas = document.getElementById('canvas');
  const mount = mountShader(canvas, {
    fragmentShader: heatmapFragmentShader,
    uniforms: {
      u_image: processedUrl,
      u_colors: [
        [0.067, 0.125, 0.416, 1],
        [0.122, 0.231, 0.635, 1],
        [0.184, 0.388, 0.906, 1],
        [0.420, 0.843, 1, 1],
        [1, 0.902, 0.475, 1],
        [1, 0.600, 0.118, 1],
        [1, 0.298, 0, 1],
      ],
      u_colorsCount: 7,
      u_colorBack: [0, 0, 0, 1],
      u_contour: 0.5,
      u_angle: 0,
      u_noise: 0,
      u_innerGlow: 0.5,
      u_outerGlow: 0.5,
      // Sizing uniforms
      u_fit: 1, // 0=none, 1=contain, 2=cover
      u_scale: 0.75,
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

<ParamField path="image" type="string | HTMLImageElement" required>
  Source image/logo to apply the heatmap effect to. The image will be preprocessed automatically in React.
</ParamField>

<ParamField path="colors" type="string[]" default="['#11206a', '#1f3ba2', '#2f63e7', '#6bd7ff', '#ffe679', '#ff991e', '#ff4c00']">
  Array of up to 10 gradient colors (from cold to hot) in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex, rgb, or rgba format
</ParamField>

<ParamField path="contour" type="number" default="0.5" min="0" max="1">
  Heat intensity near the edges of the input shape
</ParamField>

<ParamField path="angle" type="number" default="0" min="0" max="360">
  Direction of the heatwave animation in degrees
</ParamField>

<ParamField path="noise" type="number" default="0" min="0" max="1">
  Grain applied across the entire graphic for texture
</ParamField>

<ParamField path="innerGlow" type="number" default="0.5" min="0" max="1">
  Size of the heated area inside the input shape
</ParamField>

<ParamField path="outerGlow" type="number" default="0.5" min="0" max="1">
  Size of the heated area outside the input shape
</ParamField>

<ParamField path="suspendWhenProcessingImage" type="boolean" default="false">
  (React only) Suspends the component when the image is being processed. Useful with React Suspense.
</ParamField>

### Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'contain'">
  How to fit the shader into the canvas dimensions
</ParamField>

<ParamField path="scale" type="number" default="0.75" min="0.01" max="4">
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

The Heatmap shader comes with built-in presets:

* **Default**: Blue to red fire gradient
* **Sepia**: Warm brown to white gradient with high noise

<CodeGroup>
  ```tsx React Preset Usage theme={null}
  import { Heatmap, heatmapPresets } from '@paper-design/shaders-react';

  function App() {
    return <Heatmap {...heatmapPresets[0].params} image="/logo.png" />;
  }
  ```
</CodeGroup>

## Examples

### Fire Effect

```tsx theme={null}
<Heatmap
  image="/logo.png"
  colors={['#11206a', '#1f3ba2', '#2f63e7', '#6bd7ff', '#ffe679', '#ff991e', '#ff4c00']}
  colorBack="#000000"
  contour={0.5}
  innerGlow={0.5}
  outerGlow={0.5}
  speed={1}
/>
```

### Sepia Glow

```tsx theme={null}
<Heatmap
  image="/logo.png"
  colors={['#997F45', '#ffffff']}
  colorBack="#000000"
  contour={0.5}
  noise={0.75}
  innerGlow={0.5}
  outerGlow={0.5}
  speed={0.5}
/>
```

### Electric Blue

```tsx theme={null}
<Heatmap
  image="/logo.png"
  colors={['#000033', '#0066ff', '#00ffff', '#ffffff']}
  colorBack="#000000"
  contour={0.8}
  angle={90}
  innerGlow={0.3}
  outerGlow={0.7}
  speed={2}
/>
```

## Image Preprocessing

### React (Automatic)

In React, image preprocessing happens automatically:

```tsx theme={null}
<Heatmap image="/logo.png" suspendWhenProcessingImage={true} />
```

Set `suspendWhenProcessingImage` to `true` to use React Suspense during processing.

### Vanilla JavaScript (Manual)

For vanilla JavaScript, you must preprocess images manually:

```js theme={null}
import { toProcessedHeatmap } from '@paper-design/shaders';

const result = await toProcessedHeatmap('/logo.png');
const processedUrl = URL.createObjectURL(result.blob);

// Use processedUrl as u_image uniform
```

### What Preprocessing Does

The preprocessing function:

1. Converts the image to grayscale
2. Generates multiple blur levels
3. Creates edge detection data
4. Packages everything into RGB channels of a single image

This allows the shader to efficiently compute the heatmap effect.

## Technical Details

### Shader Uniforms (Vanilla JS)

When using the vanilla JavaScript API:

```js theme={null}
{
  u_image: processedImageUrl, // Must be preprocessed!
  u_colors: [
    [r, g, b, a],
    [r, g, b, a],
    // ... up to 10 colors
  ],
  u_colorsCount: 7,
  u_colorBack: [r, g, b, a],
  u_contour: 0.5,
  u_angle: 0,
  u_noise: 0,
  u_innerGlow: 0.5,
  u_outerGlow: 0.5,
}
```

### Animation

The Heatmap shader features:

* Multiple animated waves flowing through the shape
* Smooth gradient transitions
* Directional control via `angle` parameter
* Synchronized timing for natural appearance

### Color Gradient

Colors are interpolated smoothly across the heat levels. The gradient flows from:

* First color (cold/dark areas)
* Middle colors (medium heat)
* Last color (hot/bright areas)

You can use 2-10 colors for different effects.

### Performance Notes

* Animated shader with continuous rendering
* Image preprocessing happens once per image
* Preprocessing time depends on image size (\~100-500ms typical)
* Multiple blur passes computed during preprocessing
* Runtime performance is excellent after preprocessing
* Best with logo/icon images rather than photos
