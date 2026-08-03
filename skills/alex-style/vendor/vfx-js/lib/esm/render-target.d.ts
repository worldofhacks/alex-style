import type { GLContext } from "./gl/context.js";
import { Framebuffer } from "./gl/framebuffer.js";
import { Pass } from "./gl/pass.js";
import { type GlslVersion, type Uniforms } from "./gl/program.js";
/**
 * Create a framebuffer matching the options passed to element/post-effect passes.
 * @internal
 */
export declare function createRenderTarget(ctx: GLContext, width: number, height: number, opts?: {
    float?: boolean;
}): Framebuffer;
/**
 * Create a {@link Pass} for a fullscreen render. Maps the old
 * `createPassMaterial` behaviour:
 *   - Rendering to an intermediate buffer → NoBlending.
 *   - Rendering to the screen with `premultipliedAlpha` → premultiplied blend.
 *   - Otherwise (element passes) → non-premultiplied normal blend.
 * @internal
 */
export declare function createPassMaterial(ctx: GLContext, opts: {
    vertexShader?: string;
    fragmentShader: string;
    uniforms: Uniforms;
    /** True when this pass renders into an intermediate RT. */
    renderingToBuffer?: boolean;
    premultipliedAlpha?: boolean;
    glslVersion?: GlslVersion;
}): Pass;
