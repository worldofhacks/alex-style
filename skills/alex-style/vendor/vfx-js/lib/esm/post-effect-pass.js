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
var _PostEffectPass_uniforms, _PostEffectPass_uniformGenerators, _PostEffectPass_backbuffer, _PostEffectPass_persistent, _PostEffectPass_float, _PostEffectPass_size;
import { Backbuffer } from "./backbuffer.js";
import { Vec2, Vec4 } from "./gl/vec.js";
import { createPassMaterial } from "./render-target.js";
/**
 * A single post-effect pass. Owns its shader program, uniforms, and
 * optional persistent backbuffer.
 * @internal
 */
export class PostEffectPass {
    constructor(ctx, fragmentShader, uniforms, persistent, float, size, hasBufferTarget, glslVersion) {
        _PostEffectPass_uniforms.set(this, void 0);
        _PostEffectPass_uniformGenerators.set(this, void 0);
        _PostEffectPass_backbuffer.set(this, void 0);
        _PostEffectPass_persistent.set(this, void 0);
        _PostEffectPass_float.set(this, void 0);
        _PostEffectPass_size.set(this, void 0);
        __classPrivateFieldSet(this, _PostEffectPass_persistent, persistent ?? false, "f");
        __classPrivateFieldSet(this, _PostEffectPass_float, float ?? false, "f");
        __classPrivateFieldSet(this, _PostEffectPass_size, size, "f");
        __classPrivateFieldSet(this, _PostEffectPass_uniformGenerators, {}, "f");
        __classPrivateFieldSet(this, _PostEffectPass_uniforms, {
            src: { value: null },
            offset: { value: new Vec2() },
            resolution: { value: new Vec2() },
            viewport: { value: new Vec4() },
            time: { value: 0.0 },
            mouse: { value: new Vec2() },
            passIndex: { value: 0 },
        }, "f");
        if (uniforms) {
            for (const [key, value] of Object.entries(uniforms)) {
                if (typeof value === "function") {
                    __classPrivateFieldGet(this, _PostEffectPass_uniformGenerators, "f")[key] = value;
                    __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f")[key] = { value: value() };
                }
                else {
                    __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f")[key] = { value };
                }
            }
        }
        this.pass = createPassMaterial(ctx, {
            fragmentShader,
            uniforms: __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f"),
            renderingToBuffer: hasBufferTarget ?? false,
            premultipliedAlpha: true,
            glslVersion,
        });
    }
    get uniforms() {
        return __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f");
    }
    setUniforms(tex, pixelRatio, xywh, time, mouseX, mouseY) {
        __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f").src.value = tex;
        __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f").resolution.value.set(xywh.w * pixelRatio, xywh.h * pixelRatio);
        __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f").offset.value.set(xywh.x * pixelRatio, xywh.y * pixelRatio);
        __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f").time.value = time;
        __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f").mouse.value.set(mouseX * pixelRatio, mouseY * pixelRatio);
    }
    updateCustomUniforms(uniformGenerators) {
        for (const [key, generator] of Object.entries(__classPrivateFieldGet(this, _PostEffectPass_uniformGenerators, "f"))) {
            if (__classPrivateFieldGet(this, _PostEffectPass_uniforms, "f")[key]) {
                __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f")[key].value = generator();
            }
        }
        if (uniformGenerators) {
            for (const [key, generator] of Object.entries(uniformGenerators)) {
                if (__classPrivateFieldGet(this, _PostEffectPass_uniforms, "f")[key]) {
                    __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f")[key].value = generator();
                }
            }
        }
    }
    initializeBackbuffer(ctx, width, height, pixelRatio) {
        if (__classPrivateFieldGet(this, _PostEffectPass_persistent, "f") && !__classPrivateFieldGet(this, _PostEffectPass_backbuffer, "f")) {
            if (__classPrivateFieldGet(this, _PostEffectPass_size, "f")) {
                __classPrivateFieldSet(this, _PostEffectPass_backbuffer, new Backbuffer(ctx, __classPrivateFieldGet(this, _PostEffectPass_size, "f")[0], __classPrivateFieldGet(this, _PostEffectPass_size, "f")[1], 1, __classPrivateFieldGet(this, _PostEffectPass_float, "f")), "f");
            }
            else {
                __classPrivateFieldSet(this, _PostEffectPass_backbuffer, new Backbuffer(ctx, width, height, pixelRatio, __classPrivateFieldGet(this, _PostEffectPass_float, "f")), "f");
            }
        }
    }
    resizeBackbuffer(width, height) {
        if (__classPrivateFieldGet(this, _PostEffectPass_backbuffer, "f") && !__classPrivateFieldGet(this, _PostEffectPass_size, "f")) {
            __classPrivateFieldGet(this, _PostEffectPass_backbuffer, "f").resize(width, height);
        }
    }
    /**
     * Register a named buffer texture as a uniform (for auto-binding).
     * The texture value will be updated each frame by the render loop.
     */
    registerBufferUniform(name) {
        if (!__classPrivateFieldGet(this, _PostEffectPass_uniforms, "f")[name]) {
            __classPrivateFieldGet(this, _PostEffectPass_uniforms, "f")[name] = { value: null };
        }
    }
    get backbuffer() {
        return __classPrivateFieldGet(this, _PostEffectPass_backbuffer, "f");
    }
    get persistent() {
        return __classPrivateFieldGet(this, _PostEffectPass_persistent, "f");
    }
    get float() {
        return __classPrivateFieldGet(this, _PostEffectPass_float, "f");
    }
    get size() {
        return __classPrivateFieldGet(this, _PostEffectPass_size, "f");
    }
    dispose() {
        this.pass.dispose();
        __classPrivateFieldGet(this, _PostEffectPass_backbuffer, "f")?.dispose();
    }
}
_PostEffectPass_uniforms = new WeakMap(), _PostEffectPass_uniformGenerators = new WeakMap(), _PostEffectPass_backbuffer = new WeakMap(), _PostEffectPass_persistent = new WeakMap(), _PostEffectPass_float = new WeakMap(), _PostEffectPass_size = new WeakMap();
//# sourceMappingURL=post-effect-pass.js.map