import type { Theme } from '@unocss/preset-mini'

export function flipScaleBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'flip-scale-up-hor': '{0%{transform:scale(1) rotateX(0)}50%{transform:scale(2.5) rotateX(-90deg)}100%{transform:scale(1) rotateX(-180deg)}}',
    'flip-scale-down-hor': '{0%{transform:scale(1) rotateX(0)}50%{transform:scale(.4) rotateX(90deg)}100%{transform:scale(1) rotateX(180deg)}}',
    'flip-scale-up-ver': '{0%{transform:scale(1) rotateY(0)}50%{transform:scale(2.5) rotateY(90deg)}100%{transform:scale(1) rotateY(180deg)}}',
    'flip-scale-down-ver': '{0%{transform:scale(1) rotateY(0)}50%{transform:scale(.4) rotateY(-90deg)}100%{transform:scale(1) rotateY(-180deg)}}',
    'flip-scale-up-diag-1': '{0%{transform:scale(1) rotate3d(1,1,0,0deg)}50%{transform:scale(2.5) rotate3d(1,1,0,90deg)}100%{transform:scale(1) rotate3d(1,1,0,180deg)}}',
    'flip-scale-down-diag-1': '{0%{transform:scale(1) rotate3d(1,1,0,0deg)}50%{transform:scale(.4) rotate3d(1,1,0,-90deg)}100%{transform:scale(1) rotate3d(1,1,0,-180deg)}}',
    'flip-scale-up-diag-2': '{0%{transform:scale(1) rotate3d(-1,1,0,0deg)}50%{transform:scale(2.5) rotate3d(-1,1,0,90deg)}100%{transform:scale(1) rotate3d(-1,1,0,180deg)}}',
    'flip-scale-down-diag-2': '{0%{transform:scale(1) rotate3d(-1,1,0,0deg)}50%{transform:scale(.4) rotate3d(-1,1,0,-90deg)}100%{transform:scale(1) rotate3d(-1,1,0,-180deg)}}',
  }
  const duration = '.5s'
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
