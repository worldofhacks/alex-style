> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Halftone CMYK

> CMYK halftone printing effect with customizable ink colors

CMYK halftone printing effect applied to images with customizable dot patterns and ink colors for each channel (Cyan, Magenta, Yellow, Black). Simulates traditional four-color printing process.

## Features

* True CMYK color separation
* Customizable ink colors per channel
* Multiple dot styles (dots, ink, sharp)
* Individual channel gain and flood controls
* Grid noise and grain effects
* Vintage printing simulation

## Basic Usage

<CodeGroup>
  ```tsx React theme={null}
  import { HalftoneCmyk } from '@paper-design/shaders-react';

  function App() {
    return (
      <HalftoneCmyk
        image="/path/to/image.jpg"
        type="ink"
        size={0.2}
        contrast={1}
        softness={1}
        colorBack="#fbfaf5"
        colorC="#00b4ff"
        colorM="#fc519f"
        colorY="#ffd800"
        colorK="#231f20"
        gridNoise={0.2}
        floodC={0.15}
        gainC={0.3}
        gainY={0.2}
      />
    );
  }
  ```

  ```js Vanilla JavaScript theme={null}
  import { mountShader, halftoneCmykFragmentShader, HalftoneCmykTypes, getShaderNoiseTexture } from '@paper-design/shaders';

  const canvas = document.getElementById('canvas');
  const mount = mountShader(canvas, {
    fragmentShader: halftoneCmykFragmentShader,
    uniforms: {
      u_image: '/path/to/image.jpg',
      u_noiseTexture: getShaderNoiseTexture(),
      u_type: HalftoneCmykTypes.ink, // 1
      u_size: 0.2,
      u_contrast: 1,
      u_softness: 1,
      u_colorBack: [0.984, 0.980, 0.961, 1],
      u_colorC: [0, 0.706, 1, 1],
      u_colorM: [0.988, 0.318, 0.624, 1],
      u_colorY: [1, 0.847, 0, 1],
      u_colorK: [0.137, 0.122, 0.125, 1],
      u_gridNoise: 0.2,
      u_grainSize: 0.5,
      u_grainMixer: 0,
      u_grainOverlay: 0,
      u_floodC: 0.15,
      u_floodM: 0,
      u_floodY: 0,
      u_floodK: 0,
      u_gainC: 0.3,
      u_gainM: 0,
      u_gainY: 0.2,
      u_gainK: 0,
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
  Optional source image to convert to CMYK halftone
</ParamField>

<ParamField path="type" type="'dots' | 'ink' | 'sharp'" default="'ink'">
  Dot rendering style:

  * `dots`: Separate dots with clear boundaries
  * `ink`: Blended dots simulating ink spread
  * `sharp`: Sharp dots with per-pixel color sampling
</ParamField>

<ParamField path="size" type="number" default="0.2" min="0" max="1">
  Halftone cell size (0 = large cells, 1 = small cells)
</ParamField>

<ParamField path="contrast" type="number" default="1" min="0" max="2">
  Image contrast adjustment before halftone conversion
</ParamField>

<ParamField path="softness" type="number" default="1" min="0" max="1">
  Edge softness of dots (0 = hard edge, 1 = smooth gradient)
</ParamField>

<ParamField path="colorBack" type="string" default="'#fbfaf5'">
  Background (paper) color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorC" type="string" default="'#00b4ff'">
  Cyan ink color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorM" type="string" default="'#fc519f'">
  Magenta ink color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorY" type="string" default="'#ffd800'">
  Yellow ink color in hex, rgb, or rgba format
</ParamField>

<ParamField path="colorK" type="string" default="'#231f20'">
  Black (key) ink color in hex, rgb, or rgba format
</ParamField>

<ParamField path="gridNoise" type="number" default="0.2" min="0" max="1">
  Smooth noise applied to both dot positions and color sampling
</ParamField>

<ParamField path="grainSize" type="number" default="0.5" min="0" max="1">
  Size of grain overlay texture
</ParamField>

<ParamField path="grainMixer" type="number" default="0" min="0" max="1">
  Strength of grain affecting dot size
</ParamField>

<ParamField path="grainOverlay" type="number" default="0" min="0" max="1">
  Strength of grain overlay on final output
</ParamField>

### Channel Controls

<ParamField path="floodC" type="number" default="0.15" min="-1" max="1">
  Flat cyan dot size adjustment applied uniformly
</ParamField>

<ParamField path="floodM" type="number" default="0" min="-1" max="1">
  Flat magenta dot size adjustment applied uniformly
</ParamField>

<ParamField path="floodY" type="number" default="0" min="-1" max="1">
  Flat yellow dot size adjustment applied uniformly
</ParamField>

<ParamField path="floodK" type="number" default="0" min="-1" max="1">
  Flat black dot size adjustment applied uniformly
</ParamField>

<ParamField path="gainC" type="number" default="0.3" min="-1" max="1">
  Proportional cyan dot size gain (enhances existing dots)
</ParamField>

<ParamField path="gainM" type="number" default="0" min="-1" max="1">
  Proportional magenta dot size gain
</ParamField>

<ParamField path="gainY" type="number" default="0.2" min="-1" max="1">
  Proportional yellow dot size gain
</ParamField>

<ParamField path="gainK" type="number" default="0" min="-1" max="1">
  Proportional black dot size gain
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

The HalftoneCmyk shader comes with several built-in presets:

* **Default**: Vibrant CMYK with cyan and yellow emphasis
* **Drops**: High contrast with irregular dot placement
* **Newspaper**: Grayscale newsprint effect
* **Vintage**: Soft vintage colors with grain

<CodeGroup>
  ```tsx React Preset Usage theme={null}
  import { HalftoneCmyk, halftoneCmykPresets } from '@paper-design/shaders-react';

  function App() {
    return <HalftoneCmyk {...halftoneCmykPresets[0].params} image="/image.jpg" />;
  }
  ```
</CodeGroup>

## Examples

### Newspaper Print

```tsx theme={null}
<HalftoneCmyk
  image="/image.jpg"
  type="dots"
  size={0.01}
  contrast={2}
  softness={0.2}
  colorBack="#f2f1e8"
  colorC="#7a7a75"
  colorM="#7a7a75"
  colorY="#7a7a75"
  colorK="#231f20"
  gridNoise={0.6}
  floodK={0.1}
  gainC={-0.17}
  gainM={-0.45}
  gainY={-0.45}
  grainOverlay={0.2}
