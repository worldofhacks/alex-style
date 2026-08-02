import type { Theme } from '@unocss/preset-mini'

export function pulsateAttention(theme: Theme) {
  const keyframes: Record<string, string> = {
    'heartbeat': '{from{transform:scale(1);transform-origin:center center;animation-timing-function:ease-out}10%{transform:scale(.91);animation-timing-function:ease-in}17%{transform:scale(.98);animation-timing-function:ease-out}33%{transform:scale(.87);animation-timing-function:ease-in}45%{transform:scale(1);animation-timing-function:ease-out}}',
    'pulsate-bck': '{0%{transform:scale(1)}50%{transform:scale(.9)}100%{transform:scale(1)}}',
    'pulsate-fwd': '{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}',
    'ping': '{0%{transform:scale(.2);opacity:.8}80%{transform:scale(1.2);opacity:0}100%{transform:scale(2.2);opacity:0}}',
  }
  const duration: Record<string, string> = {
    'heartbeat': '1.5ss',
    'pulsate-bck': '.5s',
    'pulsate-fwd': '.5s',
    'bounce-right': '.8s',
  }
  const timingFns = 'ease-in-out'
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
