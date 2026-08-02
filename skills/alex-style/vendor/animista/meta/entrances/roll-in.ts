import type { Theme } from '@unocss/preset-mini'

export function rollInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'roll-in-left': '{0%{transform:translateX(-200rem) rotate(-540deg);opacity:0}100%{transform:translateX(0) rotate(0deg);opacity:1}}',
    'roll-in-top': '{0%{transform:translateY(-200rem) rotate(-540deg);opacity:0}100%{transform:translateY(0) rotate(0deg);opacity:1}}',
    'roll-in-right': '{0%{transform:translateX(200rem) rotate(540deg);opacity:0}100%{transform:translateX(0) rotate(0deg);opacity:1}}',
    'roll-in-bottom': '{0%{transform:translateY(200rem) rotate(540deg);opacity:0}100%{transform:translateY(0) rotate(0deg);opacity:1}}',
  }
  const duration = '.6s'
  const timingFns = 'ease-out'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
