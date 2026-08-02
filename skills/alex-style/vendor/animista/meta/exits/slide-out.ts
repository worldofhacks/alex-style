import type { Theme } from '@unocss/preset-mini'

export function slideOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-out-top': '{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-250rem);opacity:0}}',
    'slide-out-tr': '{0%{transform:translateY(0) translateX(0);opacity:1}100%{transform:translateY(-250rem) translateX(250rem);opacity:0}}',
    'slide-out-right': '{0%{transform:translateX(0);opacity:1}100%{transform:translateX(250rem);opacity:0}}',
    'slide-out-br': '{0%{transform:translateY(0) translateX(0);opacity:1}100%{transform:translateY(250rem) translateX(250rem);opacity:0}}',
    'slide-out-bottom': '{0%{transform:translateY(0);opacity:1}100%{transform:translateY(250rem);opacity:0}}',
    'slide-out-bl': '{0%{transform:translateY(0) translateX(0);opacity:1}100%{transform:translateY(250rem) translateX(-250rem);opacity:0}}',
    'slide-out-left': '{0%{transform:translateX(0);opacity:1}100%{transform:translateX(-250rem);opacity:0}}',
    'slide-out-tl': '{0%{transform:translateY(0) translateX(0);opacity:1}100%{transform:translateY(-250rem) translateX(-250rem);opacity:0}}',
  }
  const duration = '.5s'
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
