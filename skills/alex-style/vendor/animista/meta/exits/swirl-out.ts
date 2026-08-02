import type { Theme } from '@unocss/preset-mini'

export function swirlOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'swirl-out-bck': '{0%{transform:rotate(0) scale(1);opacity:1}100%{transform:rotate(-540deg) scale(0);opacity:0}}',
    'swirl-out-fwd': '{0%{transform:rotate(0) scale(1);opacity:1}100%{transform:rotate(540deg) scale(5);opacity:0}}',
    'swirl-out-top-bck': '{0%{transform:rotate(0) scale(1);transform-origin:50% 0;opacity:1}100%{transform:rotate(-540deg) scale(0);transform-origin:50% 0;opacity:0}}',
    'swirl-out-top-fwd': '{0%{transform:rotate(0) scale(1);transform-origin:50% 0;opacity:1}100%{transform:rotate(540deg) scale(5);transform-origin:50% 0;opacity:0}}',
    'swirl-out-tr-bck': '{0%{transform:rotate(0) scale(1);transform-origin:100% 0;opacity:1}100%{transform:rotate(-540deg) scale(0);transform-origin:100% 0;opacity:0}}',
    'swirl-out-tr-fwd': '{0%{transform:rotate(0) scale(1);transform-origin:100% 0;opacity:1}100%{transform:rotate(540deg) scale(5);transform-origin:100% 0;opacity:0}}',
    'swirl-out-right-bck': '{0%{transform:rotate(0) scale(1);transform-origin:100% 50%;opacity:1}100%{transform:rotate(-540deg) scale(0);transform-origin:100% 50%;opacity:0}}',
    'swirl-out-right-fwd': '{0%{transform:rotate(0) scale(1);transform-origin:100% 50%;opacity:1}100%{transform:rotate(540deg) scale(5);transform-origin:100% 50%;opacity:0}}',
    'swirl-out-br-bck': '{0%{transform:rotate(0) scale(1);transform-origin:100% 100%;opacity:1}100%{transform:rotate(-540deg) scale(0);transform-origin:100% 100%;opacity:0}}',
    'swirl-out-br-fwd': '{0%{transform:rotate(0) scale(1);transform-origin:100% 100%;opacity:1}100%{transform:rotate(540deg) scale(5);transform-origin:100% 100%;opacity:0}}',
    'swirl-out-bottom-bck': '{0%{transform:rotate(0) scale(1);transform-origin:50% 100%;opacity:1}100%{transform:rotate(-540deg) scale(0);transform-origin:50% 100%;opacity:0}}',
    'swirl-out-bottom-fwd': '{0%{transform:rotate(0) scale(1);transform-origin:50% 100%;opacity:1}100%{transform:rotate(540deg) scale(5);transform-origin:50% 100%;opacity:0}}',
    'swirl-out-bl-bck': '{0%{transform:rotate(0) scale(1);transform-origin:0 100%;opacity:1}100%{transform:rotate(-540deg) scale(0);transform-origin:0 100%;opacity:0}}',
    'swirl-out-bl-fwd': '{0%{transform:rotate(0) scale(1);transform-origin:0 100%;opacity:1}100%{transform:rotate(540deg) scale(5);transform-origin:0 100%;opacity:0}}',
    'swirl-out-left-bck': '{0%{transform:rotate(0) scale(1);transform-origin:0 50%;opacity:1}100%{transform:rotate(-540deg) scale(0);transform-origin:0 50%;opacity:0}}',
    'swirl-out-left-fwd': '{0%{transform:rotate(0) scale(1);transform-origin:0 50%;opacity:1}100%{transform:rotate(540deg) scale(5);transform-origin:0 50%;opacity:0}}',
    'swirl-out-tl-bck': '{0%{transform:rotate(0) scale(1);transform-origin:0 0;opacity:1}100%{transform:rotate(-540deg) scale(0);transform-origin:0 0;opacity:0}}',
    'swirl-out-tl-fwd': '{0%{transform:rotate(0) scale(1);transform-origin:0 0;opacity:1}100%{transform:rotate(720deg) scale(5);transform-origin:0 0;opacity:0}}',
  }
  const duration = '.6s'
  const timingFns = 'ease-in)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
