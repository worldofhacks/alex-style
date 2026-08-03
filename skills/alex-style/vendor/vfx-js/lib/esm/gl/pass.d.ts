import type { GLContext } from "./context.js";
import type { Framebuffer } from "./framebuffer.js";
import { type GlslVersion, Program, type Uniforms } from "./program.js";
import type { Quad } from "./quad.js";
/**
 * Blending preset for a {@link Pass}.
 *   - `"normal"`: non-premultiplied (SRC_ALPHA, ONE_MINUS_SRC_ALPHA).
 *     Equivalent to Three.js NormalBlending with premultipliedAlpha=false.
 *   - `"premultiplied"`: premultiplied (ONE, ONE_MINUS_SRC_ALPHA).
 *     Equivalent to Three.js NormalBlending with premultipliedAlpha=true.
 *   - `"additive"`: premultiplied additive (ONE, ONE). Source RGB and
 *     alpha both accumulate onto the destination — overlapping
 *     fragments brighten.
 *   - `"none"`: BLEND disabled. Used when rendering to an intermediate
 *     buffer so output is not blended against previous contents.
 * @internal
 */
export type BlendMode = "normal" | "premultiplied" | "additive" | "none";
/** @internal */
export declare class Pass {
    gl: WebGL2RenderingContext;
    program: Program;
    uniforms: Uniforms;
    blend: BlendMode;
    constructor(ctx: GLContext, vertSrc: string, fragSrc: string, uniforms: Uniforms, blend: BlendMode, glslVersion?: GlslVersion);
    dispose(): void;
}
type ViewportRect = {
    x: number;
    y: number;
    w: number;
    h: number;
};
/**
 * Render `pass` into `target` (or the canvas if null) over `viewport`.
 * Applies clipping and blend state, uploads uniforms, and draws the quad.
 * @internal
 */
export declare function renderPass(gl: WebGL2RenderingContext, quad: Quad, pass: Pass, target: Framebuffer | null, viewport: ViewportRect, canvasW: number, canvasH: number, pixelRatio: number): void;
/** @internal */
export declare function applyBlend(gl: WebGL2RenderingContext, mode: BlendMode): void;
export {};
