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
var _Texture_instances, _Texture_ctx, _Texture_uploaded, _Texture_registered, _Texture_external, _Texture_create, _Texture_upload, _Texture_applyParams;
/** @internal */
export class Texture {
    constructor(ctx, source, opts) {
        _Texture_instances.add(this);
        this.wrapS = "clamp";
        this.wrapT = "clamp";
        this.minFilter = "linear";
        this.magFilter = "linear";
        this.needsUpdate = true;
        /** Source image/canvas/video; exposed for identity comparison. */
        this.source = null;
        _Texture_ctx.set(this, void 0);
        _Texture_uploaded.set(this, false);
        _Texture_registered.set(this, void 0);
        _Texture_external.set(this, void 0);
        __classPrivateFieldSet(this, _Texture_ctx, ctx, "f");
        this.gl = ctx.gl;
        const external = opts?.externalHandle;
        __classPrivateFieldSet(this, _Texture_external, external !== undefined, "f");
        if (external !== undefined) {
            // Caller owns the handle; skip create/upload/restore/delete.
            this.texture = external;
            __classPrivateFieldSet(this, _Texture_uploaded, true, "f");
            this.needsUpdate = false;
        }
        else {
            __classPrivateFieldGet(this, _Texture_instances, "m", _Texture_create).call(this);
        }
        if (source) {
            this.source = source;
        }
        __classPrivateFieldSet(this, _Texture_registered, opts?.autoRegister !== false && !__classPrivateFieldGet(this, _Texture_external, "f"), "f");
        if (__classPrivateFieldGet(this, _Texture_registered, "f")) {
            ctx.addResource(this);
        }
    }
    restore() {
        // External handles are dead after context loss; caller rebuilds
        // them via their onContextRestored subscription and hands a new
        // Texture back. No-op here.
        if (__classPrivateFieldGet(this, _Texture_external, "f")) {
            return;
        }
        // Old handle is invalid; create a fresh one and flag for re-upload.
        __classPrivateFieldGet(this, _Texture_instances, "m", _Texture_create).call(this);
        __classPrivateFieldSet(this, _Texture_uploaded, false, "f");
        this.needsUpdate = true;
    }
    bind(unit) {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        if (this.needsUpdate) {
            __classPrivateFieldGet(this, _Texture_instances, "m", _Texture_upload).call(this);
            this.needsUpdate = false;
        }
    }
    dispose() {
        if (__classPrivateFieldGet(this, _Texture_registered, "f")) {
            __classPrivateFieldGet(this, _Texture_ctx, "f").removeResource(this);
        }
        if (!__classPrivateFieldGet(this, _Texture_external, "f")) {
            this.gl.deleteTexture(this.texture);
        }
    }
}
_Texture_ctx = new WeakMap(), _Texture_uploaded = new WeakMap(), _Texture_registered = new WeakMap(), _Texture_external = new WeakMap(), _Texture_instances = new WeakSet(), _Texture_create = function _Texture_create() {
    const tex = this.gl.createTexture();
    if (!tex) {
        throw new Error("[VFX-JS] Failed to create texture");
    }
    this.texture = tex;
}, _Texture_upload = function _Texture_upload() {
    const gl = this.gl;
    const src = this.source;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    if (src) {
        try {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        }
        catch (e) {
            // Some sources (e.g. cross-origin videos before playback)
            // can fail temporarily; log and keep the previous pixels.
            console.error(e);
        }
    }
    else if (!__classPrivateFieldGet(this, _Texture_uploaded, "f")) {
        // Allocate 1x1 transparent pixel so the sampler is valid even
        // without a real source.
        const pixel = new Uint8Array([0, 0, 0, 0]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    }
    __classPrivateFieldGet(this, _Texture_instances, "m", _Texture_applyParams).call(this);
    __classPrivateFieldSet(this, _Texture_uploaded, true, "f");
}, _Texture_applyParams = function _Texture_applyParams() {
    const gl = this.gl;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapEnum(gl, this.wrapS));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapEnum(gl, this.wrapT));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterEnum(gl, this.minFilter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterEnum(gl, this.magFilter));
};
function wrapEnum(gl, w) {
    if (w === "repeat") {
        return gl.REPEAT;
    }
    if (w === "mirror") {
        return gl.MIRRORED_REPEAT;
    }
    return gl.CLAMP_TO_EDGE;
}
function filterEnum(gl, f) {
    return f === "nearest" ? gl.NEAREST : gl.LINEAR;
}
/** Load an image from URL with CORS enabled. @internal */
export function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
//# sourceMappingURL=texture.js.map