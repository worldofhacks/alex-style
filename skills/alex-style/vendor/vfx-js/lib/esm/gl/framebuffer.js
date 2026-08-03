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
var _Framebuffer_instances, _Framebuffer_ctx, _Framebuffer_allocate;
import { Texture } from "./texture.js";
/**
 * Single color-attachment framebuffer. Replaces `THREE.WebGLRenderTarget`.
 * The `texture` field is a {@link Texture} that wraps the FBO's color
 * attachment, so it can be fed directly into a shader as a sampler.
 *
 * Self-registers with {@link GLContext} so the FBO + its attachment
 * texture are rebuilt after a context loss. The internal attachment
 * texture opts out of auto-registering; its storage is managed here.
 * @internal
 */
export class Framebuffer {
    constructor(ctx, width, height, opts = {}) {
        _Framebuffer_instances.add(this);
        _Framebuffer_ctx.set(this, void 0);
        __classPrivateFieldSet(this, _Framebuffer_ctx, ctx, "f");
        this.gl = ctx.gl;
        this.width = Math.max(1, Math.floor(width));
        this.height = Math.max(1, Math.floor(height));
        this.float = opts.float ?? false;
        this.mipmap = opts.mipmap ?? false;
        this.texture = new Texture(ctx, undefined, { autoRegister: false });
        const w = opts.wrap;
        if (w !== undefined) {
            if (typeof w === "string") {
                this.texture.wrapS = w;
                this.texture.wrapT = w;
            }
            else {
                this.texture.wrapS = w[0];
                this.texture.wrapT = w[1];
            }
        }
        if (opts.filter !== undefined) {
            this.texture.minFilter = opts.filter;
            this.texture.magFilter = opts.filter;
        }
        __classPrivateFieldGet(this, _Framebuffer_instances, "m", _Framebuffer_allocate).call(this);
        ctx.addResource(this);
    }
    setSize(width, height) {
        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));
        if (w === this.width && h === this.height) {
            return;
        }
        this.width = w;
        this.height = h;
        __classPrivateFieldGet(this, _Framebuffer_instances, "m", _Framebuffer_allocate).call(this);
    }
    restore() {
        // Old FBO + attachment texture are dead; the attachment Texture
        // recreated its handle via its own `restore()` (not registered;
        // done manually here because ordering matters).
        this.texture.restore();
        __classPrivateFieldGet(this, _Framebuffer_instances, "m", _Framebuffer_allocate).call(this);
    }
    dispose() {
        __classPrivateFieldGet(this, _Framebuffer_ctx, "f").removeResource(this);
        this.gl.deleteFramebuffer(this.fbo);
        this.texture.dispose();
    }
    /**
     * Regenerate mips from level 0. No-op when this FB was not created
     * with `mipmap: true`.
     */
    generateMipmaps() {
        if (!this.mipmap) {
            return;
        }
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}
_Framebuffer_ctx = new WeakMap(), _Framebuffer_instances = new WeakSet(), _Framebuffer_allocate = function _Framebuffer_allocate() {
    const gl = this.gl;
    const oldFbo = this.fbo;
    const fbo = gl.createFramebuffer();
    if (!fbo) {
        throw new Error("[VFX-JS] Failed to create framebuffer");
    }
    this.fbo = fbo;
    const tex = this.texture.texture;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // Choose format based on float/non-float. For float textures, use
    // RGBA16F as a fallback if linear filtering on RGBA32F is not
    // supported by the GPU.
    const floatLinear = __classPrivateFieldGet(this, _Framebuffer_ctx, "f").floatLinearFilter;
    const internalFormat = this.float
        ? floatLinear
            ? gl.RGBA32F
            : gl.RGBA16F
        : gl.RGBA8;
    const type = this.float
        ? floatLinear
            ? gl.FLOAT
            : gl.HALF_FLOAT
        : gl.UNSIGNED_BYTE;
    // Per-level texImage2D for both mip and non-mip — the texture
    // handle is reused across setSize / restore, and texStorage2D
    // makes it immutable so re-allocate would fail. Per-level keeps
    // the storage mutable and matches the non-mip code path.
    if (this.mipmap) {
        const levels = Math.floor(Math.log2(Math.max(this.width, this.height))) + 1;
        let w = this.width;
        let h = this.height;
        for (let level = 0; level < levels; level++) {
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, w, h, 0, gl.RGBA, type, null);
            w = Math.max(1, w >> 1);
            h = Math.max(1, h >> 1);
        }
    }
    else {
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, this.width, this.height, 0, gl.RGBA, type, null);
    }
    const baseMin = this.texture.minFilter === "nearest" ? gl.NEAREST : gl.LINEAR;
    const magF = this.texture.magFilter === "nearest" ? gl.NEAREST : gl.LINEAR;
    // Auto-promote MIN to mipmap-aware variant when mip storage exists.
    const minF = this.mipmap
        ? this.texture.minFilter === "nearest"
            ? gl.NEAREST_MIPMAP_NEAREST
            : gl.LINEAR_MIPMAP_LINEAR
        : baseMin;
    const wrapS = wrapEnum(gl, this.texture.wrapS);
    const wrapT = wrapEnum(gl, this.texture.wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minF);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magF);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.texture.needsUpdate = false;
    // Keep the Texture wrapper's source null: the storage is managed
    // here, not by a DOM source.
    this.texture.source = null;
    // Delete after assigning the new FBO so this.fbo is never stale.
    // On restore() the old handle is dead; deleteFramebuffer is a no-op.
    if (oldFbo) {
        gl.deleteFramebuffer(oldFbo);
    }
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
//# sourceMappingURL=framebuffer.js.map