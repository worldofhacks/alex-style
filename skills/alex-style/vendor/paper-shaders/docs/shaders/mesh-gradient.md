> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Mesh Gradient

> A flowing composition of color spots with organic distortion and animation

The Mesh Gradient shader creates a flowing composition of color spots that move along distinct trajectories and are transformed by organic distortion. It supports up to 10 colors and provides controls for distortion, swirl effects, and grain overlays.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { MeshGradient } from '@paper-design/shaders-react';

  function App() {
    return (
      <MeshGradient
        colors={['#e0eaff', '#241d9a', '#f75092', '#9f50d3']}
        speed={1}
        distortion={0.8}
        swirl={0.1}
        grainMixer={0}
        grainOverlay={0}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, meshGradientFragmentShader } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    meshGradientFragmentShader,
    {
      u_colors: [
        [0.88, 0.92, 1, 1],
        [0.14, 0.11, 0.6, 1],
        [0.97, 0.31, 0.57, 1],
        [0.62, 0.31, 0.83, 1]
      ],
      u_colorsCount: 4,
      u_distortion: 0.8,
      u_swirl: 0.1,
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
      u_worldWidth: 0,
      u_worldHeight: 0,
    },
    {}, // WebGL context attributes
    1   // speed
  );
  ```
</CodeGroup>

## Parameters

<ParamField path="colors" type="string[]" default="['#e0eaff', '#241d9a', '#f75092', '#9f50d3']">
  Array of color hex strings for the gradient spots. Supports up to 10 colors. Each color creates a moving spot that blends with others.
</ParamField>

<ParamField path="distortion" type="number" default="0.8">
  Power of organic noise distortion applied to the gradient (0 to 1). Higher values create more wavy, organic movement.
</ParamField>

<ParamField path="swirl" type="number" default="0.1">
  Power of vortex distortion effect (0 to 1). Creates a rotational swirl around the center of the gradient.
</ParamField>

<ParamField path="grainMixer" type="number" default="0">
  Strength of grain distortion applied to shape edges (0 to 1). Adds texture to the boundaries between color spots.
</ParamField>

<ParamField path="grainOverlay" type="number" default="0">
  Post-processing black/white grain overlay strength (0 to 1). Adds a film grain effect over the entire gradient.
</ParamField>

<ParamField path="speed" type="number" default="1">
  Animation speed multiplier. Set to 0 to pause animation and use manual frame control.
</ParamField>

<ParamField path="frame" type="number" default="0">
  Manual frame counter for when speed is 0. Useful for scrubbing through the animation.
</ParamField>

### Common Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="scale" type="number" default="1">
  Overall zoom level of the graphics (0.01 to 4).
</ParamField>

<ParamField path="rotation" type="number" default="0">
  Overall rotation angle in degrees (0 to 360).
</ParamField>

<ParamField path="offsetX" type="number" default="0">
  Horizontal offset of the graphics center (-1 to 1).
</ParamField>

<ParamField path="offsetY" type="number" default="0">
  Vertical offset of the graphics center (-1 to 1).
</ParamField>

<ParamField path="originX" type="number" default="0.5">
  Reference point for positioning world width in the canvas (0 to 1).
</ParamField>

<ParamField path="originY" type="number" default="0.5">
  Reference point for positioning world height in the canvas (0 to 1).
</ParamField>

## Presets

The component comes with several built-in presets:

### Default

```tsx theme={null}
<MeshGradient
  colors={['#e0eaff', '#241d9a', '#f75092', '#9f50d3']}
  speed={1}
  distortion={0.8}
  swirl={0.1}
/>
```

### Ink

```tsx theme={null}
<MeshGradient
  colors={['#ffffff', '#000000']}
  speed={1}
  distortion={1}
  swirl={0.2}
  rotation={90}
/>
```

### Purple

```tsx theme={null}
<MeshGradient
  colors={['#aaa7d7', '#3c2b8e']}
  speed={0.6}
  distortion={1}
  swirl={1}
/>
```

### Beach

```tsx theme={null}
<MeshGradient
  colors={['#bcecf6', '#00aaff', '#00f7ff', '#ffd447']}
  speed={0.1}
  distortion={0.8}
  swirl={0.35}
/>
```

## Technical Details

* **Max Colors**: 10
* **Animation**: Continuous flowing motion of color spots
* **Performance**: Optimized for real-time rendering
* **Coordinates**: Uses object UV coordinates with sizing transforms

The shader calculates positions for each color spot using procedural functions, applies noise-based distortion and vortex rotation, then blends colors using inverse distance weighting for smooth transitions.
