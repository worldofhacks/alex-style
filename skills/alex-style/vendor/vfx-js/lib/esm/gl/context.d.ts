/** A GL resource that can be rebuilt after a WebGL context loss. @internal */
export interface Restorable {
    restore(): void;
}
/**
 * WebGL2 context wrapper. Owns the canvas's rendering context, negotiates
 * optional float texture extensions, and coordinates recovery of registered
 * resources after `webglcontextlost` / `webglcontextrestored` events.
 *
 * Low-level resources ({@link Program}, {@link Framebuffer}, {@link Texture},
 * {@link Quad}) register themselves here so their underlying GL handles can
 * be rebuilt after a context loss.
 * @internal
 */
export declare class GLContext {
    #private;
    gl: WebGL2RenderingContext;
    canvas: HTMLCanvasElement;
    maxTextureSize: number;
    /** True if `OES_texture_float_linear` is available. */
    floatLinearFilter: boolean;
    /** True between `webglcontextlost` and `webglcontextrestored`. */
    isContextLost: boolean;
    constructor(canvas: HTMLCanvasElement);
    setSize(width: number, height: number, pixelRatio: number): void;
    addResource(r: Restorable): void;
    removeResource(r: Restorable): void;
    /** Subscribe to context-lost events. Returns an unsubscribe function. */
    onContextLost(cb: () => void): () => void;
    /** Subscribe to context-restored events. Returns an unsubscribe function. */
    onContextRestored(cb: () => void): () => void;
}
