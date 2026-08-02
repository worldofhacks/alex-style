import type { Theme } from '@unocss/preset-mini'

export function scaleUpBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'scale-up-center': '{0%{transform:scale(.5)}100%{transform:scale(1)}}',
    'scale-up-top': '{0%{transform:scale(.5);transform-origin:50% 0}100%{transform:scale(1);transform-origin:50% 0}}',
    'scale-up-tr': '{0%{transform:scale(.5);transform-origin:100% 0}100%{transform:scale(1);transform-origin:100% 0}}',
    'scale-up-right': '{0%{transform:scale(.5);transform-origin:100% 50%}100%{transform:scale(1);transform-origin:100% 50%}}',
    'scale-up-br': '{0%{transform:scale(.5);transform-origin:100% 100%}100%{transform:scale(1);transform-origin:100% 100%}}',
    'scale-up-bottom': '{0%{transform:scale(.5);transform-origin:50% 100%}100%{transform:scale(1);transform-origin:50% 100%}}',
    'scale-up-bl': '{0%{transform:scale(.5);transform-origin:0 100%}100%{transform:scale(1);transform-origin:0 100%}}',
    'scale-up-left': '{0%{transform:scale(.5);transform-origin:0 50%}100%{transform:scale(1);transform-origin:0 50%}}',
    'scale-up-tl': '{0%{transform:scale(.5);transform-origin:0 0}100%{transform:scale(1);transform-origin:0 0}}',
    'scale-up-hor-center': '{0%{transform:scaleX(.4)}100%{transform:scaleX(1)}}',
    'scale-up-hor-left': '{0%{transform:scaleX(.4);transform-origin:0 0}100%{transform:scaleX(1);transform-origin:0 0}}',
    'scale-up-hor-right': '{0%{transform:scaleX(.4);transform-origin:100% 100%}100%{transform:scaleX(1);transform-origin:100% 100%}}',
    'scale-up-ver-center': '{0%{transform:scaleY(.4)}100%{transform:scaleY(1)}}',
    'scale-up-ver-top': '{0%{transform:scaleY(.4);transform-origin:100% 0}100%{transform:scaleY(1);transform-origin:100% 0}}',
    'scale-up-ver-bottom': '{0%{transform:scaleY(.4);transform-origin:0 100%}100%{transform:scaleY(1);transform-origin:0 100%}}',
  }
  const duration = '.4s'
  const timingFns = 'cubic-bezier(0.39, 0.575, 0.565, 1)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
