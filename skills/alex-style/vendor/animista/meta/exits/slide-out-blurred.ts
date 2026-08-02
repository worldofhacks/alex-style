import type { Theme } from '@unocss/preset-mini'

export function slideOutBlurredExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-out-blurred-top': '{0%{transform:translateY(0) scaleY(1) scaleX(1);transform-origin:50% 0;filter:blur(0);opacity:1}100%{transform:translateY(-250rem) scaleY(2) scaleX(.2);transform-origin:50% 0;filter:blur(10rem);opacity:0}}',
    'slide-out-blurred-tr': '{0%{transform:translate(0,0) skew(0deg,0deg);transform-origin:50% 50%;filter:blur(0);opacity:1}100%{transform:translate(250rem,-250rem) skew(-80deg,-10deg);transform-origin:0 0;filter:blur(10rem);opacity:0}}',
    'slide-out-blurred-right': '{0%{transform:translateX(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}100%{transform:translateX(250rem) scaleX(2) scaleY(.2);transform-origin:0 50%;filter:blur(10rem);opacity:0}}',
    'slide-out-blurred-br': '{0%{transform:translate(0,0) skew(0deg,0deg);transform-origin:50% 50%;filter:blur(0);opacity:1}100%{transform:translate(250rem,250rem) skew(80deg,10deg);transform-origin:0 100%;filter:blur(10rem);opacity:0}}',
    'slide-out-blurred-bottom': '{0%{transform:translateY(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}100%{transform:translateY(250rem) scaleY(2) scaleX(.2);transform-origin:50% 100%;filter:blur(10rem);opacity:0}}',
    'slide-out-blurred-bl': '{0%{transform:translate(0,0) skew(0deg,0deg);transform-origin:50% 50%;filter:blur(0);opacity:1}100%{transform:translate(-250rem,250rem) skew(-80deg,-10deg);transform-origin:100% 100%;filter:blur(10rem);opacity:0}}',
    'slide-out-blurred-left': '{0%{transform:translateX(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}100%{transform:translateX(-250rem) scaleX(2) scaleY(.2);transform-origin:100% 50%;filter:blur(10rem);opacity:0}}',
    'slide-out-blurred-tl': '{0%{transform:translate(0,0) skew(0deg,0deg);transform-origin:50% 50%;filter:blur(0);opacity:1}100%{transform:translate(-250rem,-250rem) skew(80deg,10deg);transform-origin:100% 0;filter:blur(10rem);opacity:0}}',
  }
  const duration = '.45s'
  const timingFns = 'cubic-bezier(.755,.05,.855,.06)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
