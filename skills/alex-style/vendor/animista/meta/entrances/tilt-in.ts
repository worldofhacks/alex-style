import type { Theme } from '@unocss/preset-mini'

export function tiltInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'tilt-in-top-1': '{0%{transform:rotateY(30deg) translateY(-300px) skewY(-30deg);opacity:0}100%{transform:rotateY(0deg) translateY(0) skewY(0deg);opacity:1}}',
    'tilt-in-top-2': '{0%{transform:rotateY(-30deg) translateY(-300px) skewY(30deg);opacity:0}100%{transform:rotateY(0deg) translateY(0) skewY(0deg);opacity:1}}',
    'tilt-in-tr': '{0%{transform:rotateY(-35deg) rotateX(20deg) translate(250px,-250px) skew(-12deg,-15deg);opacity:0}100%{transform:rotateY(0) rotateX(0deg) translate(0,0) skew(0deg,0deg);opacity:1}}',
    'tilt-in-right-1': '{0%{transform:rotateX(-30deg) translateX(300px) skewX(30deg);opacity:0}100%{transform:rotateX(0deg) translateX(0) skewX(0deg);opacity:1}}',
    'tilt-in-right-2': '{0%{transform:rotateX(30deg) translateX(300px) skewX(-30deg);opacity:0}100%{transform:rotateX(0deg) translateX(0) skewX(0deg);opacity:1}}',
    'tilt-in-br': '{0%{transform:rotateY(-35deg) rotateX(-20deg) translate(250px,250px) skew(12deg,15deg);opacity:0}100%{transform:rotateY(0) rotateX(0deg) translate(0,0) skew(0deg,0deg);opacity:1}}',
    'tilt-in-bottom-1': '{0%{transform:rotateY(30deg) translateY(300px) skewY(-30deg);opacity:0}100%{transform:rotateY(0deg) translateY(0) skewY(0deg);opacity:1}}',
    'tilt-in-bottom-2': '{0%{transform:rotateY(-30deg) translateY(300px) skewY(30deg);opacity:0}100%{transform:rotateY(0deg) translateY(0) skewY(0deg);opacity:1}}',
    'tilt-in-bl': '{0%{transform:rotateY(35deg) rotateX(-20deg) translate(-250px,250px) skew(-12deg,-15deg);opacity:0}100%{transform:rotateY(0) rotateX(0deg) translate(0,0) skew(0deg,0deg);opacity:1}}',
    'tilt-in-left-1': '{0%{transform:rotateX(-30deg) translateX(-300px) skewX(-30deg);opacity:0}100%{transform:rotateX(0deg) translateX(0) skewX(0deg);opacity:1}}',
    'tilt-in-left-2': '{0%{transform:rotateX(30deg) translateX(-300px) skewX(30deg);opacity:0}100%{transform:rotateX(0deg) translateX(0) skewX(0deg);opacity:1}}',
    'tilt-in-tl': '{0%{transform:rotateY(35deg) rotateX(20deg) translate(-250px,-250px) skew(12deg,15deg);opacity:0}100%{transform:rotateY(0) rotateX(0deg) translate(0,0) skew(0deg,0deg);opacity:1}}',
  }
  const duration = '.6s'
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
