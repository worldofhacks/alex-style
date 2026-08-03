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
var _VFXPlayer_instances, _VFXPlayer_opts, _VFXPlayer_canvas, _VFXPlayer_ctx, _VFXPlayer_gl, _VFXPlayer_quad, _VFXPlayer_programCache, _VFXPlayer_copyPass, _VFXPlayer_postEffectEntries, _VFXPlayer_postEffectTarget, _VFXPlayer_postEffectBufferTargets, _VFXPlayer_postEffectChain, _VFXPlayer_postEffectChainReady, _VFXPlayer_registeredEffects, _VFXPlayer_postEffectChainStaticUniforms, _VFXPlayer_postEffectChainGenerators, _VFXPlayer_postEffectChainLastTime, _VFXPlayer_playRequest, _VFXPlayer_pixelRatio, _VFXPlayer_elements, _VFXPlayer_initTime, _VFXPlayer_canvasRect, _VFXPlayer_viewport, _VFXPlayer_canvasSize, _VFXPlayer_paddingX, _VFXPlayer_paddingY, _VFXPlayer_mouseX, _VFXPlayer_mouseY, _VFXPlayer_isRenderingToCanvas, _VFXPlayer_updateCanvasSize, _VFXPlayer_resize, _VFXPlayer_pointermove, _VFXPlayer_rerenderTextElement, _VFXPlayer_addEffectElement, _VFXPlayer_normalizePasses, _VFXPlayer_playLoop, _VFXPlayer_renderEffectElement, _VFXPlayer_shouldUsePostEffect, _VFXPlayer_assertEffectsNotReused, _VFXPlayer_releaseEffects, _VFXPlayer_chainMarginCss, _VFXPlayer_hitTest, _VFXPlayer_getShader, _VFXPlayer_render, _VFXPlayer_setOffset, _VFXPlayer_initPostEffects, _VFXPlayer_initPostEffectChain, _VFXPlayer_runPostEffectChain, _VFXPlayer_renderPostEffects, _VFXPlayer_setupPostEffectTarget;
import { Backbuffer } from "./backbuffer.js";
import { shaders } from "./constants.js";
import { CopyPass } from "./copy-pass.js";
import dom2canvas from "./dom-to-canvas.js";
import { EffectChain } from "./effect-chain.js";
import { makeEffectRenderTargetFromFb, makeEffectTexture, } from "./effect-host.js";
import GIFData from "./gif.js";
import { GLContext } from "./gl/context.js";
import { renderPass } from "./gl/pass.js";
import { Quad } from "./gl/quad.js";
import { loadImage, Texture } from "./gl/texture.js";
import { Vec2, Vec4 } from "./gl/vec.js";
import { getGLRect, rectToGLRect } from "./gl-rect.js";
import { PostEffectPass } from "./post-effect-pass.js";
import { ProgramCache } from "./program-cache.js";
import { createMargin, createRect, getIntersection, growRect, MARGIN_ZERO, toCeiledRect, toRect, } from "./rect.js";
import { createPassMaterial, createRenderTarget } from "./render-target.js";
const gifFor = new Map();
/**
 * @internal
 */
