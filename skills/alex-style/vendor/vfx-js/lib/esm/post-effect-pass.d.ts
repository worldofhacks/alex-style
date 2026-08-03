import { Backbuffer } from "./backbuffer.js";
import type { GLContext } from "./gl/context.js";
import type { Pass } from "./gl/pass.js";
import type { GlslVersion, Uniforms } from "./gl/program.js";
import type { Texture } from "./gl/texture.js";
import type { GLRect } from "./gl-rect.js";
import type { VFXUniforms, VFXUniformValue } from "./types.js";
/**
 * A single post-effect pass. Owns its shader program, uniforms, and
 * optional persistent backbuffer.
 * @internal
 */
export declare class PostEffectPass {
    #private;
    pass: Pass;
    constructor(ctx: GLContext, fragmentShader: string, uniforms?: VFXUniforms, persistent?: boolean, float?: boolean, size?: [number, number], hasBufferTarget?: boolean, glslVersion?: GlslVersion);
    get uniforms(): Uniforms;
    setUniforms(tex: Texture, pixelRatio: number, xywh: GLRect, time: number, mouseX: number, mouseY: number): void;
    updateCustomUniforms(uniformGenerators?: {
        [name: string]: () => VFXUniformValue;
    }): void;
    initializeBackbuffer(ctx: GLContext, width: number, height: number, pixelRatio: number): void;
    resizeBackbuffer(width: number, height: number): void;
    /**
     * Register a named buffer texture as a uniform (for auto-binding).
     * The texture value will be updated each frame by the render loop.
     */
    registerBufferUniform(name: string): void;
    get backbuffer(): Backbuffer | undefined;
    get persistent(): boolean;
    get float(): boolean;
    get size(): [number, number] | undefined;
    dispose(): void;
}
