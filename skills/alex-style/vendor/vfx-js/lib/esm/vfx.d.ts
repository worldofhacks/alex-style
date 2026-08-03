import { type Effect, type VFXOpts, type VFXProps } from "./types.js";
/**
 * The main interface of VFX-JS.
 */
export declare class VFX {
    #private;
    /**
     * Create a VFX instance if WebGL is available, or return `null`.
     */
    static init(options?: VFXOpts): VFX | null;
    /**
     * Creates VFX instance and start playing immediately.
     * @throws When WebGL is not available in the current environment.
     */
    constructor(options?: VFXOpts);
    /**
     * Register an element to track the position and render visual effects in the area.
     */
    add(element: HTMLElement, opts: VFXProps, initialCapture?: OffscreenCanvas): Promise<void>;
    /**
     * Update the HIC texture for a layoutsubtree canvas.
     * @internal Used by VFXCanvas (@vfx-js/react).
     */
    updateHICTexture(canvas: HTMLCanvasElement, offscreen: OffscreenCanvas): void;
    get maxTextureSize(): number;
    /**
     * Register an element using html-in-canvas API.
     * Wraps the element in a `<canvas layoutsubtree>` and captures via drawElementImage.
     * Falls back to `add()` if html-in-canvas is not supported.
     */
    addHTML(element: HTMLElement, opts: VFXProps): Promise<void>;
    /**
     * Remove the element from VFX and stop rendering the shader.
     */
    remove(element: HTMLElement): void;
    /**
     * Replace the effect chain on an already-registered effect-path
     * element in-place. Effects whose reference is unchanged keep their
     * init state and GPU resources; only added/removed effects run
     * `init` / `dispose`. The element's source texture is preserved.
     *
     * Useful for live UIs that reorder or toggle effects without paying
     * the cost of `vfx.remove` + `vfx.add` (which reloads the source).
     */
    updateEffects(element: HTMLElement, effect: Effect | readonly Effect[]): Promise<void>;
    /**
     * Update the texture for the given element.
     *
     * For an `HTMLImageElement`, reloads its current `src` — call this
     * after changing `img.src`. Videos refresh automatically (no-op).
     * Otherwise re-snapshots the element's DOM subtree.
     *
     * Useful for elements whose contents change (input, textarea, or an
     * `<img>` whose `src` swaps).
     */
    update(element: HTMLElement): Promise<void>;
    /**
     * Start rendering VFX.
     */
    play(): void;
    /**
     * Stop rendering VFX.
     * You can restart rendering by calling `VFX.play()` later.
     */
    stop(): void;
    /**
     * Render the whole scene once, manually.
     * This is useful when you want to control the rendering timings manually by combining with `autoplay: false`.
     */
    render(): void;
    /**
     * Destroy VFX and stop rendering.
     */
    destroy(): void;
}
