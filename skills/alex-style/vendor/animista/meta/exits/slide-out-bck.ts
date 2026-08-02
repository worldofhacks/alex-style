import type { Theme } from '@unocss/preset-mini'

export function slideOutBckExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'slide-out-bck-center': '{0%{transform:translateZ(0);opacity:1}100%{transform:translateZ(-275rem);opacity:0}}',
    'slide-out-bck-top': '{0%{transform:translateZ(1) translateY(0);opacity:1}100%{transform:translateZ(-275rem) translateY(-250rem);opacity:0}}',
    'slide-out-bck-tr': '{0%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}100%{transform:translateZ(-275rem) translateY(-250rem) translateX(250rem);opacity:0}}',
    'slide-out-bck-right': '{0%{transform:translateZ(0) translateX(0);opacity:1}100%{transform:translateZ(-275rem) translateX(250rem);opacity:0}}',
    'slide-out-bck-br': '{0%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}100%{transform:translateZ(-275rem) translateY(250rem) translateX(250rem);opacity:0}}',
    'slide-out-bck-bottom': '{0%{transform:translateZ(0) translateY(0);opacity:1}100%{transform:translateZ(-275rem) translateY(250rem);opacity:0}}',
    'slide-out-bck-bl': '{0%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}100%{transform:translateZ(-275rem) translateY(250rem) translateX(-250rem);opacity:0}}',
    'slide-out-bck-left': '{0%{transform:translateZ(0) translateX(0);opacity:1}100%{transform:translateZ(-275rem) translateX(-250rem);opacity:0}}',
    'slide-out-bck-tl': '{0%{transform:translateZ(0) translateY(0) translateX(0);opacity:1}100%{transform:translateZ(-275rem) translateY(-250rem) translateX(-250rem);opacity:0}}',
  }
  const duration = '.5s'
  const timingFns = 'cubic-bezier(.55,.085,.68,.53)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
