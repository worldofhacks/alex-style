import type { GLContext, Restorable } from "./context.js";
/**
 * Fullscreen quad. Builds a single VAO with a position buffer that
 * covers NDC (-1..1). Attribute name "position" is bound to location 0
 * on every shader program (see {@link Program}) so this VAO can be
 * shared across all passes.
 *
 * Self-registers with {@link GLContext} so the VAO/buffer are rebuilt
 * after a context loss.
 * @internal
 */
export declare class Quad implements Restorable {
    #private;
    gl: WebGL2RenderingContext;
    vao: WebGLVertexArrayObject;
    constructor(ctx: GLContext);
    restore(): void;
    draw(): void;
    dispose(): void;
}
