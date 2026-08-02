import type { Theme } from '@unocss/preset-mini'

export function swingInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'swing-in-top-fwd': '{0%{transform:rotateX(-100deg);transform-origin:top;opacity:0}100%{transform:rotateX(0deg);transform-origin:top;opacity:1}}',
    'swing-in-top-bck': '{0%{transform:rotateX(70deg);transform-origin:top;opacity:0}100%{transform:rotateX(0deg);transform-origin:top;opacity:1}}',
    'swing-in-right-fwd': '{0%{transform:rotateY(-100deg);transform-origin:right;opacity:0}100%{transform:rotateY(0);transform-origin:right;opacity:1}}',
    'swing-in-right-bck': '{0%{transform:rotateY(70deg);transform-origin:right;opacity:0}100%{transform:rotateY(0);transform-origin:right;opacity:1}}',
    'swing-in-bottom-fwd': '{0%{transform:rotateX(100deg);transform-origin:bottom;opacity:0}100%{transform:rotateX(0);transform-origin:bottom;opacity:1}}',
    'swing-in-bottom-bck': '{0%{transform:rotateX(-70deg);transform-origin:bottom;opacity:0}100%{transform:rotateX(0);transform-origin:bottom;opacity:1}}',
    'swing-in-left-fwd': '{0%{transform:rotateY(100deg);transform-origin:left;opacity:0}100%{transform:rotateY(0);transform-origin:left;opacity:1}}',
    'swing-in-left-bck': '{0%{transform:rotateY(-70deg);transform-origin:left;opacity:0}100%{transform:rotateY(0);transform-origin:left;opacity:1}}',
  }
  const duration = '.5s'
  const timingFns = 'cubic-bezier(.175,.885,.32,1.275)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
