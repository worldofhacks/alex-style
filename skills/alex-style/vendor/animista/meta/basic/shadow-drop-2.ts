import type { Theme } from '@unocss/preset-mini'

export function shadowDrop2Basic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'shadow-drop-2-center': '{0%{transform:translateZ(0);box-shadow:0 0 0 0 transparent}100%{transform:translateZ(12.5rem);box-shadow:0 0 5rem 0 rgba(0,0,0,.35)}}',
    'shadow-drop-2-top': '{0%{transform:translateZ(0) translateY(0);box-shadow:0 0 0 0 transparent}100%{transform:translateZ(12.5rem) translateY(3rem);box-shadow:0 -3rem 5rem -3rem rgba(0,0,0,.35)}}',
    'shadow-drop-2-right': '{0%{transform:translateZ(0) translateX(0);box-shadow:0 0 0 0 transparent}100%{transform:translateZ(12.5rem) translateX(-3rem);box-shadow:3rem 0 5rem -3rem rgba(0,0,0,.35)}}',
    'shadow-drop-2-bottom': '{0%{transform:translateZ(0) translateY(0);box-shadow:0 0 0 0 transparent}100%{transform:translateZ(12.5rem) translateY(-3rem);box-shadow:0 3rem 5rem -3rem rgba(0,0,0,.35)}}',
    'shadow-drop-2-left': '{0%{transform:translateZ(0) translateX(0);box-shadow:0 0 0 0 transparent}100%{transform:translateZ(12.5rem) translateX(3rem);box-shadow:-3rem 0 5rem -3rem rgba(0,0,0,.35)}}',
    'shadow-drop-2-lr': '{0%{transform:translateZ(0);box-shadow:0 0 0 0 transparent,0 0 0 0 transparent}100%{transform:translateZ(12.5rem);box-shadow:-3rem 0 5rem -3rem rgba(0,0,0,.35),3rem 0 5rem -3rem rgba(0,0,0,.35)}}',
    'shadow-drop-2-tb': '{0%{transform:translateZ(0);box-shadow:0 0 0 0 transparent,0 0 0 0 transparent}100%{transform:translateZ(12.5rem);box-shadow:0 -3rem 5rem -3rem rgba(0,0,0,.35),0 3rem 5rem -3rem rgba(0,0,0,.35)}}',
    'shadow-drop-2-tr': '{0%{transform:translateZ(0) translateX(0) translateY(0);box-shadow:0 0 0 0 transparent}100%{transform:translateZ(12.5rem) translateX(-3rem) translateY(3rem);box-shadow:3rem -3rem 5rem -3rem rgba(0,0,0,.35)}}',
    'shadow-drop-2-br': '{0%{transform:translateZ(0) translateX(0) translateY(0);box-shadow:0 0 0 0 transparent}100%{transform:translateZ(12.5rem) translateX(-3rem) translateY(-3rem);box-shadow:3rem 3rem 5rem -3rem rgba(0,0,0,.35)}}',
    'shadow-drop-2-bl': '{0%{transform:translateZ(0) translateX(0) translateY(0);box-shadow:0 0 0 0 transparent}100%{transform:translateZ(12.5rem) translateX(3rem) translateY(-3rem);box-shadow:-3rem 3rem 5rem -3rem rgba(0,0,0,.35)}}',
    'shadow-drop-2-tl': '{0%{transform:translateZ(0) translateX(0) translateY(0);box-shadow:0 0 0 0 transparent}100%{transform:translateZ(12.5rem) translateX(3rem) translateY(3rem);box-shadow:-3rem -3rem 5rem -3rem rgba(0,0,0,.35)}}',
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
