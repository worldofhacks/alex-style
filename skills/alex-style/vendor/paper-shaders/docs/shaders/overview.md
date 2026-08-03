> ## Documentation Index
> Fetch the complete documentation index at: https://mintlify.com/paper-design/shaders/llms.txt
> Use this file to discover all available pages before exploring further.

# Shaders Overview

> Explore all available Paper Shaders with visual examples and categories

Paper Shaders provides a collection of GPU-accelerated visual effects that run smoothly in the browser. Each shader is highly customizable and available as both React components and vanilla JavaScript functions.

## Categories

### Gradients

Smooth color transitions and blends perfect for backgrounds and visual interest.

* **[Mesh Gradient](/shaders/mesh-gradient)** - Flowing composition of color spots with organic distortion
* **[Static Mesh Gradient](/shaders/static-mesh-gradient)** - Multi-point gradient with wave distortion controls
* **[Static Radial Gradient](/shaders/static-radial-gradient)** - Radial gradient with focal point and shape controls
* **[Grain Gradient](/shaders/grain-gradient)** - Multi-color gradients with grainy noise texture in 7 abstract forms

### Noise & Organic

Natural, flowing patterns based on mathematical noise functions.

* **[Simplex Noise](/shaders/simplex-noise)** - Smooth animated curves with multi-color gradients
* **[Neuro Noise](/shaders/neuro-noise)** - Glowing web-like structure of fluid lines
* **[Perlin Noise](/shaders/perlin-noise)** - Classic 3D Perlin noise with customizable octaves
* **[Smoke Ring](/shaders/smoke-ring)** - Radial gradient shaped with layered noise for smoky effects

### Shapes & Patterns

Geometric and organic shapes with dynamic animations.

* **[Metaballs](/shaders/metaballs)** - Gooey balls that merge into smooth organic shapes
* **[Voronoi](/shaders/voronoi)** - Animated cellular pattern with customizable edges

## Installation

All shaders are included in the Paper Shaders packages:

<CodeGroup>
  ```bash npm theme={null}
  npm install @paper-design/shaders-react
  ```

  ```bash yarn theme={null}
  yarn add @paper-design/shaders-react
  ```

  ```bash pnpm theme={null}
  pnpm add @paper-design/shaders-react
  ```
</CodeGroup>

## Usage Patterns

### React Components

All shaders are available as React components:

```tsx theme={null}
import { MeshGradient } from '@paper-design/shaders-react';

function App() {
  return (
    <MeshGradient
      colors={['#e0eaff', '#241d9a', '#f75092', '#9f50d3']}
      speed={1}
      distortion={0.8}
    />
  );
}
```

### Vanilla JavaScript

For non-React projects, use the core package:

```javascript theme={null}
import { ShaderMount, meshGradientFragmentShader } from '@paper-design/shaders';

const container = document.getElementById('container');
const shader = new ShaderMount(
  container,
  meshGradientFragmentShader,
  {
    u_colors: [[0.88, 0.92, 1, 1], [0.14, 0.11, 0.6, 1], [0.97, 0.31, 0.57, 1]],
    u_colorsCount: 3,
    u_distortion: 0.8,
    u_swirl: 0.1,
    // ... other uniforms
  },
  {}, // WebGL context attributes
  1   // speed
);
```

## Common Parameters

Most shaders share these common parameters:

* **speed** - Animation speed multiplier (default: 1)
* **frame** - Manual frame control when speed is 0
* **scale** - Zoom level (0.01 to 4)
* **rotation** - Rotation angle in degrees (0 to 360)
* **fit** - How to fit the shader: 'none', 'contain', or 'cover'
* **offsetX/offsetY** - Position offset (-1 to 1)
* **originX/originY** - Transform origin point (0 to 1)

## Performance Tips

* Use `speed={0}` and control `frame` manually for paused animations
* Lower `scale` values can improve performance
* Reduce color counts when possible
* Consider using simpler shaders for mobile devices

## Browser Support

Paper Shaders requires WebGL 2.0 support, which is available in:

* Chrome 56+
* Firefox 51+
* Safari 15+
* Edge 79+

For older browsers, implement a fallback using CSS gradients or static images.
