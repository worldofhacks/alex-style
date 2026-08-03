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
var _CompiledGeometry_instances, _CompiledGeometry_ctx, _CompiledGeometry_geo, _CompiledGeometry_program, _CompiledGeometry_vbos, _CompiledGeometry_ibo, _CompiledGeometry_registered, _CompiledGeometry_allocate, _EffectGeometryCache_ctx, _EffectGeometryCache_quad, _EffectGeometryCache_map, _EffectGeometryCache_all;
/**
 * Singleton token returned as `ctx.quad`.
 *
 * All hosts share the same token — it always resolves to the shared
 * {@link Quad} (NDC -1..1 fullscreen).
 * @internal
 */
export const EFFECT_QUAD_TOKEN = Object.freeze({
    __brand: "EffectQuad",
});
/** @internal */
export function isEffectQuad(g) {
    return g === EFFECT_QUAD_TOKEN;
}
function modeEnum(gl, mode) {
    switch (mode) {
        case "lines":
            return gl.LINES;
        case "lineStrip":
            return gl.LINE_STRIP;
        case "points":
            return gl.POINTS;
        default:
            return gl.TRIANGLES;
    }
}
function attribTypeEnum(gl, data) {
    if (data instanceof Float32Array) {
        return gl.FLOAT;
    }
    if (data instanceof Uint8Array) {
        return gl.UNSIGNED_BYTE;
    }
    if (data instanceof Uint16Array) {
        return gl.UNSIGNED_SHORT;
    }
    if (data instanceof Uint32Array) {
        return gl.UNSIGNED_INT;
    }
    if (data instanceof Int8Array) {
        return gl.BYTE;
    }
    if (data instanceof Int16Array) {
        return gl.SHORT;
    }
    if (data instanceof Int32Array) {
        return gl.INT;
    }
    throw new Error("[VFX-JS] Unsupported attribute typed array");
}
function normalizeAttribute(name, desc) {
    if (ArrayBuffer.isView(desc) && !(desc instanceof DataView)) {
        // Shorthand: typed array only. Default itemSize=2 (common for
        // "position" 2D). If position is actually 3D the user must use
        // the explicit form.
        return {
            name,
            data: desc,
            itemSize: 2,
            normalized: false,
            perInstance: false,
        };
    }
    const d = desc;
    return {
        name,
        data: d.data,
        itemSize: d.itemSize,
        normalized: d.normalized ?? false,
        perInstance: d.perInstance ?? false,
    };
}
/**
 * Compiled VAO + buffers for an (EffectGeometry, Program) pair.
 *
 * Registered on {@link GLContext} so context-restore rebuilds the VAO
 * and its VBOs / IBO from the original POJO descriptors.
 * @internal
 */
