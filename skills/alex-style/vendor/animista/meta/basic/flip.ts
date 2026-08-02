import type { Theme } from '@unocss/preset-mini'

export function flipBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'flip-horizontal-bottom': '{0%{transform:rotateX(0)}100%{transform:rotateX(-180deg)}}',
    'flip-horizontal-top': '{0%{transform:rotateX(0)}100%{transform:rotateX(180deg)}}',
    'flip-horizontal-bck': '{0%{transform:translateZ(0) rotateX(0)}100%{transform:translateZ(-65rem) rotateX(180deg)}}',
    'flip-horizontal-fwd': '{0%{transform:translateZ(0) rotateX(0)}100%{transform:translateZ(40rem) rotateX(-180deg)}}',
    'flip-vertical-right': '{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}',
    'flip-vertical-left': '{0%{transform:rotateY(0)}100%{transform:rotateY(-180deg)}}',
    'flip-vertical-bck': '{0%{transform:translateZ(0) rotateY(0)}100%{transform:translateZ(-65rem) rotateY(-180deg)}}',
    'flip-vertical-fwd': '{0%{transform:translateZ(0) rotateY(0)}100%{transform:translateZ(40rem) rotateY(180deg)}}',
    'flip-diagonal-1-tr': '{0%{transform:rotate3d(1,1,0,0deg)}100%{transform:rotate3d(1,1,0,180deg)}}',
    'flip-diagonal-1-bl': '{0%{transform:rotate3d(1,1,0,0deg)}100%{transform:rotate3d(1,1,0,-180deg)}}',
    'flip-diagonal-1-bck': '{0%{transform:translateZ(0) rotate3d(1,1,0,0deg)}100%{transform:translateZ(-65rem) rotate3d(1,1,0,-180deg)}}',
    'flip-diagonal-1-fwd': '{0%{transform:translateZ(0) rotate3d(1,1,0,0deg)}100%{transform:translateZ(40rem) rotate3d(1,1,0,180deg)}}',
    'flip-diagonal-2-br': '{0%{transform:rotate3d(-1,1,0,0deg)}100%{transform:rotate3d(-1,1,0,180deg)}}',
    'flip-diagonal-2-tl': '{0%{transform:rotate3d(-1,1,0,0deg)}100%{transform:rotate3d(-1,1,0,-180deg)}}',
    'flip-diagonal-2-bck': '{0%{transform:translateZ(0) rotate3d(-1,1,0,0deg)}100%{transform:translateZ(-65rem) rotate3d(-1,1,0,-180deg)}}',
    'flip-diagonal-2-fwd': '{0%{transform:translateZ(0) rotate3d(-1,1,0,0deg)}100%{transform:translateZ(40rem) rotate3d(-1,1,0,180deg)}}',
  }
  const duration = '.4s'
  const timingFns = 'cubic-bezier(.455,.03,.515,.955)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
