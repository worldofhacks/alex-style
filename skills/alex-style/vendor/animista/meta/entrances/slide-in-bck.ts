import type { Theme } from '@unocss/preset-mini'

export function slideInBckEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-in-bck-center': '{0%{transform:translateZ(600px);opacity:0}100%{transform:translateZ(0);opacity:1}}',
    'slide-in-bck-top': '{0%{transform:translateZ(175rem) translateY(-75rem);opacity:0}100%{transform:translateZ(0) translateY(0);opacity:1}}',
    'slide-in-bck-tr': '{0%{transform:translateZ(175rem) translateY(-75rem) translateX(100rem);opacity:0}100%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}}',
    'slide-in-bck-right': '{0%{transform:translateZ(175rem) translateX(100rem);opacity:0}100%{transform:translateZ(0) translateX(0);opacity:1}}',
    'slide-in-bck-br': '{0%{transform:translateZ(175rem) translateY(75rem) translateX(100rem);opacity:0}100%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}}',
    'slide-in-bck-bottom': '{0%{transform:translateZ(175rem) translateY(75rem);opacity:0}100%{transform:translateZ(0) translateY(0);opacity:1}}',
    'slide-in-bck-bl': '{0%{transform:translateZ(175rem) translateY(75rem) translateX(-100rem);opacity:0}100%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}}',
    'slide-in-bck-left': '{0%{transform:translateZ(175rem) translateX(-100rem);opacity:0}100%{transform:translateZ(0) translateX(0);opacity:1}}',
    'slide-in-bck-tl': '{0%{transform:translateZ(175rem) translateY(-75rem) translateX(-100rem);opacity:0}100%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}}',
  }
  const duration = '.6s'
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
