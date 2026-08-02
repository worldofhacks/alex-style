import type { Theme } from '@unocss/preset-mini'

export function rotateInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'rotate-in-center': '{0%{transform:rotate(-360deg);opacity:0}100%{transform:rotate(0);opacity:1}}',
    'rotate-in-top': '{0%{transform:rotate(-360deg);transform-origin:top;opacity:0}100%{transform:rotate(0deg);transform-origin:top;opacity:1}}',
    'rotate-in-tr': '{0%{transform:rotate(-360deg);transform-origin:top right;opacity:0}100%{transform:rotate(0deg);transform-origin:top right;opacity:1}}',
    'rotate-in-right': '{0%{transform:rotate(-360deg);transform-origin:right;opacity:0}100%{transform:rotate(0deg);transform-origin:right;opacity:1}}',
    'rotate-in-br': '{0%{transform:rotate(-360deg);transform-origin:bottom right;opacity:0}100%{transform:rotate(0deg);transform-origin:bottom right;opacity:1}}',
    'rotate-in-bottom': '{0%{transform:rotate(-360deg);transform-origin:bottom;opacity:0}100%{transform:rotate(0deg);transform-origin:bottom;opacity:1}}',
    'rotate-in-bl': '{0%{transform:rotate(-360deg);transform-origin:bottom left;opacity:0}100%{transform:rotate(0deg);transform-origin:bottom left;opacity:1}}',
    'rotate-in-left': '{0%{transform:rotate(-360deg);transform-origin:left;opacity:0}100%{transform:rotate(0deg);transform-origin:left;opacity:1}}',
    'rotate-in-tl': '{0%{transform:rotate(-360deg);transform-origin:top left;opacity:0}100%{transform:rotate(0deg);transform-origin:top left;opacity:1}}',
    'rotate-in-hor': '{0%{transform:rotateX(360deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}',
    'rotate-in-ver': '{0%{transform:rotateY(-360deg);opacity:0}100%{transform:rotateY(0deg);opacity:1}}',
    'rotate-in-diag-1': '{0%{transform:rotate3d(1,1,0,-360deg);opacity:0}100%{transform:rotate3d(1,1,0,0deg);opacity:1}}',
    'rotate-in-diag-2': '{0%{transform:rotate3d(-1,1,0,-360deg);opacity:0}100%{transform:rotate3d(-1,1,0,0deg);opacity:1}}',
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
