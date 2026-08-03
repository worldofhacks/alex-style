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
var _VFX_instances, _VFX_player, _VFX_canvas, _VFX_wrapperCanvases, _VFX_addImage, _VFX_addVideo, _VFX_addCanvas, _VFX_addText;
import { unwrapElement, wrapElement } from "./html-in-canvas.js";
import { supportsHtmlInCanvas } from "./html-in-canvas-support.js";
import { getVFXOpts, } from "./types.js";
import { VFXPlayer } from "./vfx-player.js";
import { isWebGLAvailable } from "./webgl-support.js";
function checkEnvironment() {
    if (typeof window === "undefined") {
        throw "Cannot find 'window'. VFX-JS only runs on the browser.";
    }
    if (typeof document === "undefined") {
        throw "Cannot find 'document'. VFX-JS only runs on the browser.";
    }
}
function getCanvasStyle(fixed) {
    return {
        position: fixed ? "fixed" : "absolute",
        top: 0,
        left: 0,
        // Sized by VFXPlayer#updateCanvasSize; avoid 100vw/100vh which
        // can cause overflow on iOS Safari.
        width: "0px",
        height: "0px",
        "z-index": 9999,
        "pointer-events": "none",
    };
}
/**
 * The main interface of VFX-JS.
 */
export class VFX {
    /**
     * Create a VFX instance if WebGL is available, or return `null`.
     */
    static init(options) {
        try {
            return new VFX(options);
        }
        catch {
            return null;
        }
    }
    /**
     * Creates VFX instance and start playing immediately.
     * @throws When WebGL is not available in the current environment.
     */
    constructor(options = {}) {
        _VFX_instances.add(this);
        _VFX_player.set(this, void 0);
        _VFX_canvas.set(this, void 0);
        _VFX_wrapperCanvases.set(this, new Map());
        checkEnvironment();
        if (!isWebGLAvailable()) {
            throw new Error("[VFX-JS] WebGL is not available in this environment.");
        }
        const opts = getVFXOpts(options);
        // Setup canvas
        const canvas = document.createElement("canvas");
        const canvasStyle = getCanvasStyle(opts.fixedCanvas);
        for (const [k, v] of Object.entries(canvasStyle)) {
            canvas.style.setProperty(k, v.toString());
        }
        if (opts.zIndex !== undefined) {
            canvas.style.setProperty("z-index", opts.zIndex.toString());
        }
        (opts.wrapper ?? document.body).appendChild(canvas);
        __classPrivateFieldSet(this, _VFX_canvas, canvas, "f");
        __classPrivateFieldSet(this, _VFX_player, new VFXPlayer(opts, canvas), "f");
        if (opts.autoplay) {
            __classPrivateFieldGet(this, _VFX_player, "f").play();
        }
    }
    /**
     * Register an element to track the position and render visual effects in the area.
     */
    async add(element, opts, initialCapture) {
        if (element instanceof HTMLImageElement) {
            await __classPrivateFieldGet(this, _VFX_instances, "m", _VFX_addImage).call(this, element, opts);
        }
        else if (element instanceof HTMLVideoElement) {
            await __classPrivateFieldGet(this, _VFX_instances, "m", _VFX_addVideo).call(this, element, opts);
        }
        else if (element instanceof HTMLCanvasElement) {
            if (element.hasAttribute("layoutsubtree") && initialCapture) {
                await __classPrivateFieldGet(this, _VFX_player, "f").addElement(element, opts, initialCapture);
            }
            else {
                await __classPrivateFieldGet(this, _VFX_instances, "m", _VFX_addCanvas).call(this, element, opts);
            }
        }
        else {
            await __classPrivateFieldGet(this, _VFX_instances, "m", _VFX_addText).call(this, element, opts);
        }
    }
    /**
     * Update the HIC texture for a layoutsubtree canvas.
     * @internal Used by VFXCanvas (@vfx-js/react).
     */
    updateHICTexture(canvas, offscreen) {
        __classPrivateFieldGet(this, _VFX_player, "f").updateHICTexture(canvas, offscreen);
    }
    get maxTextureSize() {
        return __classPrivateFieldGet(this, _VFX_player, "f").maxTextureSize;
    }
    /**
     * Register an element using html-in-canvas API.
     * Wraps the element in a `<canvas layoutsubtree>` and captures via drawElementImage.
     * Falls back to `add()` if html-in-canvas is not supported.
     */
    async addHTML(element, opts) {
        if (!supportsHtmlInCanvas()) {
            console.warn("html-in-canvas not supported, falling back to dom-to-canvas");
            return this.add(element, opts);
        }
        if (opts.overlay !== undefined) {
            console.warn("addHTML does not support overlay mode (layoutsubtree hides children). Ignoring overlay option.");
        }
        const { overlay: _, ...hicOpts } = opts;
        let wrapper = __classPrivateFieldGet(this, _VFX_wrapperCanvases, "f").get(element);
        if (wrapper) {
            __classPrivateFieldGet(this, _VFX_player, "f").removeElement(wrapper);
        }
        const { canvas, initialCapture } = await wrapElement(element, {
            onCapture: (offscreen) => {
                __classPrivateFieldGet(this, _VFX_player, "f").updateHICTexture(canvas, offscreen);
            },
            maxSize: __classPrivateFieldGet(this, _VFX_player, "f").maxTextureSize,
        });
        wrapper = canvas;
        __classPrivateFieldGet(this, _VFX_wrapperCanvases, "f").set(element, wrapper);
        await __classPrivateFieldGet(this, _VFX_player, "f").addElement(wrapper, hicOpts, initialCapture);
    }
    /**
     * Remove the element from VFX and stop rendering the shader.
     */
    remove(element) {
        const wrapper = __classPrivateFieldGet(this, _VFX_wrapperCanvases, "f").get(element);
        if (wrapper) {
            unwrapElement(wrapper, element);
            __classPrivateFieldGet(this, _VFX_wrapperCanvases, "f").delete(element);
            __classPrivateFieldGet(this, _VFX_player, "f").removeElement(wrapper);
        }
        else {
            __classPrivateFieldGet(this, _VFX_player, "f").removeElement(element);
        }
    }
    /**
     * Replace the effect chain on an already-registered effect-path
     * element in-place. Effects whose reference is unchanged keep their
     * init state and GPU resources; only added/removed effects run
     * `init` / `dispose`. The element's source texture is preserved.
     *
     * Useful for live UIs that reorder or toggle effects without paying
     * the cost of `vfx.remove` + `vfx.add` (which reloads the source).
     */
    updateEffects(element, effect) {
        const target = __classPrivateFieldGet(this, _VFX_wrapperCanvases, "f").get(element) ?? element;
        return __classPrivateFieldGet(this, _VFX_player, "f").updateElementEffects(target, effect);
    }
    /**
     * Update the texture for the given element.
     *
     * For an `HTMLImageElement`, reloads its current `src` — call this
     * after changing `img.src`. Videos refresh automatically (no-op).
     * Otherwise re-snapshots the element's DOM subtree.
     *
     * Useful for elements whose contents change (input, textarea, or an
     * `<img>` whose `src` swaps).
     */
    async update(element) {
        const wrapper = __classPrivateFieldGet(this, _VFX_wrapperCanvases, "f").get(element);
        if (wrapper) {
            wrapper.requestPaint();
            return;
        }
        if (element instanceof HTMLImageElement) {
            return __classPrivateFieldGet(this, _VFX_player, "f").updateImageElement(element);
        }
        else if (element instanceof HTMLCanvasElement) {
            __classPrivateFieldGet(this, _VFX_player, "f").updateCanvasElement(element);
            return;
        }
        else {
            return __classPrivateFieldGet(this, _VFX_player, "f").updateTextElement(element);
        }
    }
    /**
     * Start rendering VFX.
     */
    play() {
        __classPrivateFieldGet(this, _VFX_player, "f").play();
    }
    /**
     * Stop rendering VFX.
     * You can restart rendering by calling `VFX.play()` later.
     */
    stop() {
        __classPrivateFieldGet(this, _VFX_player, "f").stop();
    }
    /**
     * Render the whole scene once, manually.
     * This is useful when you want to control the rendering timings manually by combining with `autoplay: false`.
     */
    render() {
        __classPrivateFieldGet(this, _VFX_player, "f").render();
    }
    /**
     * Destroy VFX and stop rendering.
     */
    destroy() {
        for (const [element, wrapper] of __classPrivateFieldGet(this, _VFX_wrapperCanvases, "f")) {
            unwrapElement(wrapper, element);
        }
        __classPrivateFieldGet(this, _VFX_wrapperCanvases, "f").clear();
        __classPrivateFieldGet(this, _VFX_player, "f").destroy();
        __classPrivateFieldGet(this, _VFX_canvas, "f").remove();
    }
}
_VFX_player = new WeakMap(), _VFX_canvas = new WeakMap(), _VFX_wrapperCanvases = new WeakMap(), _VFX_instances = new WeakSet(), _VFX_addImage = function _VFX_addImage(element, opts) {
    if (element.complete) {
        return __classPrivateFieldGet(this, _VFX_player, "f").addElement(element, opts);
    }
    else {
        return new Promise((resolve) => {
            element.addEventListener("load", () => {
                __classPrivateFieldGet(this, _VFX_player, "f").addElement(element, opts);
                resolve();
            }, { once: true });
        });
    }
}, _VFX_addVideo = function _VFX_addVideo(element, opts) {
    if (element.readyState >= 3) {
        return __classPrivateFieldGet(this, _VFX_player, "f").addElement(element, opts);
    }
    else {
        return new Promise((resolve) => {
            element.addEventListener("canplay", () => {
                __classPrivateFieldGet(this, _VFX_player, "f").addElement(element, opts);
                resolve();
            }, { once: true });
        });
    }
}, _VFX_addCanvas = function _VFX_addCanvas(element, opts) {
    return __classPrivateFieldGet(this, _VFX_player, "f").addElement(element, opts);
}, _VFX_addText = function _VFX_addText(element, opts) {
    return __classPrivateFieldGet(this, _VFX_player, "f").addElement(element, opts);
};
//# sourceMappingURL=vfx.js.map