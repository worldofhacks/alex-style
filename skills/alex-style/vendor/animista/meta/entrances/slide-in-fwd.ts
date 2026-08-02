import type { Theme } from '@unocss/preset-mini'

export function slideInFwdEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-in-fwd-center': '{0%{transform:translateZ(-350rem);opacity:0}100%{transform:translateZ(0);opacity:1}}',
    'slide-in-fwd-top': '{0%{transform:translateZ(-350rem) translateY(-200rem);opacity:0}100%{transform:translateZ(0) translateY(0);opacity:1}}',
    'slide-in-fwd-tr': '{0%{transform:translateZ(-350rem) translateY(-200rem) translateX(250rem);opacity:0}100%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}}',
    'slide-in-fwd-right': '{0%{transform:translateZ(-350rem) translateX(250rem);opacity:0}100%{transform:translateZ(0) translateX(0);opacity:1}}',
    'slide-in-fwd-br': '{0%{transform:translateZ(-350rem) translateY(200rem) translateX(250rem);opacity:0}100%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}}',
    'slide-in-fwd-bottom': '{0%{transform:translateZ(-350rem) translateY(200rem);opacity:0}100%{transform:translateZ(0) translateY(0);opacity:1}}',
    'slide-in-fwd-bl': '{0%{transform:translateZ(-350rem) translateY(200rem) translateX(-250rem);opacity:0}100%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}}',
    'slide-in-fwd-left': '{0%{transform:translateZ(-350rem) translateX(-250rem);opacity:0}100%{transform:translateZ(0) translateX(0);opacity:1}}',
    'slide-in-fwd-tl': '{0%{transform:translateZ(-350rem) translateY(-200rem) translateX(-250rem);opacity:0}100%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}}',
  }
  const duration = '.4s'
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
