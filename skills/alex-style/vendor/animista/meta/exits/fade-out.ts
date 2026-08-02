import type { Theme } from '@unocss/preset-mini'

export function fadeOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'fade-out': '{0%{opacity:1}100%{opacity:0}}',
    'fade-out-bck': '{0%{transform:translateZ(0);opacity:1}100%{transform:translateZ(-20rem);opacity:0}}',
    'fade-out-fwd': '{0%{transform:translateZ(0);opacity:1}100%{transform:translateZ(20rem);opacity:0}}',
    'fade-out-top': '{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-12.5rem);opacity:0}}',
    ' fade-out-tr': '{0%{transform:translateX(0) translateY(0);opacity:1}100%{transform:translateX(12.5rem) translateY(-12.5rem);opacity:0}}',
    'fade-out-right': '{0%{transform:translateX(0);opacity:1}100%{transform:translateX(12.5rem);opacity:0}}',
    'fade-out-br': '{0%{transform:translateX(0) translateY(0);opacity:1}100%{transform:translateX(12.5rem) translateY(12.5rem);opacity:0}}',
    'fade-out-bottom': '{0%{transform:translateY(0);opacity:1}100%{transform:translateY(12.5rem);opacity:0}}',
    'fade-out-bl': '{0%{transform:translateX(0) translateY(0);opacity:1}100%{transform:translateX(-12.5rem) translateY(12.5rem);opacity:0}}',
    'fade-out-left': '{0%{transform:translateX(0);opacity:1}100%{transform:translateX(-12.5rem);opacity:0}}',
    'fade-out-tl': '{0%{transform:translateX(0) translateY(0);opacity:1}100%{transform:translateX(-12.5rem) translateY(-12.5rem);opacity:0}}',
  }
  const duration = '1s'
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
