import { COPY_FRAGMENT_SHADER, DEFAULT_VERTEX_SHADER } from "./constants.js";
import { Pass } from "./gl/pass.js";
import { Vec2, Vec4 } from "./gl/vec.js";
/**
 * Copies a source texture to the current framebuffer with premultiplied
 * alpha blending. Used after rendering an element's backbuffer into
 * the canvas/post-effect RT.
 * @internal
 */
export class CopyPass {
    constructor(ctx) {
        this.uniforms = {
            src: { value: null },
            offset: { value: new Vec2() },
            resolution: { value: new Vec2() },
            viewport: { value: new Vec4() },
        };
        this.pass = new Pass(ctx, DEFAULT_VERTEX_SHADER, COPY_FRAGMENT_SHADER, this.uniforms, "premultiplied");
    }
    setUniforms(tex, pixelRatio, xywh) {
        this.uniforms.src.value = tex;
        this.uniforms.resolution.value.set(xywh.w * pixelRatio, xywh.h * pixelRatio);
        this.uniforms.offset.value.set(xywh.x * pixelRatio, xywh.y * pixelRatio);
    }
    dispose() {
        this.pass.dispose();
    }
}
//# sourceMappingURL=copy-pass.js.map