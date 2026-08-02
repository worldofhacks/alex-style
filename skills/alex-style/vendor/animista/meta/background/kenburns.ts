import type { Theme } from '@unocss/preset-mini'

export function kenburnsBackground(theme: Theme) {
  const keyframes: Record<string, string> = {
    'kenburns-top': '{0%{transform:scale(1) translateY(0);transform-origin:50% 16%}100%{transform:scale(1.25) translateY(-3.75rem);transform-origin:top}}',
    'kenburns-top-right': '{0%{transform:scale(1) translate(0,0);transform-origin:84% 16%}100%{transform:scale(1.25) translate(5rem,-3.75rem);transform-origin:right top}}',
    'kenburns-right': '{0%{transform:scale(1) translate(0,0);transform-origin:84% 50%}100%{transform:scale(1.25) translateX(5rem);transform-origin:right}}',
    'kenburns-bottom-right': '{0%{transform:scale(1) translate(0,0);transform-origin:84% 84%}100%{transform:scale(1.25) translate(5rem,3.75rem);transform-origin:right bottom}}',
    'kenburns-bottom': '{0%{transform:scale(1) translateY(0);transform-origin:50% 84%}100%{transform:scale(1.25) translateY(3.75rem);transform-origin:bottom}}',
    'kenburns-bottom-left': '{0%{transform:scale(1) translate(0,0);transform-origin:16% 84%}100%{transform:scale(1.25) translate(-5rem,3.75rem);transform-origin:left bottom}}',
    'kenburns-left': '{0%{transform:scale(1) translate(0,0);transform-origin:16% 50%}100%{transform:scale(1.25) translate(-5rem,3.75rem);transform-origin:left}}',
    'kenburns-top-left': '{0%{transform:scale(1) translate(0,0);transform-origin:16% 16%}100%{transform:scale(1.25) translate(-5rem,-3.75rem);transform-origin:top left}}',
  }
  const duration = '5s'
  const timingFns = 'ease-out'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }
  return theme
}
