import type { Theme } from '@unocss/preset-mini'
/**
 * https://animista.net/play/basic/scale-down
 */
export function scaleDownBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'scale-down-center': '{100%{transform:scale(.5)}0%{transform:scale(1)}}',
    'scale-down-top': '{100%{transform:scale(.5);transform-origin:50% 0}0%{transform:scale(1);transform-origin:50% 0}}',
    'scale-down-tr': '{100%{transform:scale(.5);transform-origin:100% 0}0%{transform:scale(1);transform-origin:100% 0}}',
    'scale-down-right': '{100%{transform:scale(.5);transform-origin:100% 50%}0%{transform:scale(1);transform-origin:100% 50%}}',
    'scale-down-br': '{100%{transform:scale(.5);transform-origin:100% 100%}0%{transform:scale(1);transform-origin:100% 100%}}',
    'scale-down-bottom': '{100%{transform:scale(.5);transform-origin:50% 100%}0%{transform:scale(1);transform-origin:50% 100%}}',
    'scale-down-bl': '{100%{transform:scale(.5);transform-origin:0 100%}0%{transform:scale(1);transform-origin:0 100%}}',
    'scale-down-left': '{100%{transform:scale(.5);transform-origin:0 50%}0%{transform:scale(1);transform-origin:0 50%}}',
    'scale-down-tl': '{100%{transform:scale(.5);transform-origin:0 0}0%{transform:scale(1);transform-origin:0 0}}',
    'scale-down-hor-center': '{100%{transform:scaleX(.4)}0%{transform:scaleX(1)}}',
    'scale-down-hor-left': '{100%{transform:scaleX(.4);transform-origin:0 0}0%{transform:scaleX(1);transform-origin:0 0}}',
    'scale-down-hor-right': '{100%{transform:scaleX(.4);transform-origin:100% 100%}0%{transform:scaleX(1);transform-origin:100% 100%}}',
    'scale-down-ver-center': '{100%{transform:scaleY(.4)}0%{transform:scaleY(1)}}',
    'scale-down-ver-top': '{100%{transform:scaleY(.4);transform-origin:100% 0}0%{transform:scaleY(1);transform-origin:100% 0}}',
    'scale-down-ver-bottom': '{100%{transform:scaleY(.4);transform-origin:0 100%}0%{transform:scaleY(1);transform-origin:0 100%}}',
  }
  const duration = '.4s'
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
