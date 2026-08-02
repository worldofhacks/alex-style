import type { Theme } from '@unocss/preset-mini'

export function swirlInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'swirl-in-fwd': '{0%{transform:rotate(-540deg) scale(0);opacity:0}100%{transform:rotate(0) scale(1);opacity:1}}',
    'swirl-in-bck': '{0%{transform:rotate(540deg) scale(5);opacity:0}100%{transform:rotate(0) scale(1);opacity:1}}',
    'swirl-in-top-fwd': '{0%{transform:rotate(-540deg) scale(0);transform-origin:50% 0;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:50% 0;opacity:1}}',
    'swirl-in-top-bck': '{0%{transform:rotate(540deg) scale(5);transform-origin:50% 0;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:50% 0;opacity:1}}',
    'swirl-in-tr-fwd': '{0%{transform:rotate(-540deg) scale(0);transform-origin:100% 0;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:100% 0;opacity:1}}',
    'swirl-in-tr-bck': '{0%{transform:rotate(540deg) scale(5);transform-origin:100% 0;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:100% 0;opacity:1}}',
    'swirl-in-right-fwd': '{0%{transform:rotate(-540deg) scale(0);transform-origin:100% 50%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:100% 50%;opacity:1}}',
    'swirl-in-right-bck': '{0%{transform:rotate(540deg) scale(5);transform-origin:100% 50%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:100% 50%;opacity:1}}',
    'swirl-in-br-fwd': '{0%{transform:rotate(-540deg) scale(0);transform-origin:100% 100%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:100% 100%;opacity:1}}',
    'swirl-in-br-bck': '{0%{transform:rotate(540deg) scale(5);transform-origin:100% 100%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:100% 100%;opacity:1}}',
    'swirl-in-bottom-fwd': '{0%{transform:rotate(-540deg) scale(0);transform-origin:50% 100%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:50% 100%;opacity:1}}',
    'swirl-in-bottom-bck': '{0%{transform:rotate(540deg) scale(5);transform-origin:50% 100%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:50% 100%;opacity:1}}',
    'swirl-in-bl-fwd': '{0%{transform:rotate(-540deg) scale(0);transform-origin:0 100%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:0 100%;opacity:1}}',
    'swirl-in-bl-bck': '{0%{transform:rotate(540deg) scale(5);transform-origin:0 100%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:0 100%;opacity:1}}',
    'swirl-in-left-fwd': '{0%{transform:rotate(-540deg) scale(0);transform-origin:0 50%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:0 50%;opacity:1}}',
    'swirl-in-left-bck': '{0%{transform:rotate(540deg) scale(5);transform-origin:0 50%;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:0 50%;opacity:1}}',
    'swirl-in-tl-fwd': '{0%{transform:rotate(-540deg) scale(0);transform-origin:0 0;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:0 0;opacity:1}}',
    'swirl-in-tl-bck': '{0%{transform:rotate(540deg) scale(5);transform-origin:0 0;opacity:0}100%{transform:rotate(0) scale(1);transform-origin:0 0;opacity:1}}',
  }
  const duration = '.6s'
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
