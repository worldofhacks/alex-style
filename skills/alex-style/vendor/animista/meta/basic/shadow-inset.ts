import type { Theme } from '@unocss/preset-mini'

export function shadowInsetBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'shadow-inset-center': '{0%{box-shadow:inset 0 0 0 0 transparent}100%{box-shadow:inset 0 0 3.5rem 0 rgba(0,0,0,.5)}}',
    'shadow-inset-top': '{0%{box-shadow:inset 0 0 0 0 transparent}100%{box-shadow:inset 0 1.5rem 3.5rem -1.5rem rgba(0,0,0,.5)}}',
    'shadow-inset-right': '{0%{box-shadow:inset 0 0 0 0 transparent}100%{box-shadow:inset -1.5rem 0 3.5rem -1.5rem rgba(0,0,0,.5)}}',
    'shadow-inset-bottom': '{0%{box-shadow:inset 0 0 0 0 transparent}100%{box-shadow:inset 0 -1.5rem 3.5rem -1.5rem rgba(0,0,0,.5)}}',
    'shadow-inset-left': '{0%{box-shadow:inset 0 0 0 0 transparent}100%{box-shadow:inset 1.5rem 0 3.5rem -1.5rem rgba(0,0,0,.5)}}',
    'shadow-inset-lr': '{0%{box-shadow:inset 0 0 0 0 transparent,inset 0 0 0 0 transparent}100%{box-shadow:inset -1.5rem 0 3.5rem -1.5rem rgba(0,0,0,.5),inset 1.5rem 0 3.5rem -1.5rem rgba(0,0,0,.5)}}',
    'shadow-inset-tb': '{0%{box-shadow:inset 0 0 0 0 transparent,inset 0 0 0 0 transparent}100%{box-shadow:inset 0 -1.5rem 3.5rem -1.5rem rgba(0,0,0,.5),inset 0 1.5rem 3.5rem -1.5rem rgba(0,0,0,.5)}}',
    'shadow-inset-tr': '{0%{box-shadow:inset 0 0 0 0 transparent}100%{box-shadow:inset -1.5rem 1.5rem 3.5rem -1.5rem rgba(0,0,0,.5)}}',
    'shadow-inset-br': '{0%{box-shadow:inset 0 0 0 0 transparent}100%{box-shadow:inset -1.5rem -1.5rem 3.5rem -1.5rem rgba(0,0,0,.5)}}',
    'shadow-inset-bl': '{0%{box-shadow:inset 0 0 0 0 transparent}100%{box-shadow:inset 1.5rem -1.5rem 3.5rem -1.5rem rgba(0,0,0,.5)}}',
    'shadow-inset-tl': '{0%{box-shadow:inset 0 0 0 0 transparent}100%{box-shadow:inset 1.5rem 1.5rem 3.5rem -1.5rem rgba(0,0,0,.5)}}',
  }
  const duration = '.4s'
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
