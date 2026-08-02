import type { Theme } from '@unocss/preset-mini'

export function rolloutBlurredExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'roll-out-blurred-left': '{0%{transform:translateX(0) rotate(0deg);filter:blur(0);opacity:1}100%{transform:translateX(-250rem) rotate(-720deg);filter:blur(12.5rem);opacity:0}}',
    'roll-out-blurred-top': '{0%{transform:translateY(0) rotate(0deg);filter:blur(0);opacity:1}100%{transform:translateY(-200rem) rotate(-720deg);filter:blur(12.5rem);opacity:0}}',
    'roll-out-blurred-right': '{0%{transform:translateX(0) rotate(0deg);filter:blur(0);opacity:1}100%{transform:translateX(250rem) rotate(720deg);filter:blur(12.5rem);opacity:0}}',
    'roll-out-blurred-bottom': '{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(200rem) rotate(720deg);filter:blur(12.5rem);opacity:0}}',
  }
  const duration = '.65s'
  const timingFns = 'cubic-bezier(.755,.05,.855,.06)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
