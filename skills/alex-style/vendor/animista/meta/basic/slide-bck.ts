import type { Theme } from '@unocss/preset-mini'

export function slideBckBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-bck-center': '{0%{transform:translateZ(0)}100%{transform:translateZ(-100rem)}}',
    'slide-bck-top': '{0%{transform:translateZ(0) translateY(0)}100%{transform:translateZ(-100rem) translateY(-50rem)}}',
    'slide-bck-tr': '{0%{transform:translateZ(0) translateY(0) translateX(0)}100%{transform:translateZ(-100rem) translateY(-50rem) translateX(50rem)}}',
    'slide-bck-right': '{0%{transform:translateZ(0) translateX(0)}100%{transform:translateZ(-100rem) translateX(50rem)}}',
    'slide-bck-br': '{0%{transform:translateZ(0) translateY(0) translateX(0)}100%{transform:translateZ(-100rem) translateY(50rem) translateX(50rem)}}',
    'slide-bck-bottom': '{0%{transform:translateZ(0) translateY(0)}100%{transform:translateZ(-100rem) translateY(50rem)}}',
    'slide-bck-bl': '{0%{transform:translateZ(0) translateY(0) translateX(0)}100%{transform:translateZ(-100rem) translateY(50rem) translateX(-50rem)}}',
    'slide-bck-left': '{0%{transform:translateZ(0) translateX(0)}100%{transform:translateZ(-100rem) translateX(-50rem)}}',
    'slide-bck-tl': '{0%{transform:translateZ(0) translateY(0) translateX(0)}100%{transform:translateZ(-100rem) translateY(-50rem) translateX(-50rem)}}',
  }
  const duration = '.45s'
  const timingFns = 'cubic-bezier(.47,0.000,.745,.715)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
