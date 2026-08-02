import type { Theme } from '@unocss/preset-mini'

export function slideFwdBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-fwd-center': '{0%{transform:translateZ(0)}100%{transform:translateZ(40rem)}}',
    'slide-fwd-top': '{0%{transform:translateZ(0) translateY(0)}100%{transform:translateZ(40rem) translateY(-25rem)}}',
    'slide-fwd-tr': '{0%{transform:translateZ(0) translateY(0) translateX(0)}100%{transform:translateZ(40rem) translateY(-25rem) translateX(25rem)}}',
    'slide-fwd-right': '{0%{transform:translateZ(0) translateX(0)}100%{transform:translateZ(40rem) translateX(25rem)}}',
    'slide-fwd-br': '{0%{transform:translateZ(0) translateY(0) translateX(0)}100%{transform:translateZ(40rem) translateY(25rem) translateX(25rem)}}',
    'slide-fwd-bottom': '{0%{transform:translateZ(0) translateY(0)}100%{transform:translateZ(40rem) translateY(25rem)}}',
    'slide-fwd-bl': '{0%{transform:translateZ(0) translateY(0) translateX(0)}100%{transform:translateZ(40rem) translateY(25rem) translateX(-25rem)}}',
    'slide-fwd-left': '{0%{transform:translateZ(0) translateX(0)}100%{transform:translateZ(40rem) translateX(-25rem)}}',
    'slide-fwd-tl': '{0%{transform:translateZ(0) translateY(0) translateX(0)}100%{transform:translateZ(40rem) translateY(-25rem) translateX(-25rem)}}',
  }
  const duration = '.45s'
  const timingFns = 'cubic-bezier(.25,.46,.45,.94)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
