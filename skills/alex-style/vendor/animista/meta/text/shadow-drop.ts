import type { Theme } from '@unocss/preset-mini'

export function shadowDropText(theme: Theme) {
  const keyframes: Record<string, string> = {
    'text-shadow-drop-center': '{0%{text-shadow:0 0 0 transparent}100%{text-shadow:0 0 4.5rem rgba(0,0,0,.35)}}',
    'text-shadow-drop-top': '{0%{text-shadow:0 0 0 transparent}100%{text-shadow:0 -1.5rem 4.5rem rgba(0,0,0,.35)}}',
    'text-shadow-drop-tr': '{0%{text-shadow:0 0 0 transparent}100%{text-shadow:1.5rem -1.5rem 4.5rem rgba(0,0,0,.35)}}',
    'text-shadow-drop-right': '{0%{text-shadow:0 0 0 transparent}100%{text-shadow:1.5rem 0 4.5rem rgba(0,0,0,.35)}}',
    'text-shadow-drop-br': '{0%{text-shadow:0 0 0 transparent}100%{text-shadow:1.5rem 1.5rem 4.5rem rgba(0,0,0,.35)}}',
    'text-shadow-drop-bottom': '{0%{text-shadow:0 0 0 transparent}100%{text-shadow:0 1.5rem 4.5rem rgba(0,0,0,.35)}}',
    'text-shadow-drop-bl': '{0%{text-shadow:0 0 0 transparent}100%{text-shadow:-1.5rem 1.5rem 4.5rem rgba(0,0,0,.35)}}',
    'text-shadow-drop-left': '{0%{text-shadow:0 0 0 transparent}100%{text-shadow:-1.5rem 0 4.5rem rgba(0,0,0,.35)}}',
    'text-shadow-drop-tl': '{0%{text-shadow:0 0 0 transparent}100%{text-shadow:-1.5rem -1.5rem 4.5rem rgba(0,0,0,.35)}}',
  }
  const duration = '.6s'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.mode![key] = mode
  }

  return theme
}
