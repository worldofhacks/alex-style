import type { Theme } from '@unocss/preset-mini'

export function wobbleAttention(theme: Theme) {
  const keyframes: Record<string, string> = {
    'wobble-hor-bottom': '{0%,100%{transform:translateX(0);transform-origin:50% 50%}15%{transform:translateX(-7.5rem) rotate(-6deg)}30%{transform:translateX(3.75rem) rotate(6deg)}45%{transform:translateX(-3.75rem) rotate(-3.6deg)}60%{transform:translateX(2.25rem) rotate(2.4deg)}75%{transform:translateX(-1.5rem) rotate(-1.2deg)}}',
    'wobble-hor-top': '{0%,100%{transform:translateX(0);transform-origin:50% 50%}15%{transform:translateX(-7.5rem) rotate(6deg)}30%{transform:translateX(3.75rem) rotate(-6deg)}45%{transform:translateX(-3.75rem) rotate(3.6deg)}60%{transform:translateX(2.25rem) rotate(-2.4deg)}75%{transform:translateX(-1.5rem) rotate(1.2deg)}}',
    'wobble-ver-left': '{0%,100%{transform:translateY(0) rotate(0);transform-origin:50% 50%}15%{transform:translateY(-7.5rem) rotate(-6deg)}30%{transform:translateY(3.75rem) rotate(6deg)}45%{transform:translateY(-3.75rem) rotate(-3.6deg)}60%{transform:translateY(2.25rem) rotate(2.4deg)}75%{transform:translateY(-1.5rem) rotate(-1.2deg)}}',
    'wobble-ver-right': '{0%,100%{transform:translateY(0) rotate(0);transform-origin:50% 50%}15%{transform:translateY(-7.5rem) rotate(6deg)}30%{transform:translateY(3.75rem) rotate(-6deg)}45%{transform:translateY(-3.75rem) rotate(3.6deg)}60%{transform:translateY(2.25rem) rotate(-2.4deg)}75%{transform:translateY(-1.5rem) rotate(1.2deg)}}',
  }
  const duration = '.8s'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.mode![key] = mode
  }
  return theme
}
