import { EffectHost } from "./effect-host.js";
import type { GLContext } from "./gl/context.js";
import type { Quad } from "./gl/quad.js";
import type { ProgramCache } from "./program-cache.js";
import { type ElementRect, type Margin } from "./rect.js";
import type { Effect, EffectRenderTarget, EffectTexture, EffectUniformValue, EffectVFXProps } from "./types.js";
/** @internal */
export type ChainFrameInput = {
    time: number;
    deltaTime: number;
    mouse: [number, number];
    mouseViewport: [number, number];
    intersection: number;
    enterTime: number;
    leaveTime: number;
    resolvedUniforms: Record<string, EffectUniformValue>;
    /** Canvas size (= viewport-inner + scrollPadding on each side), CSS px. */
    canvasSize: readonly [number, number];
    /** Canvas size, device px. */
    canvasBufferSize: readonly [number, number];
    /** Element rect (inner, no overflow), CSS px. Mirrors canvas for post effects. */
    elementSize: readonly [number, number];
    /** Element rect (inner, no overflow), device px. Mirrors canvas for post effects. */
    elementBufferSize: readonly [number, number];
    /**
     * Element's content rect on canvas, bottom-left origin, device px.
     * Used to position the final-stage draw viewport (canvas-space) and
     * to derive `dims.canvasRect` in element-local coords (the canvas
     * itself is `(0, 0, canvasBufferSize)` in canvas coords).
     */
    elementRectOnCanvasPx: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    /**
     * Destination for the last rendering stage. `null` draws to the
     * canvas; otherwise the handle's underlying FBO is used (e.g. when
     * a post-effect chain reads this chain's output as its input).
     */
    finalTarget: EffectRenderTarget | null;
    isVisible: boolean;
};
/** @internal */
type StageLayout = {
    /** Stage's rect in element-local device px (bottom-left). */
    dstRect: ElementRect;
    /** Dst buffer size (device px): cached for FBO sizing. */
    dstBufferSize: [number, number];
    /** Content sub-rect within dst buffer UV (xy = origin, zw = size). */
    contentRectUv: [number, number, number, number];
    /**
     * Device-px viewport on the canvas / final FBO for this stage's
     * draw. Only meaningful for the last rendering stage; intermediate
     * stages use `(0, 0, dstBufferSize[0], dstBufferSize[1])`.
     */
    outputViewport: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
};
/**
 * Pipeline orchestrator for a single element's Effect chain.
 *
 * Rect model:
 * - Each rendering stage declares its own `dstRect` in element-local
 *   device px (bottom-left). Stage 0's `srcRect` is `contentRect`
 *   (= `[0, 0, elementBufferSize[0], elementBufferSize[1]]`); stage k's `srcRect`
 *   = stage k-1's `dstRect`.
 * - Each effect's `outputRect(dims)` returns the dst rect, or `undefined`
 *   to inherit `srcRect` (no growth). Stages are independent — no
 *   accumulation, no monotonic clamp.
 * - `dims.canvasRect` is the canvas rect in element-local px (= viewport
 *   + scrollPadding from element bottom-left). Use it directly for
 *   "reach canvas edges" effects.
 * - The last rendering effect's `outputRect` is honored too, but no
 *   intermediate buffer is allocated — the dst remains the fixed final
 *   target, and `dstRect` only positions / sizes the canvas-space draw
 *   viewport (the host still receives `outputBufferW/H = dstRect[2..3]`
 *   so internal RTs auto-size to include the rect).
 * - `srcRectUv` / `contentRectUv` are derived per stage from the rect map
 *   (`rectInRect(content, dst)` and `rectInRect(srcRect, dst)`) and
 *   uploaded as uniforms so the default vertex shader can emit `uvSrc`
 *   (src-sampling UV) and `uvContent` (dst-space 0..1 over element).
 *
 * Error handling:
 * - `init` throws → reverse-dispose prior effects, bubble rejection.
 * - `update`/`render` throw → `console.warn` once per (chain, effect),
 *   render failures fall back to a passthrough copy so the output doesn't
 *   disappear.
 *
 * @internal
 */
export declare class EffectChain {
    #private;
    constructor(glCtx: GLContext, quad: Quad, pixelRatio: number, effects: readonly Effect[], vfxProps: EffectVFXProps, capture: EffectTexture, isPostEffect: boolean, programCache: ProgramCache);
    get effects(): readonly Effect[];
    get hosts(): readonly EffectHost[];
    get renderingIndices(): readonly number[];
    /** Test-only accessor for per-stage layout data. @internal */
    get stages(): readonly StageLayout[];
    /**
     * Per-side pad in **device px** to grow the visibility hit-test
     * rect by, so glow / trail extending past the element rect keeps
     * the chain running while the padded region is on-screen. Reflects
     * the most recent rendered frame; empty / first-frame chains
     * return zero margins. Caller divides by `pixelRatio` to convert
     * to CSS px before passing to `growRect`.
     */
    get hitTestPadBuffer(): Margin;
    /**
     * Sequentially run each effect's `init`. On throw, dispose prior
     * effects in reverse order (the failing effect's own `dispose` is
     * NOT called) and rethrow.
     */
    initAll(): Promise<void>;
    /** One frame. No-op when `!isVisible`. */
    run(input: ChainFrameInput): void;
    dispose(): void;
    /**
     * Replace the chain's effects with a new array, preserving hosts /
     * init state for effects whose reference is unchanged. Reordering
     * the same set of effects calls no `init` / `dispose`. Newly added
     * effects get a fresh host and `init`; removed effects' `dispose`
     * runs and their host is destroyed. Intermediate RTs are torn down
     * and lazily rebuilt on the next frame (sizes follow the new chain).
     *
     * On `init` failure of a newly-added effect, the freshly-created
     * hosts are rolled back and the existing chain is left intact.
     */
    replaceEffects(newEffects: readonly Effect[]): Promise<void>;
}
export {};
