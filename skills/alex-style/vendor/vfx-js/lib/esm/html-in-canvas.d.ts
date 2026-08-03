export interface CaptureOpts {
    onCapture: (offscreen: OffscreenCanvas) => void;
    maxSize?: number;
}
/**
 * Set up onpaint handler + ResizeObservers on a layoutsubtree canvas.
 * Returns the initial OffscreenCanvas from the first onpaint.
 */
export declare function setupCapture(canvas: HTMLCanvasElement, opts: CaptureOpts): Promise<OffscreenCanvas>;
/**
 * Tear down onpaint handler + ResizeObservers set up by setupCapture.
 */
export declare function teardownCapture(canvas: HTMLCanvasElement): void;
interface WrapResult {
    canvas: HTMLCanvasElement;
    initialCapture: OffscreenCanvas;
}
/**
 * Wrap an element in a `<canvas layoutsubtree>` for html-in-canvas capture.
 *
 * CSS identity (class + style) is copied to the canvas so width/height
 * resolve via normal CSS cascade. Canvas is a replaced element — it does
 * NOT auto-fit height to children, even with `layoutsubtree`. A child RO
 * in `setupCapture` keeps the CSS height in sync with the child.
 *
 * The element is expected to fill its containing block (full-width) or carry
 * an explicit px width; content-sized elements are unsupported. See the
 * sizing policy in docs/html-in-canvas.md.
 *
 * Delegates onpaint + ROs to `setupCapture`.
 */
export declare function wrapElement(element: HTMLElement, opts: CaptureOpts): Promise<WrapResult>;
/**
 * Unwrap: move element back out of the canvas wrapper and restore state.
 */
export declare function unwrapElement(canvas: HTMLCanvasElement, element: HTMLElement): void;
export {};
