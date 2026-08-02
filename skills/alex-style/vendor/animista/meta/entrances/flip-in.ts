import type { Theme } from '@unocss/preset-mini'

export function flipInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'flip-in-hor-bottom': '{0%{transform:rotateX(80deg);opacity:0}100%{transform:rotateX(0);opacity:1}}',
    'flip-in-hor-top': '{0%{transform:rotateX(-80deg);opacity:0}100%{transform:rotateX(0);opacity:1}}',
    'flip-in-ver-right': '{0%{transform:rotateY(-80deg);opacity:0}100%{transform:rotateY(0);opacity:1}}',
    'flip-in-ver-left': '{0%{transform:rotateY(80deg);opacity:0}100%{transform:rotateY(0);opacity:1}}',
    'flip-in-diag-1-tr': '{0%{transform:rotate3d(1,1,0,-80deg);opacity:0}100%{transform:rotate3d(1,1,0,0deg);opacity:1}}',
    'flip-in-diag-1-bl': '{0%{transform:rotate3d(1,1,0,80deg);opacity:0}100%{transform:rotate3d(1,1,0,0deg);opacity:1}}',
    'flip-in-diag-2-tl': '{0%{transform:rotate3d(-1,1,0,80deg);opacity:0}100%{transform:rotate3d(1,1,0,0deg);opacity:1}}',
    'flip-in-diag-2-br': '{0%{transform:rotate3d(-1,1,0,-80deg);opacity:0}100%{transform:rotate3d(1,1,0,0deg);opacity:1}}',
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
