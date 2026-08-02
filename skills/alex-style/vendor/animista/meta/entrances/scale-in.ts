import type { Theme } from '@unocss/preset-mini'

export function scaleInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'scale-in-center': '{0%{transform:scale(0);opacity:1}100%{transform:scale(1);opacity:1}}',
    'scale-in-top': '{0%{transform:scale(0);transform-origin:50% 0;opacity:1}100%{transform:scale(1);transform-origin:50% 0;opacity:1}}',
    'scale-in-tr': '{0%{transform:scale(0);transform-origin:100% 0;opacity:1}100%{transform:scale(1);transform-origin:100% 0;opacity:1}}',
    'scale-in-right': '{0%{transform:scale(0);transform-origin:100% 50%;opacity:1}100%{transform:scale(1);transform-origin:100% 50%;opacity:1}}',
    'scale-in-br': '{0%{transform:scale(0);transform-origin:100% 100%;opacity:1}100%{transform:scale(1);transform-origin:100% 100%;opacity:1}}',
    'scale-in-bottom': '{0%{transform:scale(0);transform-origin:50% 100%;opacity:1}100%{transform:scale(1);transform-origin:50% 100%;opacity:1}}',
    'scale-in-bl': '{0%{transform:scale(0);transform-origin:0 100%;opacity:1}100%{transform:scale(1);transform-origin:0 100%;opacity:1}}',
    'scale-in-left': '{0%{transform:scale(0);transform-origin:0 50%;opacity:1}100%{transform:scale(1);transform-origin:0 50%;opacity:1}}',
    'scale-in-tl': '{0%{transform:scale(0);transform-origin:0 0;opacity:1}100%{transform:scale(1);transform-origin:0 0;opacity:1}}',
    'scale-in-hor-center': '{0%{transform:scaleX(0);opacity:1}100%{transform:scaleX(1);opacity:1}}',
    'scale-in-hor-left': '{0%{transform:scaleX(0);transform-origin:0 0;opacity:1}100%{transform:scaleX(1);transform-origin:0 0;opacity:1}}',
    'scale-in-hor-right': '{0%{transform:scaleX(0);transform-origin:100% 100%;opacity:1}100%{transform:scaleX(1);transform-origin:100% 100%;opacity:1}}',
    'scale-in-ver-center': '{0%{transform:scaleY(0);opacity:1}100%{transform:scaleY(1);opacity:1}}',
    'scale-in-ver-top': '{0%{transform:scaleY(0);transform-origin:100% 0;opacity:1}100%{transform:scaleY(1);transform-origin:100% 0;opacity:1}}',
    'scale-in-ver-bottom': '{0%{transform:scaleY(0);transform-origin:0 100%;opacity:1}100%{transform:scaleY(1);transform-origin:0 100%;opacity:1}}',

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
