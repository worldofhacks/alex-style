import type { Theme } from '@unocss/preset-mini'

export function rollOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'roll-out-left': '{0%{transform:translateX(0) rotate(0deg);opacity:1}100%{transform:translateX(-250rem) rotate(-540deg);opacity:0}}',
    'roll-out-top': '{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-200rem) rotate(-540deg);opacity:0}}',
    'roll-out-right': '{0%{transform:translateX(0) rotate(0deg);opacity:1}100%{transform:translateX(250rem) rotate(540deg);opacity:0}}',
    'roll-out-bottom': '{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(200rem) rotate(540deg);opacity:0}}',
  }
  const duration = '.6s'
  const timingFns = 'ease-in)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
