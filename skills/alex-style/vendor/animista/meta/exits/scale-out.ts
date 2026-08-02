import type { Theme } from '@unocss/preset-mini'

export function scaleOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'scale-out-center': '{0%{transform:scale(1);opacity:1}100%{transform:scale(0);opacity:1}}',
    'scale-out-top': '{0%{transform:scale(1);transform-origin:50% 0;opacity:1}100%{transform:scale(0);transform-origin:50% 0;opacity:1}}',
    'scale-out-tr': '{0%{transform:scale(1);transform-origin:100% 0;opacity:1}100%{transform:scale(0);transform-origin:100% 0;opacity:1}}',
    'scale-out-right': '{0%{transform:scale(1);transform-origin:100% 50%;opacity:1}100%{transform:scale(0);transform-origin:100% 50%;opacity:1}}',
    'scale-out-br': '{0%{transform:scale(1);transform-origin:100% 100%;opacity:1}100%{transform:scale(0);transform-origin:100% 100%;opacity:1}}',
    'scale-out-bottom': '{0%{transform:scale(1);transform-origin:50% 100%;opacity:1}100%{transform:scale(0);transform-origin:50% 100%;opacity:1}}',
    'scale-out-bl': '{0%{transform:scale(1);transform-origin:0 100%;opacity:1}100%{transform:scale(0);transform-origin:0 100%;opacity:1}}',
    'scale-out-left': '{0%{transform:scale(1);transform-origin:0 50%;opacity:1}100%{transform:scale(0);transform-origin:0 50%;opacity:1}}',
    'scale-out-tl': '{0%{transform:scale(1);transform-origin:0 0;opacity:1}100%{transform:scale(0);transform-origin:0 0;opacity:1}}',
    'scale-out-horizontal': '{0%{transform:scaleX(1);opacity:1}100%{transform:scaleX(0);opacity:1}}',
    'scale-out-hor-left': '{0%{transform:scaleX(1);transform-origin:0 0;opacity:1}100%{transform:scaleX(0);transform-origin:0 0;opacity:1}}',
    'scale-out-hor-right': '{0%{transform:scaleX(1);transform-origin:100% 100%;opacity:1}100%{transform:scaleX(0);transform-origin:100% 100%;opacity:1}}',
    'scale-out-vertical': '{0%{transform:scaleY(1);opacity:1}100%{transform:scaleY(0);opacity:1}}',
    'scale-out-ver-top': '{0%{transform:scaleY(1);transform-origin:100% 0;opacity:1}100%{transform:scaleY(0);transform-origin:100% 0;opacity:1}}',
    'scale-out-ver-bottom': '{0%{transform:scaleY(1);transform-origin:0 100%;opacity:1}100%{transform:scaleY(0);transform-origin:0 100%;opacity:1}}',
  }
  const duration = '.5s'
  const timingFns = 'cubic-bezier(.55,.085,.68,.53)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
