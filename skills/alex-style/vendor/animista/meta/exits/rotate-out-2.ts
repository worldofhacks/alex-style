import type { Theme } from '@unocss/preset-mini'

export function rotateOut2Exits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'rotate-out-2-cw': '{0%{transform:rotate(0);opacity:1}100%{transform:rotate(45deg);opacity:0}}',
    'rotate-out-2-ccw': '{0%{transform:rotate(0);opacity:1}100%{transform:rotate(-45deg);opacity:0}}',
    'rotate-out-2-bck': '{0%{transform:translateZ(0) rotate(0);opacity:1}100%{transform:translateZ(-45rem) rotate(-45deg);opacity:0}}',
    'rotate-out-2-fwd': '{0%{transform:translateZ(0) rotate(0);opacity:1}100%{transform:translateZ(45rem) rotate(45deg);opacity:0}}',
    'rotate-out-2-tr-cw': '{0%{transform:rotate(0);transform-origin:100% 0;opacity:1}100%{transform:rotate(45deg);transform-origin:100% 0;opacity:0}}',
    'rotate-out-2-tr-ccw': '{0%{transform:rotate(0);transform-origin:100% 0;opacity:1}100%{transform:rotate(-45deg);transform-origin:100% 0;opacity:0}}',
    'rotate-out-2-br-cw': '{0%{transform:rotate(0);transform-origin:100% 100%;opacity:1}100%{transform:rotate(45deg);transform-origin:100% 100%;opacity:0}}',
    'rotate-out-2-br-ccw': '{0%{transform:rotate(0);transform-origin:100% 100%;opacity:1}100%{transform:rotate(-45deg);transform-origin:100% 100%;opacity:0}}',
    'rotate-out-2-bl-cw': '{0%{transform:rotate(0);transform-origin:0 100%;opacity:1}100%{transform:rotate(45deg);transform-origin:0 100%;opacity:0}}',
    'rotate-out-2-bl-ccw': '{0%{transform:rotate(0);transform-origin:0 100%;opacity:1}100%{transform:rotate(-45deg);transform-origin:0 100%;opacity:0}}',
    'rotate-out-2-tl-cw': '{0%{transform:rotate(0);transform-origin:0 0;opacity:1}100%{transform:rotate(45deg);transform-origin:0 0;opacity:0}}',
    'rotate-out-2-tl-ccw': '{0%{transform:rotate(0);transform-origin:0 0;opacity:1}100%{transform:rotate(-45deg);transform-origin:0 0;opacity:0}}',
  }
  const duration = '.6s'
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
