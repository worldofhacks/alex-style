import type { GLContext, Restorable } from "./context.js";
/**
 * Texture wrapper over a WebGL2 `TEXTURE_2D`.
 *
 * Matches the behaviour of the Three.js texture types previously used
 * by VFX-JS: Y-flipped unpack, non-premultiplied alpha, linear filter,
 * and RGBA format. Use {@link needsUpdate} to re-upload from a live
 * canvas/video source on the next bind.
 *
 * Self-registers with {@link GLContext} unless `autoRegister: false` is
 * passed — opt out when the Texture is owned by a {@link Framebuffer}
 * (its storage is managed by the FBO's own `restore()`).
 * @internal
 */
export type TextureWrap = "clamp" | "repeat" | "mirror";
/** @internal */
export type TextureFilter = "nearest" | "linear";
/** @internal */
export type TextureSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap;
/** @internal */
export type TextureOpts = {
    /** Default true. Pass false for FBO attachment textures. */
    autoRegister?: boolean;
    /**
     * Externally-owned raw WebGL texture handle. When provided, the
     * Texture wrapper skips creation / upload / deletion — the caller
     * retains lifetime ownership. Used by
     * {@link EffectContext.wrapTexture} for WebGLTexture sources.
     */
    externalHandle?: WebGLTexture;
};
/** @internal */
export declare class Texture implements Restorable {
    #private;
    gl: WebGL2RenderingContext;
    texture: WebGLTexture;
    wrapS: TextureWrap;
    wrapT: TextureWrap;
    minFilter: TextureFilter;
    magFilter: TextureFilter;
    needsUpdate: boolean;
    /** Source image/canvas/video; exposed for identity comparison. */
    source: TextureSource | null;
    constructor(ctx: GLContext, source?: TextureSource, opts?: TextureOpts);
    restore(): void;
    bind(unit: number): void;
    dispose(): void;
}
/** Load an image from URL with CORS enabled. @internal */
export declare function loadImage(url: string): Promise<HTMLImageElement>;
