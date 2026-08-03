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
var _ProgramCache_glCtx, _ProgramCache_programs;
import { Program } from "./gl/program.js";
/**
 * VFX-instance-scoped cache of compiled {@link Program}s keyed by
 * `${frag}\0${vert}\0${glslVersion}`. Lifted out of {@link EffectHost}
 * so multiple hosts (one per attached Effect instance) sharing the
 * same `GLContext` compile each unique shader triple exactly once.
 *
 * Lifetime: programs live until {@link dispose} is called by the
 * owning `VFXPlayer`.
 *
 * @internal
 */
export class ProgramCache {
    constructor(glCtx) {
        _ProgramCache_glCtx.set(this, void 0);
        _ProgramCache_programs.set(this, new Map());
        __classPrivateFieldSet(this, _ProgramCache_glCtx, glCtx, "f");
    }
    get(vert, frag, glslVersion) {
        const key = `${frag}\0${vert}\0${glslVersion ?? ""}`;
        let p = __classPrivateFieldGet(this, _ProgramCache_programs, "f").get(key);
        if (!p) {
            p = new Program(__classPrivateFieldGet(this, _ProgramCache_glCtx, "f"), vert, frag, glslVersion);
            __classPrivateFieldGet(this, _ProgramCache_programs, "f").set(key, p);
        }
        return p;
    }
    /** Test-only count of cached programs. @internal */
    get size() {
        return __classPrivateFieldGet(this, _ProgramCache_programs, "f").size;
    }
    dispose() {
        for (const p of __classPrivateFieldGet(this, _ProgramCache_programs, "f").values()) {
            p.dispose();
        }
        __classPrivateFieldGet(this, _ProgramCache_programs, "f").clear();
    }
}
_ProgramCache_glCtx = new WeakMap(), _ProgramCache_programs = new WeakMap();
//# sourceMappingURL=program-cache.js.map