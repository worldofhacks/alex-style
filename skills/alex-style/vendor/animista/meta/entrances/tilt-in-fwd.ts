import type { Theme } from '@unocss/preset-mini'

export function tiltInFwdEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'tilt-in-fwd-tr': '{0%{transform:rotateY(20deg) rotateX(35deg) translate(75rem,-75rem) skew(-35deg,10deg);opacity:0}100%{transform:rotateY(0) rotateX(0deg) translate(0,0) skew(0deg,0deg);opacity:1}}',
    'tilt-in-fwd-br': '{0%{transform:rotateY(20deg) rotateX(-35deg) translate(75rem,75rem) skew(35deg,-10deg);opacity:0}100%{transform:rotateY(0) rotateX(0deg) translate(0,0) skew(0deg,0deg);opacity:1}}',
    'tilt-in-fwd-bl': '{0%{transform:rotateY(-20deg) rotateX(-35deg) translate(-75rem,75rem) skew(-35deg,10deg);opacity:0}100%{transform:rotateY(0) rotateX(0deg) translate(0,0) skew(0deg,0deg);opacity:1}}',
    'tilt-in-fwd-tl': '{0%{transform:rotateY(-20deg) rotateX(35deg) translate(-75rem,-75rem) skew(35deg,-10deg);opacity:0}100%{transform:rotateY(0) rotateX(0deg) translate(0,0) skew(0deg,0deg);opacity:1}}',
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
