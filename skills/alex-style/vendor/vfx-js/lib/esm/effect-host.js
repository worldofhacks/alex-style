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
var _EffectHost_instances, _EffectHost_glCtx, _EffectHost_gl, _EffectHost_pixelRatio, _EffectHost_programCache, _EffectHost_geometries, _EffectHost_ownedTextures, _EffectHost_ownedRTs, _EffectHost_autoResizeRTs, _EffectHost_restoredUnsubs, _EffectHost_phase, _EffectHost_warnedDrawInUpdate, _EffectHost_dims, _EffectHost_mutCtx, _EffectHost_createRenderTarget, _EffectHost_disposeOwnedRT, _EffectHost_wrapTexture, _EffectHost_perFrameAutoUpdate, _EffectHost_draw, _EffectHost_blit, _EffectHost_doDraw, _EffectHost_buildUniforms;
import { Backbuffer } from "./backbuffer.js";
import { EFFECT_QUAD_TOKEN, EffectGeometryCache, isEffectQuad, } from "./effect-geometry.js";
import { Framebuffer } from "./gl/framebuffer.js";
import { applyBlend } from "./gl/pass.js";
import { Texture } from "./gl/texture.js";
// ---------------------------------------------------------------------------
// Internal resolver shapes — hidden from the public EffectTexture /
// EffectRenderTarget types via Symbol keys.
// ---------------------------------------------------------------------------
const RESOLVE_TEXTURE = Symbol.for("@vfx-js/effect.resolve-texture");
const RESOLVE_RT = Symbol.for("@vfx-js/effect.resolve-rt");
function resolveTexture(h) {
    return h[RESOLVE_TEXTURE]();
}
function resolveRt(h) {
    return h[RESOLVE_RT];
}
// ---------------------------------------------------------------------------
// Default vertex shaders (300 es / 100). Emit three varyings, nested
// largest-to-smallest in the [0, 1] range:
//   uv        — 0..1 over the full dst buffer (= captured content + pad)
//   uvSrc     — 0..1 over the src buffer (capture-only, or prior stage's
//               intermediate including its pad)
//   uvContent — 0..1 over the captured content (element / HTML subtree);
//               outside [0, 1] indicates pad
// Driven by two auto-uploaded uniforms:
//   contentRectUv (vec4) — content sub-rect within dst buffer UV
//   srcRectUv (vec4) — content sub-rect within src texture UV
// ---------------------------------------------------------------------------
const DEFAULT_VERT_300 = `#version 300 es
precision highp float;
in vec3 position;
out vec2 uv;
out vec2 uvContent;
out vec2 uvSrc;
uniform vec4 contentRectUv;
uniform vec4 srcRectUv;
void main() {
    vec2 bufferUV = position.xy * 0.5 + 0.5;
    uv = bufferUV;
    uvContent = (bufferUV - contentRectUv.xy) / contentRectUv.zw;
    uvSrc = srcRectUv.xy + uvContent * srcRectUv.zw;
    gl_Position = vec4(position, 1.0);
}
`;
const DEFAULT_VERT_100 = `
precision highp float;
attribute vec3 position;
varying vec2 uv;
varying vec2 uvContent;
varying vec2 uvSrc;
uniform vec4 contentRectUv;
uniform vec4 srcRectUv;
void main() {
    vec2 bufferUV = position.xy * 0.5 + 0.5;
    uv = bufferUV;
    uvContent = (bufferUV - contentRectUv.xy) / contentRectUv.zw;
    uvSrc = srcRectUv.xy + uvContent * srcRectUv.zw;
    gl_Position = vec4(position, 1.0);
}
`;
// Minimal passthrough copy fragment shader (300 es). Used for the
// stageCount=0 identity copy and render-failure fallback.
const PASSTHROUGH_FRAG_300 = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 outColor;
uniform sampler2D src;
void main() {
    outColor = texture(src, uv);
}
`;
const PASSTHROUGH_FRAG_100 = `
precision highp float;
varying vec2 uv;
uniform sampler2D src;
void main() {
    gl_FragColor = texture2D(src, uv);
}
`;
// Copy fragment backing `ctx.blit`. Samples `uvSrc` (captured content →
// dst buffer), unlike PASSTHROUGH_FRAG which samples the full dst buffer
// (`uv`) for the stageCount=0 identity copy.
const BLIT_FRAG_300 = `#version 300 es
precision highp float;
in vec2 uvSrc;
out vec4 outColor;
uniform sampler2D src;
void main() {
    outColor = texture(src, uvSrc);
}
`;
const BLIT_FRAG_100 = `
precision highp float;
varying vec2 uvSrc;
uniform sampler2D src;
void main() {
    gl_FragColor = texture2D(src, uvSrc);
}
`;
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
export class EffectHost {
    constructor(glCtx, quad, pixelRatio, initialSrc, initialVfxProps, programCache) {
        _EffectHost_instances.add(this);
        _EffectHost_glCtx.set(this, void 0);
        _EffectHost_gl.set(this, void 0);
        _EffectHost_pixelRatio.set(this, void 0);
        _EffectHost_programCache.set(this, void 0);
        _EffectHost_geometries.set(this, void 0);
        _EffectHost_ownedTextures.set(this, []);
        _EffectHost_ownedRTs.set(this, []);
        _EffectHost_autoResizeRTs.set(this, []);
        _EffectHost_restoredUnsubs.set(this, []);
        _EffectHost_phase.set(this, "init");
        _EffectHost_warnedDrawInUpdate.set(this, false);
        _EffectHost_dims.set(this, void 0);
        /**
         * Same object as `this.ctx`, typed as mutable for internal frame
         * updates. The chain writes to fields here; user effects see the
         * `readonly` view via `this.ctx`.
         */
        _EffectHost_mutCtx.set(this, void 0);
        _EffectHost_perFrameAutoUpdate.set(this, []);
        __classPrivateFieldSet(this, _EffectHost_glCtx, glCtx, "f");
        __classPrivateFieldSet(this, _EffectHost_gl, glCtx.gl, "f");
        __classPrivateFieldSet(this, _EffectHost_pixelRatio, pixelRatio, "f");
        __classPrivateFieldSet(this, _EffectHost_programCache, programCache, "f");
        __classPrivateFieldSet(this, _EffectHost_geometries, new EffectGeometryCache(glCtx, quad), "f");
        __classPrivateFieldSet(this, _EffectHost_dims, {
            outputBufferW: 1,
            outputBufferH: 1,
            canvasBufferSize: [1, 1],
            outputViewport: { x: 0, y: 0, w: 1, h: 1 },
            elementBufferW: 1,
            elementBufferH: 1,
            contentRectUv: [0, 0, 1, 1],
            srcRectUv: [0, 0, 1, 1],
        }, "f");
        const initialDims = {
            element: [1, 1],
            elementPixel: [1, 1],
            canvas: [1, 1],
            canvasPixel: [1, 1],
            pixelRatio,
            contentRect: [0, 0, 1, 1],
            srcRect: [0, 0, 1, 1],
            canvasRect: [0, 0, 1, 1],
        };
        const ctx = {
            time: 0,
            deltaTime: 0,
            pixelRatio,
            resolution: [1, 1],
            mouse: [0, 0],
            mouseViewport: [0, 0],
            intersection: 0,
            enterTime: 0,
            leaveTime: 0,
            src: initialSrc,
            target: null,
            uniforms: {},
            vfxProps: initialVfxProps,
            dims: initialDims,
            quad: EFFECT_QUAD_TOKEN,
            gl: __classPrivateFieldGet(this, _EffectHost_gl, "f"),
            createRenderTarget: (opts) => __classPrivateFieldGet(this, _EffectHost_instances, "m", _EffectHost_createRenderTarget).call(this, opts),
            wrapTexture: (source, opts) => __classPrivateFieldGet(this, _EffectHost_instances, "m", _EffectHost_wrapTexture).call(this, source, opts),
            draw: (opts) => __classPrivateFieldGet(this, _EffectHost_instances, "m", _EffectHost_draw).call(this, opts),
            blit: (source, target, opts) => __classPrivateFieldGet(this, _EffectHost_instances, "m", _EffectHost_blit).call(this, source, target, opts),
            onContextRestored: (cb) => {
                const unsub = __classPrivateFieldGet(this, _EffectHost_glCtx, "f").onContextRestored(cb);
                __classPrivateFieldGet(this, _EffectHost_restoredUnsubs, "f").push(unsub);
                return unsub;
            },
        };
        __classPrivateFieldSet(this, _EffectHost_mutCtx, ctx, "f");
    }
    get ctx() {
        return __classPrivateFieldGet(this, _EffectHost_mutCtx, "f");
    }
    // -- orchestrator-facing API --------------------------------------------
    setPhase(p) {
        __classPrivateFieldSet(this, _EffectHost_phase, p, "f");
    }
    setFrameDims(dims) {
        __classPrivateFieldSet(this, _EffectHost_dims, dims, "f");
        __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").resolution = [
            dims.canvasBufferSize[0],
            dims.canvasBufferSize[1],
        ];
        // Auto-resize managed RTs whose size tracks this stage's dst
        // buffer (= element + dstPad). Sizing to dst buffer instead of
        // inner element ensures effects can write into the pad region
        // without manual sizing.
        for (const rt of __classPrivateFieldGet(this, _EffectHost_autoResizeRTs, "f")) {
            rt.resolver.resize?.(dims.outputBufferW, dims.outputBufferH);
        }
    }
    setEffectDims(dims) {
        __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").dims = dims;
    }
    setFrameState(state) {
        const c = __classPrivateFieldGet(this, _EffectHost_mutCtx, "f");
        c.time = state.time;
        c.deltaTime = state.deltaTime;
        c.mouse = state.mouse;
        c.mouseViewport = state.mouseViewport;
        c.intersection = state.intersection;
        c.enterTime = state.enterTime;
        c.leaveTime = state.leaveTime;
        c.uniforms = state.uniforms;
    }
    setSrc(src) {
        __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").src = src;
    }
    setOutput(output) {
        __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").target = output;
    }
    // -- internal passthrough pass (used by chain for stageCount=0 / fallback)
    /**
     * Draws a passthrough copy of `src` into `target` using the host's
     * own program cache. The viewport passed in is device-px.
     */
    passthroughCopy(src, target, viewport) {
        const prevPhase = __classPrivateFieldGet(this, _EffectHost_phase, "f");
        __classPrivateFieldSet(this, _EffectHost_phase, "render", "f");
        const prevOutput = __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").target;
        __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").target = target;
        try {
            const prevVp = __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport;
            __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport = { ...viewport };
            const glslVersion = __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").vfxProps.glslVersion;
            const frag = glslVersion === "100"
                ? PASSTHROUGH_FRAG_100
                : PASSTHROUGH_FRAG_300;
            __classPrivateFieldGet(this, _EffectHost_instances, "m", _EffectHost_doDraw).call(this, {
                frag,
                uniforms: { src },
                target,
            });
            __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport = prevVp;
        }
        finally {
            __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").target = prevOutput;
            __classPrivateFieldSet(this, _EffectHost_phase, prevPhase, "f");
        }
    }
    /** Clears the given RT with `(0, 0, 0, 0)`. Device-px target. */
    clearRt(rt) {
        const gl = __classPrivateFieldGet(this, _EffectHost_gl, "f");
        const resolver = resolveRt(rt);
        gl.bindFramebuffer(gl.FRAMEBUFFER, resolver.getWriteFbo().fbo);
        gl.viewport(0, 0, rt.width, rt.height);
        gl.clearColor(0, 0, 0, 0);
        gl.disable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    /** Called by the chain at the start of the render phase. */
    tickAutoUpdates() {
        for (const fn of __classPrivateFieldGet(this, _EffectHost_perFrameAutoUpdate, "f")) {
            fn();
        }
    }
    // -- dispose ------------------------------------------------------------
    dispose() {
        __classPrivateFieldSet(this, _EffectHost_phase, "disposed", "f");
        for (const unsub of __classPrivateFieldGet(this, _EffectHost_restoredUnsubs, "f")) {
            unsub();
        }
        __classPrivateFieldSet(this, _EffectHost_restoredUnsubs, [], "f");
        for (const rt of __classPrivateFieldGet(this, _EffectHost_ownedRTs, "f")) {
            rt.resolver.dispose?.();
        }
        __classPrivateFieldSet(this, _EffectHost_ownedRTs, [], "f");
        __classPrivateFieldSet(this, _EffectHost_autoResizeRTs, [], "f");
        for (const t of __classPrivateFieldGet(this, _EffectHost_ownedTextures, "f")) {
            t.dispose();
        }
        __classPrivateFieldSet(this, _EffectHost_ownedTextures, [], "f");
        __classPrivateFieldGet(this, _EffectHost_geometries, "f").dispose();
        __classPrivateFieldSet(this, _EffectHost_perFrameAutoUpdate, [], "f");
    }
}
_EffectHost_glCtx = new WeakMap(), _EffectHost_gl = new WeakMap(), _EffectHost_pixelRatio = new WeakMap(), _EffectHost_programCache = new WeakMap(), _EffectHost_geometries = new WeakMap(), _EffectHost_ownedTextures = new WeakMap(), _EffectHost_ownedRTs = new WeakMap(), _EffectHost_autoResizeRTs = new WeakMap(), _EffectHost_restoredUnsubs = new WeakMap(), _EffectHost_phase = new WeakMap(), _EffectHost_warnedDrawInUpdate = new WeakMap(), _EffectHost_dims = new WeakMap(), _EffectHost_mutCtx = new WeakMap(), _EffectHost_perFrameAutoUpdate = new WeakMap(), _EffectHost_instances = new WeakSet(), _EffectHost_createRenderTarget = function _EffectHost_createRenderTarget(opts) {
    const persistent = opts?.persistent ?? false;
    const float = opts?.float ?? false;
    const wrap = normalizeWrap(opts?.wrap);
    const filter = opts?.filter;
    const mipmapOpt = opts?.mipmap ?? false;
    const mipmap = mipmapOpt !== false;
    const mipmapAutoRegen = mipmapOpt === true;
    const explicitSize = opts?.size;
    const sizeW = explicitSize ? explicitSize[0] : __classPrivateFieldGet(this, _EffectHost_dims, "f").outputBufferW;
    const sizeH = explicitSize ? explicitSize[1] : __classPrivateFieldGet(this, _EffectHost_dims, "f").outputBufferH;
    let resolver;
    let getW;
    let getH;
    if (persistent) {
        const pr = explicitSize ? 1 : __classPrivateFieldGet(this, _EffectHost_pixelRatio, "f");
        const cssW = explicitSize ? sizeW : sizeW / pr;
        const cssH = explicitSize ? sizeH : sizeH / pr;
        const bb = new Backbuffer(__classPrivateFieldGet(this, _EffectHost_glCtx, "f"), cssW, cssH, pr, float, {
            wrap,
            filter,
            mipmap,
        });
        resolver = {
            getReadTexture: () => bb.texture,
            getWriteFbo: () => bb.target,
            swap: () => bb.swap(),
            resize: explicitSize
                ? undefined
                : (bufferW, bufferH) => {
                    bb.resize(bufferW / __classPrivateFieldGet(this, _EffectHost_pixelRatio, "f"), bufferH / __classPrivateFieldGet(this, _EffectHost_pixelRatio, "f"));
                },
            dispose: () => bb.dispose(),
        };
        if (mipmap) {
            resolver.regenerateMipmaps = () => bb.target.generateMipmaps();
            resolver.mipmapAutoRegen = mipmapAutoRegen;
        }
        getW = () => bb.target.width;
        getH = () => bb.target.height;
    }
    else {
        const fb = new Framebuffer(__classPrivateFieldGet(this, _EffectHost_glCtx, "f"), sizeW, sizeH, {
            float,
            wrap,
            filter,
            mipmap,
        });
        resolver = {
            getReadTexture: () => fb.texture,
            getWriteFbo: () => fb,
            resize: explicitSize
                ? undefined
                : (bufferW, bufferH) => fb.setSize(bufferW, bufferH),
            dispose: () => fb.dispose(),
        };
        if (mipmap) {
            resolver.regenerateMipmaps = () => fb.generateMipmaps();
            resolver.mipmapAutoRegen = mipmapAutoRegen;
        }
        getW = () => fb.width;
        getH = () => fb.height;
    }
    let owned;
    const dispose = () => __classPrivateFieldGet(this, _EffectHost_instances, "m", _EffectHost_disposeOwnedRT).call(this, owned);
    const handle = makeEffectRenderTarget(resolver, getW, getH, dispose);
    owned = { handle, resolver };
    __classPrivateFieldGet(this, _EffectHost_ownedRTs, "f").push(owned);
    if (!explicitSize) {
        __classPrivateFieldGet(this, _EffectHost_autoResizeRTs, "f").push(owned);
    }
    return handle;
}, _EffectHost_disposeOwnedRT = function _EffectHost_disposeOwnedRT(owned) {
    const idx = __classPrivateFieldGet(this, _EffectHost_ownedRTs, "f").indexOf(owned);
    if (idx < 0) {
        return; // already disposed
    }
    __classPrivateFieldGet(this, _EffectHost_ownedRTs, "f").splice(idx, 1);
    const aIdx = __classPrivateFieldGet(this, _EffectHost_autoResizeRTs, "f").indexOf(owned);
    if (aIdx >= 0) {
        __classPrivateFieldGet(this, _EffectHost_autoResizeRTs, "f").splice(aIdx, 1);
    }
    owned.resolver.dispose?.();
}, _EffectHost_wrapTexture = function _EffectHost_wrapTexture(source, opts) {
    const wrap = normalizeWrap(opts?.wrap);
    const filter = opts?.filter;
    let texture;
    let getW;
    let getH;
    let autoUpdateFn = null;
    const isRawHandle = isWebGLTextureHandle(source);
    if (isRawHandle) {
        if (!opts?.size) {
            throw new Error("[VFX-JS] wrapTexture(WebGLTexture) requires opts.size");
        }
        const [sw, sh] = opts.size;
        texture = new Texture(__classPrivateFieldGet(this, _EffectHost_glCtx, "f"), undefined, {
            autoRegister: false,
            externalHandle: source,
        });
        getW = () => sw;
        getH = () => sh;
    }
    else {
        // Re-cast into the DOM subunion: TS's `Exclude` collapses
        // against `WebGLTexture` because in the DOM lib it is an
        // empty interface, so every other member is assignable.
        const domSource = source;
        texture = new Texture(__classPrivateFieldGet(this, _EffectHost_glCtx, "f"), domSource);
        const explicitSize = opts?.size;
        const readDim = (axis) => {
            if (explicitSize) {
                return axis === "w" ? explicitSize[0] : explicitSize[1];
            }
            if (typeof HTMLImageElement !== "undefined" &&
                domSource instanceof HTMLImageElement) {
                return axis === "w"
                    ? domSource.naturalWidth
                    : domSource.naturalHeight;
            }
            if (typeof HTMLVideoElement !== "undefined" &&
                domSource instanceof HTMLVideoElement) {
                return axis === "w"
                    ? domSource.videoWidth
                    : domSource.videoHeight;
            }
            const wc = domSource;
            return axis === "w" ? wc.width : wc.height;
        };
        getW = () => readDim("w");
        getH = () => readDim("h");
        const videoLike = (typeof HTMLVideoElement !== "undefined" &&
            domSource instanceof HTMLVideoElement) ||
            (typeof HTMLCanvasElement !== "undefined" &&
                domSource instanceof HTMLCanvasElement) ||
            (typeof OffscreenCanvas !== "undefined" &&
                domSource instanceof OffscreenCanvas);
        const autoUpdate = opts?.autoUpdate ?? videoLike;
        if (autoUpdate) {
            autoUpdateFn = () => {
                texture.needsUpdate = true;
            };
        }
    }
    texture.wrapS = wrap[0];
    texture.wrapT = wrap[1];
    if (filter !== undefined) {
        texture.minFilter = filter;
        texture.magFilter = filter;
    }
    __classPrivateFieldGet(this, _EffectHost_ownedTextures, "f").push(texture);
    if (autoUpdateFn) {
        __classPrivateFieldGet(this, _EffectHost_perFrameAutoUpdate, "f").push(autoUpdateFn);
    }
    return makeEffectTexture(() => texture, getW, getH);
}, _EffectHost_draw = function _EffectHost_draw(opts) {
    if (__classPrivateFieldGet(this, _EffectHost_phase, "f") !== "render") {
        if (__classPrivateFieldGet(this, _EffectHost_phase, "f") === "update" && !__classPrivateFieldGet(this, _EffectHost_warnedDrawInUpdate, "f")) {
            __classPrivateFieldSet(this, _EffectHost_warnedDrawInUpdate, true, "f");
            console.warn("[VFX-JS] ctx.draw() called in update(); ignored. Move draws to render().");
        }
        return;
    }
    __classPrivateFieldGet(this, _EffectHost_instances, "m", _EffectHost_doDraw).call(this, opts);
}, _EffectHost_blit = function _EffectHost_blit(source, target, opts) {
    if (__classPrivateFieldGet(this, _EffectHost_phase, "f") !== "render") {
        if (__classPrivateFieldGet(this, _EffectHost_phase, "f") === "update" && !__classPrivateFieldGet(this, _EffectHost_warnedDrawInUpdate, "f")) {
            __classPrivateFieldSet(this, _EffectHost_warnedDrawInUpdate, true, "f");
            console.warn("[VFX-JS] ctx.blit() called in update(); ignored. Move draws to render().");
        }
        return;
    }
    const frag = __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").vfxProps.glslVersion === "100"
        ? BLIT_FRAG_100
        : BLIT_FRAG_300;
    __classPrivateFieldGet(this, _EffectHost_instances, "m", _EffectHost_doDraw).call(this, {
        frag,
        uniforms: { src: source },
        target,
        blend: opts?.blend,
        swap: opts?.swap,
    });
}, _EffectHost_doDraw = function _EffectHost_doDraw(opts) {
    const gl = __classPrivateFieldGet(this, _EffectHost_gl, "f");
    const vert = opts.vert ??
        (__classPrivateFieldGet(this, _EffectHost_mutCtx, "f").vfxProps.glslVersion === "100"
            ? DEFAULT_VERT_100
            : DEFAULT_VERT_300);
    const program = __classPrivateFieldGet(this, _EffectHost_programCache, "f").get(vert, opts.frag, __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").vfxProps.glslVersion);
    const ctxOutput = __classPrivateFieldGet(this, _EffectHost_mutCtx, "f").target;
    const rawTarget = opts.target === undefined || opts.target === null
        ? ctxOutput
        : opts.target;
    // Writes to the stage's assigned target (explicit ctx.target, null,
    // or omitted) honor the chain-computed outputViewport. Writes to a
    // user-allocated RT get full-RT dims.
    const isStageOutput = rawTarget === null || rawTarget === ctxOutput;
    let fbo;
    let vpX;
    let vpY;
    let vpW;
    let vpH;
    let swap;
    let regenerateMipmaps;
    if (rawTarget === null) {
        fbo = null;
        vpX = __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport.x;
        vpY = __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport.y;
        vpW = __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport.w;
        vpH = __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport.h;
    }
    else {
        const resolver = resolveRt(rawTarget);
        fbo = resolver.getWriteFbo().fbo;
        if (isStageOutput) {
            vpX = __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport.x;
            vpY = __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport.y;
            vpW = __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport.w;
            vpH = __classPrivateFieldGet(this, _EffectHost_dims, "f").outputViewport.h;
        }
        else {
            vpX = 0;
            vpY = 0;
            vpW = rawTarget.width;
            vpH = rawTarget.height;
        }
        swap = resolver.swap;
        if (resolver.mipmapAutoRegen) {
            regenerateMipmaps = resolver.regenerateMipmaps;
        }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(vpX, vpY, vpW, vpH);
    gl.disable(gl.SCISSOR_TEST);
    const blend = opts.blend ?? (rawTarget === null ? "premultiplied" : "none");
    applyBlend(gl, blend);
    program.use();
    const uniforms = __classPrivateFieldGet(this, _EffectHost_instances, "m", _EffectHost_buildUniforms).call(this, opts.uniforms);
    program.uploadUniforms(uniforms);
    const geometry = opts.geometry ?? EFFECT_QUAD_TOKEN;
    if (isEffectQuad(geometry)) {
        __classPrivateFieldGet(this, _EffectHost_geometries, "f").quad.draw();
    }
    else {
        const compiled = __classPrivateFieldGet(this, _EffectHost_geometries, "f").resolve(geometry, program);
        compiled.draw();
    }
    // Regen pre-swap: getWriteFbo() returned the buffer we just
    // drew to. After swap, that buffer rotates to the read side
    // and the next draw would land on the stale partner.
    regenerateMipmaps?.();
    if (swap && opts.swap !== false) {
        swap();
    }
}, _EffectHost_buildUniforms = function _EffectHost_buildUniforms(userUniforms) {
    const out = {};
    // Auto uniforms: contentRectUv (dst) + srcRectUv (src).
    out["contentRectUv"] = { value: __classPrivateFieldGet(this, _EffectHost_dims, "f").contentRectUv };
    out["srcRectUv"] = { value: __classPrivateFieldGet(this, _EffectHost_dims, "f").srcRectUv };
    if (!userUniforms) {
        return out;
    }
    for (const [name, value] of Object.entries(userUniforms)) {
        out[name] = toInternalUniform(value);
    }
    return out;
};
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isWebGLTextureHandle(source) {
    // WebGLTexture is an opaque interface (no instance methods), but a
    // runtime check against the global constructor works when available.
    // DOM-source types all expose `width`, `naturalWidth`, etc., so the
    // structural duck-check (no `width`, `naturalWidth`, `videoWidth`)
    // fallbacks correctly cover environments without the global.
    const globalWebGLTexture = globalThis
        .WebGLTexture;
    if (globalWebGLTexture &&
        typeof globalWebGLTexture === "function" &&
        source instanceof
            globalWebGLTexture) {
        return true;
    }
    const s = source;
    return (s.width === undefined &&
        s.naturalWidth === undefined &&
        s.videoWidth === undefined);
}
function normalizeWrap(w) {
    if (w === undefined) {
        return ["clamp", "clamp"];
    }
    if (typeof w === "string") {
        return [w, w];
    }
    return [w[0], w[1]];
}
function toInternalUniform(value) {
    if (typeof value === "object" && value !== null && "__brand" in value) {
        if (value.__brand === "EffectRenderTarget") {
            return { value: resolveRt(value).getReadTexture() };
        }
        return { value: resolveTexture(value) };
    }
    return { value };
}
/**
 * Build an EffectTexture handle that resolves to the given Texture each
 * time. The resolver callback form lets `ctx.src` transparently follow
 * a text-element re-render (which swaps `e.srcTexture`).
 * @internal
 */
export function makeEffectTexture(resolve, width, height) {
    const handle = {
        __brand: "EffectTexture",
        get width() {
            return width();
        },
        get height() {
            return height();
        },
    };
    Object.defineProperty(handle, RESOLVE_TEXTURE, { value: resolve });
    return handle;
}
/** @internal */
export function makeEffectRenderTarget(resolver, width, height, dispose) {
    const handle = {
        __brand: "EffectRenderTarget",
        get width() {
            return width();
        },
        get height() {
            return height();
        },
        // Framework-owned RTs pass no dispose; the no-op makes
        // `rt.dispose()` always safe to call.
        dispose: dispose ?? (() => { }),
        // No-op when the underlying RT has no mip storage.
        generateMipmaps: () => resolver.regenerateMipmaps?.(),
    };
    Object.defineProperty(handle, RESOLVE_RT, { value: resolver });
    return handle;
}
/**
 * Build an EffectRenderTarget handle over an already-allocated
 * Framebuffer. Used by the chain to expose intermediates / the final
 * post-effect target.
 * @internal
 */
export function makeEffectRenderTargetFromFb(fb) {
    const resolver = {
        getReadTexture: () => fb.texture,
        getWriteFbo: () => fb,
    };
    return makeEffectRenderTarget(resolver, () => fb.width, () => fb.height);
}
// Re-export resolvers for the chain's internal use.
export { RESOLVE_RT, RESOLVE_TEXTURE, resolveRt, resolveTexture };
//# sourceMappingURL=effect-host.js.map