import type { Theme } from '@unocss/preset-mini'

export function shakeAttention(theme: Theme) {
  const keyframes: Record<string, string> = {
    'shake-horizontal': '{0%,100%{transform:translateX(0)}10%,30%,50%,70%{transform:translateX(-2.5rem)}20%,40%,60%{transform:translateX(2.5rem)}80%{transform:translateX(2rem)}90%{transform:translateX(-2rem)}}',
    'shake-vertical': '{0%,100%{transform:translateY(0)}10%,30%,50%,70%{transform:translateY(-2rem)}20%,40%,60%{transform:translateY(2rem)}80%{transform:translateY(1.6rem)}90%{transform:translateY(-1.6rem)}}',
    'shake-lr': '{0%,100%{transform:rotate(0deg);transform-origin:50% 50%}10%{transform:rotate(8deg)}20%,40%,60%{transform:rotate(-10deg)}30%,50%,70%{transform:rotate(10deg)}80%{transform:rotate(-8deg)}90%{transform:rotate(8deg)}}',
    'shake-top': '{0%,100%{transform:rotate(0deg);transform-origin:50% 0}10%{transform:rotate(2deg)}20%,40%,60%{transform:rotate(-4deg)}30%,50%,70%{transform:rotate(4deg)}80%{transform:rotate(-2deg)}90%{transform:rotate(2deg)}}',
    'shake-tr': '{0%,100%{transform:rotate(0deg);transform-origin:100% 0}10%{transform:rotate(2deg)}20%,40%,60%{transform:rotate(-4deg)}30%,50%,70%{transform:rotate(4deg)}80%{transform:rotate(-2deg)}90%{transform:rotate(2deg)}}',
    'shake-right': '{0%,100%{transform:rotate(0deg);transform-origin:100% 50%}10%{transform:rotate(2deg)}20%,40%,60%{transform:rotate(-4deg)}30%,50%,70%{transform:rotate(4deg)}80%{transform:rotate(-2deg)}90%{transform:rotate(2deg)}}',
    'shake-br': '{0%,100%{transform:rotate(0deg);transform-origin:100% 100%}10%{transform:rotate(2deg)}20%,40%,60%{transform:rotate(-4deg)}30%,50%,70%{transform:rotate(4deg)}80%{transform:rotate(-2deg)}90%{transform:rotate(2deg)}}',
    'shake-bottom': '{0%,100%{transform:rotate(0deg);transform-origin:50% 100%}10%{transform:rotate(2deg)}20%,40%,60%{transform:rotate(-4deg)}30%,50%,70%{transform:rotate(4deg)}80%{transform:rotate(-2deg)}90%{transform:rotate(2deg)}}',
    'shake-bl': '{0%,100%{transform:rotate(0deg);transform-origin:0 100%}10%{transform:rotate(2deg)}20%,40%,60%{transform:rotate(-4deg)}30%,50%,70%{transform:rotate(4deg)}80%{transform:rotate(-2deg)}90%{transform:rotate(2deg)}}',
    'shake-left': '{0%,100%{transform:rotate(0deg);transform-origin:0 50%}10%{transform:rotate(2deg)}20%,40%,60%{transform:rotate(-4deg)}30%,50%,70%{transform:rotate(4deg)}80%{transform:rotate(-2deg)}90%{transform:rotate(2deg)}}',
    'shake-tl': '{0%,100%{transform:rotate(0deg);transform-origin:0 0}10%{transform:rotate(2deg)}20%,40%,60%{transform:rotate(-4deg)}30%,50%,70%{transform:rotate(4deg)}80%{transform:rotate(-2deg)}90%{transform:rotate(2deg)}}',
  }
  const duration = '.8s'
  const timingFns = 'cubic-bezier(.455,.03,.515,.955)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }
  return theme
}
