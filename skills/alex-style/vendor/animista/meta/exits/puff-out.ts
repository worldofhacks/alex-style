import type { Theme } from '@unocss/preset-mini'

export function puffOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'puff-out-center': '{0%{transform:scale(1);filter:blur(0);opacity:1}100%{transform:scale(2);filter:blur(1rem);opacity:0}}',
    'puff-out-top': '{0%{transform:scale(1);transform-origin:50% 0;filter:blur(0);opacity:1}100%{transform:scale(2);transform-origin:50% 0;filter:blur(1rem);opacity:0}}',
    'puff-out-tr': '{0%{transform:scale(1);transform-origin:100% 0;filter:blur(0);opacity:1}100%{transform:scale(2);transform-origin:100% 0;filter:blur(1rem);opacity:0}}',
    'puff-out-right': '{0%{transform:scale(1);transform-origin:100% 50%;filter:blur(0);opacity:1}100%{transform:scale(2);transform-origin:100% 50%;filter:blur(1rem);opacity:0}}',
    'puff-out-br': '{0%{transform:scale(1);transform-origin:100% 100%;filter:blur(0);opacity:1}100%{transform:scale(2);transform-origin:100% 100%;filter:blur(1rem);opacity:0}}',
    'puff-out-bottom': '{0%{transform:scale(1);transform-origin:50% 100%;filter:blur(0);opacity:1}100%{transform:scale(2);transform-origin:50% 100%;filter:blur(1rem);opacity:0}}',
    'puff-out-bl': '{0%{transform:scale(1);transform-origin:0 100%;filter:blur(0);opacity:1}100%{transform:scale(2);transform-origin:0 100%;filter:blur(1rem);opacity:0}}',
    'puff-out-left': '{0%{transform:scale(1);transform-origin:0 50%;filter:blur(0);opacity:1}100%{transform:scale(2);transform-origin:0 50%;filter:blur(1rem);opacity:0}}',
    'puff-out-tl': '{0%{transform:scale(1);transform-origin:0 0;filter:blur(0);opacity:1}100%{transform:scale(2);transform-origin:0 0;filter:blur(1rem);opacity:0}}',
    'puff-out-hor': '{0%{transform:scaleX(1);filter:blur(0);opacity:1}100%{transform:scaleX(2);filter:blur(1rem);opacity:0}}',
    'puff-out-ver': '{0%{transform:scaleY(1);filter:blur(0);opacity:1}100%{transform:scaleY(2);filter:blur(1rem);opacity:0}}',
  }
  const duration = '1s'
  const timingFns = 'cubic-bezier(.165,.84,.44,1.000)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
