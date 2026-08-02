import type { Theme } from '@unocss/preset-mini'

export function vibrateAttention(theme: Theme) {
  const keyframes: Record<string, string> = {
    'vibrate-1': '{0%{transform:translate(0)}20%{transform:translate(-0.5rem,0.5rem)}40%{transform:translate(-0.5rem,-0.5rem)}60%{transform:translate(0.5rem,0.5rem)}80%{transform:translate(0.5rem,-0.5rem)}100%{transform:translate(0)}}',
    'vibrate-2': '{0%{transform:translate(0)}20%{transform:translate(0.5rem,-0.5rem)}40%{transform:translate(0.5rem,0.5rem)}60%{transform:translate(-0.5rem,0.5rem)}80%{transform:translate(-0.5rem,-0.5rem)}100%{transform:translate(0)}}',
    'vibrate-3': '{0%{transform:translate(0)}10%{transform:translate(-0.5rem,-0.5rem)}20%{transform:translate(0.5rem,-0.5rem)}30%{transform:translate(-0.5rem,0.5rem)}40%{transform:translate(0.5rem,0.5rem)}50%{transform:translate(-0.5rem,-0.5rem)}60%{transform:translate(0.5rem,-0.5rem)}70%{transform:translate(-0.5rem,0.5rem)}80%{transform:translate(-0.5rem,-0.5rem)}90%{transform:translate(0.5rem,-0.5rem)}100%{transform:translate(0)}}',
  }
  const duration: Record<string, string> = {
    'vibrate-1': '.3s',
    'vibrate-2': '.3s',
    'vibrate-3': '.5s',
  }
  const timingFns = 'linear'
  const counts = 'infinite'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration[key]
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.counts![key] = counts
    theme.animation!.mode![key] = mode
  }
  return theme
}
