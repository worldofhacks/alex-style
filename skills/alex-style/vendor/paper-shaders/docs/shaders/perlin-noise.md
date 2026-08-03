> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Perlin Noise

> Classic animated 3D Perlin noise with exposed controls for octaves, persistence, and lacunarity

The Perlin Noise shader implements the classic 3D Perlin noise algorithm with full control over octaves, persistence, and lacunarity. Perfect for creating natural, flowing patterns like water, clouds, marble, or organic textures.

## Usage

<CodeGroup>
  ```tsx React theme={null}
  import { PerlinNoise } from '@paper-design/shaders-react';

  function App() {
    return (
      <PerlinNoise
        colorFront="#fccff7"
        colorBack="#632ad5"
        proportion={0.35}
        softness={0.1}
        octaveCount={1}
        persistence={1}
        lacunarity={1.5}
        speed={0.5}
      />
    );
  }
  ```

  ```javascript Vanilla JS theme={null}
  import { ShaderMount, perlinNoiseFragmentShader } from '@paper-design/shaders';

  const container = document.getElementById('container');
  const shader = new ShaderMount(
    container,
    perlinNoiseFragmentShader,
    {
      u_colorFront: [0.99, 0.81, 0.97, 1],
      u_colorBack: [0.39, 0.16, 0.84, 1],
      u_proportion: 0.35,
      u_softness: 0.1,
      u_octaveCount: 1,
      u_persistence: 1,
      u_lacunarity: 1.5,
      // Sizing uniforms
      u_fit: 2,
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
    0.5 // speed
  );
  ```
</CodeGroup>

## Parameters

<ParamField path="colorFront" type="string" default="'#fccff7'">
  Foreground color in hex format. Appears in the bright areas of the noise pattern.
</ParamField>

<ParamField path="colorBack" type="string" default="'#632ad5'">
  Background color in hex format. Appears in the dark areas of the noise pattern.
</ParamField>

<ParamField path="proportion" type="number" default="0.35">
  Blend point between 2 colors (0 to 1). 0.5 = equal distribution, lower values show more foreground, higher values show more background.
</ParamField>

<ParamField path="softness" type="number" default="0.1">
  Color transition sharpness (0 to 1). 0 = hard edge between colors, 1 = smooth gradient transition.
</ParamField>

<ParamField path="octaveCount" type="number" default="1">
  Number of noise octaves (1 to 8). More octaves create more detailed patterns but impact performance. Each octave adds a layer of detail.
</ParamField>

<ParamField path="persistence" type="number" default="1">
  Roughness and falloff between octaves (0.3 to 1). Lower values make higher octaves contribute less, creating smoother patterns. Higher values retain more detail.
</ParamField>

<ParamField path="lacunarity" type="number" default="1.5">
  Frequency step between octaves (1.5 to 10). Defines how compressed the pattern is. Higher values create more compressed, intricate patterns.
</ParamField>

<ParamField path="speed" type="number" default="0.5">
  Animation speed multiplier. Controls how fast the noise evolves through the third dimension (time).
</ParamField>

### Common Sizing Parameters

<ParamField path="fit" type="'none' | 'contain' | 'cover'" default="'cover'">
  How to fit the shader into the canvas dimensions.
</ParamField>

<ParamField path="scale" type="number" default="1">
  Overall zoom level (0.01 to 4). Affects the size of noise features.
</ParamField>

<ParamField path="rotation" type="number" default="0">
  Rotation angle in degrees (0 to 360).
</ParamField>

<ParamField path="offsetX" type="number" default="0">
  Horizontal offset (-1 to 1).
</ParamField>

<ParamField path="offsetY" type="number" default="0">
  Vertical offset (-1 to 1).
</ParamField>

## Presets

### Default

```tsx theme={null}
<PerlinNoise
  colorFront="#fccff7"
  colorBack="#632ad5"
  proportion={0.35}
  softness={0.1}
  octaveCount={1}
  persistence={1}
  lacunarity={1.5}
  speed={0.5}
/>
```

### Nintendo Water

```tsx theme={null}
<PerlinNoise
  colorFront="#d1eefc"
  colorBack="#2d69d4"
  proportion={0.42}
  softness={0}
  octaveCount={2}
  persistence={0.55}
  lacunarity={1.8}
  scale={1 / 0.2}
  speed={0.4}
/>
```

### Moss

```tsx theme={null}
<PerlinNoise
  colorFront="#262626"
  colorBack="#05ff4a"
  proportion={0.65}
  softness={0.35}
  octaveCount={6}
  persistence={1}
  lacunarity={2.55}
  scale={1 / 0.15}
  speed={0.02}
/>
```

### Worms

```tsx theme={null}
<PerlinNoise
  colorFront="#595959"
  colorBack="#ffffff00"
  proportion={0.5}
  softness={0}
  octaveCount={1}
  persistence={1}
  lacunarity={1.5}
  scale={0.9}
  speed={0}
/>
```

## Technical Details

* **Algorithm**: Classic 3D Perlin noise with gradient interpolation
* **Gradients**: 12 predefined gradient vectors for consistent results
* **Interpolation**: Fade function using 6t⁵ - 15t⁴ + 10t³
* **Octaves**: Fractal Brownian Motion (FBM) with configurable layers
* **Coordinates**: Uses pattern UV coordinates scaled by 0.5
* **Anti-aliasing**: Uses `fwidth` for smooth color transitions
* **Original Algorithm**: Based on [NlSGDz shader](https://www.shadertoy.com/view/NlSGDz)

The shader generates 3D Perlin noise by:

1. Computing gradient vectors at the corners of a 3D grid cell
2. Interpolating using the fade function for smooth transitions
3. Optionally layering multiple octaves with decreasing amplitude and increasing frequency
4. Normalizing the result and mapping to two colors with configurable sharpness
