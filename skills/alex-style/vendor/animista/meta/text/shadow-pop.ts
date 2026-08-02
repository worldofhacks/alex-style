import type { Theme } from '@unocss/preset-mini'

export function shadowPopText(theme: Theme) {
  const keyframes: Record<string, string> = {
    'text-shadow-pop-top': '{0%{text-shadow:0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555;transform:translateY(0)}100%{text-shadow:0 -1px #555,0 -2px #555,0 -3px #555,0 -4px #555,0 -5px #555,0 -6px #555,0 -7px #555,0 -8px #555;transform:translateY(8px)}}',
    'text-shadow-pop-tr': '{0%{text-shadow:0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555;transform:translateX(0) translateY(0)}100%{text-shadow:1px -1px #555,2px -2px #555,3px -3px #555,4px -4px #555,5px -5px #555,6px -6px #555,7px -7px #555,8px -8px #555;transform:translateX(-8px) translateY(8px)}}',
    'text-shadow-pop-right': '{0%{text-shadow:0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555;transform:translateX(0)}100%{text-shadow:1px 0 #555,2px 0 #555,3px 0 #555,4px 0 #555,5px 0 #555,6px 0 #555,7px 0 #555,8px 0 #555;transform:translateX(-8px)}}',
    'text-shadow-pop-br': '{0%{text-shadow:0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555;transform:translateX(0) translateY(0)}100%{text-shadow:1px 1px #555,2px 2px #555,3px 3px #555,4px 4px #555,5px 5px #555,6px 6px #555,7px 7px #555,8px 8px #555;transform:translateX(-8px) translateY(-8px)}}',
    'text-shadow-pop-bottom': '{0%{text-shadow:0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555;transform:translateY(0)}100%{text-shadow:0 1px #555,0 2px #555,0 3px #555,0 4px #555,0 5px #555,0 6px #555,0 7px #555,0 8px #555;transform:translateY(-8px)}}',
    'text-shadow-pop-bl': '{0%{text-shadow:0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555;transform:translateX(0) translateY(0)}100%{text-shadow:-1px 1px #555,-2px 2px #555,-3px 3px #555,-4px 4px #555,-5px 5px #555,-6px 6px #555,-7px 7px #555,-8px 8px #555;transform:translateX(8px) translateY(-8px)}}',
    'text-shadow-pop-left': '{0%{text-shadow:0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555;transform:translateX(0)}100%{text-shadow:-1px 0 #555,-2px 0 #555,-3px 0 #555,-4px 0 #555,-5px 0 #555,-6px 0 #555,-7px 0 #555,-8px 0 #555;transform:translateX(8px)}}',
    'text-shadow-pop-tl': '{0%{text-shadow:0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555,0 0 #555;transform:translateX(0) translateY(0)}100%{text-shadow:-1px -1px #555,-2px -2px #555,-3px -3px #555,-4px -4px #555,-5px -5px #555,-6px -6px #555,-7px -7px #555,-8px -8px #555;transform:translateX(8px) translateY(8px)}}',
  }
  const duration = '.6s'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.mode![key] = mode
  }

  return theme
}
