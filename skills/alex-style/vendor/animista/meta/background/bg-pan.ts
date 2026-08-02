import type { Theme } from '@unocss/preset-mini'

export function bgPanBackground(theme: Theme) {
  const keyframes: Record<string, string> = {
    'bg-pan-left': '{0%{background-position:100% 50%}100%{background-position:0 50%}}',
    'bg-pan-right': '{0%{background-position:0 50%}100%{background-position:100% 50%}}',
    'bg-pan-top': '{0%{background-position:50% 100%}100%{background-position:50% 0}}',
    'bg-pan-bottom': '{0%{background-position:50% 0}100%{background-position:50% 100%}}',
    'bg-pan-tr': '{0%{background-position:0 100%}100%{background-position:100% 0}}',
    'bg-pan-br': '{0%{background-position:0 0}100%{background-position:100% 100%}}',
    'bg-pan-bl': '{0%{background-position:100% 0}100%{background-position:0 100%}}',
    'bg-pan-tl': '{0%{background-position:100% 100%}100%{background-position:0 0}}',
  }
  const duration = '8s'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.mode![key] = mode
  }
  return theme
}
