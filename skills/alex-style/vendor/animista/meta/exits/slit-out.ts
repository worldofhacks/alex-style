import type { Theme } from '@unocss/preset-mini'

export function slitOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slit-out-vertical': '{0%{transform:translateZ(0) rotateY(0);opacity:1}54%{transform:translateZ(-40rem) rotateY(87deg);opacity:1}100%{transform:translateZ(-200rem) rotateY(90deg);opacity:0}}',
    'slit-out-horizontal': '{0%{transform:translateZ(0) rotateX(0);opacity:1}54%{transform:translateZ(-40rem) rotateX(87deg);opacity:1}100%{transform:translateZ(-200rem) rotateX(90deg);opacity:0}}',
    'slit-out-diagonal-1': '{0%{transform:translateZ(0) rotate3d(1,1,0,0);opacity:1}54%{transform:translateZ(-40rem) rotate3d(1,1,0,87deg);opacity:1}100%{transform:translateZ(-200rem) rotate3d(1,1,0,90deg);opacity:0}}',
    'slit-out-diagonal-2': '{0%{transform:translateZ(0) rotate3d(-1,1,0,0);opacity:1}54%{transform:translateZ(-40rem) rotate3d(-1,1,0,-87deg);opacity:1}100%{transform:translateZ(-200rem) rotate3d(-1,1,0,-90deg);opacity:0}}',
  }
  const duration = '.5s'
  const timingFns = 'ease-in'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
