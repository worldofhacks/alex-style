> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Water

> Water-like surface distortion with natural caustic realism

Water-like surface distortion with natural caustic realism. Works as an image filter or standalone animated texture with realistic underwater light patterns.

## Features

* Realistic water caustic patterns
* Animated wave distortion
* Configurable highlight intensity
* Multi-layer caustic effects
* Edge distortion control
* Works as filter or standalone texture

## Basic Usage

<CodeGroup>
  ```tsx React theme={null}
  import { Water } from '@paper-design/shaders-react';

  function App() {
    return (
      <Water
        image="/path/to/image.jpg"
        colorBack="#909090"
        colorHighlight="#ffffff"
        highlights={0.07}
        layering={0.5}
        edges={0.8}
        waves={0.3}
        caustic={0.1}
        size={1}
        speed={1}
      />
    );
  }
  ```

  ```js Vanilla JavaScript theme={null}
  import { mountShader, waterFragmentShader } from '@paper-design/shaders';

  const canvas = document.getElementById('canvas');
  const mount = mountShader(canvas, {
    fragmentShader: waterFragmentShader,
    uniforms: {
      u_image: '/path/to/image.jpg',
      u_colorBack: [0.565, 0.565, 0.565, 1],
      u_colorHighlight: [1, 1, 1, 1],
      u_highlights: 0.07,
      u_layering: 0.5,
      u_edges: 0.8,
      u_waves: 0.3,
      u_caustic: 0.1,
      u_size: 1,
      // Sizing uniforms
      u_fit: 2, // 0=none, 1=contain, 2=cover
      u_scale: 0.8,
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
  Optional source image to apply the water effect to
</ParamField>

<ParamField path="colorBack" type="string" default="'#909090'">
  Background color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorHighlight" type="string" default="'#ffffff'">
  Highlight color for caustic patterns in hex, rgb, or rgba format
</ParamField>

<ParamField path="highlights" type="number" default="0.07" min="0" max="1">
  Coloring added over image/background following caustic shape
</ParamField>

<ParamField path="layering" type="number" default="0.5" min="0" max="1">
  Power of 2nd layer of caustic distortion for more complex patterns
</ParamField>

<ParamField path="edges" type="number" default="0.8" min="0" max="1">
  Caustic distortion power on the image edges
</ParamField>

<ParamField path="waves" type="number" default="0.3" min="0" max="1">
  Additional distortion based on simplex noise, independent from caustic
</ParamField>

<ParamField path="caustic" type="number" default="0.1" min="0" max="1">
  Overall power of caustic distortion effect
</ParamField>

<ParamField path="size" type="number" default="1" min="0.01" max="7">
  Pattern scale relative to the image
</ParamField>

### Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'contain'">
  How to fit the shader into the canvas dimensions
</ParamField>

<ParamField path="scale" type="number" default="0.8" min="0.01" max="4">
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

<ParamField path="speed" type="number" default="1">
  Animation speed multiplier
</ParamField>

<ParamField path="frame" type="number" default="0">
  Manual frame control for animation
</ParamField>

## Presets

The Water shader comes with several built-in presets:

* **Default**: Balanced water effect with caustics and waves
* **Slow-mo**: Slow animation with strong highlights
* **Abstract**: High-scale pattern for abstract effects
* **Streaming**: Fast flowing water without caustics

<CodeGroup>
  ```tsx React Preset Usage theme={null}
  import { Water, waterPresets } from '@paper-design/shaders-react';

  function App() {
    return <Water {...waterPresets[0].params} />;
  }
  ```
</CodeGroup>

## Examples

### Slow Motion Water

```tsx theme={null}
<Water
  image="/image.jpg"
  speed={0.1}
  highlights={0.4}
  layering={0}
  edges={0}
  waves={0}
  caustic={0.2}
  size={0.7}
/>
```

### Abstract Water Pattern

```tsx theme={null}
<Water
  fit="cover"
  scale={3}
  highlights={0}
  layering={0}
  edges={1}
  waves={1}
  caustic={0.4}
  size={0.15}
/>
```

### Streaming Effect

```tsx theme={null}
<Water
  image="/image.jpg"
  fit="contain"
  scale={0.4}
  speed={2}
  highlights={0}
  layering={0}
  edges={0}
  waves={0.5}
  caustic={0}
  size={0.5}
/>
```

## Technical Details

### Shader Uniforms (Vanilla JS)

When using the vanilla JavaScript API, colors are passed as RGBA arrays with values from 0 to 1:

```js theme={null}
{
  u_colorBack: [r, g, b, a], // e.g., [0.565, 0.565, 0.565, 1]
  u_colorHighlight: [r, g, b, a],
  u_highlights: 0.07,
  u_layering: 0.5,
  u_waves: 0.3,
  u_edges: 0.8,
  u_caustic: 0.1,
  u_size: 1,
}
```

### Animation

The Water shader is animated by default. The animation shows:

* Moving caustic patterns
* Wave distortion
* Flowing highlights

Control animation with the `speed` parameter or `frame` for manual control.

### Performance Notes

* Animated shader with continuous rendering
* Uses simplex noise for wave distortion
* Multiple layers can be disabled for better performance
* Best with moderate `size` values for visible caustics
