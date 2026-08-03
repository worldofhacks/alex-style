import type { GLContext } from "./gl/context.js";
import { type GlslVersion, Program } from "./gl/program.js";
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
export declare class ProgramCache {
    #private;
    constructor(glCtx: GLContext);
    get(vert: string, frag: string, glslVersion?: GlslVersion): Program;
    /** Test-only count of cached programs. @internal */
    get size(): number;
    dispose(): void;
}
