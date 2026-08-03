> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Waves

> Static line pattern from zigzags to smooth waves

Static line pattern configurable into textures ranging from sharp zigzags to smooth flowing waves. Supports various wave shapes and spacing controls.

## React Usage

```tsx theme={null}
import { Waves } from '@paper-design/shaders-react';

export default function MyComponent() {
  return (
    <Waves
      colorFront="#ffbb00"
      colorBack="#000000"
      shape={0}
      frequency={0.5}
      amplitude={0.5}
      spacing={1.2}
      proportion={0.1}
      softness={0}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
```

## Vanilla JavaScript Usage

```javascript theme={null}
import { mountWaves } from '@paper-design/shaders';

const canvas = document.getElementById('myCanvas');
const cleanup = mountWaves(canvas, {
  colorFront: '#ffbb00',
  colorBack: '#000000',
  shape: 0,
  frequency: 0.5,
  amplitude: 0.5,
  spacing: 1.2,
  proportion: 0.1,
  softness: 0,
});

// Call cleanup() when done
```

## Parameters

<ParamField path="colorFront" type="string" default="'#ffbb00'">
  Foreground color in hex format.
</ParamField>

<ParamField path="colorBack" type="string" default="'#000000'">
  Background color in hex format.
</ParamField>

<ParamField path="shape" type="number" default="0">
  Line shape style. Fractional values morph between shapes:

  * 0: Zigzag
  * 1: Sine wave
  * 2-3: Irregular waves

  Range: 0 to 3.
</ParamField>

<ParamField path="frequency" type="number" default="0.5">
  Wave frequency controlling the number of cycles. Range: 0 to 2.
</ParamField>

<ParamField path="amplitude" type="number" default="0.5">
  Wave amplitude controlling the height. Range: 0 to 1.
</ParamField>

<ParamField path="spacing" type="number" default="1.2">
  Space between every two wavy lines. Range: 0 to 2.
</ParamField>

<ParamField path="proportion" type="number" default="0.1">
  Blend point between front and back colors, where 0.5 equals equal distribution. Range: 0 to 1.
</ParamField>

<ParamField path="softness" type="number" default="0">
  Color transition sharpness. 0 creates hard edges, 1 creates smooth gradients. Range: 0 to 1.
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

The Waves shader comes with several built-in presets:

* **Default**: Orange zigzag waves on black
* **Groovy**: Vertical flowing waves with soft colors
* **Tangled up**: Green and blue irregular waves
* **Ride the wave**: High amplitude dramatic waves

```tsx theme={null}
import { Waves, groovyPreset } from '@paper-design/shaders-react';

<Waves {...groovyPreset.params} />
```

## Notes

* This shader is static and does not animate
* Supports higher resolution rendering (up to 6016×3384 pixels)
* Use fractional `shape` values to create unique hybrid patterns
* Combine with `rotation` to create vertical or diagonal wave patterns
