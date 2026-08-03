/**
 * @internal
 */
export declare const DEFAULT_VERTEX_SHADER = "\nprecision highp float;\nin vec3 position;\nvoid main() {\n    gl_Position = vec4(position, 1.0);\n}\n";
/**
 * GLSL ES 1.00 variant of the default vertex shader. Used when the paired
 * fragment shader is GLSL 100 so vertex/fragment versions match at link time.
 * @internal
 */
export declare const DEFAULT_VERTEX_SHADER_100 = "\nprecision highp float;\nattribute vec3 position;\nvoid main() {\n    gl_Position = vec4(position, 1.0);\n}\n";
/**
 * @internal
 */
export declare const COPY_FRAGMENT_SHADER = "\nprecision highp float;\nuniform vec2 offset;\nuniform vec2 resolution;\nuniform sampler2D src;\nout vec4 outColor;\nvoid main() {\n    vec2 uv = (gl_FragCoord.xy - offset) / resolution;\n    if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) {\n        discard;\n    }\n    outColor = texture(src, uv);\n}\n";
export type ShaderPreset = "none" | "uvGradient" | "rainbow" | "glitch" | "rgbGlitch" | "rgbShift" | "shine" | "blink" | "spring" | "duotone" | "tritone" | "hueShift" | "sinewave" | "pixelate" | "halftone" | "slitScanTransition" | "warpTransition" | "pixelateTransition" | "focusTransition" | "invert" | "grayscale" | "vignette" | "chromatic";
/**
 * Shader code for presets.
 * Shaders in `shader` can be looked up with keys in `ShaderPreset`.
 *
 * ```ts
 * const shader = shaders["glitch"];
 * console.log(shader);
 * ```
 */
export declare const shaders: Record<ShaderPreset, string>;
