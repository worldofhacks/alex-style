> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Halftone Dots

> Halftone dot image filter with customizable grids and dot styles

A halftone-dot image filter featuring customizable grids, color palettes, and dot styles. Perfect for creating retro printing effects, LED screen simulations, and artistic halftone patterns.

## Features

* Multiple dot styles (classic, gooey, holes, soft)
* Two grid types (square, hex)
* Original color preservation or custom colors
* Adjustable dot size and contrast
* Grain effects and overlays
* Inverted luminance option

## Basic Usage

<CodeGroup>
  ```tsx React theme={null}
  import { HalftoneDots } from '@paper-design/shaders-react';

  function App() {
    return (
      <HalftoneDots
        image="/path/to/image.jpg"
        type="gooey"
        grid="hex"
        size={0.5}
        radius={1.25}
        contrast={0.4}
        colorFront="#2b2b2b"
        colorBack="#f2f1e8"
        originalColors={false}
        grainMixer={0.2}
        grainOverlay={0.2}
      />
    );
  }
  ```

  ```js Vanilla JavaScript theme={null}
  import { mountShader, halftoneDotsFragmentShader, HalftoneDotsTypes, HalftoneDotsGrids } from '@paper-design/shaders';

  const canvas = document.getElementById('canvas');
  const mount = mountShader(canvas, {
    fragmentShader: halftoneDotsFragmentShader,
    uniforms: {
      u_image: '/path/to/image.jpg',
      u_type: HalftoneDotsTypes.gooey, // 1
      u_grid: HalftoneDotsGrids.hex, // 1
      u_size: 0.5,
      u_radius: 1.25,
      u_contrast: 0.4,
      u_colorFront: [0.169, 0.169, 0.169, 1],
      u_colorBack: [0.949, 0.945, 0.910, 1],
      u_originalColors: false,
      u_inverted: false,
      u_grainMixer: 0.2,
      u_grainOverlay: 0.2,
      u_grainSize: 0.5,
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

<ParamField path="image" type="string | HTMLImageElement" default="''">
  Optional source image to apply the halftone effect to
</ParamField>

<ParamField path="type" type="'classic' | 'gooey' | 'holes' | 'soft'" default="'gooey'">
  Dot style:

  * `classic`: Sharp circular dots
  * `gooey`: Soft blended dots that merge together
  * `holes`: Inverted dots creating holes
  * `soft`: Smooth gradient dots
</ParamField>

<ParamField path="grid" type="'square' | 'hex'" default="'hex'">
  Grid arrangement:

  * `square`: Square/rectangular grid
  * `hex`: Hexagonal grid (more organic)
</ParamField>

<ParamField path="size" type="number" default="0.5" min="0" max="1">
  Grid size relative to the image box (0 = large dots, 1 = small dots)
</ParamField>

<ParamField path="radius" type="number" default="1.25" min="0" max="2">
  Maximum dot size relative to grid cell
</ParamField>

<ParamField path="contrast" type="number" default="0.4" min="0" max="1">
  Contrast applied to the sampled image before halftoning
</ParamField>

<ParamField path="colorFront" type="string" default="'#2b2b2b'">
  Foreground/dot color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorBack" type="string" default="'#f2f1e8'">
  Background color in hex, rgb, or rgba format
</ParamField>

<ParamField path="originalColors" type="boolean" default="false">
  Use sampled image's original colors instead of colorFront
</ParamField>

<ParamField path="inverted" type="boolean" default="false">
  Inverts the image luminance (doesn't affect the color scheme)
</ParamField>

<ParamField path="grainMixer" type="number" default="0.2" min="0" max="1">
  Strength of grain distortion applied to dot edges
</ParamField>

<ParamField path="grainOverlay" type="number" default="0.2" min="0" max="1">
  Post-processing black/white grain overlay
</ParamField>

<ParamField path="grainSize" type="number" default="0.5" min="0" max="1">
  Scale applied to both grain distortion and grain overlay
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

The HalftoneDots shader comes with several built-in presets:

* **Default**: Gooey dots on hex grid with grain
* **LED Screen**: Soft dots on square grid simulating LED display
* **Mosaic**: Classic dots with original colors
* **Round and Square**: Hole dots with inverted luminance

<CodeGroup>
  ```tsx React Preset Usage theme={null}
  import { HalftoneDots, halftoneDotsPresets } from '@paper-design/shaders-react';

  function App() {
    return <HalftoneDots {...halftoneDotsPresets[0].params} image="/image.jpg" />;
  }
  ```
</CodeGroup>

## Examples

### LED Screen Effect

```tsx theme={null}
<HalftoneDots
  image="/image.jpg"
  type="soft"
  grid="square"
  size={0.5}
  radius={1.5}
  contrast={0.3}
  colorFront="#29ff7b"
  colorBack="#000000"
  grainMixer={0}
  grainOverlay={0}
/>
```

### Mosaic Pattern

```tsx theme={null}
<HalftoneDots
  image="/image.jpg"
  type="classic"
  grid="hex"
  size={0.6}
  radius={2}
  contrast={0.01}
  originalColors={true}
  grainMixer={0}
  grainOverlay={0}
/>
```

### Inverted Holes

```tsx theme={null}
<HalftoneDots
  image="/image.jpg"
  type="holes"
  grid="square"
  size={0.8}
  radius={1}
  contrast={1}
  colorFront="#ff8000"
  colorBack="#141414"
  inverted={true}
  grainMixer={0.05}
  grainOverlay={0.3}
/>
```

### Classic Print

```tsx theme={null}
<HalftoneDots
  image="/image.jpg"
  type="classic"
  grid="hex"
  size={0.5}
  radius={1.25}
  contrast={0.4}
  colorFront="#000000"
  colorBack="#ffffff"
  grainMixer={0.2}
  grainOverlay={0.1}
/>
```

## Technical Details

### Shader Uniforms (Vanilla JS)

When using the vanilla JavaScript API:

```js theme={null}
import { HalftoneDotsTypes, HalftoneDotsGrids } from '@paper-design/shaders';

{
  u_type: HalftoneDotsTypes.classic, // or 0
  u_grid: HalftoneDotsGrids.square, // or 0
  u_colorFront: [r, g, b, a],
  u_colorBack: [r, g, b, a],
  u_size: 0.5,
  u_radius: 1.25,
  u_contrast: 0.4,
  u_originalColors: false,
  u_inverted: false,
  u_grainMixer: 0.2,
  u_grainOverlay: 0.2,
  u_grainSize: 0.5,
}
```

### Dot Types

* `classic` (0): Sharp circular dots with antialiasing
* `gooey` (1): Soft dots that blend together
* `holes` (2): Inverted effect creating holes
* `soft` (3): Smooth gradient dots

### Grid Types

* `square` (0): Rectangular grid alignment
* `hex` (1): Hexagonal grid (offset rows)

### Color Modes

**Custom Color Mode** (`originalColors: false`):

* Uses `colorFront` for dots and `colorBack` for background
* Creates monochrome or duotone effect
* Best for stylized looks

**Original Colors Mode** (`originalColors: true`):

* Preserves image colors in halftone pattern
* Adjusts `radius` and `contrast` automatically
* Best for realistic halftone prints

### Performance Notes

* Static shader (no animation by default)
* Performance depends on `size` (smaller = slower)
* `gooey` and `soft` types sample multiple cells
* Grain effects have minimal performance impact
* Works best with moderate `size` values (0.3-0.7)
