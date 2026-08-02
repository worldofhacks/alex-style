import type { Theme } from '@unocss/preset-mini'

export function slideOutFwdExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-out-fwd-center': '{0%{transform:translateZ(1);opacity:1}100%{transform:translateZ(150rem);opacity:0}}',
    'slide-out-fwd-top': '{0%{transform:translateZ(1) translateY(0);opacity:1}100%{transform:translateZ(150rem) translateY(-75rem);opacity:0}}',
    'slide-out-fwd-tr': '{0%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}100%{transform:translateZ(150rem) translateY(-75rem) translateX(125rem);opacity:0}}',
    'slide-out-fwd-right': '{0%{transform:translateZ(0) translateX(0);opacity:1}100%{transform:translateZ(150rem) translateX(125rem);opacity:0}}',
    'slide-out-fwd-br': '{0%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}100%{transform:translateZ(150rem) translateY(75rem) translateX(125rem);opacity:0}}',
    'slide-out-fwd-bottom': '{0%{transform:translateZ(0) translateY(0);opacity:1}100%{transform:translateZ(150rem) translateY(75rem);opacity:0}}',
    'slide-out-fwd-bl': '{0%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}100%{transform:translateZ(150rem) translateY(75rem) translateX(-125rem);opacity:0}}',
    'slide-out-fwd-left': '{0%{transform:translateZ(0) translateX(0);opacity:1}100%{transform:translateZ(150rem) translateX(-125rem);opacity:0}}',
    'slide-out-fwd-tl': '{0%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}100%{transform:translateZ(150rem) translateY(-75rem) translateX(-125rem);opacity:0}}',
  }
  const duration = '.7s'
  const timingFns = 'cubic-bezier(.55,.085,.68,.53)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
