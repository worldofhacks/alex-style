import type { Theme } from '@unocss/preset-mini'

export function popUpText(theme: Theme) {
  const keyframes: Record<string, string> = {
    'text-pop-up-top': '{0%{transform:translateY(0);transform-origin:50% 50%;text-shadow:none}100%{transform:translateY(-50px);transform-origin:50% 50%;text-shadow:0 1px 0 #ccc,0 2px 0 #ccc,0 3px 0 #ccc,0 4px 0 #ccc,0 5px 0 #ccc,0 6px 0 #ccc,0 7px 0 #ccc,0 8px 0 #ccc,0 9px 0 #ccc,0 50px 30px rgba(0,0,0,.3)}}',
    'text-pop-up-tr': '{0%{transform:translateY(0) translateX(0);transform-origin:50% 50%;text-shadow:none}100%{transform:translateY(-50px) translateX(50px);transform-origin:50% 50%;text-shadow:0 1px 0 #ccc,0 2px 0 #ccc,0 3px 0 #ccc,0 4px 0 #ccc,0 5px 0 #ccc,0 6px 0 #ccc,0 7px 0 #ccc,0 8px 0 #ccc,0 9px 0 #ccc,0 50px 30px rgba(0,0,0,.3)}}',
    'text-pop-up-right': '{0%{transform:translateX(0);transform-origin:50% 50%;text-shadow:none}100%{transform:translateX(50px);transform-origin:50% 50%;text-shadow:0 1px 0 #ccc,0 2px 0 #ccc,0 3px 0 #ccc,0 4px 0 #ccc,0 5px 0 #ccc,0 6px 0 #ccc,0 7px 0 #ccc,0 8px 0 #ccc,0 9px 0 #ccc,0 50px 30px rgba(0,0,0,.3)}}',
    'text-pop-up-br': '{0%{transform:translateY(0) translateX(0);transform-origin:50% 50%;text-shadow:none}100%{transform:translateY(50px) translateX(50px);transform-origin:50% 50%;text-shadow:0 1px 0 #ccc,0 2px 0 #ccc,0 3px 0 #ccc,0 4px 0 #ccc,0 5px 0 #ccc,0 6px 0 #ccc,0 7px 0 #ccc,0 8px 0 #ccc,0 9px 0 #ccc,0 50px 30px rgba(0,0,0,.3)}}',
    'text-pop-up-bottom': '{0%{transform:translateY(0);transform-origin:50% 50%;text-shadow:none}100%{transform:translateY(50px);transform-origin:50% 50%;text-shadow:0 1px 0 #ccc,0 2px 0 #ccc,0 3px 0 #ccc,0 4px 0 #ccc,0 5px 0 #ccc,0 6px 0 #ccc,0 7px 0 #ccc,0 8px 0 #ccc,0 9px 0 #ccc,0 50px 30px rgba(0,0,0,.3)}}',
    'text-pop-up-bl': '{0%{transform:translateY(0) translateX(0);transform-origin:50% 50%;text-shadow:none}100%{transform:translateY(50px) translateX(-50px);transform-origin:50% 50%;text-shadow:0 1px 0 #ccc,0 2px 0 #ccc,0 3px 0 #ccc,0 4px 0 #ccc,0 5px 0 #ccc,0 6px 0 #ccc,0 7px 0 #ccc,0 8px 0 #ccc,0 9px 0 #ccc,0 50px 30px rgba(0,0,0,.3)}}',
    'text-pop-up-left': '{0%{transform:translateX(0);transform-origin:50% 50%;text-shadow:none}100%{transform:translateX(-50px);transform-origin:50% 50%;text-shadow:0 1px 0 #ccc,0 2px 0 #ccc,0 3px 0 #ccc,0 4px 0 #ccc,0 5px 0 #ccc,0 6px 0 #ccc,0 7px 0 #ccc,0 8px 0 #ccc,0 9px 0 #ccc,0 50px 30px rgba(0,0,0,.3)}}',
    'text-pop-up-tl': '{0%{transform:translateY(0) translateX(0);transform-origin:50% 50%;text-shadow:none}100%{transform:translateY(-50px) translateX(-50px);transform-origin:50% 50%;text-shadow:0 1px 0 #ccc,0 2px 0 #ccc,0 3px 0 #ccc,0 4px 0 #ccc,0 5px 0 #ccc,0 6px 0 #ccc,0 7px 0 #ccc,0 8px 0 #ccc,0 9px 0 #ccc,0 50px 30px rgba(0,0,0,.3)}}',
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
