import type { GLContext } from "./gl/context.js";
import { Framebuffer } from "./gl/framebuffer.js";
import type { Texture, TextureFilter, TextureWrap } from "./gl/texture.js";
import { type GLRect } from "./gl-rect.js";
/**
 * Double-buffered render target. Pass 0 is read, pass 1 is written;
 * swap() rotates them each frame so a shader can read its previous
 * output without a feedback loop.
 * @internal
 */
export declare class Backbuffer {
    #private;
    constructor(ctx: GLContext, width: number, height: number, pixelRatio: number, float: boolean | undefined, opts?: {
        wrap?: TextureWrap | readonly [TextureWrap, TextureWrap];
        filter?: TextureFilter;
        mipmap?: boolean;
    });
    /** Read texture (the previous frame's output). */
    get texture(): Texture;
    /** Write target for the current frame. */
    get target(): Framebuffer;
    resize(width: number, height: number): void;
    /** Rotate the double-buffers. Call after rendering to `target`. */
    swap(): void;
    getViewport(): GLRect;
    dispose(): void;
}
