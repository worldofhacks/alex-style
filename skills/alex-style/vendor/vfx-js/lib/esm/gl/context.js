var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GLContext_resources, _GLContext_onLost, _GLContext_onRestored, _GLContext_handleLost, _GLContext_handleRestored;
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
export class GLContext {
    constructor(canvas) {
        /** True between `webglcontextlost` and `webglcontextrestored`. */
        this.isContextLost = false;
        _GLContext_resources.set(this, new Set());
        _GLContext_onLost.set(this, new Set());
        _GLContext_onRestored.set(this, new Set());
        _GLContext_handleLost.set(this, (event) => {
            // Without preventDefault the browser will not attempt to restore.
            event.preventDefault();
            this.isContextLost = true;
            for (const cb of __classPrivateFieldGet(this, _GLContext_onLost, "f")) {
                cb();
            }
        });
        _GLContext_handleRestored.set(this, () => {
            this.isContextLost = false;
            // Re-float extensions (fresh context).
            const gl = this.gl;
            gl.getExtension("EXT_color_buffer_float");
            gl.getExtension("EXT_color_buffer_half_float");
            for (const r of __classPrivateFieldGet(this, _GLContext_resources, "f")) {
                r.restore();
            }
            for (const cb of __classPrivateFieldGet(this, _GLContext_onRestored, "f")) {
                cb();
            }
        });
        const gl = canvas.getContext("webgl2", {
            alpha: true,
            premultipliedAlpha: true,
            antialias: false,
            depth: false,
            stencil: false,
            preserveDrawingBuffer: false,
        });
        if (!gl) {
            throw new Error("[VFX-JS] WebGL2 is not available.");
        }
        this.gl = gl;
        this.canvas = canvas;
        gl.getExtension("EXT_color_buffer_float");
        gl.getExtension("EXT_color_buffer_half_float");
        this.floatLinearFilter = !!gl.getExtension("OES_texture_float_linear");
        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        canvas.addEventListener("webglcontextlost", __classPrivateFieldGet(this, _GLContext_handleLost, "f"), false);
        canvas.addEventListener("webglcontextrestored", __classPrivateFieldGet(this, _GLContext_handleRestored, "f"), false);
    }
    setSize(width, height, pixelRatio) {
        const w = Math.floor(width * pixelRatio);
        const h = Math.floor(height * pixelRatio);
        if (this.canvas.width !== w || this.canvas.height !== h) {
            this.canvas.width = w;
            this.canvas.height = h;
        }
    }
    addResource(r) {
        __classPrivateFieldGet(this, _GLContext_resources, "f").add(r);
    }
    removeResource(r) {
        __classPrivateFieldGet(this, _GLContext_resources, "f").delete(r);
    }
    /** Subscribe to context-lost events. Returns an unsubscribe function. */
    onContextLost(cb) {
        __classPrivateFieldGet(this, _GLContext_onLost, "f").add(cb);
        return () => __classPrivateFieldGet(this, _GLContext_onLost, "f").delete(cb);
    }
    /** Subscribe to context-restored events. Returns an unsubscribe function. */
    onContextRestored(cb) {
        __classPrivateFieldGet(this, _GLContext_onRestored, "f").add(cb);
        return () => __classPrivateFieldGet(this, _GLContext_onRestored, "f").delete(cb);
    }
}
_GLContext_resources = new WeakMap(), _GLContext_onLost = new WeakMap(), _GLContext_onRestored = new WeakMap(), _GLContext_handleLost = new WeakMap(), _GLContext_handleRestored = new WeakMap();
//# sourceMappingURL=context.js.map