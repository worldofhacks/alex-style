import type { Theme } from '@unocss/preset-mini'

export function rotate90Basic(theme: Theme) {
  const properties: Record<string, Record<string, string>> = {
    none: {},
    top: { 'transform-origin': 'top' },
    tr: { 'transform-origin': 'top right' },
    right: { 'transform-origin': 'right' },
    br: { 'transform-origin': '100% 100%' },
    bottom: { 'transform-origin': 'bottom' },
    bl: { 'transform-origin': '0 100%' },
    left: { 'transform-origin': 'left' },
    tl: { 'transform-origin': '0 0' },
  }
  const keyframesType: Record<string, string> = {
    cw: '{0%{transform:rotate(0)}100%{transform:rotate(90deg)}}',
    ccw: '{0%{transform:rotate(0)}100%{transform:rotate(-90deg)}}',
  }
  const keyframes: Record<string, string> = {
    'rotate-90-horizontal-fwd': '{0%{transform:rotateX(0)}100%{transform:rotateX(90deg)}}',
    'rotate-90-horizontal-bck': '{0%{transform:rotateX(0)}100%{transform:rotateX(-90deg)}}',
    'rotate-90-vertical-fwd': '{0%{transform:rotateY(0)}100%{transform:rotateY(90deg)}}',
    'rotate-90-vertical-bck': '{0%{transform:rotateY(0)}100%{transform:rotateY(-90deg)}}',
  }
  const duration = '.4s'
  const timingFns = 'cubic-bezier(.25,.46,.45,.94)'
  const mode = 'both'

  for (const d in properties) {
    for (const t in keyframesType) {
      const key = d === 'none' ? `rotate-90-${t}` : `rotate-90-${d}-${t}`
      theme.animation!.keyframes![key] = keyframesType[t]
      theme.animation!.durations![key] = duration
      theme.animation!.timingFns![key] = timingFns
      theme.animation!.properties![key] = properties[d]
      theme.animation!.mode![key] = mode
    }
  }
  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.timingFns![key] = timingFns
    theme.animation!.mode![key] = mode
  }

  return theme
}