/>
```

### Vintage Poster

```tsx theme={null}
<HalftoneCmyk
  image="/image.jpg"
  type="sharp"
  size={0.2}
  contrast={1.25}
  softness={0.4}
  colorBack="#fffaf0"
  colorC="#59afc5"
  colorM="#d8697c"
  colorY="#fad85c"
  colorK="#2d2824"
  gridNoise={0.45}
  floodC={0.15}
  gainC={0.3}
  gainY={0.2}
  grainMixer={0.15}
  grainOverlay={0.1}
/>
```

### High Contrast Drops

```tsx theme={null}
<HalftoneCmyk
  image="/image.jpg"
  type="ink"
  size={0.88}
  contrast={1.15}
  softness={0}
  colorBack="#eeefd7"
  colorC="#00b2ff"
  colorM="#fc4f4f"
  colorY="#ffd900"
  colorK="#231f20"
  gridNoise={0.5}
  floodC={0.15}
  gainC={1.0}
  gainM={0.44}
  gainY={-1.0}
  grainMixer={0.05}
  grainOverlay={0.25}
/>
```

## Technical Details

### Shader Uniforms (Vanilla JS)

When using the vanilla JavaScript API:

```js theme={null}
import { HalftoneCmykTypes, getShaderNoiseTexture } from '@paper-design/shaders';

{
  u_type: HalftoneCmykTypes.ink, // or 1
  u_noiseTexture: getShaderNoiseTexture(), // Required!
  u_colorBack: [r, g, b, a],
  u_colorC: [r, g, b, a],
  u_colorM: [r, g, b, a],
  u_colorY: [r, g, b, a],
  u_colorK: [r, g, b, a],
  // ... other parameters
}
```

### Dot Types

* `dots` (0): Separate dots with clear boundaries
* `ink` (1): Blended dots simulating ink spread
* `sharp` (2): Sharp dots with direct pixel sampling

### CMYK Separation

The shader automatically converts RGB images to CMYK using standard formulas:

* **Cyan**: Absence of red
* **Magenta**: Absence of green
* **Yellow**: Absence of blue
* **Black (Key)**: Overall darkness

Each channel is rendered at a different rotation angle (15°, 75°, 0°, 45°) to prevent moiré patterns.

### Channel Controls

**Flood Parameters** (`-1` to `1`):

* Add or subtract a flat amount from all dots in a channel
* Positive values make all dots bigger
* Negative values make all dots smaller
* Useful for overall color balance

**Gain Parameters** (`-1` to `1`):

* Multiply existing dot sizes proportionally
* Positive values enhance existing dots
* Negative values reduce existing dots
* Preserves relative differences between areas

### Performance Notes

* Static shader (no animation by default)
* Requires noise texture (automatically handled in React)
* `ink` and `sharp` types sample 9 cells per pixel
* Performance scales with image resolution
* Grid noise adds slight computational cost
