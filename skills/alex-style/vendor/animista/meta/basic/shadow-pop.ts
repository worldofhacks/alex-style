import type { Theme } from '@unocss/preset-mini'

export function shadowPopBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'shadow-pop-tr': '{0%{box-shadow:0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e;transform:translateX(0) translateY(0)}100%{box-shadow:1px -1px #3e3e3e,2px -2px #3e3e3e,3px -3px #3e3e3e,4px -4px #3e3e3e,5px -5px #3e3e3e,6px -6px #3e3e3e,7px -7px #3e3e3e,8px -8px #3e3e3e;transform:translateX(-8px) translateY(8px)}}',
    'shadow-pop-br': '{0%{box-shadow:0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e;transform:translateX(0) translateY(0)}100%{box-shadow:1px 1px #3e3e3e,2px 2px #3e3e3e,3px 3px #3e3e3e,4px 4px #3e3e3e,5px 5px #3e3e3e,6px 6px #3e3e3e,7px 7px #3e3e3e,8px 8px #3e3e3e;transform:translateX(-8px) translateY(-8px)}}',
    'shadow-pop-bl': '{0%{box-shadow:0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e;transform:translateX(0) translateY(0)}100%{box-shadow:-1px 1px #3e3e3e,-2px 2px #3e3e3e,-3px 3px #3e3e3e,-4px 4px #3e3e3e,-5px 5px #3e3e3e,-6px 6px #3e3e3e,-7px 7px #3e3e3e,-8px 8px #3e3e3e;transform:translateX(8px) translateY(-8px)}}',
    'shadow-pop-tl': '{0%{box-shadow:0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e,0 0 #3e3e3e;transform:translateX(0) translateY(0)}100%{box-shadow:-1px -1px #3e3e3e,-2px -2px #3e3e3e,-3px -3px #3e3e3e,-4px -4px #3e3e3e,-5px -5px #3e3e3e,-6px -6px #3e3e3e,-7px -7px #3e3e3e,-8px -8px #3e3e3e;transform:translateX(8px) translateY(8px)}}',
  }
  const duration = '.3s'
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
