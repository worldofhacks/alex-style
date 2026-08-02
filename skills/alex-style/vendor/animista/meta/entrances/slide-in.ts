import type { Theme } from '@unocss/preset-mini'

export function slideInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-in-top': '{0%{transform:translateY(-250rem);opacity:0}100%{transform:translateY(0);opacity:1}}',
    'slide-in-tr': '{0%{transform:translateY(-250rem) translateX(250rem);opacity:0}100%{transform:translateY(0) translateX(0);opacity:1}}',
    'slide-in-right': '{0%{transform:translateX(250rem);opacity:0}100%{transform:translateX(0);opacity:1}}',
    'slide-in-br': '{0%{transform:translateY(250rem) translateX(250rem);opacity:0}100%{transform:translateY(0) translateX(0);opacity:1}}',
    'slide-in-bottom': '{0%{transform:translateY(250rem);opacity:0}100%{transform:translateY(0);opacity:1}}',
    'slide-in-bl': '{0%{transform:translateY(250rem) translateX(-250rem);opacity:0}100%{transform:translateY(0) translateX(0);opacity:1}}',
    'slide-in-left': '{0%{transform:translateX(-250rem);opacity:0}100%{transform:translateX(0);opacity:1}}',
    'slide-in-tl': '{0%{transform:translateY(-250rem) translateX(-250rem);opacity:0}100%{transform:translateY(0) translateX(0);opacity:1}}',
  }
  const duration = '.5s'
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
