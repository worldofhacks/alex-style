import type { Theme } from '@unocss/preset-mini'

export function jelloAttention(theme: Theme) {
  const keyframes: Record<string, string> = {
    'jello-horizontal': '{0%{transform:scale3d(1,1,1)}30%{transform:scale3d(1.25,.75,1)}40%{transform:scale3d(.75,1.25,1)}50%{transform:scale3d(1.15,.85,1)}65%{transform:scale3d(.95,1.05,1)}75%{transform:scale3d(1.05,.95,1)}100%{transform:scale3d(1,1,1)}}',
    'jello-vertical': '{0%{transform:scale3d(1,1,1)}30%{transform:scale3d(.75,1.25,1)}40%{transform:scale3d(1.25,.75,1)}50%{transform:scale3d(.85,1.15,1)}65%{transform:scale3d(1.05,.95,1)}75%{transform:scale3d(.95,1.05,1)}100%{transform:scale3d(1,1,1)}}',
    'jello-diagonal-1': '{0%{transform:skew(0deg 0deg)}30%{transform:skew(25deg 25deg)}40%{transform:skew(-15deg,-15deg)}50%{transform:skew(15deg,15deg)}65%{transform:skew(-5deg,-5deg)}75%{transform:skew(5deg,5deg)}100%{transform:skew(0deg 0deg)}}',
    'jello-diagonal-2': '{0%{transform:skew(0deg 0deg)}30%{transform:skew(-25deg -25deg)}40%{transform:skew(15deg,15deg)}50%{transform:skew(-15deg,-15deg)}65%{transform:skew(5deg,5deg)}75%{transform:skew(-5deg,-5deg)}100%{transform:skew(0deg 0deg)}}',
  }
  const duration: Record<string, string> = {
    'jello-horizontal': '.9s',
    'jello-vertical': '.9s',
    'jello-diagonal-1': '.8s',
    'jello-diagonal-2': '.8s',
  }
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration[key]
    theme.animation!.mode![key] = mode
  }
  return theme
}
