import type { GLContext, Restorable } from "./gl/context.js";
import type { Program } from "./gl/program.js";
import type { Quad } from "./gl/quad.js";
import type { EffectGeometry, EffectQuad } from "./types.js";
/**
 * Singleton token returned as `ctx.quad`.
 *
 * All hosts share the same token — it always resolves to the shared
 * {@link Quad} (NDC -1..1 fullscreen).
 * @internal
 */
export declare const EFFECT_QUAD_TOKEN: EffectQuad;
/** @internal */
export declare function isEffectQuad(g: unknown): g is EffectQuad;
/**
 * Compiled VAO + buffers for an (EffectGeometry, Program) pair.
 *
 * Registered on {@link GLContext} so context-restore rebuilds the VAO
 * and its VBOs / IBO from the original POJO descriptors.
 * @internal
 */
export declare class CompiledGeometry implements Restorable {
    #private;
    gl: WebGL2RenderingContext;
    vao: WebGLVertexArrayObject;
    mode: number;
    /** gl.UNSIGNED_SHORT or gl.UNSIGNED_INT (when indexed). */
    indexType: number;
    hasIndices: boolean;
    /** Number of vertices / indices to draw (after drawRange). */
    drawCount: number;
    /** Offset in the attribute / index buffer (after drawRange). */
    drawStart: number;
    instanceCount: number;
    constructor(ctx: GLContext, geo: EffectGeometry, program: Program);
    restore(): void;
    draw(): void;
    dispose(): void;
}
/**
 * Per-host cache of compiled geometries, keyed by (EffectGeometry, Program).
 *
 * The program dimension is required because `gl.getAttribLocation` is
 * program-specific — caching only by geometry would break on a second
 * program whose attribute name → location assignment differs.
 *
 * Uses a `WeakMap` for primary lookup plus a parallel `Set` so
 * {@link dispose} can iterate every compiled entry the host owns.
 * @internal
 */
export declare class EffectGeometryCache {
    #private;
    constructor(ctx: GLContext, quad: Quad);
    /** The shared fullscreen {@link Quad} (resolves {@link EFFECT_QUAD_TOKEN}). */
    get quad(): Quad;
    resolve(geo: EffectGeometry, program: Program): CompiledGeometry;
    dispose(): void;
}
