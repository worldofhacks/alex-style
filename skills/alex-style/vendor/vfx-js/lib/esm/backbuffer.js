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
var _Backbuffer_width, _Backbuffer_height, _Backbuffer_pixelRatio, _Backbuffer_buffers;
import { Framebuffer } from "./gl/framebuffer.js";
import { getGLRect } from "./gl-rect.js";
/**
 * Double-buffered render target. Pass 0 is read, pass 1 is written;
 * swap() rotates them each frame so a shader can read its previous
 * output without a feedback loop.
 * @internal
 */
export class Backbuffer {
    constructor(ctx, width, height, pixelRatio, float, opts = {}) {
        _Backbuffer_width.set(this, void 0);
        _Backbuffer_height.set(this, void 0);
        _Backbuffer_pixelRatio.set(this, void 0);
        _Backbuffer_buffers.set(this, void 0);
        __classPrivateFieldSet(this, _Backbuffer_width, width, "f");
        __classPrivateFieldSet(this, _Backbuffer_height, height, "f");
        __classPrivateFieldSet(this, _Backbuffer_pixelRatio, pixelRatio, "f");
        const pwidth = width * pixelRatio;
        const pheight = height * pixelRatio;
        const fbOpts = {
            float,
            wrap: opts.wrap,
            filter: opts.filter,
            mipmap: opts.mipmap,
        };
        __classPrivateFieldSet(this, _Backbuffer_buffers, [
            new Framebuffer(ctx, pwidth, pheight, fbOpts),
            new Framebuffer(ctx, pwidth, pheight, fbOpts),
        ], "f");
    }
    /** Read texture (the previous frame's output). */
    get texture() {
        return __classPrivateFieldGet(this, _Backbuffer_buffers, "f")[0].texture;
    }
    /** Write target for the current frame. */
    get target() {
        return __classPrivateFieldGet(this, _Backbuffer_buffers, "f")[1];
    }
    resize(width, height) {
        if (width === __classPrivateFieldGet(this, _Backbuffer_width, "f") && height === __classPrivateFieldGet(this, _Backbuffer_height, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _Backbuffer_width, width, "f");
        __classPrivateFieldSet(this, _Backbuffer_height, height, "f");
        const pw = width * __classPrivateFieldGet(this, _Backbuffer_pixelRatio, "f");
        const ph = height * __classPrivateFieldGet(this, _Backbuffer_pixelRatio, "f");
        __classPrivateFieldGet(this, _Backbuffer_buffers, "f")[0].setSize(pw, ph);
        __classPrivateFieldGet(this, _Backbuffer_buffers, "f")[1].setSize(pw, ph);
    }
    /** Rotate the double-buffers. Call after rendering to `target`. */
    swap() {
        __classPrivateFieldSet(this, _Backbuffer_buffers, [__classPrivateFieldGet(this, _Backbuffer_buffers, "f")[1], __classPrivateFieldGet(this, _Backbuffer_buffers, "f")[0]], "f");
    }
    getViewport() {
        return getGLRect(0, 0, __classPrivateFieldGet(this, _Backbuffer_width, "f"), __classPrivateFieldGet(this, _Backbuffer_height, "f"));
    }
    dispose() {
        __classPrivateFieldGet(this, _Backbuffer_buffers, "f")[0].dispose();
        __classPrivateFieldGet(this, _Backbuffer_buffers, "f")[1].dispose();
    }
}
_Backbuffer_width = new WeakMap(), _Backbuffer_height = new WeakMap(), _Backbuffer_pixelRatio = new WeakMap(), _Backbuffer_buffers = new WeakMap();
//# sourceMappingURL=backbuffer.js.map