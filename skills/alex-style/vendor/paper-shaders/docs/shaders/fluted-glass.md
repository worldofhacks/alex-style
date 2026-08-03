> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Fluted Glass

> Fluted glass image filter with streaked, ribbed distortions

Fluted glass image filter that transforms an image into streaked, ribbed distortions, giving a mix of clarity and obscurity like looking through textured glass.

## Features

* Multiple grid patterns (lines, waves, zigzag, patterns)
* Various distortion shapes (prism, lens, contour, cascade, flat)
* Configurable shadows and highlights
* One-directional blur effects
* Edge softness control
* Grain overlay options

## Basic Usage

<CodeGroup>
  ```tsx React theme={null}
  import { FlutedGlass } from '@paper-design/shaders-react';

  function App() {
    return (
      <FlutedGlass
        image="/path/to/image.jpg"
        size={0.5}
        shape="lines"
        distortionShape="prism"
        distortion={0.5}
        angle={0}
        shadows={0.25}
        highlights={0.1}
        blur={0}
        edges={0.25}
      />
    );
  }
  ```

  ```js Vanilla JavaScript theme={null}
  import { mountShader, flutedGlassFragmentShader, GlassGridShapes, GlassDistortionShapes } from '@paper-design/shaders';

  const canvas = document.getElementById('canvas');
  const mount = mountShader(canvas, {
    fragmentShader: flutedGlassFragmentShader,
    uniforms: {
      u_image: '/path/to/image.jpg',
      u_colorBack: [0, 0, 0, 0],
      u_colorShadow: [0, 0, 0, 1],
      u_colorHighlight: [1, 1, 1, 1],
      u_size: 0.5,
      u_shape: GlassGridShapes.lines, // 1
      u_distortionShape: GlassDistortionShapes.prism, // 1
      u_distortion: 0.5,
      u_angle: 0,
      u_shadows: 0.25,
      u_highlights: 0.1,
      u_blur: 0,
      u_edges: 0.25,
      u_shift: 0,
      u_stretch: 0,
      u_marginLeft: 0,
      u_marginRight: 0,
      u_marginTop: 0,
      u_marginBottom: 0,
      u_grainMixer: 0,
      u_grainOverlay: 0,
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
  Source image to apply the fluted glass effect to
</ParamField>

<ParamField path="colorBack" type="string" default="'#00000000'">
  Background color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorShadow" type="string" default="'#000000'">
  Shadow color for darker areas in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorHighlight" type="string" default="'#ffffff'">
  Highlight color for lighter areas in hex, rgb, or rgba format
</ParamField>

<ParamField path="size" type="number" default="0.5" min="0" max="1">
  Size of the distortion shape grid
</ParamField>

<ParamField path="shape" type="'lines' | 'linesIrregular' | 'wave' | 'zigzag' | 'pattern'" default="'lines'">
  Grid shape pattern:

  * `lines`: Regular parallel lines
  * `linesIrregular`: Lines with irregular variations
  * `wave`: Wavy pattern
  * `zigzag`: Zigzag pattern
  * `pattern`: Complex sine pattern
</ParamField>

<ParamField path="distortionShape" type="'prism' | 'lens' | 'contour' | 'cascade' | 'flat'" default="'prism'">
  Shape of distortion within each stripe:

  * `prism`: Sharp prismatic distortion
  * `lens`: Lens-like curved distortion
  * `contour`: Contoured distortion with depth
  * `cascade`: Cascading wave distortion
  * `flat`: Minimal flat distortion
</ParamField>

<ParamField path="distortion" type="number" default="0.5" min="0" max="1">
  Power of distortion applied within each stripe
</ParamField>

<ParamField path="angle" type="number" default="0" min="0" max="180">
  Direction of the grid relative to the image in degrees
</ParamField>

<ParamField path="shadows" type="number" default="0.25" min="0" max="1">
  Color gradient added over image, following distortion shape
</ParamField>

<ParamField path="highlights" type="number" default="0.1" min="0" max="1">
  Thin strokes along distortion shape, useful for antialiasing
</ParamField>

<ParamField path="blur" type="number" default="0" min="0" max="1">
  One-directional blur over the image with extra blur around edges
</ParamField>

<ParamField path="edges" type="number" default="0.25" min="0" max="1">
  Glass distortion and softness on the image edges
</ParamField>

<ParamField path="shift" type="number" default="0" min="-1" max="1">
  Texture shift in direction opposite to the grid
</ParamField>

<ParamField path="stretch" type="number" default="0" min="0" max="1">
  Extra distortion along the grid lines
</ParamField>

<ParamField path="margin" type="number" default="0" min="0" max="1">
  Distance from all edges to the effect (applies to all sides)
</ParamField>

<ParamField path="marginLeft" type="number" default="0" min="0" max="1">
  Distance from the left edge to the effect
</ParamField>

<ParamField path="marginRight" type="number" default="0" min="0" max="1">
  Distance from the right edge to the effect
</ParamField>

<ParamField path="marginTop" type="number" default="0" min="0" max="1">
  Distance from the top edge to the effect
</ParamField>

<ParamField path="marginBottom" type="number" default="0" min="0" max="1">
  Distance from the bottom edge to the effect
</ParamField>

<ParamField path="grainMixer" type="number" default="0" min="0" max="1">
  Strength of grain distortion applied to shape edges
</ParamField>

<ParamField path="grainOverlay" type="number" default="0" min="0" max="1">
  Post-processing black/white grain overlay
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

The FlutedGlass shader comes with several built-in presets:

* **Default**: Classic fluted glass with prism distortion
* **Abstract**: Irregular lines with high blur and distortion
* **Waves**: Wave pattern with stretch and contour distortion
* **Folds**: Cascade distortion with margins

<CodeGroup>
  ```tsx React Preset Usage theme={null}
  import { FlutedGlass, flutedGlassPresets } from '@paper-design/shaders-react';

  function App() {
    return <FlutedGlass {...flutedGlassPresets[0].params} image="/image.jpg" />;
  }
  ```
</CodeGroup>

## Examples

### Wave Pattern

```tsx theme={null}
<FlutedGlass
  image="/image.jpg"
  size={0.9}
  shape="wave"
  distortionShape="contour"
  distortion={0.5}
  blur={0.1}
  edges={0.5}
  stretch={1}
  grainOverlay={0.05}
