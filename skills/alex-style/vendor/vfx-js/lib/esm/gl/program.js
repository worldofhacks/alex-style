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
var _Program_instances, _Program_ctx, _Program_vertSrc, _Program_fragSrc, _Program_glslVersion, _Program_uniforms, _Program_compile;
import { Texture } from "./texture.js";
import { Vec2, Vec4 } from "./vec.js";
/** @see {@link GlslVersion} */
export function detectGlslVersion(src) {
    if (/#version\s+300\s+es\b/.test(src)) {
        return "300 es";
    }
    if (/#version\s+100\b/.test(src)) {
        return "100";
    }
    if (/\bgl_FragColor\b|\btexture2D\b|\bvarying\b|\battribute\b/.test(src)) {
        return "100";
    }
    return "300 es";
}
/**
 * Compiled GLSL program. Handles vertex/fragment shader compilation,
 * link, attribute binding (attribute "position" → location 0), and
 * uniform upload.
 *
 * GLSL version: `glslVersion` if given, else auto-detected from the
 * fragment shader via {@link detectGlslVersion}.
 *
 * Self-registers with {@link GLContext} so the program is recompiled
 * after a `webglcontextrestored` event.
 * @internal
 */
export class Program {
    constructor(ctx, vertSrc, fragSrc, glslVersion) {
        _Program_instances.add(this);
        _Program_ctx.set(this, void 0);
        _Program_vertSrc.set(this, void 0);
        _Program_fragSrc.set(this, void 0);
        _Program_glslVersion.set(this, void 0);
        _Program_uniforms.set(this, new Map());
        __classPrivateFieldSet(this, _Program_ctx, ctx, "f");
        this.gl = ctx.gl;
        __classPrivateFieldSet(this, _Program_vertSrc, vertSrc, "f");
        __classPrivateFieldSet(this, _Program_fragSrc, fragSrc, "f");
        __classPrivateFieldSet(this, _Program_glslVersion, glslVersion ?? detectGlslVersion(fragSrc), "f");
        __classPrivateFieldGet(this, _Program_instances, "m", _Program_compile).call(this);
        ctx.addResource(this);
    }
    restore() {
        // The old handle is dead after context loss; recompile from source.
        __classPrivateFieldGet(this, _Program_instances, "m", _Program_compile).call(this);
    }
    use() {
        this.gl.useProgram(this.program);
    }
    hasUniform(name) {
        return __classPrivateFieldGet(this, _Program_uniforms, "f").has(name);
    }
    /** Upload a set of uniforms. Samplers auto-allocate texture units. */
    uploadUniforms(uniforms) {
        const gl = this.gl;
        let textureUnit = 0;
        for (const [name, info] of __classPrivateFieldGet(this, _Program_uniforms, "f")) {
            const entry = uniforms[name];
            if (!entry) {
                continue;
            }
            const value = entry.value;
            if (value === null || value === undefined) {
                continue;
            }
            if (isSamplerType(info.type)) {
                if (value instanceof Texture) {
                    value.bind(textureUnit);
                    gl.uniform1i(info.location, textureUnit);
                    textureUnit++;
                }
                continue;
            }
            if (value instanceof Texture) {
                continue;
            }
            uploadScalarUniform(gl, info, value);
        }
    }
    dispose() {
        __classPrivateFieldGet(this, _Program_ctx, "f").removeResource(this);
        this.gl.deleteProgram(this.program);
    }
}
_Program_ctx = new WeakMap(), _Program_vertSrc = new WeakMap(), _Program_fragSrc = new WeakMap(), _Program_glslVersion = new WeakMap(), _Program_uniforms = new WeakMap(), _Program_instances = new WeakSet(), _Program_compile = function _Program_compile() {
    const gl = this.gl;
    const vs = compileShader(gl, gl.VERTEX_SHADER, ensureVersion(__classPrivateFieldGet(this, _Program_vertSrc, "f"), __classPrivateFieldGet(this, _Program_glslVersion, "f")));
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, ensureVersion(__classPrivateFieldGet(this, _Program_fragSrc, "f"), __classPrivateFieldGet(this, _Program_glslVersion, "f")));
    const program = gl.createProgram();
    if (!program) {
        throw new Error("[VFX-JS] Failed to create program");
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    // Pin "position" to attribute location 0 so the shared Quad VAO
    // works across all programs.
    gl.bindAttribLocation(program, 0, "position");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program) ?? "";
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteProgram(program);
        throw new Error(`[VFX-JS] Program link failed: ${log}`);
    }
    gl.detachShader(program, vs);
    gl.detachShader(program, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.program = program;
    __classPrivateFieldGet(this, _Program_uniforms, "f").clear();
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (!info) {
            continue;
        }
        const name = info.name.replace(/\[0\]$/, "");
        const location = gl.getUniformLocation(program, info.name);
        if (!location) {
            continue;
        }
        __classPrivateFieldGet(this, _Program_uniforms, "f").set(name, {
            location,
            type: info.type,
            size: info.size,
        });
    }
};
function compileShader(gl, type, src) {
    const sh = gl.createShader(type);
    if (!sh) {
        throw new Error("[VFX-JS] Failed to create shader");
    }
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(sh) ?? "";
        gl.deleteShader(sh);
        throw new Error(`[VFX-JS] Shader compile failed: ${log}\n\n${src}`);
    }
    return sh;
}
function ensureVersion(src, version) {
    const trimmed = src.replace(/^\s+/, "");
    if (trimmed.startsWith("#version")) {
        return src;
    }
    if (version === "100") {
        // WebGL2 default is GLSL ES 1.00 when no directive is present.
        return src;
    }
    return `#version 300 es\n${src}`;
}
function isSamplerType(type) {
    // WebGL2 sampler enum values.
    return (type === 0x8b5e || // SAMPLER_2D
        type === 0x8dca || // INT_SAMPLER_2D
        type === 0x8dd2 || // UNSIGNED_INT_SAMPLER_2D
        type === 0x8b62 // SAMPLER_2D_SHADOW
    );
}
/** Track unsupported uniform types we've already warned about to avoid log spam. */
const warnedUnsupportedTypes = new Set();
/** @internal — exported for testability; not part of the public API. */
export function uploadScalarUniform(gl, info, value) {
    const loc = info.location;
    const isArray = info.size > 1;
    const fv = value;
    const iv = value;
    const uv = value;
    switch (info.type) {
        case gl.FLOAT:
            if (isArray) {
                gl.uniform1fv(loc, fv);
            }
            else {
                gl.uniform1f(loc, value);
            }
            return;
        case gl.FLOAT_VEC2:
            if (isArray) {
                gl.uniform2fv(loc, fv);
            }
            else if (value instanceof Vec2) {
                gl.uniform2f(loc, value.x, value.y);
            }
            else {
                const v = value;
                gl.uniform2f(loc, v[0], v[1]);
            }
            return;
        case gl.FLOAT_VEC3:
            if (isArray) {
                gl.uniform3fv(loc, fv);
            }
            else {
                const v = value;
                gl.uniform3f(loc, v[0], v[1], v[2]);
            }
            return;
        case gl.FLOAT_VEC4:
            if (isArray) {
                gl.uniform4fv(loc, fv);
            }
            else if (value instanceof Vec4) {
                gl.uniform4f(loc, value.x, value.y, value.z, value.w);
            }
            else {
                const v = value;
                gl.uniform4f(loc, v[0], v[1], v[2], v[3]);
            }
            return;
        case gl.INT:
            if (isArray) {
                gl.uniform1iv(loc, iv);
            }
            else {
                gl.uniform1i(loc, value);
            }
            return;
        case gl.INT_VEC2:
            if (isArray) {
                gl.uniform2iv(loc, iv);
            }
            else {
                const v = value;
                gl.uniform2i(loc, v[0], v[1]);
            }
            return;
        case gl.INT_VEC3:
            if (isArray) {
                gl.uniform3iv(loc, iv);
            }
            else {
                const v = value;
                gl.uniform3i(loc, v[0], v[1], v[2]);
            }
            return;
        case gl.INT_VEC4:
            if (isArray) {
                gl.uniform4iv(loc, iv);
            }
            else {
                const v = value;
                gl.uniform4i(loc, v[0], v[1], v[2], v[3]);
            }
            return;
        case gl.BOOL:
            if (isArray) {
                gl.uniform1iv(loc, iv);
            }
            else {
                gl.uniform1i(loc, value ? 1 : 0);
            }
            return;
        case gl.BOOL_VEC2:
            if (isArray) {
                gl.uniform2iv(loc, iv);
            }
            else {
                const v = value;
                gl.uniform2i(loc, v[0] ? 1 : 0, v[1] ? 1 : 0);
            }
            return;
        case gl.BOOL_VEC3:
            if (isArray) {
                gl.uniform3iv(loc, iv);
            }
            else {
                const v = value;
                gl.uniform3i(loc, v[0] ? 1 : 0, v[1] ? 1 : 0, v[2] ? 1 : 0);
            }
            return;
        case gl.BOOL_VEC4:
            if (isArray) {
                gl.uniform4iv(loc, iv);
            }
            else {
                const v = value;
                gl.uniform4i(loc, v[0] ? 1 : 0, v[1] ? 1 : 0, v[2] ? 1 : 0, v[3] ? 1 : 0);
            }
            return;
        case gl.FLOAT_MAT2:
            gl.uniformMatrix2fv(loc, false, fv);
            return;
        case gl.FLOAT_MAT3:
            gl.uniformMatrix3fv(loc, false, fv);
            return;
        case gl.FLOAT_MAT4:
            gl.uniformMatrix4fv(loc, false, fv);
            return;
        case gl.UNSIGNED_INT:
            if (isArray) {
                gl.uniform1uiv(loc, uv);
            }
            else {
                gl.uniform1ui(loc, value);
            }
            return;
        case gl.UNSIGNED_INT_VEC2:
            if (isArray) {
                gl.uniform2uiv(loc, uv);
            }
            else {
                const v = value;
                gl.uniform2ui(loc, v[0], v[1]);
            }
            return;
        case gl.UNSIGNED_INT_VEC3:
            if (isArray) {
                gl.uniform3uiv(loc, uv);
            }
            else {
                const v = value;
                gl.uniform3ui(loc, v[0], v[1], v[2]);
            }
            return;
        case gl.UNSIGNED_INT_VEC4:
            if (isArray) {
                gl.uniform4uiv(loc, uv);
            }
            else {
                const v = value;
                gl.uniform4ui(loc, v[0], v[1], v[2], v[3]);
            }
            return;
        default:
            if (!warnedUnsupportedTypes.has(info.type)) {
                warnedUnsupportedTypes.add(info.type);
                console.warn(`[VFX-JS] Unsupported uniform type 0x${info.type.toString(16)}; skipping upload.`);
            }
            return;
    }
}
//# sourceMappingURL=program.js.map