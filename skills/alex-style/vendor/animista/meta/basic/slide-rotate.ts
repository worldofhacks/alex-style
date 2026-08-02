import type { Theme } from '@unocss/preset-mini'

export function slideRotateBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-rotate-hor-top': '{0%{transform:translateY(0) rotateX(0deg)}100%{transform:translateY(-37.5rem) rotateX(-90deg)}}',
    'slide-rotate-hor-t-bck': '{0%{transform:translateY(0) translateZ(0) rotateX(0deg);transform-origin:top center}100%{transform:translateY(-37.5rem) translateZ(-57.5rem) rotateX(-90deg);transform-origin:top center}}',
    'slide-rotate-hor-t-fwd': '{0%{transform:translateY(0) translateZ(0) rotateX(0deg);transform-origin:bottom center}100%{transform:translateY(-37.5rem) translateZ(32.5rem) rotateX(-90deg);transform-origin:bottom center}}',
    'slide-rotate-ver-right': '{0%{transform:translateX(0) rotateY(0)}100%{transform:translateX(37.5rem) rotateY(-90deg)}}',
    'slide-rotate-ver-r-bck': '{0%{transform:translateX(0) translateZ(0) rotateY(0);transform-origin:center right}100%{transform:translateX(37.5rem) translateZ(-57.5rem) rotateY(-90deg);transform-origin:center right}}',
    'slide-rotate-ver-r-fwd': '{0%{transform:translateX(0) translateZ(0) rotateY(0);transform-origin:center left}100%{transform:translateX(37.5rem) translateZ(32.5rem) rotateY(-90deg);transform-origin:center left}}',
    'slide-rotate-hor-bottom': '{0%{transform:translateY(0) rotateX(0deg)}100%{transform:translateY(37.5rem) rotateX(90deg)}}',
    'slide-rotate-hor-b-bck': '{0%{transform:translateY(0) translateZ(0) rotateX(0deg);transform-origin:bottom center}100%{transform:translateY(37.5rem) translateZ(-57.5rem) rotateX(90deg);transform-origin:bottom center}}',
    'slide-rotate-hor-b-fwd': '{0%{transform:translateY(0) translateZ(0) rotateX(0deg);transform-origin:top center}100%{transform:translateY(37.5rem) translateZ(32.5rem) rotateX(90deg);transform-origin:top center}}',
    'slide-rotate-ver-left': '{0%{transform:translateX(0) rotateY(0)}100%{transform:translateX(-37.5rem) rotateY(90deg)}}',
    'slide-rotate-ver-l-bck': '{0%{transform:translateX(0) translateZ(0) rotateY(0);transform-origin:center left}100%{transform:translateX(-37.5rem) translateZ(-57.5rem) rotateY(90deg);transform-origin:center left}}',
    'slide-rotate-ver-l-fwd': '{0%{transform:translateX(0) translateZ(0) rotateY(0);transform-origin:center right}100%{transform:translateX(-37.5rem) translateZ(32.5rem) rotateY(90deg);transform-origin:center right}}',
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
