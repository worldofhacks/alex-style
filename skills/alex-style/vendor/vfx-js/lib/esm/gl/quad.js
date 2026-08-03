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
var _Quad_instances, _Quad_ctx, _Quad_buffer, _Quad_allocate;
/**
 * Fullscreen quad. Builds a single VAO with a position buffer that
 * covers NDC (-1..1). Attribute name "position" is bound to location 0
 * on every shader program (see {@link Program}) so this VAO can be
 * shared across all passes.
 *
 * Self-registers with {@link GLContext} so the VAO/buffer are rebuilt
 * after a context loss.
 * @internal
 */
export class Quad {
    constructor(ctx) {
        _Quad_instances.add(this);
        _Quad_ctx.set(this, void 0);
        _Quad_buffer.set(this, void 0);
        __classPrivateFieldSet(this, _Quad_ctx, ctx, "f");
        this.gl = ctx.gl;
        __classPrivateFieldGet(this, _Quad_instances, "m", _Quad_allocate).call(this);
        ctx.addResource(this);
    }
    restore() {
        __classPrivateFieldGet(this, _Quad_instances, "m", _Quad_allocate).call(this);
    }
    draw() {
        const gl = this.gl;
        gl.bindVertexArray(this.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    dispose() {
        __classPrivateFieldGet(this, _Quad_ctx, "f").removeResource(this);
        this.gl.deleteVertexArray(this.vao);
        this.gl.deleteBuffer(__classPrivateFieldGet(this, _Quad_buffer, "f"));
    }
}
_Quad_ctx = new WeakMap(), _Quad_buffer = new WeakMap(), _Quad_instances = new WeakSet(), _Quad_allocate = function _Quad_allocate() {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    if (!vao || !buffer) {
        throw new Error("[VFX-JS] Failed to create quad VAO");
    }
    this.vao = vao;
    __classPrivateFieldSet(this, _Quad_buffer, buffer, "f");
    const verts = new Float32Array([
        -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0,
    ]);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};
//# sourceMappingURL=quad.js.map