export class CompiledGeometry {
    constructor(ctx, geo, program) {
        _CompiledGeometry_instances.add(this);
        _CompiledGeometry_ctx.set(this, void 0);
        _CompiledGeometry_geo.set(this, void 0);
        _CompiledGeometry_program.set(this, void 0);
        _CompiledGeometry_vbos.set(this, []);
        _CompiledGeometry_ibo.set(this, null);
        /** gl.UNSIGNED_SHORT or gl.UNSIGNED_INT (when indexed). */
        this.indexType = 0;
        this.hasIndices = false;
        /** Number of vertices / indices to draw (after drawRange). */
        this.drawCount = 0;
        /** Offset in the attribute / index buffer (after drawRange). */
        this.drawStart = 0;
        _CompiledGeometry_registered.set(this, false);
        __classPrivateFieldSet(this, _CompiledGeometry_ctx, ctx, "f");
        this.gl = ctx.gl;
        __classPrivateFieldSet(this, _CompiledGeometry_geo, geo, "f");
        __classPrivateFieldSet(this, _CompiledGeometry_program, program, "f");
        this.mode = modeEnum(this.gl, geo.mode);
        this.instanceCount = geo.instanceCount ?? 0;
        __classPrivateFieldGet(this, _CompiledGeometry_instances, "m", _CompiledGeometry_allocate).call(this);
        ctx.addResource(this);
        __classPrivateFieldSet(this, _CompiledGeometry_registered, true, "f");
    }
    restore() {
        // Old VAO / VBOs / IBO are dead; rebuild with fresh handles.
        __classPrivateFieldSet(this, _CompiledGeometry_vbos, [], "f");
        __classPrivateFieldSet(this, _CompiledGeometry_ibo, null, "f");
        __classPrivateFieldGet(this, _CompiledGeometry_instances, "m", _CompiledGeometry_allocate).call(this);
    }
    draw() {
        const gl = this.gl;
        gl.bindVertexArray(this.vao);
        if (this.hasIndices) {
            if (this.instanceCount > 0) {
                gl.drawElementsInstanced(this.mode, this.drawCount, this.indexType, this.drawStart *
                    (this.indexType === gl.UNSIGNED_INT ? 4 : 2), this.instanceCount);
            }
            else {
                gl.drawElements(this.mode, this.drawCount, this.indexType, this.drawStart *
                    (this.indexType === gl.UNSIGNED_INT ? 4 : 2));
            }
        }
        else if (this.instanceCount > 0) {
            gl.drawArraysInstanced(this.mode, this.drawStart, this.drawCount, this.instanceCount);
        }
        else {
            gl.drawArrays(this.mode, this.drawStart, this.drawCount);
        }
    }
    dispose() {
        if (__classPrivateFieldGet(this, _CompiledGeometry_registered, "f")) {
            __classPrivateFieldGet(this, _CompiledGeometry_ctx, "f").removeResource(this);
            __classPrivateFieldSet(this, _CompiledGeometry_registered, false, "f");
        }
        const gl = this.gl;
        gl.deleteVertexArray(this.vao);
        for (const b of __classPrivateFieldGet(this, _CompiledGeometry_vbos, "f")) {
            gl.deleteBuffer(b);
        }
        if (__classPrivateFieldGet(this, _CompiledGeometry_ibo, "f")) {
            gl.deleteBuffer(__classPrivateFieldGet(this, _CompiledGeometry_ibo, "f"));
        }
        __classPrivateFieldSet(this, _CompiledGeometry_vbos, [], "f");
        __classPrivateFieldSet(this, _CompiledGeometry_ibo, null, "f");
    }
}
_CompiledGeometry_ctx = new WeakMap(), _CompiledGeometry_geo = new WeakMap(), _CompiledGeometry_program = new WeakMap(), _CompiledGeometry_vbos = new WeakMap(), _CompiledGeometry_ibo = new WeakMap(), _CompiledGeometry_registered = new WeakMap(), _CompiledGeometry_instances = new WeakSet(), _CompiledGeometry_allocate = function _CompiledGeometry_allocate() {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    if (!vao) {
        throw new Error("[VFX-JS] Failed to create VAO");
    }
    this.vao = vao;
    gl.bindVertexArray(vao);
    const programHandle = __classPrivateFieldGet(this, _CompiledGeometry_program, "f").program;
    let vertexCountFromPosition = null;
    for (const [name, descriptor] of Object.entries(__classPrivateFieldGet(this, _CompiledGeometry_geo, "f").attributes)) {
        const attr = normalizeAttribute(name, descriptor);
        const loc = gl.getAttribLocation(programHandle, attr.name);
        if (loc < 0) {
            // Attribute isn't declared in this program; skip silently.
            continue;
        }
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error(`[VFX-JS] Failed to create VBO for "${attr.name}"`);
        }
        __classPrivateFieldGet(this, _CompiledGeometry_vbos, "f").push(buffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, attr.data, gl.STATIC_DRAW);
        const type = attribTypeEnum(gl, attr.data);
        gl.enableVertexAttribArray(loc);
        if (type === gl.FLOAT ||
            type === gl.HALF_FLOAT ||
            attr.normalized) {
            gl.vertexAttribPointer(loc, attr.itemSize, type, attr.normalized, 0, 0);
        }
        else {
            gl.vertexAttribIPointer(loc, attr.itemSize, type, 0, 0);
        }
        if (attr.perInstance) {
            gl.vertexAttribDivisor(loc, 1);
        }
        if (name === "position" && vertexCountFromPosition === null) {
            vertexCountFromPosition = attr.data.length / attr.itemSize;
        }
    }
    let indexCount = 0;
    const indices = __classPrivateFieldGet(this, _CompiledGeometry_geo, "f").indices;
    if (indices) {
        const ibo = gl.createBuffer();
        if (!ibo) {
            throw new Error("[VFX-JS] Failed to create IBO");
        }
        __classPrivateFieldSet(this, _CompiledGeometry_ibo, ibo, "f");
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        this.hasIndices = true;
        this.indexType =
            indices instanceof Uint32Array
                ? gl.UNSIGNED_INT
                : gl.UNSIGNED_SHORT;
        indexCount = indices.length;
    }
    else {
        this.hasIndices = false;
    }
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    if (__classPrivateFieldGet(this, _CompiledGeometry_ibo, "f")) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    // Compute drawCount / drawStart.
    const totalCount = this.hasIndices
        ? indexCount
        : (vertexCountFromPosition ?? 0);
    const range = __classPrivateFieldGet(this, _CompiledGeometry_geo, "f").drawRange;
    this.drawStart = range?.start ?? 0;
    this.drawCount =
        range?.count !== undefined
            ? range.count
            : Math.max(0, totalCount - this.drawStart);
};
/**
 * Per-host cache of compiled geometries, keyed by (EffectGeometry, Program).
 *
 * The program dimension is required because `gl.getAttribLocation` is
 * program-specific — caching only by geometry would break on a second
 * program whose attribute name → location assignment differs.
 *
 * Uses a `WeakMap` for primary lookup plus a parallel `Set` so
 * {@link dispose} can iterate every compiled entry the host owns.
 * @internal
 */
