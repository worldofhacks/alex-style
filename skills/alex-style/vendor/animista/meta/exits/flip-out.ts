import type { Theme } from '@unocss/preset-mini'

export function flipOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'flip-out-hor-top': '{0%{transform:rotateX(0);opacity:1}100%{transform:rotateX(70deg);opacity:0}}',
    'flip-out-hor-bottom': '{0%{transform:rotateX(0);opacity:1}100%{transform:rotateX(-70deg);opacity:0}}',
    'flip-out-ver-left': '{0%{transform:rotateY(0);opacity:1}100%{transform:rotateY(-70deg);opacity:0}}',
    'flip-out-ver-right': '{0%{transform:rotateY(0);opacity:1}100%{transform:rotateY(70deg);opacity:0}}',
    'flip-out-diag-1-tr': '{0%{transform:rotate3d(1,1,0,0deg);opacity:1}100%{transform:rotate3d(1,1,0,70deg);opacity:0}}',
    'flip-out-diag-1-bl': '{0%{transform:rotate3d(1,1,0,0deg);opacity:1}100%{transform:rotate3d(1,1,0,-70deg);opacity:0}}',
    'flip-out-diag-2-tl': '{0%{transform:rotate3d(1,1,0,0deg);opacity:1}100%{transform:rotate3d(-1,1,0,-70deg);opacity:0}}',
    'flip-out-diag-2-br': '{0%{transform:rotate3d(1,1,0,0deg);opacity:1}100%{transform:rotate3d(-1,1,0,70deg);opacity:0}}',
  }
  const duration = '.45s'
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
