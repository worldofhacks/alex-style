import { type Margin, type Rect } from "./rect.js";
import type { Effect, VFXElementIntersection, VFXOptsInner, VFXProps } from "./types.js";
/**
 * @internal
 */
export declare class VFXPlayer {
    #private;
    constructor(opts: VFXOptsInner, canvas: HTMLCanvasElement);
    destroy(): void;
    addElement(element: HTMLElement, opts?: VFXProps, initialCapture?: OffscreenCanvas): Promise<void>;
    /**
     * Replace the effect chain on an already-registered effect-path
     * element. Effects whose reference is unchanged keep their host /
     * init state; only added/removed effects run init/dispose. Throws
     * when the element is not registered, lives on the shader path, or
     * when a *new* effect (not already in the current chain) is already
     * attached to another element/postEffect on this player.
     */
    updateElementEffects(element: HTMLElement, rawEffect: Effect | readonly Effect[]): Promise<void>;
    removeElement(element: HTMLElement): void;
    updateTextElement(element: HTMLElement): Promise<void>;
    /**
     * Re-capture an `<img>` whose `src` changed since `add()`.
     *
     * Image source textures are uploaded once at `add()` time (only
     * video / GIF refresh per frame), so this reloads the current `src`
     * and swaps `e.srcTexture`. No-op for GIFs, which refresh already.
     */
    updateImageElement(element: HTMLImageElement): Promise<void>;
    updateCanvasElement(element: HTMLCanvasElement): void;
    updateHICTexture(canvas: HTMLCanvasElement, offscreen: OffscreenCanvas): void;
    get maxTextureSize(): number;
    isPlaying(): boolean;
    play(): void;
    stop(): void;
    render(): void;
}
/**
 * Returns if the given rects intersect.
 * It returns true when the rects are adjacent (= intersection ratio is 0).
 */
export declare function isRectInViewport(viewport: Rect, rect: Rect): boolean;
export declare function checkIntersection(viewport: Rect, rect: Rect, intersection: number, threshold: number): boolean;
export declare function parseOverflowOpts(overflow: VFXProps["overflow"]): [isFullScreen: boolean, Margin];
export declare function parseIntersectionOpts(intersectionOpts: VFXProps["intersection"]): VFXElementIntersection;
