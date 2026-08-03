import { Program } from "./program.js";
/** @internal */
export class Pass {
    constructor(ctx, vertSrc, fragSrc, uniforms, blend, glslVersion) {
        this.gl = ctx.gl;
        this.program = new Program(ctx, vertSrc, fragSrc, glslVersion);
        this.uniforms = uniforms;
        this.blend = blend;
    }
    dispose() {
        this.program.dispose();
    }
}
/**
 * Render `pass` into `target` (or the canvas if null) over `viewport`.
 * Applies clipping and blend state, uploads uniforms, and draws the quad.
 * @internal
 */
export function renderPass(gl, quad, pass, target, viewport, canvasW, canvasH, pixelRatio) {
    const targetCssW = target ? target.width / pixelRatio : canvasW;
    const targetCssH = target ? target.height / pixelRatio : canvasH;
    const cx1 = Math.max(0, viewport.x);
    const cy1 = Math.max(0, viewport.y);
    const cx2 = Math.min(targetCssW, viewport.x + viewport.w);
    const cy2 = Math.min(targetCssH, viewport.y + viewport.h);
    const cw = cx2 - cx1;
    const ch = cy2 - cy1;
    if (cw <= 0 || ch <= 0) {
        return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
    gl.viewport(Math.round(cx1 * pixelRatio), Math.round(cy1 * pixelRatio), Math.round(cw * pixelRatio), Math.round(ch * pixelRatio));
    applyBlend(gl, pass.blend);
    pass.program.use();
    pass.program.uploadUniforms(pass.uniforms);
    quad.draw();
}
/** @internal */
export function applyBlend(gl, mode) {
    if (mode === "none") {
        gl.disable(gl.BLEND);
        return;
    }
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    if (mode === "premultiplied") {
        gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
    else if (mode === "additive") {
        gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
    }
    else {
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
}
//# sourceMappingURL=pass.js.map