export class EffectGeometryCache {
    constructor(ctx, quad) {
        _EffectGeometryCache_ctx.set(this, void 0);
        _EffectGeometryCache_quad.set(this, void 0);
        _EffectGeometryCache_map.set(this, new WeakMap());
        _EffectGeometryCache_all.set(this, new Set());
        __classPrivateFieldSet(this, _EffectGeometryCache_ctx, ctx, "f");
        __classPrivateFieldSet(this, _EffectGeometryCache_quad, quad, "f");
    }
    /** The shared fullscreen {@link Quad} (resolves {@link EFFECT_QUAD_TOKEN}). */
    get quad() {
        return __classPrivateFieldGet(this, _EffectGeometryCache_quad, "f");
    }
    resolve(geo, program) {
        let byProgram = __classPrivateFieldGet(this, _EffectGeometryCache_map, "f").get(geo);
        if (!byProgram) {
            byProgram = new Map();
            __classPrivateFieldGet(this, _EffectGeometryCache_map, "f").set(geo, byProgram);
        }
        let compiled = byProgram.get(program);
        if (!compiled) {
            compiled = new CompiledGeometry(__classPrivateFieldGet(this, _EffectGeometryCache_ctx, "f"), geo, program);
            byProgram.set(program, compiled);
            __classPrivateFieldGet(this, _EffectGeometryCache_all, "f").add(compiled);
        }
        return compiled;
    }
    dispose() {
        for (const c of __classPrivateFieldGet(this, _EffectGeometryCache_all, "f")) {
            c.dispose();
        }
        __classPrivateFieldGet(this, _EffectGeometryCache_all, "f").clear();
        // WeakMap entries become unreachable naturally when the user
        // releases their geometry refs; the Programs are disposed by
        // the VFX-scoped ProgramCache.
    }
}
_EffectGeometryCache_ctx = new WeakMap(), _EffectGeometryCache_quad = new WeakMap(), _EffectGeometryCache_map = new WeakMap(), _EffectGeometryCache_all = new WeakMap();
//# sourceMappingURL=effect-geometry.js.map