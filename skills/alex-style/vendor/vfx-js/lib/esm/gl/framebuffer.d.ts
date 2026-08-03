import type { GLContext, Restorable } from "./context.js";
import { Texture, type TextureFilter, type TextureWrap } from "./texture.js";
/**
 * Single color-attachment framebuffer. Replaces `THREE.WebGLRenderTarget`.
 * The `texture` field is a {@link Texture} that wraps the FBO's color
 * attachment, so it can be fed directly into a shader as a sampler.
 *
 * Self-registers with {@link GLContext} so the FBO + its attachment
 * texture are rebuilt after a context loss. The internal attachment
 * texture opts out of auto-registering; its storage is managed here.
 * @internal
 */
export declare class Framebuffer implements Restorable {
    #private;
    gl: WebGL2RenderingContext;
    width: number;
    height: number;
    float: boolean;
    mipmap: boolean;
    fbo: WebGLFramebuffer;
    texture: Texture;
    constructor(ctx: GLContext, width: number, height: number, opts?: {
        float?: boolean;
        wrap?: TextureWrap | readonly [TextureWrap, TextureWrap];
        filter?: TextureFilter;
        mipmap?: boolean;
    });
    setSize(width: number, height: number): void;
    restore(): void;
    dispose(): void;
    /**
     * Regenerate mips from level 0. No-op when this FB was not created
     * with `mipmap: true`.
     */
    generateMipmaps(): void;
}
