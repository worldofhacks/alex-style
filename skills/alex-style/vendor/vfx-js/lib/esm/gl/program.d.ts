import type { GLContext, Restorable } from "./context.js";
import { Texture } from "./texture.js";
import { Vec2, Vec4 } from "./vec.js";
/** @internal */
export type UniformValue = number | boolean | Vec2 | Vec4 | Texture | [number, number] | [number, number, number] | [number, number, number, number] | number[] | Float32Array | Int32Array | Uint32Array;
/** @internal */
export type Uniform = {
    value: UniformValue | null;
};
/** @internal */
export type Uniforms = {
    [name: string]: Uniform;
};
/**
 * GLSL ES version of a shader. When omitted on a VFX prop, it is
 * auto-detected from the fragment shader via {@link detectGlslVersion}:
 * GLSL 100 markers (`gl_FragColor`, `texture2D`, `varying`, `attribute`)
 * pick `"100"`, otherwise `"300 es"`.
 */
export type GlslVersion = "100" | "300 es";
/** @see {@link GlslVersion} */
export declare function detectGlslVersion(src: string): GlslVersion;
/** @internal */
type ActiveUniform = {
    location: WebGLUniformLocation;
    type: number;
    size: number;
};
/**
 * Compiled GLSL program. Handles vertex/fragment shader compilation,
 * link, attribute binding (attribute "position" → location 0), and
 * uniform upload.
 *
 * GLSL version: `glslVersion` if given, else auto-detected from the
 * fragment shader via {@link detectGlslVersion}.
 *
 * Self-registers with {@link GLContext} so the program is recompiled
 * after a `webglcontextrestored` event.
 * @internal
 */
export declare class Program implements Restorable {
    #private;
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    constructor(ctx: GLContext, vertSrc: string, fragSrc: string, glslVersion?: GlslVersion);
    restore(): void;
    use(): void;
    hasUniform(name: string): boolean;
    /** Upload a set of uniforms. Samplers auto-allocate texture units. */
    uploadUniforms(uniforms: Uniforms): void;
    dispose(): void;
}
/** @internal — exported for testability; not part of the public API. */
export declare function uploadScalarUniform(gl: WebGL2RenderingContext, info: ActiveUniform, value: Exclude<UniformValue, Texture>): void;
export {};