/>
```

### Abstract Effect

```tsx theme={null}
<FlutedGlass
  image="/image.jpg"
  scale={4}
  size={0.7}
  shape="linesIrregular"
  distortionShape="flat"
  distortion={1}
  angle={30}
  blur={1}
  edges={0.5}
  stretch={1}
  grainMixer={0.1}
  grainOverlay={0.1}
/>
```

### Subtle Folds

```tsx theme={null}
<FlutedGlass
  image="/image.jpg"
  size={0.4}
  shape="lines"
  distortionShape="cascade"
  distortion={0.75}
  shadows={0.4}
  blur={0.25}
  edges={0.5}
  margin={0.1}
/>
```

## Technical Details

### Shader Uniforms (Vanilla JS)

When using the vanilla JavaScript API:

```js theme={null}
import { GlassGridShapes, GlassDistortionShapes } from '@paper-design/shaders';

{
  u_shape: GlassGridShapes.lines, // or 1
  u_distortionShape: GlassDistortionShapes.prism, // or 1
  u_colorBack: [r, g, b, a],
  u_colorShadow: [r, g, b, a],
  u_colorHighlight: [r, g, b, a],
  // ... other parameters
}
```

### Grid Shapes

* `lines` (1): Regular parallel lines
* `linesIrregular` (2): Irregular line patterns
* `wave` (3): Sine wave pattern
* `zigzag` (4): Zigzag pattern
* `pattern` (5): Complex 2D pattern

### Distortion Shapes

* `prism` (1): Sharp prismatic effect
* `lens` (2): Curved lens effect
* `contour` (3): Depth contour effect
* `cascade` (4): Cascading waves
* `flat` (5): Minimal distortion

### Performance Notes

* Static shader (no animation by default)
* Blur parameter can impact performance at high values
* Grain effects are relatively lightweight
* Works best with high-resolution source images
