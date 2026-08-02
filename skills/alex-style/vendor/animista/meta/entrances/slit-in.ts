import type { Theme } from '@unocss/preset-mini'

export function slitInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slit-in-vertical': '{0%{transform:translateZ(-200rem) rotateY(90deg);opacity:0}54%{transform:translateZ(-40rem) rotateY(87deg);opacity:1}100%{transform:translateZ(0) rotateY(0)}}',
    'slit-in-horizontal': '{0%{transform:translateZ(-200rem) rotateX(90deg);opacity:0}54%{transform:translateZ(-40rem) rotateX(87deg);opacity:1}100%{transform:translateZ(0) rotateX(0)}}',
    'slit-in-diagonal-1': '{0%{transform:translateZ(-200rem) rotate3d(1,1,0,90deg);animation-timing-function:ease-in;opacity:0}54%{transform:translateZ(-40rem) rotate3d(1,1,0,87deg);animation-timing-function:ease-in-out;opacity:1}100%{transform:translateZ(0) rotate3d(1,1,0,0);animation-timing-function:ease-out}}',
    'slit-in-diagonal-2': '{0%{transform:translateZ(-200rem) rotate3d(-1,1,0,-90deg);animation-timing-function:ease-in;opacity:0}54%{transform:translateZ(-40rem) rotate3d(-1,1,0,-87deg);animation-timing-function:ease-in-out;opacity:1}100%{transform:translateZ(0) rotate3d(-1,1,0,0);animation-timing-function:ease-out}}',
  }
  const duration = '.45s'
  const timingFns = 'ease-out'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
