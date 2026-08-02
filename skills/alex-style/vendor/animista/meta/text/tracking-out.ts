import type { Theme } from '@unocss/preset-mini'

export function trackingOutText(theme: Theme) {
  const keyframes: Record<string, string> = {
    'tracking-out-contract': '{0%{opacity:1}50%{opacity:1}100%{letter-spacing:-.5em;opacity:0}}',
    'tracking-out-contract-bck': '{0%{transform:translateZ(0);opacity:1}60%{opacity:1}100%{letter-spacing:-.5em;transform:translateZ(-125rem);opacity:0}}',
    'tracking-out-contract-bck-top': '{0%{transform:translateZ(0) translateY(0);opacity:1}60%{opacity:1}100%{letter-spacing:-.5em;transform:translateZ(-125rem) translateY(-75rem);opacity:0}}',
    'tracking-out-contract-bck-bottom': '{0%{transform:translateZ(0) translateY(0);opacity:1}60%{opacity:1}100%{letter-spacing:-.5em;transform:translateZ(-125rem) translateY(75rem);opacity:0}}',
    'tracking-out-expand': '{0%{opacity:1}60%{opacity:.8}100%{letter-spacing:1em;opacity:0}}',
    'tracking-out-expand-fwd': '{0%{transform:translateZ(0);opacity:1}60%{opacity:.8}100%{letter-spacing:1em;transform:translateZ(75rem);opacity:0}}',
    'tracking-out-expand-fwd-top': '{0%{transform:translateZ(0) translateY(0);opacity:1}60%{opacity:.8}100%{letter-spacing:1em;transform:translateZ(75rem) translateY(-50rem);opacity:0}}',
    'tracking-out-expand-fwd-bottom': '{0%{transform:translateZ(0) translateY(0);opacity:1}60%{opacity:.8}100%{letter-spacing:1em;transform:translateZ(75rem) translateY(50rem);opacity:0}}',
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
