import type { GLContext } from "./gl/context.js";
import { Framebuffer } from "./gl/framebuffer.js";
import type { Quad } from "./gl/quad.js";
import { Texture } from "./gl/texture.js";
import type { ProgramCache } from "./program-cache.js";
import type { Effect, EffectContext, EffectDims, EffectRenderTarget, EffectTexture, EffectUniformValue, EffectVFXProps } from "./types.js";
declare const RESOLVE_TEXTURE: unique symbol;
declare const RESOLVE_RT: unique symbol;
/** @internal */
export type EffectTextureInternal = EffectTexture & {
    readonly [RESOLVE_TEXTURE]: () => Texture;
};
/** @internal */
export type EffectRenderTargetInternal = EffectRenderTarget & {
    readonly [RESOLVE_RT]: RenderTargetResolver;
};
/** @internal */
type RenderTargetResolver = {
    /** Current read texture (for sampling the RT as a uniform). */
    getReadTexture(): Texture;
    /** Current write target (for `bindFramebuffer`). */
    getWriteFbo(): Framebuffer;
    /** Called after a draw that wrote to the RT. `persistent: true` only. */
    swap?: () => void;
    /** Called when the host's element size changes (auto-tracking RTs). */
    resize?: (bufferW: number, bufferH: number) => void;
    dispose?: () => void;
    /**
     * Regenerate mips on the current write FB. Present only when the
     * RT was created with `mipmap: true | "manual"`. Always safe to
     * call; no-op for non-mipmap RTs (handled at the FB layer).
     */
    regenerateMipmaps?: () => void;
    /**
     * True iff `mipmap: true` (auto mode). EffectHost calls
     * `regenerateMipmaps` post-draw, pre-swap when set.
     */
    mipmapAutoRegen?: boolean;
};
declare function resolveTexture(h: EffectTexture): Texture;
declare function resolveRt(h: EffectRenderTarget): RenderTargetResolver;
/** Element-scope dimensions the orchestrator updates each frame. @internal */
export type HostFrameDims = {
    /** Device-px size of the write buffer for this stage. */
    outputBufferW: number;
    outputBufferH: number;
    /** Canvas device-px size (for `ctx.resolution`). */
    canvasBufferSize: readonly [number, number];
    /**
     * Device-px viewport used when the draw's target is the stage's
     * assigned `ctx.target` (or `null` / omitted). For intermediate
     * stages this is `(0, 0, bufferW, bufferH)`; for the last stage it
     * is the canvas-space element rect (bottom-left origin). User-
     * allocated RTs keep their full-dim viewport regardless.
     */
    outputViewport: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    /**
     * Current element device-px size (inner, no pad). Provided for
     * effects that need the inner extent — auto-resize RTs use
     * `outputBufferW/H` (= dst buffer = inner + dstPad) instead so they
     * include this stage's pad region.
     */
    elementBufferW: number;
    elementBufferH: number;
    /**
     * `contentRectUv` uniform value (dst): inner origin + inner size in
     * buffer-fraction units (0..1). See plan.md "`uvSrc` varying".
     */
    contentRectUv: [number, number, number, number];
    /**
     * `srcRectUv` uniform value (src): sampling origin + size in src
     * texture UV. Drives `uvSrc = srcRectUv.xy + uvContent *
     * srcRectUv.zw` in the default vertex shader.
     */
    srcRectUv: [number, number, number, number];
};
/** @internal */
type Phase = "init" | "update" | "render" | "disposed";
/**
 * One-to-one owner of an Effect's `EffectContext`.
 *
 * The orchestrator ({@link EffectChain}) mutates fields on `ctx` each
 * frame (time / src / output / etc.) for reference stability and to
 * reduce allocations. Owns:
 * - Managed Framebuffer / Backbuffer / Texture / VAO entries
 * - Phase flag for `ctx.draw()` suppression in the update phase
 *
 * Compiled {@link Program}s are not owned here — they live in the
 * VFX-scoped {@link ProgramCache} and are shared across hosts.
 *
 * See plan.md "effect-host.ts" for the full behavior spec.
 * @internal
 */
export declare class EffectHost {
    #private;
    constructor(glCtx: GLContext, quad: Quad, pixelRatio: number, initialSrc: EffectTexture, initialVfxProps: EffectVFXProps, programCache: ProgramCache);
    get ctx(): EffectContext;
    setPhase(p: Phase): void;
    setFrameDims(dims: HostFrameDims): void;
    setEffectDims(dims: EffectDims): void;
    setFrameState(state: {
        time: number;
        deltaTime: number;
        mouse: [number, number];
        mouseViewport: [number, number];
        intersection: number;
        enterTime: number;
        leaveTime: number;
        uniforms: Record<string, EffectUniformValue>;
    }): void;
    setSrc(src: EffectTexture): void;
    setOutput(output: EffectRenderTarget | null): void;
    /**
     * Draws a passthrough copy of `src` into `target` using the host's
     * own program cache. The viewport passed in is device-px.
     */
    passthroughCopy(src: EffectTexture, target: EffectRenderTarget | null, viewport: {
        x: number;
        y: number;
        w: number;
        h: number;
    }): void;
    /** Clears the given RT with `(0, 0, 0, 0)`. Device-px target. */
    clearRt(rt: EffectRenderTarget): void;
    /** Called by the chain at the start of the render phase. */
    tickAutoUpdates(): void;
    dispose(): void;
}
/**
 * Build an EffectTexture handle that resolves to the given Texture each
 * time. The resolver callback form lets `ctx.src` transparently follow
 * a text-element re-render (which swaps `e.srcTexture`).
 * @internal
 */
export declare function makeEffectTexture(resolve: () => Texture, width: () => number, height: () => number): EffectTextureInternal;
/** @internal */
export declare function makeEffectRenderTarget(resolver: RenderTargetResolver, width: () => number, height: () => number, dispose?: () => void): EffectRenderTargetInternal;
/**
 * Build an EffectRenderTarget handle over an already-allocated
 * Framebuffer. Used by the chain to expose intermediates / the final
 * post-effect target.
 * @internal
 */
export declare function makeEffectRenderTargetFromFb(fb: Framebuffer): EffectRenderTarget;
/** Effect-host-owned type tag re-export for convenience. @internal */
export type { Effect };
export { RESOLVE_RT, RESOLVE_TEXTURE, resolveRt, resolveTexture };
