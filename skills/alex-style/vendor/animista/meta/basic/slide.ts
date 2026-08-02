import type { Theme } from '@unocss/preset-mini'

export function slideBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-top': '{0%{transform:translateY(0)}100%{transform:translateY(-25rem)}}',
    'slide-tr': '{0%{transform:translateY(0) translateX(0)}100%{transform:translateY(-25rem) translateX(25rem)}}',
    'slide-right': '{0%{transform:translateX(0)}100%{transform:translateX(25rem)}}',
    'slide-br': '{0%{transform:translateY(0) translateX(0)}100%{transform:translateY(25rem) translateX(25rem)}}',
    'slide-bottom': '{0%{transform:translateY(0)}100%{transform:translateY(25rem)}}',
    'slide-bl': '{0%{transform:translateY(0) translateX(0)}100%{transform:translateY(25rem) translateX(-25rem)}}',
    'slide-left': '{0%{transform:translateX(0)}100%{transform:translateX(-25rem)}}',
    'slide-tl': '{0%{transform:translateY(0) translateX(0)}100%{transform:translateY(-25rem) translateX(-25rem)}}',
  }
  const duration = '.5s'
  const timingFns = 'cubic-bezier(.25,.46,.45,.94)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
