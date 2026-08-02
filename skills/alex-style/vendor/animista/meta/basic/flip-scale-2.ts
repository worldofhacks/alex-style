import type { Theme } from '@unocss/preset-mini'

export function flipScale2Basic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'flip-scale-2-hor-top': '{0%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% 0}50%{transform:translateY(-50%) rotateX(-90deg) scale(2);transform-origin:50% 50%}100%{transform:translateY(-100%) rotateX(-180deg) scale(1);transform-origin:50% 100%}}',
    'flip-scale-2-ver-right': '{0%{transform:translateX(0) rotateY(0) scale(1);transform-origin:100% 50%}50%{transform:translateX(50%) rotateY(-90deg) scale(2);transform-origin:50% 50%}100%{transform:translateX(100%) rotateY(-180deg) scale(1);transform-origin:0 50%}}',
    'flip-scale-2-hor-bottom': '{0%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% 100%}50%{transform:translateY(50%) rotateX(90deg) scale(2);transform-origin:50% 50%}100%{transform:translateY(100%) rotateX(180deg) scale(1);transform-origin:50% 0}}',
    'flip-scale-2-ver-left': '{0%{transform:translateX(0) rotateY(0) scale(1);transform-origin:0 50%}50%{transform:translateX(-50%) rotateY(90deg) scale(2);transform-origin:50% 50%}100%{transform:translateX(-100%) rotateY(180deg) scale(1);transform-origin:100% 50%}}',
  }
  const duration = '.5s'
  const timingFns = 'linear'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
