import type { Theme } from '@unocss/preset-mini'

export function blinkAttention(theme: Theme) {
  const keyframes: Record<string, string> = {
    'blink-1': '{0%,50%,100%{opacity:1}25%,75%{opacity:0}}',
    'blink-2': '{0%{opacity:1}50%{opacity:.2}100%{opacity:1}}',
  }
  const duration: Record<string, string> = {
    'blink-1': '.6s',
    'blink-2': '.9s',
  }
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration[key]
    theme.animation!.mode![key] = mode
  }
  return theme
}
