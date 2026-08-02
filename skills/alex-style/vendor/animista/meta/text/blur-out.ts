import type { Theme } from '@unocss/preset-mini'

export function blurOutText(theme: Theme) {
  const keyframes: Record<string, string> = {
    'text-blur-out': '{0%{filter:blur(.01)}100%{filter:blur(3rem) opacity(0)}}',
    'blur-out-contract': '{0%{filter:blur(.01)}100%{letter-spacing:-.5rem;filter:blur(3rem) opacity(0)}}',
    'blur-out-contract-bck': '{0%{transform:translateZ(0);filter:blur(.01)}100%{letter-spacing:-.5em;transform:translateZ(-125rem);filter:blur(3rem) opacity(0)}}',
    'blur-out-expand': '{0%{filter:blur(.01)}100%{letter-spacing:1em;filter:blur(3rem) opacity(0)}}',
    'blur-out-expand-fwd': '{0%{transform:translateZ(0);filter:blur(.01)}100%{letter-spacing:1em;transform:translateZ(75rem);filter:blur(3rem) opacity(0)}}',
  }
  const duration = '1.2s'
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
