import type { Theme } from '@unocss/preset-mini'

export function puffInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'puff-in-center': '{0%{transform:scale(2);filter:blur(1rem);opacity:0}100%{transform:scale(1);filter:blur(0);opacity:1}}',
    'puff-in-top': '{0%{transform:scale(2);transform-origin:50% 0;filter:blur(1rem);opacity:0}100%{transform:scale(1);transform-origin:50% 0;filter:blur(0);opacity:1}}',
    'puff-in-tr': '{0%{transform:scale(2);transform-origin:100% 0;filter:blur(1rem);opacity:0}100%{transform:scale(1);transform-origin:100% 0;filter:blur(0);opacity:1}}',
    'puff-in-right': '{0%{transform:scale(2);transform-origin:100% 50%;filter:blur(1rem);opacity:0}100%{transform:scale(1);transform-origin:100% 50%;filter:blur(0);opacity:1}}',
    'puff-in-br': '{0%{transform:scale(2);transform-origin:100% 100%;filter:blur(1rem);opacity:0}100%{transform:scale(1);transform-origin:100% 100%;filter:blur(0);opacity:1}}',
    'puff-in-bottom': '{0%{transform:scale(2);transform-origin:50% 100%;filter:blur(1rem);opacity:0}100%{transform:scale(1);transform-origin:50% 100%;filter:blur(0);opacity:1}}',
    'puff-in-bl': '{0%{transform:scale(2);transform-origin:0 100%;filter:blur(1rem);opacity:0}100%{transform:scale(1);transform-origin:0 100%;filter:blur(0);opacity:1}}',
    'puff-in-left': '{0%{transform:scale(2);transform-origin:0 50%;filter:blur(1rem);opacity:0}100%{transform:scale(1);transform-origin:0 50%;filter:blur(0);opacity:1}}',
    'puff-in-tl': '{0%{transform:scale(2);transform-origin:0 0;filter:blur(1rem);opacity:0}100%{transform:scale(1);transform-origin:0 0;filter:blur(0);opacity:1}}',
    'puff-in-hor': '{0%{transform:scaleX(2);filter:blur(1rem);opacity:0}100%{transform:scaleX(1);filter:blur(0);opacity:1}}',
    'puff-in-ver': '{0%{transform:scaleY(2);filter:blur(1rem);opacity:0}100%{transform:scaleY(1);filter:blur(0);opacity:1}}',
  }
  const duration = '.7s'
  const timingFns = 'cubic-bezier(.47,0.000,.745,.715)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
