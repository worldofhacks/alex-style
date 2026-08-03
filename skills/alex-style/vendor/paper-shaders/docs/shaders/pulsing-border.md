> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Pulsing Border

> Luminous trails of color merging into a glowing gradient contour

Luminous trails of color merging into a glowing gradient contour. Features animated spots of up to 5 colors with customizable margins, roundness, and smoke effects.

## React Usage

```tsx theme={null}
import { PulsingBorder } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <PulsingBorder
      colorBack="#000000"
      colors={['#0dc1fd', '#d915ef', '#ff3f2ecc']}
      roundness={0.25}
      thickness={0.1}
      margin={0}
      softness={0.75}
      intensity={0.2}
      bloom={0.25}
      spots={5}
      spotSize={0.5}
      pulse={0.25}
      smoke={0.3}
      smokeSize={0.6}
      speed={1}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountPulsingBorder } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountPulsingBorder(canvas, {
  colorBack: '#000000',
  colors: ['#0dc1fd', '#d915ef', '#ff3f2ecc'],
  roundness: 0.25,
  thickness: 0.1,
  margin: 0,
  softness: 0.75,
  intensity: 0.2,
  bloom: 0.25,
  spots: 5,
  spotSize: 0.5,
  pulse: 0.25,
  smoke: 0.3,
  smokeSize: 0.6,
  speed: 1,
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format.
</ParamField>

<ParamField path="colors" type="string[]" default="['#0dc1fd', '#d915ef', '#ff3f2ecc']">
  Array of up to 5 spot colors in hex format. Supports alpha channel.
</ParamField>

<ParamField path="roundness" type="number" default="0.25">
  Border radius. 0 creates sharp corners, 1 creates circular shape. Range: 0 to 1.
</ParamField>

<ParamField path="thickness" type="number" default="0.1">
  Border base width. Range: 0 to 1.
</ParamField>

<ParamField path="margin" type="number" default="0">
  Uniform margin distance from all edges. Range: 0 to 1.
</ParamField>

<ParamField path="marginLeft" type="number" default="0">
  Distance from the left edge to the effect. Overrides `margin`. Range: 0 to 1.
</ParamField>

<ParamField path="marginRight" type="number" default="0">
  Distance from the right edge to the effect. Overrides `margin`. Range: 0 to 1.
</ParamField>

<ParamField path="marginTop" type="number" default="0">
  Distance from the top edge to the effect. Overrides `margin`. Range: 0 to 1.
</ParamField>

<ParamField path="marginBottom" type="number" default="0">
  Distance from the bottom edge to the effect. Overrides `margin`. Range: 0 to 1.
</ParamField>

<ParamField path="aspectRatio" type="'auto' | 'square'" default="'auto'">
  Aspect ratio mode:

  * `auto`: Adapts to container dimensions
  * `square`: Forces square proportions
</ParamField>

<ParamField path="softness" type="number" default="0.75">
  Border edge sharpness. 0 creates hard edges, 1 creates smooth gradients. Range: 0 to 1.
</ParamField>

<ParamField path="intensity" type="number" default="0.2">
  Thickness of individual color spots. Range: 0 to 1.
</ParamField>

<ParamField path="bloom" type="number" default="0.25">
  Power of glow. 0 uses normal blending, 1 uses additive blending. Range: 0 to 1.
</ParamField>

<ParamField path="spots" type="number" default="5">
  Number of spots added for each color. Range: 1 to 20.
</ParamField>

<ParamField path="spotSize" type="number" default="0.5">
  Angular size of spots. Range: 0 to 1.
</ParamField>

<ParamField path="pulse" type="number" default="0.25">
  Optional pulsing animation intensity. Range: 0 to 1.
</ParamField>

<ParamField path="smoke" type="number" default="0.3">
  Optional noisy shape extending the border. Range: 0 to 1.
</ParamField>

<ParamField path="smokeSize" type="number" default="0.6">
  Size of the smoke effect. Range: 0 to 1.
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

The Pulsing Border shader comes with several built-in presets:

* **Default**: Cyan, magenta, and red rounded border
* **Circle**: Circular glowing border with smoke
* **Northern lights**: Slow-moving ethereal aurora effect
* **Solid line**: Simple single-color line border

```tsx theme={null}
import { PulsingBorder, circlePreset } from '@paper-design/shaders-react';

<PulsingBorder {...circlePreset.params} />
```

## Notes

* Use individual margin properties for asymmetric borders
* Combine `pulse` with `spotSize` for dramatic pulsing effects
* Set `bloom={1}` for intense additive glow
* Use `aspectRatio="square"` with `roundness={1}` for perfect circles
