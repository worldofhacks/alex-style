import type { Theme } from '@unocss/preset-mini'

export function rollInBlurredEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'roll-in-blurred-left': '{0%{transform:translateX(-250rem) rotate(-720deg);filter:blur(12.5rem);opacity:0}100%{transform:translateX(0) rotate(0deg);filter:blur(0);opacity:1}}',
    'roll-in-blurred-top': '{0%{transform:translateY(-200rem) rotate(-720deg);filter:blur(12.5rem);opacity:0}100%{transform:translateY(0) rotate(0deg);filter:blur(0);opacity:1}}',
    'roll-in-blurred-right': '{0%{transform:translateX(250rem) rotate(720deg);filter:blur(12.5rem);opacity:0}100%{transform:translateX(0) rotate(0deg);filter:blur(0);opacity:1}}',
    'roll-in-blurred-bottom': '{0%{transform:translateY(200rem) rotate(720deg);filter:blur(12.5rem);opacity:0}100%{transform:translateY(0) rotate(0deg);opacity:1}}',
  }
  const duration = '.65s'
  const timingFns = 'cubic-bezier(.23,1.000,.32,1.000)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
