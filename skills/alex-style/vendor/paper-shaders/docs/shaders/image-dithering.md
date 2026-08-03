> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Image Dithering

> Dithering image filter with multiple algorithms and color palettes

A dithering image filter with support for 4 dithering algorithms and multiple color palettes (2-color, 3-color, and multicolor options), using either predefined colors or colors sampled from the original image.

## Features

* Multiple dithering algorithms (random, 2x2, 4x4, 8x8 Bayer matrices)
* Custom color palettes (2-7 colors)
* Original color preservation mode
* Inverted luminance option
* Adjustable pixel grid size
* Retro/vintage aesthetic

## Basic Usage

<CodeGroup>
  ```tsx React theme={null}
  import { ImageDithering } from '@paper-design/shaders-react';

  function App() {
    return (
      <ImageDithering
        image="/path/to/image.jpg"
        type="8x8"
        size={2}
        colorFront="#94ffaf"
        colorBack="#000c38"
        colorHighlight="#eaff94"
        colorSteps={2}
        originalColors={false}
        inverted={false}
      />
    );
  }
  ```

  ```js Vanilla JavaScript theme={null}
  import { mountShader, imageDitheringFragmentShader, DitheringTypes } from '@paper-design/shaders';

  const canvas = document.getElementById('canvas');
  const mount = mountShader(canvas, {
    fragmentShader: imageDitheringFragmentShader,
    uniforms: {
      u_image: '/path/to/image.jpg',
      u_type: DitheringTypes['8x8'], // 4
      u_pxSize: 2,
      u_colorFront: [0.580, 1.0, 0.686, 1],
      u_colorBack: [0, 0.047, 0.220, 1],
      u_colorHighlight: [0.918, 1.0, 0.580, 1],
      u_colorSteps: 2,
      u_originalColors: false,
      u_inverted: false,
      // Sizing uniforms
      u_fit: 2, // 0=none, 1=contain, 2=cover
      u_scale: 1,
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

<ParamField path="image" type="string | HTMLImageElement" required>
  Source image to apply the dithering effect to
</ParamField>

<ParamField path="type" type="'random' | '2x2' | '4x4' | '8x8'" default="'8x8'">
  Dithering algorithm type:

  * `random`: Random noise dithering
  * `2x2`: 2×2 Bayer matrix (coarse pattern)
  * `4x4`: 4×4 Bayer matrix (medium pattern)
  * `8x8`: 8×8 Bayer matrix (fine pattern)
</ParamField>

<ParamField path="size" type="number" default="2" min="0.5" max="20">
  Pixel size of the dithering grid in screen pixels
</ParamField>

<ParamField path="colorFront" type="string" default="'#94ffaf'">
  Primary foreground color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorBack" type="string" default="'#000c38'">
  Background color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorHighlight" type="string" default="'#eaff94'">
  Secondary foreground color (set same as colorFront for classic 2-color dithering)
</ParamField>

<ParamField path="colorSteps" type="number" default="2" min="1" max="7">
  Number of color levels to use in the output. Higher values create smoother gradients.
</ParamField>

<ParamField path="originalColors" type="boolean" default="false">
  Use the original colors of the image instead of the custom color palette
</ParamField>

<ParamField path="inverted" type="boolean" default="false">
  Inverts the image luminance (doesn't affect the color scheme)
</ParamField>

### Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions
</ParamField>

<ParamField path="scale" type="number" default="1" min="0.01" max="4">
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

<ParamField path="speed" type="number" default="0">
  Animation speed multiplier (0 for static)
</ParamField>

<ParamField path="frame" type="number" default="0">
  Manual frame control for animation
</ParamField>

## Presets

The ImageDithering shader comes with several built-in presets:

* **Default**: 8×8 dithering with custom 3-color palette
* **Noise**: Random dithering with warm colors
* **Retro**: 2×2 dithering preserving original colors
* **Natural**: 8×8 dithering with original colors and 5 levels

<CodeGroup>
  ```tsx React Preset Usage theme={null}
  import { ImageDithering, imageDitheringPresets } from '@paper-design/shaders-react';

  function App() {
    return <ImageDithering {...imageDitheringPresets[0].params} image="/image.jpg" />;
  }
  ```
</CodeGroup>

## Examples

### Classic Two-Color Dithering

```tsx theme={null}
<ImageDithering
  image="/image.jpg"
  type="8x8"
  size={2}
  colorFront="#000000"
  colorBack="#ffffff"
  colorHighlight="#000000"
  colorSteps={1}
  originalColors={false}
/>
```

### Retro Game Effect

```tsx theme={null}
<ImageDithering
  image="/image.jpg"
  type="2x2"
  size={3}
  colorFront="#eeeeee"
  colorBack="#5452ff"
  colorHighlight="#eeeeee"
  colorSteps={1}
  originalColors={true}
/>
```

### Noise Effect

```tsx theme={null}
<ImageDithering
  image="/image.jpg"
  type="random"
  size={1}
  colorFront="#a2997c"
  colorBack="#000000"
  colorHighlight="#ededed"
  colorSteps={1}
/>
```

### Natural Gradient

```tsx theme={null}
<ImageDithering
  image="/image.jpg"
  type="8x8"
  size={2}
  colorSteps={5}
  originalColors={true}
/>
```

## Technical Details

### Shader Uniforms (Vanilla JS)

When using the vanilla JavaScript API:

```js theme={null}
import { DitheringTypes } from '@paper-design/shaders';

{
  u_type: DitheringTypes.random, // or 1
  u_pxSize: 2,
  u_colorFront: [r, g, b, a],
  u_colorBack: [r, g, b, a],
  u_colorHighlight: [r, g, b, a],
  u_colorSteps: 2,
  u_originalColors: false,
  u_inverted: false,
}
```

### Dithering Types

* `random` (1): Random noise pattern
* `2x2` (2): Coarse 2×2 Bayer matrix
* `4x4` (3): Medium 4×4 Bayer matrix
* `8x8` (4): Fine 8×8 Bayer matrix

### Color Modes

**Custom Palette Mode** (`originalColors: false`):

* Uses `colorFront`, `colorBack`, and `colorHighlight`
* `colorHighlight` is used for the brightest areas
* `colorSteps` controls gradient smoothness

**Original Colors Mode** (`originalColors: true`):

* Preserves image colors while applying dithering
* `colorSteps` controls quantization levels
* Color palette parameters are ignored

### Performance Notes

* Static shader (no animation by default)
* Pixel-based rendering for crisp dithering
* Performance scales with canvas size
* Lower `size` values = more pixels = slower rendering
* Bayer matrices (2×2, 4×4, 8×8) are faster than random
