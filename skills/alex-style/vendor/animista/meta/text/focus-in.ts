import type { Theme } from '@unocss/preset-mini'

export function focusInText(theme: Theme) {
  const keyframes: Record<string, string> = {
    'text-focus-in': '{0%{filter:blur(12px);opacity:0}100%{filter:blur(0);opacity:1}}',
    'focus-in-expand': '{0%{letter-spacing:-.5em;filter:blur(12px);opacity:0}100%{filter:blur(0);opacity:1}}',
    'focus-in-expand-fwd': '{0%{letter-spacing:-.5em;transform:translateZ(-800px);filter:blur(12px);opacity:0}100%{transform:translateZ(0);filter:blur(0);opacity:1}}',
    'focus-in-contract': '{0%{letter-spacing:1em;filter:blur(12px);opacity:0}100%{filter:blur(0);opacity:1}}',
    'focus-in-contract-bck': '{0%{letter-spacing:1em;transform:translateZ(300px);filter:blur(12px);opacity:0}100%{transform:translateZ(12px);filter:blur(0);opacity:1}}',
  }
  const duration = '.8s'
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
