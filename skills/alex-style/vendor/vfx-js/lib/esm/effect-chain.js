var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EffectChain_instances, _EffectChain_glCtx, _EffectChain_quad, _EffectChain_pixelRatio, _EffectChain_vfxProps, _EffectChain_programCache, _EffectChain_effects, _EffectChain_hosts, _EffectChain_renderingIndices, _EffectChain_intermediates, _EffectChain_stages, _EffectChain_capture, _EffectChain_warnedEffects, _EffectChain_disposed, _EffectChain_isPostEffect, _EffectChain_lastHitTestPad, _EffectChain_ownedPassthroughHost, _EffectChain_computeRenderingIndices, _EffectChain_newHost, _EffectChain_safeDispose, _EffectChain_resolveStages, _EffectChain_callOutputRect, _EffectChain_buildDims, _EffectChain_hostEffectDims, _EffectChain_ensureIntermediate, _EffectChain_canvasRectInElementLocal, _EffectChain_hostFrameDims;
import { EffectHost, makeEffectRenderTargetFromFb, makeEffectTexture, } from "./effect-host.js";
import { Framebuffer } from "./gl/framebuffer.js";
import { createMargin, rectInRect, } from "./rect.js";
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
export class EffectChain {
    constructor(glCtx, quad, pixelRatio, effects, vfxProps, capture, isPostEffect, programCache) {
        _EffectChain_instances.add(this);
        _EffectChain_glCtx.set(this, void 0);
        _EffectChain_quad.set(this, void 0);
        _EffectChain_pixelRatio.set(this, void 0);
        _EffectChain_vfxProps.set(this, void 0);
        _EffectChain_programCache.set(this, void 0);
        _EffectChain_effects.set(this, void 0);
        _EffectChain_hosts.set(this, void 0);
        _EffectChain_renderingIndices.set(this, void 0);
        _EffectChain_intermediates.set(this, []);
        _EffectChain_stages.set(this, []);
        _EffectChain_capture.set(this, void 0);
        _EffectChain_warnedEffects.set(this, new Set());
        _EffectChain_disposed.set(this, false);
        /** Post-effect context (element mirrors canvas; contentRect == canvasRect). */
        _EffectChain_isPostEffect.set(this, void 0);
        /**
         * Hit-test pad (per side, device px) derived from the last
         * rendering stage's `dstRect`: how far the rect extends past the
         * element's content rect. Used by the host to grow the visibility
         * rect so glow / trail outside the element keeps the chain running
         * while still on-screen. Lags by one frame (initial entry uses 0);
         * acceptable since rects are typically static or `canvasRect`-derived
         * and update immediately on the next frame.
         */
        _EffectChain_lastHitTestPad.set(this, createMargin(0));
        /**
         * Chain-owned passthrough host, used when `effects` is empty so
         * a transparent blit still works without a special-case "no chain"
         * branch. `null` means reuse `#hosts[0]`.
         */
        _EffectChain_ownedPassthroughHost.set(this, null);
        __classPrivateFieldSet(this, _EffectChain_glCtx, glCtx, "f");
        __classPrivateFieldSet(this, _EffectChain_quad, quad, "f");
        __classPrivateFieldSet(this, _EffectChain_pixelRatio, pixelRatio, "f");
        __classPrivateFieldSet(this, _EffectChain_vfxProps, vfxProps, "f");
        __classPrivateFieldSet(this, _EffectChain_programCache, programCache, "f");
        __classPrivateFieldSet(this, _EffectChain_effects, effects, "f");
        __classPrivateFieldSet(this, _EffectChain_capture, capture, "f");
        __classPrivateFieldSet(this, _EffectChain_isPostEffect, isPostEffect, "f");
        __classPrivateFieldSet(this, _EffectChain_hosts, effects.map(() => __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_newHost).call(this)), "f");
        if (effects.length === 0) {
            __classPrivateFieldSet(this, _EffectChain_ownedPassthroughHost, __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_newHost).call(this), "f");
        }
        __classPrivateFieldSet(this, _EffectChain_renderingIndices, __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_computeRenderingIndices).call(this), "f");
    }
    get effects() {
        return __classPrivateFieldGet(this, _EffectChain_effects, "f");
    }
    get hosts() {
        return __classPrivateFieldGet(this, _EffectChain_hosts, "f");
    }
    get renderingIndices() {
        return __classPrivateFieldGet(this, _EffectChain_renderingIndices, "f");
    }
    /** Test-only accessor for per-stage layout data. @internal */
    get stages() {
        return __classPrivateFieldGet(this, _EffectChain_stages, "f");
    }
    /**
     * Per-side pad in **device px** to grow the visibility hit-test
     * rect by, so glow / trail extending past the element rect keeps
     * the chain running while the padded region is on-screen. Reflects
     * the most recent rendered frame; empty / first-frame chains
     * return zero margins. Caller divides by `pixelRatio` to convert
     * to CSS px before passing to `growRect`.
     */
    get hitTestPadBuffer() {
        return __classPrivateFieldGet(this, _EffectChain_lastHitTestPad, "f");
    }
    /**
     * Sequentially run each effect's `init`. On throw, dispose prior
     * effects in reverse order (the failing effect's own `dispose` is
     * NOT called) and rethrow.
     */
    async initAll() {
        for (let i = 0; i < __classPrivateFieldGet(this, _EffectChain_effects, "f").length; i++) {
            const e = __classPrivateFieldGet(this, _EffectChain_effects, "f")[i];
            const host = __classPrivateFieldGet(this, _EffectChain_hosts, "f")[i];
            host.setPhase("init");
            try {
                if (e.init) {
                    await e.init(host.ctx);
                }
            }
            catch (err) {
                console.error(`[VFX-JS] effect[${i}].init() failed:`, err);
                for (let j = i - 1; j >= 0; j--) {
                    __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_safeDispose).call(this, j);
                    __classPrivateFieldGet(this, _EffectChain_hosts, "f")[j].dispose();
                }
                __classPrivateFieldGet(this, _EffectChain_hosts, "f")[i].dispose();
                throw err;
            }
            host.setPhase("update");
        }
    }
    /** One frame. No-op when `!isVisible`. */
    run(input) {
        if (__classPrivateFieldGet(this, _EffectChain_disposed, "f")) {
            return;
        }
        if (!input.isVisible) {
            return;
        }
        // Recompute the active render stages each frame so toggling
        // `effect.enabled` takes effect immediately (no restructuring).
        __classPrivateFieldSet(this, _EffectChain_renderingIndices, __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_computeRenderingIndices).call(this), "f");
        const stageCount = __classPrivateFieldGet(this, _EffectChain_renderingIndices, "f").length;
        // Reflect state + uniforms into each host's ctx.
        for (const host of __classPrivateFieldGet(this, _EffectChain_hosts, "f")) {
            host.setFrameState({
                time: input.time,
                deltaTime: input.deltaTime,
                mouse: input.mouse,
                mouseViewport: input.mouseViewport,
                intersection: input.intersection,
                enterTime: input.enterTime,
                leaveTime: input.leaveTime,
                uniforms: input.resolvedUniforms,
            });
        }
        // Resolve per-stage pad / buffers / srcRectUv / contentRectUv.
        // Allocates / reuses intermediate RTs.
        __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_resolveStages).call(this, input);
        // Apply per-host frame dims + per-host EffectDims (the same
        // shape outputRect saw for this stage, exposed on ctx.dims).
        for (let k = 0; k < __classPrivateFieldGet(this, _EffectChain_hosts, "f").length; k++) {
            __classPrivateFieldGet(this, _EffectChain_hosts, "f")[k].setFrameDims(__classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_hostFrameDims).call(this, k, input));
            __classPrivateFieldGet(this, _EffectChain_hosts, "f")[k].setEffectDims(__classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_hostEffectDims).call(this, k, input));
        }
        // Update phase (array order). ctx.draw() is a no-op here.
        for (let i = 0; i < __classPrivateFieldGet(this, _EffectChain_effects, "f").length; i++) {
            const e = __classPrivateFieldGet(this, _EffectChain_effects, "f")[i];
            if (!e.update) {
                continue;
            }
            const host = __classPrivateFieldGet(this, _EffectChain_hosts, "f")[i];
            host.setPhase("update");
            try {
                e.update(host.ctx);
            }
            catch (err) {
                const key = `${i}:update`;
                if (!__classPrivateFieldGet(this, _EffectChain_warnedEffects, "f").has(key)) {
                    __classPrivateFieldGet(this, _EffectChain_warnedEffects, "f").add(key);
                    console.warn(`[VFX-JS] effect[${i}].update() threw; skipping this frame's update:`, err);
                }
            }
        }
        // No rendering effects: passthrough copy.
        // Reuse `#hosts[0]` if any; otherwise fall back to the
        // chain-owned `#ownedPassthroughHost` (effects is empty).
        if (stageCount === 0) {
            const host = __classPrivateFieldGet(this, _EffectChain_ownedPassthroughHost, "f") ?? __classPrivateFieldGet(this, _EffectChain_hosts, "f")[0];
            host.passthroughCopy(__classPrivateFieldGet(this, _EffectChain_capture, "f"), input.finalTarget, input.elementRectOnCanvasPx);
            return;
        }
        // Render phase: walk renderingIndices.
        for (let k = 0; k < stageCount; k++) {
            const i = __classPrivateFieldGet(this, _EffectChain_renderingIndices, "f")[k];
            const host = __classPrivateFieldGet(this, _EffectChain_hosts, "f")[i];
            const effect = __classPrivateFieldGet(this, _EffectChain_effects, "f")[i];
            if (!effect.render) {
                // Defensive: renderingIndices filters on render presence +
                // enabled, so this is unreachable unless the Effect mutated
                // its own shape post-construction.
                continue;
            }
            host.setPhase("render");
            host.tickAutoUpdates();
            const srcHandle = k === 0 ? __classPrivateFieldGet(this, _EffectChain_capture, "f") : __classPrivateFieldGet(this, _EffectChain_intermediates, "f")[k - 1].texHandle;
            host.setSrc(srcHandle);
            let outputHandle;
            if (k === stageCount - 1) {
                outputHandle = input.finalTarget;
            }
            else {
                outputHandle = __classPrivateFieldGet(this, _EffectChain_intermediates, "f")[k].rtHandle;
                host.clearRt(outputHandle);
            }
            host.setOutput(outputHandle);
            try {
                // Call on the effect (not a destructured ref) so class-based
                // Effects keep their `this` binding.
                effect.render(host.ctx);
            }
            catch (err) {
                const key = `${i}:render`;
                if (!__classPrivateFieldGet(this, _EffectChain_warnedEffects, "f").has(key)) {
                    __classPrivateFieldGet(this, _EffectChain_warnedEffects, "f").add(key);
                    console.warn(`[VFX-JS] effect[${i}].render() threw; falling back to passthrough:`, err);
                }
                const vp = __classPrivateFieldGet(this, _EffectChain_stages, "f")[k].outputViewport;
                if (outputHandle === null) {
                    host.passthroughCopy(srcHandle, null, vp);
                }
                else if (k === stageCount - 1) {
                    host.passthroughCopy(srcHandle, outputHandle, vp);
                }
                else {
                    host.passthroughCopy(srcHandle, outputHandle, {
                        x: 0,
                        y: 0,
                        w: outputHandle.width,
                        h: outputHandle.height,
                    });
                }
            }
            host.setPhase("update");
        }
    }
    dispose() {
        if (__classPrivateFieldGet(this, _EffectChain_disposed, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _EffectChain_disposed, true, "f");
        for (let i = __classPrivateFieldGet(this, _EffectChain_effects, "f").length - 1; i >= 0; i--) {
            __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_safeDispose).call(this, i);
            __classPrivateFieldGet(this, _EffectChain_hosts, "f")[i].dispose();
        }
        if (__classPrivateFieldGet(this, _EffectChain_ownedPassthroughHost, "f")) {
            __classPrivateFieldGet(this, _EffectChain_ownedPassthroughHost, "f").dispose();
            __classPrivateFieldSet(this, _EffectChain_ownedPassthroughHost, null, "f");
        }
        for (const im of __classPrivateFieldGet(this, _EffectChain_intermediates, "f")) {
            im.fb.dispose();
        }
        __classPrivateFieldSet(this, _EffectChain_intermediates, [], "f");
        __classPrivateFieldSet(this, _EffectChain_stages, [], "f");
    }
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
    async replaceEffects(newEffects) {
        if (__classPrivateFieldGet(this, _EffectChain_disposed, "f")) {
            throw new Error("[VFX-JS] replaceEffects on disposed chain");
        }
        const oldEffects = __classPrivateFieldGet(this, _EffectChain_effects, "f");
        const oldHosts = __classPrivateFieldGet(this, _EffectChain_hosts, "f");
        const reusedHostByEffect = new Map();
        for (let i = 0; i < oldEffects.length; i++) {
            reusedHostByEffect.set(oldEffects[i], oldHosts[i]);
        }
        const nextHosts = new Array(newEffects.length);
        const newlyCreated = [];
        for (let i = 0; i < newEffects.length; i++) {
            const e = newEffects[i];
            const reused = reusedHostByEffect.get(e);
            if (reused) {
                nextHosts[i] = reused;
                reusedHostByEffect.delete(e);
            }
            else {
                const host = __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_newHost).call(this);
                nextHosts[i] = host;
                newlyCreated.push({ host, effect: e });
            }
        }
        for (let i = 0; i < newlyCreated.length; i++) {
            const { host, effect } = newlyCreated[i];
            host.setPhase("init");
            try {
                if (effect.init) {
                    await effect.init(host.ctx);
                }
                host.setPhase("update");
            }
            catch (err) {
                console.error("[VFX-JS] replaceEffects: new effect init() failed:", err);
                for (let j = i - 1; j >= 0; j--) {
                    const prior = newlyCreated[j];
                    if (prior.effect.dispose) {
                        try {
                            prior.effect.dispose();
                        }
                        catch (e2) {
                            console.error("[VFX-JS] dispose during init rollback threw:", e2);
                        }
                    }
                    prior.host.dispose();
                }
                host.dispose();
                throw err;
            }
        }
        for (const [effect, host] of reusedHostByEffect) {
            if (effect.dispose) {
                try {
                    effect.dispose();
                }
                catch (err) {
                    console.error("[VFX-JS] effect.dispose() threw during replaceEffects:", err);
                }
            }
            host.dispose();
        }
        for (const im of __classPrivateFieldGet(this, _EffectChain_intermediates, "f")) {
            im.fb.dispose();
        }
        __classPrivateFieldSet(this, _EffectChain_intermediates, [], "f");
        __classPrivateFieldSet(this, _EffectChain_stages, [], "f");
        if (newEffects.length === 0 && !__classPrivateFieldGet(this, _EffectChain_ownedPassthroughHost, "f")) {
            __classPrivateFieldSet(this, _EffectChain_ownedPassthroughHost, __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_newHost).call(this), "f");
        }
        else if (newEffects.length > 0 && __classPrivateFieldGet(this, _EffectChain_ownedPassthroughHost, "f")) {
            __classPrivateFieldGet(this, _EffectChain_ownedPassthroughHost, "f").dispose();
            __classPrivateFieldSet(this, _EffectChain_ownedPassthroughHost, null, "f");
        }
        __classPrivateFieldSet(this, _EffectChain_effects, newEffects, "f");
        __classPrivateFieldSet(this, _EffectChain_hosts, nextHosts, "f");
        __classPrivateFieldSet(this, _EffectChain_renderingIndices, __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_computeRenderingIndices).call(this), "f");
        __classPrivateFieldGet(this, _EffectChain_warnedEffects, "f").clear();
    }
}
_EffectChain_glCtx = new WeakMap(), _EffectChain_quad = new WeakMap(), _EffectChain_pixelRatio = new WeakMap(), _EffectChain_vfxProps = new WeakMap(), _EffectChain_programCache = new WeakMap(), _EffectChain_effects = new WeakMap(), _EffectChain_hosts = new WeakMap(), _EffectChain_renderingIndices = new WeakMap(), _EffectChain_intermediates = new WeakMap(), _EffectChain_stages = new WeakMap(), _EffectChain_capture = new WeakMap(), _EffectChain_warnedEffects = new WeakMap(), _EffectChain_disposed = new WeakMap(), _EffectChain_isPostEffect = new WeakMap(), _EffectChain_lastHitTestPad = new WeakMap(), _EffectChain_ownedPassthroughHost = new WeakMap(), _EffectChain_instances = new WeakSet(), _EffectChain_computeRenderingIndices = function _EffectChain_computeRenderingIndices() {
    return __classPrivateFieldGet(this, _EffectChain_effects, "f")
        .map((e, i) => typeof e.render === "function" && e.enabled !== false ? i : -1)
        .filter((i) => i >= 0);
}, _EffectChain_newHost = function _EffectChain_newHost() {
    return new EffectHost(__classPrivateFieldGet(this, _EffectChain_glCtx, "f"), __classPrivateFieldGet(this, _EffectChain_quad, "f"), __classPrivateFieldGet(this, _EffectChain_pixelRatio, "f"), __classPrivateFieldGet(this, _EffectChain_capture, "f"), __classPrivateFieldGet(this, _EffectChain_vfxProps, "f"), __classPrivateFieldGet(this, _EffectChain_programCache, "f"));
}, _EffectChain_safeDispose = function _EffectChain_safeDispose(i) {
    const e = __classPrivateFieldGet(this, _EffectChain_effects, "f")[i];
    if (!e.dispose) {
        return;
    }
    try {
        e.dispose();
    }
    catch (err) {
        console.error(`[VFX-JS] effect[${i}].dispose() threw:`, err);
    }
}, _EffectChain_resolveStages = function _EffectChain_resolveStages(input) {
    const stageCount = __classPrivateFieldGet(this, _EffectChain_renderingIndices, "f").length;
    __classPrivateFieldSet(this, _EffectChain_stages, new Array(stageCount), "f");
    if (stageCount === 0) {
        return;
    }
    // Post-effect: element mirrors canvas, so contentRect spans canvasBufferSize.
    const elementPixel = __classPrivateFieldGet(this, _EffectChain_isPostEffect, "f")
        ? input.canvasBufferSize
        : input.elementBufferSize;
    const contentRect = [
        0,
        0,
        elementPixel[0],
        elementPixel[1],
    ];
    const canvasRect = __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_canvasRectInElementLocal).call(this, input);
    let srcRect = contentRect;
    for (let k = 0; k < stageCount; k++) {
        const i = __classPrivateFieldGet(this, _EffectChain_renderingIndices, "f")[k];
        const effect = __classPrivateFieldGet(this, _EffectChain_effects, "f")[i];
        const isLast = k === stageCount - 1;
        const resolved = __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_callOutputRect).call(this, effect, srcRect, contentRect, canvasRect, input);
        const dstRect = resolved ?? srcRect;
        const dstBufferSize = [dstRect[2], dstRect[3]];
        const contentRectUv = rectInRect(contentRect, dstRect);
        const outputViewport = isLast
            ? {
                x: input.elementRectOnCanvasPx.x + dstRect[0],
                y: input.elementRectOnCanvasPx.y + dstRect[1],
                w: dstBufferSize[0],
                h: dstBufferSize[1],
            }
            : { x: 0, y: 0, w: dstBufferSize[0], h: dstBufferSize[1] };
        __classPrivateFieldGet(this, _EffectChain_stages, "f")[k] = {
            dstRect,
            dstBufferSize,
            contentRectUv,
            outputViewport,
        };
        if (!isLast) {
            __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_ensureIntermediate).call(this, k, dstBufferSize);
        }
        srcRect = dstRect;
    }
    const [lx, ly, lw, lh] = __classPrivateFieldGet(this, _EffectChain_stages, "f")[stageCount - 1].dstRect;
    __classPrivateFieldSet(this, _EffectChain_lastHitTestPad, createMargin({
        top: Math.max(0, ly + lh - elementPixel[1]),
        right: Math.max(0, lx + lw - elementPixel[0]),
        bottom: Math.max(0, -ly),
        left: Math.max(0, -lx),
    }), "f");
}, _EffectChain_callOutputRect = function _EffectChain_callOutputRect(effect, srcRect, contentRect, canvasRect, input) {
    if (!effect.outputRect) {
        return undefined;
    }
    return effect.outputRect(__classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_buildDims).call(this, input, contentRect, srcRect, canvasRect));
}, _EffectChain_buildDims = function _EffectChain_buildDims(input, contentRect, srcRect, canvasRect) {
    const pixelRatio = input.canvasBufferSize[0] / input.canvasSize[0] || 1;
    return {
        element: __classPrivateFieldGet(this, _EffectChain_isPostEffect, "f") ? input.canvasSize : input.elementSize,
        elementPixel: __classPrivateFieldGet(this, _EffectChain_isPostEffect, "f")
            ? input.canvasBufferSize
            : input.elementBufferSize,
        canvas: input.canvasSize,
        canvasPixel: input.canvasBufferSize,
        pixelRatio,
        contentRect,
        srcRect,
        canvasRect,
    };
}, _EffectChain_hostEffectDims = function _EffectChain_hostEffectDims(k, input) {
    const elementPixel = __classPrivateFieldGet(this, _EffectChain_isPostEffect, "f")
        ? input.canvasBufferSize
        : input.elementBufferSize;
    const contentRect = [
        0,
        0,
        elementPixel[0],
        elementPixel[1],
    ];
    const canvasRect = __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_canvasRectInElementLocal).call(this, input);
    const renderPos = __classPrivateFieldGet(this, _EffectChain_renderingIndices, "f").indexOf(k);
    const srcRect = renderPos <= 0 ? contentRect : __classPrivateFieldGet(this, _EffectChain_stages, "f")[renderPos - 1].dstRect;
    return __classPrivateFieldGet(this, _EffectChain_instances, "m", _EffectChain_buildDims).call(this, input, contentRect, srcRect, canvasRect);
}, _EffectChain_ensureIntermediate = function _EffectChain_ensureIntermediate(k, bufferSize) {
    const current = __classPrivateFieldGet(this, _EffectChain_intermediates, "f")[k];
    if (current &&
        current.fb.width === bufferSize[0] &&
        current.fb.height === bufferSize[1]) {
        return;
    }
    if (current) {
        current.fb.dispose();
    }
    const fb = new Framebuffer(__classPrivateFieldGet(this, _EffectChain_glCtx, "f"), bufferSize[0], bufferSize[1]);
    const rtHandle = makeEffectRenderTargetFromFb(fb);
    const texHandle = makeEffectTexture(() => fb.texture, () => fb.width, () => fb.height);
    __classPrivateFieldGet(this, _EffectChain_intermediates, "f")[k] = {
        fb,
        rtHandle,
        texHandle,
        bufferSize,
    };
}, _EffectChain_canvasRectInElementLocal = function _EffectChain_canvasRectInElementLocal(input) {
    const [cw, ch] = input.canvasBufferSize;
    if (__classPrivateFieldGet(this, _EffectChain_isPostEffect, "f")) {
        return [0, 0, cw, ch];
    }
    const { x, y } = input.elementRectOnCanvasPx;
    return [-x, -y, cw, ch];
}, _EffectChain_hostFrameDims = function _EffectChain_hostFrameDims(k, input) {
    const renderPos = __classPrivateFieldGet(this, _EffectChain_renderingIndices, "f").indexOf(k);
    let outputW;
    let outputH;
    let outputViewport;
    let contentRectUv;
    let srcRectUv;
    if (renderPos < 0) {
        // Not a rendering effect; placeholders.
        outputW = input.elementBufferSize[0];
        outputH = input.elementBufferSize[1];
        outputViewport = { x: 0, y: 0, w: outputW, h: outputH };
        contentRectUv = [0, 0, 1, 1];
        srcRectUv = [0, 0, 1, 1];
    }
    else {
        const stage = __classPrivateFieldGet(this, _EffectChain_stages, "f")[renderPos];
        outputW = stage.dstBufferSize[0];
        outputH = stage.dstBufferSize[1];
        outputViewport = stage.outputViewport;
        contentRectUv = stage.contentRectUv;
        // Stage k's src buffer is stage k-1's dst buffer; stage 0's
        // src is the capture (no pad), so srcRectUv = (0, 0, 1, 1).
        srcRectUv =
            renderPos === 0
                ? [0, 0, 1, 1]
                : __classPrivateFieldGet(this, _EffectChain_stages, "f")[renderPos - 1].contentRectUv;
    }
    return {
        outputBufferW: outputW,
        outputBufferH: outputH,
        canvasBufferSize: input.canvasBufferSize,
        outputViewport,
        elementBufferW: input.elementBufferSize[0],
        elementBufferH: input.elementBufferSize[1],
        contentRectUv,
        srcRectUv,
    };
};
//# sourceMappingURL=effect-chain.js.map