export class VFXPlayer {
    constructor(opts, canvas) {
        _VFXPlayer_instances.add(this);
        _VFXPlayer_opts.set(this, void 0);
        _VFXPlayer_canvas.set(this, void 0);
        _VFXPlayer_ctx.set(this, void 0);
        _VFXPlayer_gl.set(this, void 0);
        _VFXPlayer_quad.set(this, void 0);
        _VFXPlayer_programCache.set(this, void 0);
        _VFXPlayer_copyPass.set(this, void 0);
        _VFXPlayer_postEffectEntries.set(this, []);
        _VFXPlayer_postEffectTarget.set(this, void 0);
        _VFXPlayer_postEffectBufferTargets.set(this, new Map());
        // Effect-path post-effect state (mutually exclusive with the shader
        // post-effect passes above).
        _VFXPlayer_postEffectChain.set(this, null);
        _VFXPlayer_postEffectChainReady.set(this, false);
        /**
         * Tracks Effect instances currently attached (element chain or
         * postEffect chain). Used to reject reuse — Effects are stateful
         * (own RTs, dims) and cannot safely be shared across hosts.
         */
        _VFXPlayer_registeredEffects.set(this, new WeakSet());
        _VFXPlayer_postEffectChainStaticUniforms.set(this, {});
        _VFXPlayer_postEffectChainGenerators.set(this, {});
        _VFXPlayer_postEffectChainLastTime.set(this, 0);
        _VFXPlayer_playRequest.set(this, undefined);
        _VFXPlayer_pixelRatio.set(this, 2);
        _VFXPlayer_elements.set(this, []);
        _VFXPlayer_initTime.set(this, Date.now() / 1000.0);
        /** Canvas extent in CSS px (= viewport + scrollPadding on each side). */
        _VFXPlayer_canvasRect.set(this, createRect(0));
        /** Visible viewport in CSS px (no scrollPadding). */
        _VFXPlayer_viewport.set(this, createRect(0));
        _VFXPlayer_canvasSize.set(this, [0, 0]);
        _VFXPlayer_paddingX.set(this, 0);
        _VFXPlayer_paddingY.set(this, 0);
        _VFXPlayer_mouseX.set(this, 0);
        _VFXPlayer_mouseY.set(this, 0);
        _VFXPlayer_isRenderingToCanvas.set(this, new WeakMap());
        _VFXPlayer_resize.set(this, async () => {
            if (typeof window !== "undefined") {
                // Update dom2canvas result.
                // Render elements in viewport first, then render elements outside of the viewport.
                for (const e of __classPrivateFieldGet(this, _VFXPlayer_elements, "f")) {
                    if (e.type === "text" && e.isInViewport) {
                        const rect = e.element.getBoundingClientRect();
                        const w = Math.ceil(rect.width);
                        const h = Math.ceil(rect.height);
                        if (w !== e.width || h !== e.height) {
                            await __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_rerenderTextElement).call(this, e);
                            e.width = w;
                            e.height = h;
                        }
                    }
                }
                for (const e of __classPrivateFieldGet(this, _VFXPlayer_elements, "f")) {
                    if (e.type === "text" && !e.isInViewport) {
                        const rect = e.element.getBoundingClientRect();
                        const w = Math.ceil(rect.width);
                        const h = Math.ceil(rect.height);
                        if (w !== e.width || h !== e.height) {
                            await __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_rerenderTextElement).call(this, e);
                            e.width = w;
                            e.height = h;
                        }
                    }
                }
            }
        });
        _VFXPlayer_pointermove.set(this, (e) => {
            if (typeof window !== "undefined") {
                __classPrivateFieldSet(this, _VFXPlayer_mouseX, e.clientX, "f");
                __classPrivateFieldSet(this, _VFXPlayer_mouseY, window.innerHeight - e.clientY, "f");
            }
        });
        _VFXPlayer_playLoop.set(this, () => {
            if (this.isPlaying()) {
                this.render();
                __classPrivateFieldSet(this, _VFXPlayer_playRequest, requestAnimationFrame(__classPrivateFieldGet(this, _VFXPlayer_playLoop, "f")), "f");
            }
        });
        __classPrivateFieldSet(this, _VFXPlayer_opts, opts, "f");
        __classPrivateFieldSet(this, _VFXPlayer_canvas, canvas, "f");
        __classPrivateFieldSet(this, _VFXPlayer_ctx, new GLContext(canvas), "f");
        __classPrivateFieldSet(this, _VFXPlayer_gl, __classPrivateFieldGet(this, _VFXPlayer_ctx, "f").gl, "f");
        __classPrivateFieldGet(this, _VFXPlayer_gl, "f").clearColor(0, 0, 0, 0);
        __classPrivateFieldSet(this, _VFXPlayer_pixelRatio, opts.pixelRatio, "f");
        __classPrivateFieldSet(this, _VFXPlayer_quad, new Quad(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f")), "f");
        __classPrivateFieldSet(this, _VFXPlayer_programCache, new ProgramCache(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f")), "f");
        if (typeof window !== "undefined") {
            window.addEventListener("resize", __classPrivateFieldGet(this, _VFXPlayer_resize, "f"));
            window.addEventListener("pointermove", __classPrivateFieldGet(this, _VFXPlayer_pointermove, "f"));
        }
        __classPrivateFieldGet(this, _VFXPlayer_resize, "f").call(this);
        __classPrivateFieldSet(this, _VFXPlayer_copyPass, new CopyPass(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f")), "f");
        __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_initPostEffects).call(this, opts.postEffects);
        // Clear state that depends on frame-by-frame GPU output so the
        // scene re-renders cleanly after a context restore (persistent
        // backbuffers come back as black, then accumulate again).
        __classPrivateFieldGet(this, _VFXPlayer_ctx, "f").onContextRestored(() => {
            __classPrivateFieldGet(this, _VFXPlayer_gl, "f").clearColor(0, 0, 0, 0);
        });
    }
    destroy() {
        this.stop();
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", __classPrivateFieldGet(this, _VFXPlayer_resize, "f"));
            window.removeEventListener("pointermove", __classPrivateFieldGet(this, _VFXPlayer_pointermove, "f"));
        }
        __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f")?.dispose();
        for (const rt of __classPrivateFieldGet(this, _VFXPlayer_postEffectBufferTargets, "f").values()) {
            rt?.dispose();
        }
        for (const e of __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f")) {
            e.pass.dispose();
        }
        if (__classPrivateFieldGet(this, _VFXPlayer_postEffectChain, "f")) {
            __classPrivateFieldGet(this, _VFXPlayer_postEffectChain, "f").dispose();
            __classPrivateFieldSet(this, _VFXPlayer_postEffectChain, null, "f");
            __classPrivateFieldSet(this, _VFXPlayer_postEffectChainReady, false, "f");
        }
        __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").dispose();
        __classPrivateFieldGet(this, _VFXPlayer_programCache, "f").dispose();
        __classPrivateFieldGet(this, _VFXPlayer_quad, "f").dispose();
    }
    async addElement(element, opts = {}, initialCapture) {
        // Effect path: mutually exclusive with `shader`. See plan.md.
        if (opts.effect !== undefined) {
            return __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_addEffectElement).call(this, element, opts, opts.effect, initialCapture);
        }
        // Normalize shader input to VFXPass array
        const inputPasses = __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_normalizePasses).call(this, opts);
        const domRect = element.getBoundingClientRect();
        const rect = isTextPathElement(element)
            ? toCeiledRect(domRect)
            : toRect(domRect);
        const [isFullScreen, overflow] = parseOverflowOpts(opts.overflow);
        const rectWithOverflow = growRect(rect, overflow);
        const intersectionOpts = parseIntersectionOpts(opts.intersection);
        const originalOpacity = element.style.opacity === ""
            ? 1
            : Number.parseFloat(element.style.opacity);
        // Create values for element types
        let texture;
        let type;
        let isGif = false;
        if (element instanceof HTMLImageElement) {
            type = "img";
            isGif = !!element.src.match(/\.gif/i);
            if (isGif) {
                const gif = await GIFData.create(element.src, __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
                gifFor.set(element, gif);
                texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), gif.getCanvas());
            }
            else {
                const img = await loadImage(element.src);
                texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), img);
            }
        }
        else if (element instanceof HTMLVideoElement) {
            texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), element);
            type = "video";
        }
        else if (element instanceof HTMLCanvasElement) {
            if (element.hasAttribute("layoutsubtree") && initialCapture) {
                texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), initialCapture);
                type = "hic";
            }
            else {
                texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), element);
                type = "canvas";
            }
        }
        else {
            const canvas = await dom2canvas(element, originalOpacity, undefined, this.maxTextureSize);
            texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), canvas);
            type = "text";
        }
        const [wrapS, wrapT] = parseWrap(opts.wrap);
        texture.wrapS = wrapS;
        texture.wrapT = wrapT;
        texture.needsUpdate = true;
        const autoCrop = opts.autoCrop ?? true;
        // Hide original element
        if (type === "hic") {
            /* onpaint clears the canvas — no need to hide */
        }
        else if (opts.overlay === true) {
            /* Overlay mode. Do not hide the element */
        }
        else if (typeof opts.overlay === "number") {
            element.style.setProperty("opacity", opts.overlay.toString());
        }
        else {
            const opacity = type === "video" ? "0.0001" : "0"; // don't hide video element completely to prevent jank frames
            element.style.setProperty("opacity", opacity.toString());
        }
        // Create shared uniforms
        const sharedUniforms = {
            src: { value: texture },
            resolution: { value: new Vec2() },
            offset: { value: new Vec2() },
            time: { value: 0.0 },
            enterTime: { value: -1.0 },
            leaveTime: { value: -1.0 },
            mouse: { value: new Vec2() },
            intersection: { value: 0.0 },
            viewport: { value: new Vec4() },
            autoCrop: { value: autoCrop },
        };
        const sharedUniformGenerators = {};
        if (opts.uniforms !== undefined) {
            for (const [key, value] of Object.entries(opts.uniforms)) {
                if (typeof value === "function") {
                    sharedUniforms[key] = { value: value() };
                    sharedUniformGenerators[key] = value;
                }
                else {
                    sharedUniforms[key] = { value };
                }
            }
        }
        // Backbuffer
        let backbuffer;
        if (opts.backbuffer) {
            backbuffer = (() => {
                const bw = (rectWithOverflow.right - rectWithOverflow.left) *
                    __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
                const bh = (rectWithOverflow.bottom - rectWithOverflow.top) *
                    __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
                return new Backbuffer(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), bw, bh, __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), false);
            })();
            sharedUniforms["backbuffer"] = { value: backbuffer.texture };
        }
        // Create buffer targets for intermediate passes
        const bufferTargets = new Map();
        const passBackbuffers = new Map();
        for (let i = 0; i < inputPasses.length - 1; i++) {
            const targetName = inputPasses[i].target ?? `pass${i}`;
            inputPasses[i] = { ...inputPasses[i], target: targetName };
            const passSize = inputPasses[i].size;
            const bw = passSize
                ? passSize[0]
                : (rectWithOverflow.right - rectWithOverflow.left) *
                    __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
            const bh = passSize
                ? passSize[1]
                : (rectWithOverflow.bottom - rectWithOverflow.top) *
                    __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
            if (inputPasses[i].persistent) {
                // Persistent passes use double-buffered Backbuffer
                const pixelRatio = passSize ? 1 : __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
                const cssW = passSize
                    ? passSize[0]
                    : rectWithOverflow.right - rectWithOverflow.left;
                const cssH = passSize
                    ? passSize[1]
                    : rectWithOverflow.bottom - rectWithOverflow.top;
                passBackbuffers.set(targetName, new Backbuffer(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), cssW, cssH, pixelRatio, inputPasses[i].float));
            }
            else {
                bufferTargets.set(targetName, createRenderTarget(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), bw, bh, {
                    float: inputPasses[i].float,
                }));
            }
        }
        // Build passes
        const passes = [];
        for (let i = 0; i < inputPasses.length; i++) {
            const p = inputPasses[i];
            const frag = p.frag;
            // Create per-pass uniforms
            const passUniforms = { ...sharedUniforms };
            const passUniformGenerators = {};
            // Auto-bind buffer targets referenced in the shader
            // Skip binding the pass's own render target to avoid feedback loops
            // (persistent passes can read their own buffer via backbuffer double-buffering)
            for (const [name, rt] of bufferTargets) {
                if (name === p.target) {
                    continue;
                }
                if (frag.match(new RegExp(`uniform\\s+sampler2D\\s+${name}\\b`))) {
                    passUniforms[name] = { value: rt.texture };
                }
            }
            for (const [name, bb] of passBackbuffers) {
                if (frag.match(new RegExp(`uniform\\s+sampler2D\\s+${name}\\b`))) {
                    // Backbuffer read texture is always safe (double-buffered)
                    passUniforms[name] = { value: bb.texture };
                }
            }
            // Add per-pass uniforms
            if (p.uniforms) {
                for (const [key, value] of Object.entries(p.uniforms)) {
                    if (typeof value === "function") {
                        passUniforms[key] = { value: value() };
                        passUniformGenerators[key] = value;
                    }
                    else {
                        passUniforms[key] = { value };
                    }
                }
            }
            const pass = createPassMaterial(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), {
                vertexShader: p.vert,
                fragmentShader: frag,
                uniforms: passUniforms,
                renderingToBuffer: p.target !== undefined,
                glslVersion: p.glslVersion,
            });
            passes.push({
                pass,
                uniforms: passUniforms,
                uniformGenerators: {
                    ...sharedUniformGenerators,
                    ...passUniformGenerators,
                },
                target: p.target,
                persistent: p.persistent,
                float: p.float,
                size: p.size,
                backbuffer: p.target
                    ? passBackbuffers.get(p.target)
                    : undefined,
            });
        }
        const now = Date.now() / 1000;
        const elem = {
            type,
            element,
            isInViewport: false,
            isInLogicalViewport: false,
            // Match the (possibly-ceiled) rect so #resize's width/height
            // comparison stays in the same coordinate system.
            width: rect.right - rect.left,
            height: rect.bottom - rect.top,
            passes,
            bufferTargets,
            startTime: now,
            enterTime: now,
            leaveTime: Number.NEGATIVE_INFINITY,
            release: opts.release ?? Number.POSITIVE_INFINITY,
            isGif,
            isFullScreen,
            overflow,
            intersection: intersectionOpts,
            originalOpacity,
            srcTexture: texture,
            zIndex: opts.zIndex ?? 0,
            backbuffer,
            autoCrop,
        };
        __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_hitTest).call(this, elem, rect, now);
        // Insert element and sort elements by z-index.
        // Array.prototype.sort is stable sort, so the elements with same z
        // will be rendered by the order they are added to VFX.
        __classPrivateFieldGet(this, _VFXPlayer_elements, "f").push(elem);
        __classPrivateFieldGet(this, _VFXPlayer_elements, "f").sort((a, b) => a.zIndex - b.zIndex);
    }
    /**
     * Replace the effect chain on an already-registered effect-path
     * element. Effects whose reference is unchanged keep their host /
     * init state; only added/removed effects run init/dispose. Throws
     * when the element is not registered, lives on the shader path, or
     * when a *new* effect (not already in the current chain) is already
     * attached to another element/postEffect on this player.
     */
    async updateElementEffects(element, rawEffect) {
        const e = __classPrivateFieldGet(this, _VFXPlayer_elements, "f").find((x) => x.element === element);
        if (!e) {
            throw new Error("[VFX-JS] updateElementEffects: element not registered");
        }
        if (!e.chain) {
            throw new Error("[VFX-JS] updateElementEffects: element is on the shader path; effect-only updates are not supported");
        }
        const newEffects = Array.isArray(rawEffect)
            ? [...rawEffect]
            : [rawEffect];
        const oldEffects = e.chain.effects;
        const oldSet = new Set(oldEffects);
        const reallyNew = [];
        for (const eff of newEffects) {
            if (!oldSet.has(eff)) {
                if (__classPrivateFieldGet(this, _VFXPlayer_registeredEffects, "f").has(eff)) {
                    throw new Error("[VFX-JS] Effect instance already attached. Construct a new instance per `vfx.add()` / `postEffect`.");
                }
                reallyNew.push(eff);
            }
        }
        await e.chain.replaceEffects(newEffects);
        const newSet = new Set(newEffects);
        for (const eff of oldEffects) {
            if (!newSet.has(eff)) {
                __classPrivateFieldGet(this, _VFXPlayer_registeredEffects, "f").delete(eff);
            }
        }
        for (const eff of reallyNew) {
            __classPrivateFieldGet(this, _VFXPlayer_registeredEffects, "f").add(eff);
        }
    }
    removeElement(element) {
        const i = __classPrivateFieldGet(this, _VFXPlayer_elements, "f").findIndex((e) => e.element === element);
        if (i !== -1) {
            const e = __classPrivateFieldGet(this, _VFXPlayer_elements, "f").splice(i, 1)[0];
            if (e.chain) {
                // Effect path: chain disposes its effects + hosts +
                // intermediates. Source texture + opacity are ours.
                __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_releaseEffects).call(this, e.chain.effects);
                e.chain.dispose();
            }
            else {
                for (const rt of e.bufferTargets.values()) {
                    rt.dispose();
                }
                for (const p of e.passes) {
                    p.pass.dispose();
                    p.backbuffer?.dispose();
                }
                e.backbuffer?.dispose();
            }
            e.srcTexture.dispose();
            // Recover the original state
            element.style.setProperty("opacity", e.originalOpacity.toString());
        }
    }
    updateTextElement(element) {
        const i = __classPrivateFieldGet(this, _VFXPlayer_elements, "f").findIndex((e) => e.element === element);
        if (i !== -1) {
            return __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_rerenderTextElement).call(this, __classPrivateFieldGet(this, _VFXPlayer_elements, "f")[i]);
        }
        // Do nothing if the element is not found
        // This happens when addElement is still processing
        return Promise.resolve();
    }
    /**
     * Re-capture an `<img>` whose `src` changed since `add()`.
     *
     * Image source textures are uploaded once at `add()` time (only
     * video / GIF refresh per frame), so this reloads the current `src`
     * and swaps `e.srcTexture`. No-op for GIFs, which refresh already.
     */
    async updateImageElement(element) {
        const e = __classPrivateFieldGet(this, _VFXPlayer_elements, "f").find((e) => e.element === element);
        if (!e || e.type !== "img" || e.isGif) {
            return;
        }
        const img = await loadImage(element.src);
        const oldTexture = e.srcTexture;
        const texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), img);
        texture.wrapS = oldTexture.wrapS;
        texture.wrapT = oldTexture.wrapT;
        texture.needsUpdate = true;
        // Effect path reads `e.srcTexture` each frame via a resolver, so
        // the field swap suffices; shader path also needs the src uniform.
        if (!e.chain && e.passes.length > 0) {
            e.passes[0].uniforms["src"].value = texture;
        }
        e.srcTexture = texture;
        oldTexture.dispose();
    }
    updateCanvasElement(element) {
        const e = __classPrivateFieldGet(this, _VFXPlayer_elements, "f").find((e) => e.element === element);
        if (e) {
            const oldTexture = e.srcTexture;
            const texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), element);
            texture.wrapS = oldTexture.wrapS;
            texture.wrapT = oldTexture.wrapT;
            texture.needsUpdate = true;
            if (!e.chain && e.passes.length > 0) {
                e.passes[0].uniforms["src"].value = texture;
            }
            e.srcTexture = texture;
            oldTexture.dispose();
        }
    }
    updateHICTexture(canvas, offscreen) {
        const e = __classPrivateFieldGet(this, _VFXPlayer_elements, "f").find((e) => e.element === canvas);
        if (!e || e.type !== "hic") {
            return;
        }
        const oldTexture = e.srcTexture;
        if (oldTexture.source === offscreen) {
            oldTexture.needsUpdate = true;
        }
        else {
            const texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), offscreen);
            texture.wrapS = oldTexture.wrapS;
            texture.wrapT = oldTexture.wrapT;
            texture.needsUpdate = true;
            if (!e.chain && e.passes.length > 0) {
                e.passes[0].uniforms["src"].value = texture;
            }
            e.srcTexture = texture;
            oldTexture.dispose();
        }
    }
    get maxTextureSize() {
        return __classPrivateFieldGet(this, _VFXPlayer_ctx, "f").maxTextureSize;
    }
    isPlaying() {
        return __classPrivateFieldGet(this, _VFXPlayer_playRequest, "f") !== undefined;
    }
    play() {
        if (!this.isPlaying()) {
            __classPrivateFieldSet(this, _VFXPlayer_playRequest, requestAnimationFrame(__classPrivateFieldGet(this, _VFXPlayer_playLoop, "f")), "f");
        }
    }
    stop() {
        if (__classPrivateFieldGet(this, _VFXPlayer_playRequest, "f") !== undefined) {
            cancelAnimationFrame(__classPrivateFieldGet(this, _VFXPlayer_playRequest, "f"));
            __classPrivateFieldSet(this, _VFXPlayer_playRequest, undefined, "f");
        }
    }
    render() {
        const now = Date.now() / 1000;
        const gl = __classPrivateFieldGet(this, _VFXPlayer_gl, "f");
        // This must done every frame because iOS Safari doesn't fire
        // window resize event while the address bar is transforming.
        __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_updateCanvasSize).call(this);
        // Clear the main canvas.
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, __classPrivateFieldGet(this, _VFXPlayer_canvas, "f").width, __classPrivateFieldGet(this, _VFXPlayer_canvas, "f").height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const canvasW = __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").right - __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").left;
        const canvasH = __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").bottom - __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").top;
        const viewportGlRect = getGLRect(0, 0, canvasW, canvasH);
        // Setup post effect render target if needed. Chain-based
        // post-effect is only enabled once its async `init` resolves;
        // until then render directly to canvas (no blank frames).
        const shouldUsePostEffect = __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_shouldUsePostEffect).call(this);
        if (shouldUsePostEffect) {
            __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_setupPostEffectTarget).call(this, canvasW, canvasH);
            if (__classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f")) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f").fbo);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
        }
        for (const e of __classPrivateFieldGet(this, _VFXPlayer_elements, "f")) {
            const domRect = e.element.getBoundingClientRect();
            // text-path texture is captured at ceil dimensions — match the
            // quad so the texture maps 1:1 with no sub-pixel squish.
            const rect = e.type === "text" ? toCeiledRect(domRect) : toRect(domRect);
            const hit = __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_hitTest).call(this, e, rect, now);
            if (!hit.isVisible) {
                continue;
            }
            if (e.chain) {
                __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_renderEffectElement).call(this, e, rect, hit, now);
                continue;
            }
            // Update uniforms
            const u = e.passes[0].uniforms;
            u["time"].value = now - e.startTime;
            u["resolution"].value.set((rect.right - rect.left) * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), (rect.bottom - rect.top) * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
            // #mouseX/Y are in viewport-Y-up coords, but gl_FragCoord in
            // the canvas is in canvas-Y-up coords (canvas extends paddingX/Y
            // outside the viewport). Add padding to convert.
            u["mouse"].value.set((__classPrivateFieldGet(this, _VFXPlayer_mouseX, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingX, "f")) * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), (__classPrivateFieldGet(this, _VFXPlayer_mouseY, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingY, "f")) * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
            // Update uniform generators
            for (const pass of e.passes) {
                for (const [key, gen] of Object.entries(pass.uniformGenerators)) {
                    pass.uniforms[key].value = gen();
                }
            }
            // Update GIF / video
            gifFor.get(e.element)?.update();
            if (e.type === "video" || e.isGif) {
                u["src"].value.needsUpdate = true;
            }
            const glRect = rectToGLRect(rect, canvasH, __classPrivateFieldGet(this, _VFXPlayer_paddingX, "f"), __classPrivateFieldGet(this, _VFXPlayer_paddingY, "f"));
            const glRectWithOverflow = rectToGLRect(hit.rectWithOverflow, canvasH, __classPrivateFieldGet(this, _VFXPlayer_paddingX, "f"), __classPrivateFieldGet(this, _VFXPlayer_paddingY, "f"));
            // Update backbuffer uniform before any pass
            if (e.backbuffer) {
                e.passes[0].uniforms["backbuffer"].value = e.backbuffer.texture;
            }
            // Resize buffer targets if needed (skip passes with custom size)
            {
                const targetRect = e.isFullScreen
                    ? viewportGlRect
                    : glRectWithOverflow;
                const tw = Math.max(1, targetRect.w * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
                const th = Math.max(1, targetRect.h * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
                const cssW = Math.max(1, targetRect.w);
                const cssH = Math.max(1, targetRect.h);
                for (let i = 0; i < e.passes.length - 1; i++) {
                    const pass = e.passes[i];
                    if (pass.size) {
                        continue; // fixed size, no resize
                    }
                    if (pass.backbuffer) {
                        pass.backbuffer.resize(cssW, cssH);
                    }
                    else {
                        const rt = e.bufferTargets.get(pass.target);
                        if (rt && (rt.width !== tw || rt.height !== th)) {
                            rt.setSize(tw, th);
                        }
                    }
                }
            }
            // Track resolved buffer textures for dynamic uniform updates
            const resolvedTargets = new Map();
            // Pre-register persistent backbuffer textures
            for (const pass of e.passes) {
                if (pass.backbuffer && pass.target) {
                    resolvedTargets.set(pass.target, pass.backbuffer.texture);
                }
            }
            // Render intermediate passes, chaining src between passes
            // Use local inputTexture (like post-effects) to avoid corrupting
            // the shared src uniform across frames.
            let inputTexture = e.srcTexture;
            // #mouseX/Y are in viewport-Y-up coords, but glRect is in
            // canvas-Y-up coords (canvas extends paddingX/Y outside the
            // viewport). Add padding to convert to the same space.
            const relMouseX = __classPrivateFieldGet(this, _VFXPlayer_mouseX, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingX, "f") - glRect.x;
            const relMouseY = __classPrivateFieldGet(this, _VFXPlayer_mouseY, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingY, "f") - glRect.y;
            for (let i = 0; i < e.passes.length - 1; i++) {
                const pass = e.passes[i];
                const defaultRect = e.isFullScreen
                    ? viewportGlRect
                    : glRectWithOverflow;
                // Set src from chain (not shared uniform mutation)
                pass.uniforms["src"].value = inputTexture;
                // Update auto-bound buffer uniforms from resolved targets
                for (const [name, tex] of resolvedTargets) {
                    if (pass.uniforms[name]) {
                        pass.uniforms[name].value = tex;
                    }
                }
                // Update dynamic uniforms
                for (const [key, gen] of Object.entries(pass.uniformGenerators)) {
                    if (pass.uniforms[key]) {
                        pass.uniforms[key].value = gen();
                    }
                }
                // Intermediate passes render to their own buffer,
                // so offset is always 0 and resolution matches buffer size.
                const bufferW = pass.size
                    ? pass.size[0]
                    : defaultRect.w * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
                const bufferH = pass.size
                    ? pass.size[1]
                    : defaultRect.h * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
                const bufferRect = pass.size
                    ? getGLRect(0, 0, pass.size[0], pass.size[1])
                    : getGLRect(0, 0, defaultRect.w, defaultRect.h);
                pass.uniforms["resolution"].value.set(bufferW, bufferH);
                pass.uniforms["offset"].value.set(0, 0);
                pass.uniforms["mouse"].value.set((relMouseX / defaultRect.w) * bufferW, (relMouseY / defaultRect.h) * bufferH);
                if (pass.backbuffer) {
                    // Persistent pass: render to backbuffer, then swap
                    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, pass.pass, pass.backbuffer.target, bufferRect, pass.uniforms, true);
                    pass.backbuffer.swap();
                    inputTexture = pass.backbuffer.texture;
                }
                else {
                    const rt = e.bufferTargets.get(pass.target);
                    if (!rt) {
                        continue;
                    }
                    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, pass.pass, rt, bufferRect, pass.uniforms, true);
                    inputTexture = rt.texture;
                }
                // Update resolved target
                if (pass.target) {
                    resolvedTargets.set(pass.target, inputTexture);
                }
            }
            // Render final pass — restore element-space uniforms
            const finalPass = e.passes[e.passes.length - 1];
            finalPass.uniforms["src"].value = inputTexture;
            finalPass.uniforms["resolution"].value.set(domRect.width * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), domRect.height * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
            finalPass.uniforms["offset"].value.set(glRect.x * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), glRect.y * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
            finalPass.uniforms["mouse"].value.set((__classPrivateFieldGet(this, _VFXPlayer_mouseX, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingX, "f")) * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), (__classPrivateFieldGet(this, _VFXPlayer_mouseY, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingY, "f")) * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
            // Update resolved buffer uniforms for final pass
            for (const [name, tex] of resolvedTargets) {
                if (finalPass.uniforms[name]) {
                    finalPass.uniforms[name].value = tex;
                }
            }
            // Update dynamic uniforms for final pass
            for (const [key, gen] of Object.entries(finalPass.uniformGenerators)) {
                if (finalPass.uniforms[key]) {
                    finalPass.uniforms[key].value = gen();
                }
            }
            if (e.backbuffer) {
                // Update backbuffer
                finalPass.uniforms["backbuffer"].value = e.backbuffer.texture;
                if (e.isFullScreen) {
                    e.backbuffer.resize(canvasW, canvasH);
                    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_setOffset).call(this, e, glRect.x, glRect.y);
                    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, finalPass.pass, e.backbuffer.target, viewportGlRect, finalPass.uniforms, true);
                    e.backbuffer.swap();
                    __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").setUniforms(e.backbuffer.texture, __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), viewportGlRect);
                    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").pass, shouldUsePostEffect
                        ? __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f") || null
                        : null, viewportGlRect, __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").uniforms, false);
                }
                else {
                    e.backbuffer.resize(glRectWithOverflow.w, glRectWithOverflow.h);
                    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_setOffset).call(this, e, e.overflow.left, e.overflow.bottom);
                    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, finalPass.pass, e.backbuffer.target, e.backbuffer.getViewport(), finalPass.uniforms, true);
                    e.backbuffer.swap();
                    __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").setUniforms(e.backbuffer.texture, __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), glRectWithOverflow);
                    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").pass, shouldUsePostEffect
                        ? __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f") || null
                        : null, glRectWithOverflow, __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").uniforms, false);
                }
            }
            else {
                __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_setOffset).call(this, e, glRect.x, glRect.y);
                __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, finalPass.pass, shouldUsePostEffect ? __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f") || null : null, e.isFullScreen ? viewportGlRect : glRectWithOverflow, finalPass.uniforms, false);
            }
        }
        // Apply post effects
        if (shouldUsePostEffect && __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f")) {
            if (__classPrivateFieldGet(this, _VFXPlayer_postEffectChain, "f") && __classPrivateFieldGet(this, _VFXPlayer_postEffectChainReady, "f")) {
                __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_runPostEffectChain).call(this, viewportGlRect, now);
            }
            else {
                __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_renderPostEffects).call(this, viewportGlRect, now);
            }
        }
    }
}
_VFXPlayer_opts = new WeakMap(), _VFXPlayer_canvas = new WeakMap(), _VFXPlayer_ctx = new WeakMap(), _VFXPlayer_gl = new WeakMap(), _VFXPlayer_quad = new WeakMap(), _VFXPlayer_programCache = new WeakMap(), _VFXPlayer_copyPass = new WeakMap(), _VFXPlayer_postEffectEntries = new WeakMap(), _VFXPlayer_postEffectTarget = new WeakMap(), _VFXPlayer_postEffectBufferTargets = new WeakMap(), _VFXPlayer_postEffectChain = new WeakMap(), _VFXPlayer_postEffectChainReady = new WeakMap(), _VFXPlayer_registeredEffects = new WeakMap(), _VFXPlayer_postEffectChainStaticUniforms = new WeakMap(), _VFXPlayer_postEffectChainGenerators = new WeakMap(), _VFXPlayer_postEffectChainLastTime = new WeakMap(), _VFXPlayer_playRequest = new WeakMap(), _VFXPlayer_pixelRatio = new WeakMap(), _VFXPlayer_elements = new WeakMap(), _VFXPlayer_initTime = new WeakMap(), _VFXPlayer_canvasRect = new WeakMap(), _VFXPlayer_viewport = new WeakMap(), _VFXPlayer_canvasSize = new WeakMap(), _VFXPlayer_paddingX = new WeakMap(), _VFXPlayer_paddingY = new WeakMap(), _VFXPlayer_mouseX = new WeakMap(), _VFXPlayer_mouseY = new WeakMap(), _VFXPlayer_isRenderingToCanvas = new WeakMap(), _VFXPlayer_resize = new WeakMap(), _VFXPlayer_pointermove = new WeakMap(), _VFXPlayer_playLoop = new WeakMap(), _VFXPlayer_instances = new WeakSet(), _VFXPlayer_updateCanvasSize = function _VFXPlayer_updateCanvasSize() {
    if (typeof window === "undefined") {
        return;
    }
    // Get the viewport size excluding scrollbars.
    // We need to choose the element based on the document mode (quirks / standard).
    const doc = __classPrivateFieldGet(this, _VFXPlayer_canvas, "f").ownerDocument;
    const viewportEl = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement;
    const width = viewportEl.clientWidth;
    const height = viewportEl.clientHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    let paddingX;
    let paddingY;
    if (__classPrivateFieldGet(this, _VFXPlayer_opts, "f").fixedCanvas) {
        paddingX = 0;
        paddingY = 0;
    }
    else if (__classPrivateFieldGet(this, _VFXPlayer_opts, "f").wrapper) {
        // When a wrapper with overflow:hidden is used, no clamping needed.
        // The wrapper clips the canvas, so full padding is safe.
        paddingX = width * __classPrivateFieldGet(this, _VFXPlayer_opts, "f").scrollPadding[0];
        paddingY = height * __classPrivateFieldGet(this, _VFXPlayer_opts, "f").scrollPadding[1];
    }
    else {
        // No wrapper: clamp padding so that the canvas doesn't cause overflow
        const maxPaddingX = doc.body.scrollWidth - (scrollX + width);
        const maxPaddingY = doc.body.scrollHeight - (scrollY + height);
        paddingX = clamp(width * __classPrivateFieldGet(this, _VFXPlayer_opts, "f").scrollPadding[0], 0, maxPaddingX);
        paddingY = clamp(height * __classPrivateFieldGet(this, _VFXPlayer_opts, "f").scrollPadding[1], 0, maxPaddingY);
    }
    const widthWithPadding = width + paddingX * 2;
    const heightWithPadding = height + paddingY * 2;
    if (widthWithPadding !== __classPrivateFieldGet(this, _VFXPlayer_canvasSize, "f")[0] ||
        heightWithPadding !== __classPrivateFieldGet(this, _VFXPlayer_canvasSize, "f")[1]) {
        __classPrivateFieldGet(this, _VFXPlayer_canvas, "f").style.width = `${widthWithPadding}px`;
        __classPrivateFieldGet(this, _VFXPlayer_canvas, "f").style.height = `${heightWithPadding}px`;
        __classPrivateFieldGet(this, _VFXPlayer_ctx, "f").setSize(widthWithPadding, heightWithPadding, __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
        __classPrivateFieldSet(this, _VFXPlayer_canvasRect, createRect({
            top: -paddingY,
            left: -paddingX,
            right: width + paddingX,
            bottom: height + paddingY,
        }), "f");
        __classPrivateFieldSet(this, _VFXPlayer_viewport, createRect({
            top: 0,
            left: 0,
            right: width,
            bottom: height,
        }), "f");
        __classPrivateFieldSet(this, _VFXPlayer_canvasSize, [widthWithPadding, heightWithPadding], "f");
        __classPrivateFieldSet(this, _VFXPlayer_paddingX, paddingX, "f");
        __classPrivateFieldSet(this, _VFXPlayer_paddingY, paddingY, "f");
    }
    // Sync scroll
    if (!__classPrivateFieldGet(this, _VFXPlayer_opts, "f").fixedCanvas) {
        __classPrivateFieldGet(this, _VFXPlayer_canvas, "f").style.setProperty("transform", `translate(${scrollX - paddingX}px, ${scrollY - paddingY}px)`);
    }
}, _VFXPlayer_rerenderTextElement = async function _VFXPlayer_rerenderTextElement(e) {
    if (__classPrivateFieldGet(this, _VFXPlayer_isRenderingToCanvas, "f").get(e.element)) {
        return;
    }
    __classPrivateFieldGet(this, _VFXPlayer_isRenderingToCanvas, "f").set(e.element, true);
    try {
        const oldTexture = e.srcTexture;
        const oldCanvas = oldTexture.source instanceof OffscreenCanvas
            ? oldTexture.source
            : undefined;
        const canvas = await dom2canvas(e.element, e.originalOpacity, oldCanvas, this.maxTextureSize);
        if (canvas.width === 0 || canvas.width === 0) {
            throw "omg";
        }
        const texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), canvas);
        texture.wrapS = oldTexture.wrapS;
        texture.wrapT = oldTexture.wrapT;
        texture.needsUpdate = true;
        // Effect-path uses a resolver-form EffectTexture that reads
        // `e.srcTexture` each frame, so updating the field alone is
        // enough. Shader path also needs the pass-0 src uniform
        // rewritten.
        if (!e.chain && e.passes.length > 0) {
            e.passes[0].uniforms["src"].value = texture;
        }
        e.srcTexture = texture;
        oldTexture.dispose();
    }
    catch (e) {
        console.error(e);
    }
    __classPrivateFieldGet(this, _VFXPlayer_isRenderingToCanvas, "f").set(e.element, false);
}, _VFXPlayer_addEffectElement = async function _VFXPlayer_addEffectElement(element, opts, rawEffect, initialCapture) {
    if (opts.shader !== undefined) {
        console.warn("[VFX-JS] Both `shader` and `effect` specified; `effect` takes precedence.");
    }
    if (opts.overflow !== undefined) {
        console.warn("[VFX-JS] `overflow` is shader-path only and is ignored by the effect path. Use each effect's own `outputRect` (with `dims.canvasRect` for fullscreen) to control its dst rect.");
    }
    const effects = Array.isArray(rawEffect)
        ? [...rawEffect]
        : [rawEffect];
    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_assertEffectsNotReused).call(this, effects);
    // Shared prelude (mirrors shader-path addElement).
    const domRect = element.getBoundingClientRect();
    const rect = isTextPathElement(element)
        ? toCeiledRect(domRect)
        : toRect(domRect);
    const [isFullScreen, overflow] = parseOverflowOpts(opts.overflow);
    const intersectionOpts = parseIntersectionOpts(opts.intersection);
    const originalOpacity = element.style.opacity === ""
        ? 1
        : Number.parseFloat(element.style.opacity);
    let texture;
    let type;
    let isGif = false;
    if (element instanceof HTMLImageElement) {
        type = "img";
        isGif = !!element.src.match(/\.gif/i);
        if (isGif) {
            const gif = await GIFData.create(element.src, __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
            gifFor.set(element, gif);
            texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), gif.getCanvas());
        }
        else {
            const img = await loadImage(element.src);
            texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), img);
        }
    }
    else if (element instanceof HTMLVideoElement) {
        texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), element);
        type = "video";
    }
    else if (element instanceof HTMLCanvasElement) {
        if (element.hasAttribute("layoutsubtree") && initialCapture) {
            texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), initialCapture);
            type = "hic";
        }
        else {
            texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), element);
            type = "canvas";
        }
    }
    else {
        const canvas = await dom2canvas(element, originalOpacity, undefined, this.maxTextureSize);
        texture = new Texture(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), canvas);
        type = "text";
    }
    const [wrapS, wrapT] = parseWrap(opts.wrap);
    texture.wrapS = wrapS;
    texture.wrapT = wrapT;
    texture.needsUpdate = true;
    const autoCrop = opts.autoCrop ?? true;
    if (type === "hic") {
        /* onpaint clears the canvas */
    }
    else if (opts.overlay === true) {
        /* overlay mode */
    }
    else if (typeof opts.overlay === "number") {
        element.style.setProperty("opacity", opts.overlay.toString());
    }
    else {
        const opacity = type === "video" ? "0.0001" : "0";
        element.style.setProperty("opacity", opacity.toString());
    }
    // Effect-path specifics.
    const now = Date.now() / 1000;
    const elem = {
        type,
        element,
        isInViewport: false,
        isInLogicalViewport: false,
        // Match the (possibly-ceiled) rect so #resize's width/height
        // comparison stays in the same coordinate system.
        width: rect.right - rect.left,
        height: rect.bottom - rect.top,
        passes: [],
        bufferTargets: new Map(),
        startTime: now,
        enterTime: now,
        leaveTime: Number.NEGATIVE_INFINITY,
        release: opts.release ?? Number.POSITIVE_INFINITY,
        isGif,
        isFullScreen,
        overflow,
        intersection: intersectionOpts,
        originalOpacity,
        srcTexture: texture,
        zIndex: opts.zIndex ?? 0,
        backbuffer: undefined,
        autoCrop,
        effectLastRenderTime: now,
    };
    // Resolver-form EffectTexture — closure over `elem.srcTexture`
    // transparently follows text-element re-renders.
    const captureHandle = makeEffectTexture(() => elem.srcTexture, () => readTextureSourceDim(elem.srcTexture, "w"), () => readTextureSourceDim(elem.srcTexture, "h"));
    // Split user uniforms into static + generators.
    const staticUniforms = {};
    const gens = {};
    if (opts.uniforms) {
        for (const [k, v] of Object.entries(opts.uniforms)) {
            if (typeof v === "function") {
                gens[k] = v;
                staticUniforms[k] = v();
            }
            else {
                staticUniforms[k] = v;
            }
        }
    }
    elem.effectUniformGenerators = gens;
    elem.effectStaticUniforms = staticUniforms;
    const vfxProps = {
        autoCrop,
        glslVersion: opts.glslVersion ?? "300 es",
    };
    const chain = new EffectChain(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), __classPrivateFieldGet(this, _VFXPlayer_quad, "f"), __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), effects, vfxProps, captureHandle, false, __classPrivateFieldGet(this, _VFXPlayer_programCache, "f"));
    try {
        await chain.initAll();
    }
    catch (err) {
        // Chain has already disposed prior effects + failing host.
        // Release the source texture and restore opacity.
        __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_releaseEffects).call(this, effects);
        texture.dispose();
        element.style.setProperty("opacity", originalOpacity.toString());
        throw err;
    }
    elem.chain = chain;
    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_hitTest).call(this, elem, rect, now);
    __classPrivateFieldGet(this, _VFXPlayer_elements, "f").push(elem);
    __classPrivateFieldGet(this, _VFXPlayer_elements, "f").sort((a, b) => a.zIndex - b.zIndex);
}, _VFXPlayer_normalizePasses = function _VFXPlayer_normalizePasses(opts) {
    const inherit = (p) => p.glslVersion === undefined && opts.glslVersion !== undefined
        ? { ...p, glslVersion: opts.glslVersion }
        : p;
    if (Array.isArray(opts.shader)) {
        return opts.shader.map(inherit);
    }
    const shaderCode = __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_getShader).call(this, opts.shader || "uvGradient");
    return [inherit({ frag: shaderCode })];
}, _VFXPlayer_renderEffectElement = function _VFXPlayer_renderEffectElement(e, rect, hit, now) {
    const chain = e.chain;
    if (!chain) {
        return;
    }
    const pr = __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
    // Video / GIF per-frame re-upload (mirror shader path).
    gifFor.get(e.element)?.update();
    if (e.type === "video" || e.isGif) {
        e.srcTexture.needsUpdate = true;
    }
    // Resolve per-frame uniforms: static baseline + generator results.
    const resolvedUniforms = {
        ...(e.effectStaticUniforms ?? {}),
    };
    if (e.effectUniformGenerators) {
        for (const [k, gen] of Object.entries(e.effectUniformGenerators)) {
            resolvedUniforms[k] = gen();
        }
    }
    const canvasW = __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").right - __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").left;
    const canvasH = __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").bottom - __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").top;
    const glRect = rectToGLRect(rect, canvasH, __classPrivateFieldGet(this, _VFXPlayer_paddingX, "f"), __classPrivateFieldGet(this, _VFXPlayer_paddingY, "f"));
    // Mouse coordinates (bottom-left origin, physical px).
    //   mouse: element-local
    //   mouseViewport: viewport-local
    // `#mouseX/Y` are viewport-local logical px; adding padding maps
    // into canvas-local coords, subtracting glRect.x/y maps into
    // element-local coords.
    const relMouseX = __classPrivateFieldGet(this, _VFXPlayer_mouseX, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingX, "f") - glRect.x;
    const relMouseY = __classPrivateFieldGet(this, _VFXPlayer_mouseY, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingY, "f") - glRect.y;
    const elementInnerW = rect.right - rect.left;
    const elementInnerH = rect.bottom - rect.top;
    const prevT = e.effectLastRenderTime ?? now;
    const deltaTime = now - prevT;
    e.effectLastRenderTime = now;
    const shouldUsePostEffect = __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_shouldUsePostEffect).call(this);
    const finalTarget = shouldUsePostEffect && __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f")
        ? makeEffectRenderTargetFromFb(__classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f"))
        : null;
    chain.run({
        time: now - e.startTime,
        deltaTime,
        mouse: [relMouseX * pr, relMouseY * pr],
        mouseViewport: [__classPrivateFieldGet(this, _VFXPlayer_mouseX, "f") * pr, __classPrivateFieldGet(this, _VFXPlayer_mouseY, "f") * pr],
        intersection: hit.intersection,
        enterTime: now - e.enterTime,
        leaveTime: now - e.leaveTime,
        resolvedUniforms,
        canvasSize: [canvasW, canvasH],
        canvasBufferSize: [canvasW * pr, canvasH * pr],
        elementSize: [elementInnerW, elementInnerH],
        elementBufferSize: [elementInnerW * pr, elementInnerH * pr],
        elementRectOnCanvasPx: {
            x: glRect.x * pr,
            y: glRect.y * pr,
            w: glRect.w * pr,
            h: glRect.h * pr,
        },
        finalTarget,
        isVisible: hit.isVisible,
    });
}, _VFXPlayer_shouldUsePostEffect = function _VFXPlayer_shouldUsePostEffect() {
    return (__classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f").length > 0 ||
        (__classPrivateFieldGet(this, _VFXPlayer_postEffectChain, "f") !== null && __classPrivateFieldGet(this, _VFXPlayer_postEffectChainReady, "f")));
}, _VFXPlayer_assertEffectsNotReused = function _VFXPlayer_assertEffectsNotReused(effects) {
    for (const e of effects) {
        if (__classPrivateFieldGet(this, _VFXPlayer_registeredEffects, "f").has(e)) {
            throw new Error("[VFX-JS] Effect instance already attached. Construct a new instance per `vfx.add()` / `postEffect`.");
        }
    }
    for (const e of effects) {
        __classPrivateFieldGet(this, _VFXPlayer_registeredEffects, "f").add(e);
    }
}, _VFXPlayer_releaseEffects = function _VFXPlayer_releaseEffects(effects) {
    for (const e of effects) {
        __classPrivateFieldGet(this, _VFXPlayer_registeredEffects, "f").delete(e);
    }
}, _VFXPlayer_chainMarginCss = function _VFXPlayer_chainMarginCss(chain) {
    const padBuffer = chain.hitTestPadBuffer;
    const pr = __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
    return createMargin({
        top: padBuffer.top / pr,
        right: padBuffer.right / pr,
        bottom: padBuffer.bottom / pr,
        left: padBuffer.left / pr,
    });
}, _VFXPlayer_hitTest = function _VFXPlayer_hitTest(e, rect, now) {
    // Effect path uses chain's max dst pad (device px → CSS
    // for growRect) instead of `e.overflow`, which is shader-only.
    // Lags the actual chain pad by one frame on entry; acceptable.
    const visibilityMargin = e.chain
        ? __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_chainMarginCss).call(this, e.chain)
        : e.overflow;
    const rectWithOverflow = growRect(rect, visibilityMargin);
    const isInViewport = e.isFullScreen ||
        isRectInViewport(__classPrivateFieldGet(this, _VFXPlayer_viewport, "f"), rectWithOverflow);
    const viewportWithMargin = growRect(__classPrivateFieldGet(this, _VFXPlayer_viewport, "f"), e.intersection.rootMargin);
    const intersection = getIntersection(viewportWithMargin, rect);
    const isInLogicalViewport = e.isFullScreen ||
        checkIntersection(viewportWithMargin, rect, intersection, e.intersection.threshold);
    // Update transition timing
    if (!e.isInLogicalViewport && isInLogicalViewport /* out -> in */) {
        e.enterTime = now;
        e.leaveTime = Number.POSITIVE_INFINITY;
    }
    if (e.isInLogicalViewport && !isInLogicalViewport /* in -> out */) {
        e.leaveTime = now;
    }
    e.isInViewport = isInViewport;
    e.isInLogicalViewport = isInLogicalViewport;
    // Quit if the element has left and the transition has ended
    const isVisible = isInViewport && now - e.leaveTime <= e.release;
    if (isVisible && !e.chain && e.passes.length > 0) {
        const u = e.passes[0].uniforms;
        u["intersection"].value = intersection;
        u["enterTime"].value = now - e.enterTime;
        u["leaveTime"].value = now - e.leaveTime;
    }
    return { isVisible, intersection, rectWithOverflow };
}, _VFXPlayer_getShader = function _VFXPlayer_getShader(shaderNameOrCode) {
    if (shaderNameOrCode in shaders) {
        return shaders[shaderNameOrCode];
    }
    else {
        return shaderNameOrCode;
    }
}, _VFXPlayer_render = function _VFXPlayer_render(pass, target, rect, uniforms, clearTarget) {
    const gl = __classPrivateFieldGet(this, _VFXPlayer_gl, "f");
    // Clear intermediate targets, but never touch the post-effect target
    // here (it's cleared once per frame at the top of `render`).
    if (clearTarget &&
        target !== null &&
        target !== __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f")) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.width, target.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    // Viewport uniform uses un-clipped rect for shader uv calculation.
    const vp = uniforms["viewport"];
    if (vp && vp.value instanceof Vec4) {
        vp.value.set(rect.x * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), rect.y * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), rect.w * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), rect.h * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
    }
    try {
        renderPass(gl, __classPrivateFieldGet(this, _VFXPlayer_quad, "f"), pass, target, rect, __classPrivateFieldGet(this, _VFXPlayer_canvasSize, "f")[0], __classPrivateFieldGet(this, _VFXPlayer_canvasSize, "f")[1], __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
    }
    catch (e) {
        console.error(e);
    }
}, _VFXPlayer_setOffset = function _VFXPlayer_setOffset(e, x, y) {
    const offset = e.passes[0].uniforms["offset"].value;
    offset.x = x * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
    offset.y = y * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
}, _VFXPlayer_initPostEffects = function _VFXPlayer_initPostEffects(postEffects) {
    // Effect-path post-effect: a single-slot VFXPostEffect whose
    // `effect` field is set. See plan.md task 4-4.
    const pe = postEffects.length === 1 && !("frag" in postEffects[0])
        ? postEffects[0]
        : null;
    if (pe && pe.effect !== undefined) {
        __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_initPostEffectChain).call(this, pe, pe.effect);
        return;
    }
    const shaderSources = [];
    // First pass: assign auto target names for intermediate VFXPass items
    const passItems = [];
    for (const pe of postEffects) {
        if ("frag" in pe) {
            passItems.push(pe);
        }
    }
    for (let i = 0; i < passItems.length - 1; i++) {
        if (!passItems[i].target) {
            passItems[i] = { ...passItems[i], target: `pass${i}` };
        }
    }
    for (const pe of postEffects) {
        let frag;
        let pass;
        let target;
        if ("frag" in pe) {
            frag = pe.frag;
            pass = new PostEffectPass(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), frag, pe.uniforms, pe.persistent ?? false, pe.float ?? false, pe.size, pe.target !== undefined, pe.glslVersion);
            target = pe.target;
        }
        else {
            if (pe.shader === undefined) {
                throw new Error("VFXPostEffect requires `shader` (the `effect` path is not implemented yet).");
            }
            frag = __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_getShader).call(this, pe.shader);
            pass = new PostEffectPass(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), frag, pe.uniforms, pe.persistent ?? false, pe.float ?? false, undefined, false, pe.glslVersion);
            if (pe.persistent) {
                pass.registerBufferUniform("backbuffer");
            }
            target = undefined;
        }
        shaderSources.push(frag);
        const generators = {};
        if (pe.uniforms) {
            for (const [key, value] of Object.entries(pe.uniforms)) {
                if (typeof value === "function") {
                    generators[key] = value;
                }
            }
        }
        __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f").push({ pass, target, generators });
    }
    for (const p of passItems) {
        if (p.target) {
            __classPrivateFieldGet(this, _VFXPlayer_postEffectBufferTargets, "f").set(p.target, undefined);
        }
    }
    // Auto-bind named buffer targets referenced in shaders
    const allTargetNames = __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f")
        .map((e) => e.target)
        .filter((n) => n !== undefined);
    for (let i = 0; i < __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f").length; i++) {
        for (const name of allTargetNames) {
            if (shaderSources[i].match(new RegExp(`uniform\\s+sampler2D\\s+${name}\\b`))) {
                __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f")[i].pass.registerBufferUniform(name);
            }
        }
    }
}, _VFXPlayer_initPostEffectChain = function _VFXPlayer_initPostEffectChain(pe, rawEffect) {
    if (pe.shader !== undefined) {
        console.warn("[VFX-JS] Both `shader` and `effect` specified on post-effect; `effect` takes precedence.");
    }
    const effects = Array.isArray(rawEffect)
        ? [...rawEffect]
        : [rawEffect];
    __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_assertEffectsNotReused).call(this, effects);
    // Capture resolver: always the current #postEffectTarget texture
    // (regenerated on viewport resize via #setupPostEffectTarget).
    const captureHandle = makeEffectTexture(() => {
        const target = __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f");
        if (!target) {
            throw new Error("[VFX-JS] post-effect chain active without target");
        }
        return target.texture;
    }, () => __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f")?.width ?? 0, () => __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f")?.height ?? 0);
    const vfxProps = {
        autoCrop: true,
        glslVersion: pe.glslVersion ?? "300 es",
    };
    const chain = new EffectChain(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), __classPrivateFieldGet(this, _VFXPlayer_quad, "f"), __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), effects, vfxProps, captureHandle, true, __classPrivateFieldGet(this, _VFXPlayer_programCache, "f"));
    if (pe.uniforms) {
        for (const [k, v] of Object.entries(pe.uniforms)) {
            if (typeof v === "function") {
                __classPrivateFieldGet(this, _VFXPlayer_postEffectChainGenerators, "f")[k] =
                    v;
                __classPrivateFieldGet(this, _VFXPlayer_postEffectChainStaticUniforms, "f")[k] =
                    v();
            }
            else {
                __classPrivateFieldGet(this, _VFXPlayer_postEffectChainStaticUniforms, "f")[k] =
                    v;
            }
        }
    }
    __classPrivateFieldSet(this, _VFXPlayer_postEffectChain, chain, "f");
    __classPrivateFieldSet(this, _VFXPlayer_postEffectChainLastTime, Date.now() / 1000, "f");
    chain
        .initAll()
        .then(() => {
        // Guard against destroy() between init kickoff and
        // resolution.
        if (__classPrivateFieldGet(this, _VFXPlayer_postEffectChain, "f") === chain) {
            __classPrivateFieldSet(this, _VFXPlayer_postEffectChainReady, true, "f");
        }
    })
        .catch((err) => {
        console.error("[VFX-JS] Post-effect init failed; post-effect disabled:", err);
        if (__classPrivateFieldGet(this, _VFXPlayer_postEffectChain, "f") === chain) {
            __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_releaseEffects).call(this, __classPrivateFieldGet(this, _VFXPlayer_postEffectChain, "f").effects);
            __classPrivateFieldGet(this, _VFXPlayer_postEffectChain, "f").dispose();
            __classPrivateFieldSet(this, _VFXPlayer_postEffectChain, null, "f");
            __classPrivateFieldSet(this, _VFXPlayer_postEffectChainReady, false, "f");
        }
    });
}, _VFXPlayer_runPostEffectChain = function _VFXPlayer_runPostEffectChain(viewportGlRect, now) {
    const chain = __classPrivateFieldGet(this, _VFXPlayer_postEffectChain, "f");
    if (!chain) {
        return;
    }
    const pr = __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
    const resolvedUniforms = {
        ...__classPrivateFieldGet(this, _VFXPlayer_postEffectChainStaticUniforms, "f"),
    };
    for (const [k, gen] of Object.entries(__classPrivateFieldGet(this, _VFXPlayer_postEffectChainGenerators, "f"))) {
        resolvedUniforms[k] = gen();
    }
    const canvasW = __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").right - __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").left;
    const canvasH = __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").bottom - __classPrivateFieldGet(this, _VFXPlayer_canvasRect, "f").top;
    const prev = __classPrivateFieldGet(this, _VFXPlayer_postEffectChainLastTime, "f");
    const deltaTime = now - prev;
    __classPrivateFieldSet(this, _VFXPlayer_postEffectChainLastTime, now, "f");
    // For post-effects `element*` mirrors `canvas*`; overflow is 0.
    const canvasSize = [canvasW, canvasH];
    const canvasBufferSize = [canvasW * pr, canvasH * pr];
    const canvasOnCanvas = {
        x: viewportGlRect.x * pr,
        y: viewportGlRect.y * pr,
        w: viewportGlRect.w * pr,
        h: viewportGlRect.h * pr,
    };
    chain.run({
        time: now - __classPrivateFieldGet(this, _VFXPlayer_initTime, "f"),
        deltaTime,
        mouse: [__classPrivateFieldGet(this, _VFXPlayer_mouseX, "f") * pr, __classPrivateFieldGet(this, _VFXPlayer_mouseY, "f") * pr],
        mouseViewport: [__classPrivateFieldGet(this, _VFXPlayer_mouseX, "f") * pr, __classPrivateFieldGet(this, _VFXPlayer_mouseY, "f") * pr],
        intersection: 1,
        enterTime: 0,
        leaveTime: 0,
        resolvedUniforms,
        canvasSize,
        canvasBufferSize,
        elementSize: canvasSize,
        elementBufferSize: canvasBufferSize,
        elementRectOnCanvasPx: canvasOnCanvas,
        finalTarget: null,
        isVisible: true,
    });
}, _VFXPlayer_renderPostEffects = function _VFXPlayer_renderPostEffects(viewportGlRect, now) {
    if (!__classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f")) {
        return;
    }
    let inputTexture = __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f").texture;
    const resolvedTargets = new Map();
    // Pre-register persistent backbuffer textures so that earlier passes
    // can read from later passes' previous-frame output.
    for (const { pass, target } of __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f")) {
        if (target && pass.backbuffer) {
            resolvedTargets.set(target, pass.backbuffer.texture);
        }
    }
    for (let i = 0; i < __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f").length; i++) {
        const { pass, target: targetName, generators, } = __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f")[i];
        const isLastPass = i === __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f").length - 1;
        const mouseX = __classPrivateFieldGet(this, _VFXPlayer_mouseX, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingX, "f");
        const mouseY = __classPrivateFieldGet(this, _VFXPlayer_mouseY, "f") + __classPrivateFieldGet(this, _VFXPlayer_paddingY, "f");
        const targetDims = pass.size;
        if (targetDims) {
            const [tw, th] = targetDims;
            pass.uniforms.src.value = inputTexture;
            pass.uniforms.resolution.value.set(tw, th);
            pass.uniforms.offset.value.set(0, 0);
            pass.uniforms.time.value = now - __classPrivateFieldGet(this, _VFXPlayer_initTime, "f");
            pass.uniforms.mouse.value.set((mouseX / viewportGlRect.w) * tw, (mouseY / viewportGlRect.h) * th);
        }
        else {
            pass.setUniforms(inputTexture, __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), viewportGlRect, now - __classPrivateFieldGet(this, _VFXPlayer_initTime, "f"), mouseX, mouseY);
        }
        pass.uniforms.passIndex.value = i;
        pass.updateCustomUniforms(generators);
        // Update auto-bound buffer uniforms from previously resolved targets
        for (const [name, tex] of resolvedTargets) {
            const u = pass.uniforms[name];
            if (u) {
                u.value = tex;
            }
        }
        if (isLastPass) {
            if (pass.backbuffer) {
                if (pass.uniforms.backbuffer) {
                    pass.uniforms.backbuffer.value =
                        pass.backbuffer.texture;
                }
                __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, pass.pass, pass.backbuffer.target, viewportGlRect, pass.uniforms, true);
                pass.backbuffer.swap();
                __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").setUniforms(pass.backbuffer.texture, __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), viewportGlRect);
                __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").pass, null, viewportGlRect, __classPrivateFieldGet(this, _VFXPlayer_copyPass, "f").uniforms, false);
            }
            else {
                __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, pass.pass, null, viewportGlRect, pass.uniforms, false);
            }
        }
        else if (pass.backbuffer) {
            if (pass.uniforms.backbuffer) {
                pass.uniforms.backbuffer.value = pass.backbuffer.texture;
            }
            const bbRect = targetDims
                ? getGLRect(0, 0, targetDims[0] / __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), targetDims[1] / __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"))
                : viewportGlRect;
            __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, pass.pass, pass.backbuffer.target, bbRect, pass.uniforms, true);
            pass.backbuffer.swap();
            inputTexture = pass.backbuffer.texture;
            if (targetName) {
                resolvedTargets.set(targetName, pass.backbuffer.texture);
            }
        }
        else {
            const bufferName = targetName ?? `postEffect${i}`;
            let rt = __classPrivateFieldGet(this, _VFXPlayer_postEffectBufferTargets, "f").get(bufferName);
            const rtW = targetDims
                ? targetDims[0]
                : viewportGlRect.w * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
            const rtH = targetDims
                ? targetDims[1]
                : viewportGlRect.h * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
            if (!rt || rt.width !== rtW || rt.height !== rtH) {
                rt?.dispose();
                rt = createRenderTarget(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), rtW, rtH, {
                    float: pass.float,
                });
                __classPrivateFieldGet(this, _VFXPlayer_postEffectBufferTargets, "f").set(bufferName, rt);
            }
            const renderRect = targetDims
                ? getGLRect(0, 0, targetDims[0] / __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"), targetDims[1] / __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"))
                : viewportGlRect;
            __classPrivateFieldGet(this, _VFXPlayer_instances, "m", _VFXPlayer_render).call(this, pass.pass, rt, renderRect, pass.uniforms, true);
            inputTexture = rt.texture;
            if (targetName) {
                resolvedTargets.set(targetName, rt.texture);
            }
        }
    }
}, _VFXPlayer_setupPostEffectTarget = function _VFXPlayer_setupPostEffectTarget(width, height) {
    const targetWidth = width * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
    const targetHeight = height * __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f");
    if (!__classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f") ||
        __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f").width !== targetWidth ||
        __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f").height !== targetHeight) {
        __classPrivateFieldGet(this, _VFXPlayer_postEffectTarget, "f")?.dispose();
        __classPrivateFieldSet(this, _VFXPlayer_postEffectTarget, createRenderTarget(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), targetWidth, targetHeight), "f");
    }
    // Initialize/resize post effect backbuffers
    for (const { pass } of __classPrivateFieldGet(this, _VFXPlayer_postEffectEntries, "f")) {
        if (pass.persistent && !pass.backbuffer) {
            pass.initializeBackbuffer(__classPrivateFieldGet(this, _VFXPlayer_ctx, "f"), width, height, __classPrivateFieldGet(this, _VFXPlayer_pixelRatio, "f"));
        }
        else if (pass.backbuffer) {
            pass.resizeBackbuffer(width, height);
        }
    }
};
/**
 * Returns if the given rects intersect.
 * It returns true when the rects are adjacent (= intersection ratio is 0).
 */
