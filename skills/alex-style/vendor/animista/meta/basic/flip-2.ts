import type { Theme } from '@unocss/preset-mini'

export function flip2Basic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'flip-2-hor-top-1': '{0%{transform:translateY(0) rotateX(0);transform-origin:50% 0}100%{transform:translateY(-100%) rotateX(-180deg);transform-origin:50% 100%}}',
    'flip-2-hor-top-2': '{0%{transform:translateY(0) rotateX(0);transform-origin:50% 0}100%{transform:translateY(-100%) rotateX(180deg);transform-origin:50% 100%}}',
    'flip-2-hor-top-bck': '{0%{transform:translateY(0) translateZ(0) rotateX(0);transform-origin:50% 0}100%{transform:translateY(-100%) translateZ(-65rem) rotateX(180deg);transform-origin:50% 100%}}',
    'flip-2-hor-top-fwd': '{0%{transform:translateY(0) translateZ(0) rotateX(0);transform-origin:50% 0}100%{transform:translateY(-100%) translateZ(40rem) rotateX(-180deg);transform-origin:50% 100%}}',
    'flip-2-ver-right-1': '{0%{transform:translateX(0) rotateY(0);transform-origin:100% 50%}100%{transform:translateX(100%) rotateY(-180deg);transform-origin:0 50%}}',
    'flip-2-ver-right-2': '{0%{transform:translateX(0) rotateY(0);transform-origin:100% 50%}100%{transform:translateX(100%) rotateY(180deg);transform-origin:0 50%}}',
    'flip-2-ver-right-bck': '{0%{transform:translateX(0) translateZ(0) rotateY(0);transform-origin:100% 50%}100%{transform:translateX(100%) translateZ(-65rem) rotateY(180deg);transform-origin:0 50%}}',
    'flip-2-ver-right-fwd': '{0%{transform:translateX(0) translateZ(0) rotateY(0);transform-origin:100% 50%}100%{transform:translateX(100%) translateZ(40rem) rotateY(-180deg);transform-origin:0 50%}}',
    'flip-2-hor-bottom-1': '{0%{transform:translateY(0) rotateX(0);transform-origin:50% 100%}100%{transform:translateY(100%) rotateX(180deg);transform-origin:50% 0}}',
    'flip-2-hor-bottom-2': '{0%{transform:translateY(0) rotateX(0);transform-origin:50% 100%}100%{transform:translateY(100%) rotateX(-180deg);transform-origin:50% 0}}',
    'flip-2-hor-bottom-bck': '{0%{transform:translateY(0) translateZ(0) rotateX(0);transform-origin:50% 100%}100%{transform:translateY(100%) translateZ(-65rem) rotateX(-180deg);transform-origin:50% 0}}',
    'flip-2-hor-bottom-fwd': '{0%{transform:translateY(0) translateZ(0) rotateX(0);transform-origin:50% 100%}100%{transform:translateY(100%) translateZ(40rem) rotateX(180deg);transform-origin:50% 0}}',
    'flip-2-ver-left-1': '{0%{transform:translateX(0) rotateY(0);transform-origin:0 50%}100%{transform:translateX(-100%) rotateY(180deg);transform-origin:100% 0}}',
    'flip-2-ver-left-2': '{0%{transform:translateX(0) rotateY(0);transform-origin:0 50%}100%{transform:translateX(-100%) rotateY(-180deg);transform-origin:100% 0}}',
    'flip-2-ver-left-bck': '{0%{transform:translateX(0) translateZ(0) rotateY(0);transform-origin:0 50%}100%{transform:translateX(-100%) translateZ(-65rem) rotateY(-180deg);transform-origin:100% 0}}',
    'flip-2-ver-left-fwd': '{0%{transform:translateX(0) translateZ(0) rotateY(0);transform-origin:0 50%}100%{transform:translateX(-100%) translateZ(40rem) rotateY(180deg);transform-origin:100% 0}}',
  }
  const duration = '.5s'
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
