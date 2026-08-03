/**
 * @internal
 */
type Tetra = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
/**
 * top-left origin rect.
 * Subset of DOMRect, which is returned by `HTMLElement.getBoundingClientRect()`.
 * @internal
 */
export type Rect = Tetra & {
    readonly __brand: unique symbol;
};
export declare const RECT_ZERO: Rect;
/**
 * @internal
 */
export type Margin = Tetra & {
    readonly __brand: unique symbol;
};
/**
 * Values for margin, padding, overflow etc.
 */
export type MarginOpts = number | [top: number, right: number, bottom: number, left: number] | {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};
export declare function createMargin(r: MarginOpts): Margin;
export declare const MARGIN_ZERO: Margin;
/**
 * Values to determine a rectangle area for margin, padding etc.
 */
export type RectOpts = MarginOpts;
export declare function createRect(r: RectOpts): Rect;
export declare function toRect(r: DOMRect): Rect;
/**
 * Like {@link toRect} but ceils width and height to integer CSS pixels while
 * keeping the left/top origin. Used by text-path elements: their texture is
 * captured at ceil(rect.width) × ceil(rect.height) in dom-to-canvas (a tiny
 * sub-pixel buffer that absorbs DOM-vs-foreignObject text-metric mismatches),
 * so the on-screen quad must use the same ceiled dimensions to map the
 * texture 1:1 without any scaling/squish.
 * @internal
 */
export declare function toCeiledRect(r: DOMRect): Rect;
export declare function growRect(a: Rect, b: Margin): Rect;
export declare function shrinkRect(a: Rect, b: Margin): Rect;
/**
 * Rect in element-local physical px, bottom-left origin (matches GL UV
 * convention and `elementRectOnCanvasPx`).
 *
 * `x: 0` = element's left edge, `y: 0` = element's bottom edge.
 * Negative coords / oversized w/h extend past the element.
 *
 * @internal
 */
export type ElementRect = readonly [x: number, y: number, w: number, h: number];
/**
 * `inner`'s position and size as bottom-left UV within `outer`.
 * Returns `[(inner.x - outer.x)/outer.w, (inner.y - outer.y)/outer.h,
 * inner.w/outer.w, inner.h/outer.h]`.
 *
 * @internal
 */
export declare function rectInRect(inner: ElementRect, outer: ElementRect): [number, number, number, number];
/**
 * Calculate the ratio of the intersection between two Rect objects.
 * It returns a number between 0 and 1.
 */
export declare function getIntersection(container: Rect, target: Rect): number;
export {};