export function isRectInViewport(viewport, rect) {
    return (rect.left <= viewport.right &&
        rect.right >= viewport.left &&
        rect.top <= viewport.bottom &&
        rect.bottom >= viewport.top);
}
export function checkIntersection(viewport, rect, intersection, threshold) {
    if (threshold === 0) {
        // if threshold === 0, consider adjacent rects to be intersecting.
        return isRectInViewport(viewport, rect);
    }
    else {
        return intersection >= threshold;
    }
}
export function parseOverflowOpts(overflow) {
    if (overflow === true) {
        return [true, MARGIN_ZERO];
    }
    if (overflow === undefined) {
        return [false, MARGIN_ZERO];
    }
    return [false, createMargin(overflow)];
}
export function parseIntersectionOpts(intersectionOpts) {
    const threshold = intersectionOpts?.threshold ?? 0;
    const rootMargin = createMargin(intersectionOpts?.rootMargin ?? 0);
    return {
        threshold,
        rootMargin,
    };
}
/**
 * Inspect a Texture's source and return its native width/height.
 * Used by `ctx.src` for effect-path elements. Returns 0 if the source
 * is not yet ready (e.g. HTMLImageElement pre-load).
 */
function readTextureSourceDim(tex, axis) {
    const src = tex.source;
    if (!src) {
        return 0;
    }
    if (typeof HTMLImageElement !== "undefined" &&
        src instanceof HTMLImageElement) {
        return axis === "w" ? src.naturalWidth : src.naturalHeight;
    }
    if (typeof HTMLVideoElement !== "undefined" &&
        src instanceof HTMLVideoElement) {
        return axis === "w" ? src.videoWidth : src.videoHeight;
    }
    const wc = src;
    return axis === "w" ? wc.width : wc.height;
}
function parseWrapSingle(wrapOpt) {
    if (wrapOpt === "repeat") {
        return "repeat";
    }
    if (wrapOpt === "mirror") {
        return "mirror";
    }
    return "clamp";
}
function parseWrap(wrapOpt) {
    if (!wrapOpt) {
        return ["clamp", "clamp"];
    }
    if (Array.isArray(wrapOpt)) {
        return [parseWrapSingle(wrapOpt[0]), parseWrapSingle(wrapOpt[1])];
    }
    const w = parseWrapSingle(wrapOpt);
    return [w, w];
}
function clamp(x, xmin, xmax) {
    return Math.max(xmin, Math.min(xmax, x));
}
/**
 * Whether `element` goes through the text path (i.e. `dom2canvas`). These
 * elements have their texture captured at ceiled CSS-pixel dimensions, so
 * their on-screen rect must use {@link toCeiledRect} as well.
 * @internal
 */
function isTextPathElement(element) {
    return !(element instanceof HTMLImageElement ||
        element instanceof HTMLVideoElement ||
        element instanceof HTMLCanvasElement);
}
//# sourceMappingURL=vfx-player.js.map