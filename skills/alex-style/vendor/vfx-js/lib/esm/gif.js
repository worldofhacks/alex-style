import GIF from "./gifuct-js/index.js";
export default class GIFData {
    static async create(src, pixelRatio) {
        const gif = await fetch(src)
            .then((resp) => resp.arrayBuffer())
            .then((buff) => new GIF(buff));
        const frames = gif.decompressFrames(true, undefined, undefined);
        // biome-ignore lint/suspicious/noExplicitAny: raw data
        const { width, height } = gif.raw.lsd;
        // biome-ignore lint/suspicious/noExplicitAny: frames
        return new GIFData(frames, width, height, pixelRatio);
    }
    constructor(frames, width, height, pixelRatio) {
        this.frames = [];
        this.index = 0;
        this.playTime = 0;
        this.frames = frames;
        this.canvas = document.createElement("canvas");
        // biome-ignore lint/style/noNonNullAssertion: ctx
        this.ctx = this.canvas.getContext("2d");
        this.pixelRatio = pixelRatio;
        // Override canvas size by image size
        // Because canvas does not support scaling ImageData.
        this.canvas.width = width;
        this.canvas.height = height;
        this.startTime = Date.now();
    }
    getCanvas() {
        return this.canvas;
    }
    update() {
        const now = Date.now();
        const elapsedTime = now - this.startTime;
        while (this.playTime < elapsedTime) {
            const f = this.frames[this.index % this.frames.length];
            this.playTime += f.delay;
            this.index++;
        }
        const frame = this.frames[this.index % this.frames.length];
        const image = new ImageData(frame.patch, frame.dims.width, frame.dims.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(image, frame.dims.left, frame.dims.top);
    }
}
//# sourceMappingURL=gif.js.map