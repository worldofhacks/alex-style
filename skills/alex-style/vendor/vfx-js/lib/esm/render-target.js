import { DEFAULT_VERTEX_SHADER, DEFAULT_VERTEX_SHADER_100, } from "./constants.js";
import { Framebuffer } from "./gl/framebuffer.js";
import { Pass } from "./gl/pass.js";
import { detectGlslVersion, } from "./gl/program.js";
/**
 * Create a framebuffer matching the options passed to element/post-effect passes.
 * @internal
 */
export function createRenderTarget(ctx, width, height, opts = {}) {
    return new Framebuffer(ctx, width, height, { float: opts.float ?? false });
}
/**
 * Create a {@link Pass} for a fullscreen render. Maps the old
 * `createPassMaterial` behaviour:
 *   - Rendering to an intermediate buffer → NoBlending.
 *   - Rendering to the screen with `premultipliedAlpha` → premultiplied blend.
 *   - Otherwise (element passes) → non-premultiplied normal blend.
 * @internal
 */
export function createPassMaterial(ctx, opts) {
    const renderingToBuffer = opts.renderingToBuffer ?? false;
    let blend;
    if (renderingToBuffer) {
        blend = "none";
    }
    else if (opts.premultipliedAlpha) {
        blend = "premultiplied";
    }
    else {
        blend = "normal";
    }
    const glslVersion = opts.glslVersion ?? detectGlslVersion(opts.fragmentShader);
    const vertexShader = opts.vertexShader ??
        (glslVersion === "100"
            ? DEFAULT_VERTEX_SHADER_100
            : DEFAULT_VERTEX_SHADER);
    return new Pass(ctx, vertexShader, opts.fragmentShader, opts.uniforms, blend, glslVersion);
}
//# sourceMappingURL=render-target.js.map