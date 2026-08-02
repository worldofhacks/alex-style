import type { Theme } from '@unocss/preset-mini'

export function slideOutEllipticExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-out-elliptic-top-bck': '{0%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% 350rem;opacity:1}100%{transform:translateY(-150rem) rotateX(-30deg) scale(0);transform-origin:50% 100%;opacity:1}}',
    'slide-out-elliptic-top-fwd': '{0%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% -125rem;opacity:1}100%{transform:translateY(-150rem) rotateX(20deg) scale(6);transform-origin:50% 200%;opacity:0}}',
    'slide-out-elliptic-right-bck': '{0%{transform:translateX(0) rotateY(0) scale(1);transform-origin:-450rem 50%;opacity:1}100%{transform:translateX(250rem) rotateY(-30deg) scale(0);transform-origin:-100% 50%;opacity:1}}',
    'slide-out-elliptic-right-fwd': '{0%{transform:translateX(0) rotateY(0) scale(1);transform-origin:150rem 50%;opacity:1}100%{transform:translateX(250rem) rotateY(20deg) scale(6);transform-origin:-100% 50%;opacity:0}}',
    'slide-out-elliptic-bottom-bck': '{0%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% -350rem;opacity:1}100%{transform:translateY(150rem) rotateX(30deg) scale(0);transform-origin:50% 100%;opacity:1}}',
    'slide-out-elliptic-bottom-fwd': '{0%{transform:translateY(0) rotateX(0) scale(1);transform-origin:50% 125rem;opacity:1}100%{transform:translateY(150rem) rotateX(-20deg) scale(6);transform-origin:50% -100%;opacity:0}}',
    'slide-out-elliptic-left-bck': '{0%{transform:translateX(0) rotateY(0) scale(1);transform-origin:500rem 50%;opacity:1}100%{transform:translateX(-250rem) rotateY(30deg) scale(0);transform-origin:-100% 50%;opacity:1}}',
    'slide-out-elliptic-left-fwd': '{0%{transform:translateX(0) rotateY(0) scale(1);transform-origin:-125rem 50%;opacity:1}100%{transform:translateX(-250rem) rotateY(-20deg) scale(6);transform-origin:200% 50%;opacity:0}}',
  }
  const duration = '.7s'
  const timingFns = 'ease-in'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
