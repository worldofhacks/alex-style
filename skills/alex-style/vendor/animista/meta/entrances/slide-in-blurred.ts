import type { Theme } from '@unocss/preset-mini'

export function slideInBlurredEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-in-blurred-top': '{0%{transform:translateY(-1000px) scaleY(2.5) scaleX(.2);transform-origin:50% 0;filter:blur(40px);opacity:0}100%{transform:translateY(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}}',
    'slide-in-blurred-tr': '{0%{transform:translate(1000px,-1000px) skew(-80deg,-10deg);transform-origin:0 0;filter:blur(40px);opacity:0}100%{transform:translate(0,0) skew(0deg,0deg);transform-origin:50% 50%;filter:blur(0);opacity:1}}',
    'slide-in-blurred-right': '{0%{transform:translateX(1000px) scaleX(2.5) scaleY(.2);transform-origin:0 50%;filter:blur(40px);opacity:0}100%{transform:translateX(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}}',
    'slide-in-blurred-br': '{0%{transform:translate(1000px,1000px) skew(80deg,10deg);transform-origin:0 100%;filter:blur(40px);opacity:0}100%{transform:translate(0,0) skew(0deg,0deg);transform-origin:50% 50%;filter:blur(0);opacity:1}}',
    'slide-in-blurred-bottom': '{0%{transform:translateY(1000px) scaleY(2.5) scaleX(.2);transform-origin:50% 100%;filter:blur(40px);opacity:0}100%{transform:translateY(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}}',
    'slide-in-blurred-bl': '{0%{transform:translate(-1000px,1000px) skew(-80deg,-10deg);transform-origin:100% 100%;filter:blur(40px);opacity:0}100%{transform:translate(0,0) skew(0deg,0deg);transform-origin:50% 50%;filter:blur(0);opacity:1}}',
    'slide-in-blurred-left': '{0%{transform:translateX(-1000px) scaleX(2.5) scaleY(.2);transform-origin:100% 50%;filter:blur(40px);opacity:0}100%{transform:translateX(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}}',
    'slide-in-blurred-tl': '{0%{transform:translate(-1000px,-1000px) skew(80deg,10deg);transform-origin:100% 0;filter:blur(40px);opacity:0}100%{transform:translate(0,0) skew(0deg,0deg);transform-origin:50% 50%;filter:blur(0);opacity:1}}',
  }
  const duration = '.6s'
  const timingFns = 'cubic-bezier(.23,1.000,.32,1.000)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
