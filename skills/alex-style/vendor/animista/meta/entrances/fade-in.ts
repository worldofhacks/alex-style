import type { Theme } from '@unocss/preset-mini'

export function fadeInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'fade-in': '{0%{opacity:0}100%{opacity:1}}',
    'fade-in-fwd': '{0%{transform:translateZ(-20rem);opacity:0}100%{transform:translateZ(0);opacity:1}}',
    'fade-in-bck': '{0%{transform:translateZ(20rem);opacity:0}100%{transform:translateZ(0);opacity:1}}',
    'fade-in-top': '{0%{transform:translateY(-12.5rem);opacity:0}100%{transform:translateY(0);opacity:1}}',
    'fade-in-tr': '{0%{transform:translateX(12.5rem) translateY(-12.5rem);opacity:0}100%{transform:translateX(0) translateY(0);opacity:1}}',
    'fade-in-right': '{0%{transform:translateX(12.5rem);opacity:0}100%{transform:translateX(0);opacity:1}}',
    'fade-in-br': '{0%{transform:translateX(12.5rem) translateY(12.5rem);opacity:0}100%{transform:translateX(0) translateY(0);opacity:1}}',
    'fade-in-bottom': '{0%{transform:translateY(12.5rem);opacity:0}100%{transform:translateY(0);opacity:1}}',
    'fade-in-bl': '{0%{transform:translateX(-12.5rem) translateY(12.5rem);opacity:0}100%{transform:translateX(0) translateY(0);opacity:1}}',
    'fade-in-left': '{0%{transform:translateX(-12.5rem);opacity:0}100%{transform:translateX(0);opacity:1}}',
    'fade-in-tl': '{0%{transform:translateX(-12.5rem) translateY(-12.5rem);opacity:0}100%{transform:translateX(0) translateY(0);opacity:1}}',
  }
  const duration = '.6s'
  const timingFns = 'cubic-bezier(.39,.575,.565,1.000)'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
