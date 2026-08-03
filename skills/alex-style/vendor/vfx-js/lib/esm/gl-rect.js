/**
 * Convert a Rect (top-left origin) to GLRect (bottom-left origin).
 * @internal
 */
export function rectToGLRect(rect, containerHeight, paddingX, paddingY) {
    return {
        x: rect.left + paddingX,
        y: containerHeight - paddingY - rect.bottom,
        w: rect.right - rect.left,
        h: rect.bottom - rect.top,
    };
}
/**
 * @internal
 */
export function getGLRect(x, y, w, h) {
    return { x, y, w, h };
}
//# sourceMappingURL=gl-rect.js.map