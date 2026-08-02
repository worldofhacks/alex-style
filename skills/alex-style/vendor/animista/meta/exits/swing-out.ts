import type { Theme } from '@unocss/preset-mini'

export function swingOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'swing-out-top-bck': '{0%{transform:rotateX(0deg);transform-origin:top;opacity:1}100%{transform:rotateX(-100deg);transform-origin:top;opacity:0}}',
    'swing-out-top-fwd': '{0%{transform:rotateX(0deg);transform-origin:top;opacity:1}100%{transform:rotateX(70deg);transform-origin:top;opacity:0}}',
    'swing-out-right-bck': '{0%{transform:rotateY(0);transform-origin:right;opacity:1}100%{transform:rotateY(-100deg);transform-origin:right;opacity:0}}',
    'swing-out-right-fwd': '{0%{transform:rotateY(0);transform-origin:right;opacity:1}100%{transform:rotateY(70deg);transform-origin:right;opacity:0}}',
    'swing-out-bottom-bck': '{0%{transform:rotateX(0);transform-origin:bottom;opacity:1}100%{transform:rotateX(100deg);transform-origin:bottom;opacity:0}}',
    'swing-out-bottom-fwd': '{0%{transform:rotateX(0);transform-origin:bottom;opacity:1}100%{transform:rotateX(-70deg);transform-origin:bottom;opacity:0}}',
    'swing-out-left-bck': '{0%{transform:rotateY(0);transform-origin:left;opacity:1}100%{transform:rotateY(100deg);transform-origin:left;opacity:0}}',
    'swing-out-left-fwd': '{0%{transform:rotateY(0);transform-origin:left;opacity:1}100%{transform:rotateY(-70deg);transform-origin:left;opacity:0}}',
  }
  const duration = '.45s'
  const timingFns = 'cubic-bezier(.6,-.28,.735,.045)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
