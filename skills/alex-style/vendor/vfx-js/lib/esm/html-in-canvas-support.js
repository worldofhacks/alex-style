/// <reference path="./html-in-canvas.d.ts" />
let supported;
export function supportsHtmlInCanvas() {
    if (supported !== undefined) {
        return supported;
    }
    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        supported =
            ctx !== null &&
                typeof ctx.drawElementImage === "function" &&
                typeof canvas.requestPaint === "function";
    }
    catch {
        supported = false;
    }
    return supported;
}
//# sourceMappingURL=html-in-canvas-support.js.map