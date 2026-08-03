/** @internal */
function createTetra(r) {
    if (typeof r === "number") {
        return {
            top: r,
            right: r,
            bottom: r,
            left: r,
        };
    }
    if (Array.isArray(r)) {
        return {
            top: r[0],
            right: r[1],
            bottom: r[2],
            left: r[3],
        };
    }
    return {
        top: r.top ?? 0,
        right: r.right ?? 0,
        bottom: r.bottom ?? 0,
        left: r.left ?? 0,
    };
}
export const RECT_ZERO = { top: 0, right: 0, bottom: 0, left: 0 };
export function createMargin(r) {
    return createTetra(r);
}
export const MARGIN_ZERO = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};
export function createRect(r) {
    return createTetra(r);
}
export function toRect(r) {
    return {
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        left: r.left,
    };
}
/**
 * Like {@link toRect} but ceils width and height to integer CSS pixels while
 * keeping the left/top origin. Used by text-path elements: their texture is
 * captured at ceil(rect.width) × ceil(rect.height) in dom-to-canvas (a tiny
 * sub-pixel buffer that absorbs DOM-vs-foreignObject text-metric mismatches),
 * so the on-screen quad must use the same ceiled dimensions to map the
 * texture 1:1 without any scaling/squish.
 * @internal
 */
export function toCeiledRect(r) {
    return {
        top: r.top,
        left: r.left,
        right: r.left + Math.ceil(r.right - r.left),
        bottom: r.top + Math.ceil(r.bottom - r.top),
    };
}
export function growRect(a, b) {
    return {
        top: a.top - b.top,
        right: a.right + b.right,
        bottom: a.bottom + b.bottom,
        left: a.left - b.left,
    };
}
export function shrinkRect(a, b) {
    return {
        top: a.top + b.top,
        right: a.right - b.right,
        bottom: a.bottom - b.bottom,
        left: a.left + b.left,
    };
}
function clamp(x, xmin, xmax) {
    return Math.min(Math.max(x, xmin), xmax);
}
/**
 * `inner`'s position and size as bottom-left UV within `outer`.
 * Returns `[(inner.x - outer.x)/outer.w, (inner.y - outer.y)/outer.h,
 * inner.w/outer.w, inner.h/outer.h]`.
 *
 * @internal
 */
export function rectInRect(inner, outer) {
    const [ix, iy, iw, ih] = inner;
    const [ox, oy, ow, oh] = outer;
    if (ow <= 0 || oh <= 0) {
        return [0, 0, 1, 1];
    }
    return [(ix - ox) / ow, (iy - oy) / oh, iw / ow, ih / oh];
}
/**
 * Calculate the ratio of the intersection between two Rect objects.
 * It returns a number between 0 and 1.
 */
export function getIntersection(container, target) {
    const targetL = clamp(target.left, container.left, container.right);
    const targetR = clamp(target.right, container.left, container.right);
    const w = (targetR - targetL) / (target.right - target.left);
    const targetT = clamp(target.top, container.top, container.bottom);
    const targetB = clamp(target.bottom, container.top, container.bottom);
    const h = (targetB - targetT) / (target.bottom - target.top);
    return w * h;
}
//# sourceMappingURL=rect.js.map