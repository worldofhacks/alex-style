import type { Theme } from '@unocss/preset-mini'

export function rotateIn2Entrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'rotate-in-2-cw': '{0%{transform:rotate(-45deg);opacity:0}100%{transform:rotate(0);opacity:1}}',
    'rotate-in-2-ccw': '{0%{transform:rotate(45deg);opacity:0}100%{transform:rotate(0);opacity:1}}',
    'rotate-in-2-fwd-cw': '{0%{transform:translateZ(-50rem) rotate(-45deg);opacity:0}100%{transform:translateZ(0) rotate(0);opacity:1}}',
    'rotate-in-2-fwd-ccw': '{0%{transform:translateZ(-50rem) rotate(45deg);opacity:0}100%{transform:translateZ(0) rotate(0);opacity:1}}',
    'rotate-in-2-bck-cw': '{0%{transform:translateZ(50rem) rotate(-45deg);opacity:0}100%{transform:translateZ(0) rotate(0);opacity:1}}',
    'rotate-in-2-bck-ccw': '{0%{transform:translateZ(50rem) rotate(45deg);opacity:0}100%{transform:translateZ(0) rotate(0);opacity:1}}',
    'rotate-in-2-tr-cw': '{0%{transform:rotate(-45deg);transform-origin:100% 0;opacity:0}100%{transform:rotate(0);transform-origin:100% 0;opacity:1}}',
    'rotate-in-2-tr-ccw': '{0%{transform:rotate(45deg);transform-origin:100% 0;opacity:0}100%{transform:rotate(0);transform-origin:100% 0;opacity:1}}',
    'rotate-in-2-br-cw': '{0%{transform:rotate(-45deg);transform-origin:100% 100%;opacity:0}100%{transform:rotate(0);transform-origin:100% 100%;opacity:1}}',
    'rotate-in-2-br-ccw': '{0%{transform:rotate(45deg);transform-origin:100% 100%;opacity:0}100%{transform:rotate(0);transform-origin:100% 100%;opacity:1}}',
    'rotate-in-2-bl-cw': '{0%{transform:rotate(-45deg);transform-origin:0 100%;opacity:0}100%{transform:rotate(0);transform-origin:0 100%;opacity:1}}',
    'rotate-in-2-bl-ccw': '{0%{transform:rotate(45deg);transform-origin:0 100%;opacity:0}100%{transform:rotate(0);transform-origin:0 100%;opacity:1}}',
    'rotate-in-2-tl-cw': '{0%{transform:rotate(-45deg);transform-origin:0 0;opacity:0}100%{transform:rotate(0);transform-origin:0 0;opacity:1}}',
    'rotate-in-2-tl-ccw': '{0%{transform:rotate(45deg);transform-origin:0 0;opacity:0}100%{transform:rotate(0);transform-origin:0 0;opacity:1}}',
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
