import type { GLContext } from "./gl/context.js";
import { Pass } from "./gl/pass.js";
import type { Uniforms } from "./gl/program.js";
import type { Texture } from "./gl/texture.js";
import type { GLRect } from "./gl-rect.js";
/**
 * Copies a source texture to the current framebuffer with premultiplied
 * alpha blending. Used after rendering an element's backbuffer into
 * the canvas/post-effect RT.
 * @internal
 */
export declare class CopyPass {
    pass: Pass;
    uniforms: Uniforms;
    constructor(ctx: GLContext);
    setUniforms(tex: Texture, pixelRatio: number, xywh: GLRect): void;
    dispose(): void;
}
