import type { Theme } from '@unocss/preset-mini'

export function colorChangeBackground(theme: Theme) {
  const keyframes: Record<string, string> = {
    'color-change-2x': '{0%{background:#19dcea}100%{background:#b22cff}}',
    'color-change-3x': '{0%{background:#19dcea}50%{background:#b22cff}100%{background:#ea2222}}',
    'color-change-4x': '{0%{background:#19dcea}33.3333%{background:#b22cff}66.666%{background:#ea2222}100%{background:#f5be10}}',
    'color-change-5x': '{0%{background:#19dcea}25%{background:#b22cff}50%{background:#ea2222}75%{background:#f5be10}100%{background:#3bd80d}}',
  }
  const duration: Record<string, string> = {
    'color-change-2x': '2s',
    'color-change-3x': '4s',
    'color-change-4x': '6s',
    'color-change-5x': '8s',
  }
  const timingFns = 'linear'
  const counts = 'infinite'
  const direction = 'alternate'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration[key]
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.counts![key] = counts
    theme.animation!.direction![key] = direction
    theme.animation!.mode![key] = mode
  }
  return theme
}
