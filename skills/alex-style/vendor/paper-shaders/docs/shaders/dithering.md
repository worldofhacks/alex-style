> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Dithering

> Animated 2-color dithering over multiple pattern sources

Animated 2-color dithering over multiple pattern sources (noise, warp, dots, waves, ripple, swirl, sphere). Features various dithering algorithms including random and Bayer matrix patterns.

## React Usage

```tsx theme={null}
import { Dithering } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <Dithering
      colorBack="#000000"
      colorFront="#00b2ff"
      shape="sphere"
      type="4x4"
      size={2}
      speed={1}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountDithering } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountDithering(canvas, {
  colorBack: '#000000',
  colorFront: '#00b2ff',
  shape: 'sphere',
  type: '4x4',
  size: 2,
  speed: 1,
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format.
</ParamField>

<ParamField path="colorFront" type="string" default="'#00b2ff'">
  Foreground (ink) color in hex format.
</ParamField>

<ParamField path="shape" type="'simplex' | 'warp' | 'dots' | 'wave' | 'ripple' | 'swirl' | 'sphere'" default="'sphere'">
  Shape pattern type:

  * `simplex`: Simplex noise pattern
  * `warp`: Warped flowing pattern
  * `dots`: Animated dot pattern
  * `wave`: Sine wave pattern
  * `ripple`: Circular ripple effect
  * `swirl`: Twisted vortex pattern
  * `sphere`: 3D illuminated sphere
</ParamField>

<ParamField path="type" type="'random' | '2x2' | '4x4' | '8x8'" default="'4x4'">
  Dithering algorithm type:

  * `random`: Random dithering
  * `2x2`: 2×2 Bayer matrix
  * `4x4`: 4×4 Bayer matrix
  * `8x8`: 8×8 Bayer matrix (finest)
</ParamField>

<ParamField path="size" type="number" default="2">
  Pixel size of dithering grid. Higher values create larger pixels. Range: 0.5 to 20.
</ParamField>

<ParamField path="speed" type="number" default="1">
  Animation speed multiplier. Set to 0 to pause animation.
</ParamField>

<ParamField path="frame" type="number" default="0">
  Specific frame to display when speed is 0.
</ParamField>

### Common Sizing Parameters

<ParamField path="scale" type="number" default="0.6">
  Overall zoom level of the graphics. Range: 0.01 to 4.
</ParamField>

<ParamField path="rotation" type="number" default="0">
  Rotation angle in degrees. Range: 0 to 360.
</ParamField>

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'contain'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="offsetX" type="number" default="0">
  Horizontal offset of the graphics center. Range: -1 to 1.
</ParamField>

<ParamField path="offsetY" type="number" default="0">
  Vertical offset of the graphics center. Range: -1 to 1.
</ParamField>

## Presets

The Dithering shader comes with several built-in presets:

* **Default**: Blue sphere with 4×4 Bayer dithering
* **Warp**: Green flowing pattern with 4×4 dithering
* **Sine Wave**: Cyan wave with 4×4 dithering
* **Ripple**: Orange circular ripples with 2×2 dithering
* **Bugs**: Green animated dots with random dithering
* **Swirl**: Blue vortex with 8×8 dithering

```tsx theme={null}
import { Dithering, swirlPreset } from '@paper-design/shaders-react';

<Dithering {...swirlPreset.params} />
```

## Notes

* This shader performs sizing in the fragment shader to keep pixel grid consistent
* Different dithering types create different visual textures:
  * `random`: Organic, grainy appearance
  * `2x2`: Coarse, checkerboard-like pattern
  * `4x4`: Medium detail, classic dithering look
  * `8x8`: Fine detail, smooth gradations
* Experiment with `size` parameter to achieve retro pixel art effects
