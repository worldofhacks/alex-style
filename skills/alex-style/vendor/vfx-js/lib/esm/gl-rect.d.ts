import type { Rect } from "./rect.js";
/**
 * Layout of a rect in screen-space (bottom-left origin) that can be directly used in GLSL.
 * @internal
 */
export type GLRect = {
    x: number;
    y: number;
    w: number;
    h: number;
};
/**
 * Convert a Rect (top-left origin) to GLRect (bottom-left origin).
 * @internal
 */
export declare function rectToGLRect(rect: Rect, containerHeight: number, paddingX: number, paddingY: number): GLRect;
/**
 * @internal
 */
export declare function getGLRect(x: number, y: number, w: number, h: number): GLRect;
