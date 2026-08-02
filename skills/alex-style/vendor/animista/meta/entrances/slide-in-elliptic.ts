import type { Theme } from '@unocss/preset-mini'

export function slideInEllipticEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-in-elliptic-top-fwd': '{0%{transform:translateY(-150rem) rotateX(-30deg) scale(0);transform-origin:50% 100%;opacity:0}100%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% 1400px;opacity:1}}',
    'slide-in-elliptic-top-bck': '{0%{transform:translateY(-150rem) rotateX(30deg) scale(6.5);transform-origin:50% 200%;opacity:0}100%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% -500px;opacity:1}}',
    'slide-in-elliptic-right-fwd': '{0%{transform:translateX(200rem) rotateY(-30deg) scale(0);transform-origin:-100% 50%;opacity:0}100%{transform:translateX(0) rotateY(0) scale(1);transform-origin:-1200rem 50%;opacity:1}}',
    'slide-in-elliptic-right-bck': '{0%{transform:translateX(200rem) rotateY(30deg) scale(6.5);transform-origin:-100% 50%;opacity:0}100%{transform:translateX(0) rotateY(0) scale(1);transform-origin:150rem 50%;opacity:1}}',
    'slide-in-elliptic-bottom-fwd': '{0%{transform:translateY(150rem) rotateX(30deg) scale(0);transform-origin:50% 100%;opacity:0}100%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% -1400px;opacity:1}}',
    'slide-in-elliptic-bottom-bck': '{0%{transform:translateY(150rem) rotateX(-30deg) scale(6.5);transform-origin:50% -100%;opacity:0}100%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% 500px;opacity:1}}',
    'slide-in-elliptic-left-fwd': '{0%{transform:translateX(-200rem) rotateY(30deg) scale(0);transform-origin:-100% 50%;opacity:0}100%{transform:translateX(0) rotateY(0) scale(1);transform-origin:1200rem 50%;opacity:1}}',
    'slide-in-elliptic-left-bck': '{0%{transform:translateX(-200rem) rotateY(-30deg) scale(6.5);transform-origin:200% 50%;opacity:0}100%{transform:translateX(0) rotateY(0) scale(1);transform-origin:-150rem 50%;opacity:1}}',
  }
  const duration = '.7s'
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
