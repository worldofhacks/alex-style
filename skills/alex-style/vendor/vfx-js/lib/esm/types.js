/**
 * Parse VFXOpts and fill in the default values.
 * @internal
 */
export function getVFXOpts(opts) {
    const defaultPixelRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    let scrollPadding;
    if (opts.scrollPadding === undefined) {
        scrollPadding = [0.1, 0.1];
    }
    else if (opts.scrollPadding === false) {
        scrollPadding = [0, 0];
    }
    else if (Array.isArray(opts.scrollPadding)) {
        scrollPadding = [
            opts.scrollPadding[0] ?? 0.1,
            opts.scrollPadding[1] ?? 0.1,
        ];
    }
    else {
        scrollPadding = [opts.scrollPadding, opts.scrollPadding];
    }
    let postEffects;
    if (opts.postEffect === undefined) {
        postEffects = [];
    }
    else if (Array.isArray(opts.postEffect)) {
        postEffects = opts.postEffect;
    }
    else {
        postEffects = [opts.postEffect];
    }
    return {
        pixelRatio: opts.pixelRatio ?? defaultPixelRatio,
        zIndex: opts.zIndex ?? undefined,
        autoplay: opts.autoplay ?? true,
        fixedCanvas: opts.scrollPadding === false,
        scrollPadding,
        wrapper: opts.wrapper,
        postEffects,
    };
}
//# sourceMappingURL=types.js.map