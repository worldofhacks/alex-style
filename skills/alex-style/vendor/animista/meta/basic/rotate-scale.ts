import type { Theme } from '@unocss/preset-mini'

export function rotateScaleBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'rotate-scale-up': '{0%{transform:scale(1) rotateZ(0)}50%{transform:scale(2) rotateZ(180deg)}100%{transform:scale(1) rotateZ(360deg)}}',
    'rotate-scale-down': '{0%{transform:scale(1) rotateZ(0)}50%{transform:scale(.5) rotateZ(180deg)}100%{transform:scale(1) rotateZ(360deg)}}',
    'rotate-scale-up-hor': '{0%{transform:scale(1) rotateX(0)}50%{transform:scale(2) rotateX(-180deg)}100%{transform:scale(1) rotateX(-360deg)}}',
    'rotate-scale-down-hor': '{0%{transform:scale(1) rotateX(0)}50%{transform:scale(.5) rotateX(-180deg)}100%{transform:scale(1) rotateX(-360deg)}}',
    'rotate-scale-up-ver': '{0%{transform:scale(1) rotateY(0)}50%{transform:scale(2) rotateY(180deg)}100%{transform:scale(1) rotateY(360deg)}}',
    'rotate-scale-down-ver': '{0%{transform:scale(1) rotateY(0)}50%{transform:scale(.5) rotateY(180deg)}100%{transform:scale(1) rotateY(360deg)}}',
    'rotate-scale-up-diag-1': '{0%{transform:scale(1) rotate3d(1,1,0,0deg)}50%{transform:scale(2) rotate3d(1,1,0,-180deg)}100%{transform:scale(1) rotate3d(1,1,0,-360deg)}}',
    'rotate-scale-down-diag-1': '{0%{transform:scale(1) rotate3d(1,1,0,0deg)}50%{transform:scale(.5) rotate3d(1,1,0,-180deg)}100%{transform:scale(1) rotate3d(1,1,0,-360deg)}}',
    'rotate-scale-up-diag-2': '{0%{transform:scale(1) rotate3d(-1,1,0,0deg)}50%{transform:scale(2) rotate3d(-1,1,0,180deg)}100%{transform:scale(1) rotate3d(-1,1,0,360deg)}}',
    'rotate-scale-down-diag-2': '{0%{transform:scale(1) rotate3d(-1,1,0,0deg)}50%{transform:scale(.5) rotate3d(-1,1,0,180deg)}100%{transform:scale(1) rotate3d(-1,1,0,360deg)}}',
  }
  const duration = '.65s'
  const timingFns = 'linear'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
