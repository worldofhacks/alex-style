import type { Theme } from '@unocss/preset-mini'

export function swingBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'swing-top-fwd': '{0%{transform:rotateX(0);transform-origin:top}100%{transform:rotateX(180deg);transform-origin:top}}',
    'swing-top-bck': '{0%{transform:rotateX(0);transform-origin:top}100%{transform:rotateX(-180deg);transform-origin:top}}',
    'swing-top-right-fwd': '{0%{transform:rotate3d(1,1,0,0deg);transform-origin:100% 0}100%{transform:rotate3d(1,1,0,180deg);transform-origin:100% 0}}',
    'swing-top-right-bck': '{0%{transform:rotate3d(1,1,0,0deg);transform-origin:100% 0}100%{transform:rotate3d(1,1,0,-180deg);transform-origin:100% 0}}',
    'swing-right-fwd': '{0%{transform:rotateY(0);transform-origin:right}100%{transform:rotateY(180deg);transform-origin:right}}',
    'swing-right-bck': '{0%{transform:rotateY(0);transform-origin:right}100%{transform:rotateY(-180deg);transform-origin:right}}',
    'swing-bottom-right-fwd': '{0%{transform:rotate3d(-1,1,0,0deg);transform-origin:100% 100%}100%{transform:rotate3d(-1,1,0,180deg);transform-origin:100% 100%}}',
    'swing-bottom-right-bck': '{0%{transform:rotate3d(-1,1,0,0deg);transform-origin:100% 100%}100%{transform:rotate3d(-1,1,0,-180deg);transform-origin:100% 100%}}',
    'swing-bottom-fwd': '{0%{transform:rotateX(0);transform-origin:bottom}100%{transform:rotateX(-180deg);transform-origin:bottom}}',
    'swing-bottom-left-fwd': '{0%{transform:rotate3d(1,1,0,0deg);transform-origin:0 100%}100%{transform:rotate3d(1,1,0,-180deg);transform-origin:0 100%}}',
    'swing-bottom-left-bck': '{0%{transform:rotate3d(1,1,0,0deg);transform-origin:0 100%}100%{transform:rotate3d(1,1,0,180deg);transform-origin:0 100%}}',
    'swing-left-fwd': '{0%{transform:rotateY(0);transform-origin:left bottom}100%{transform:rotateY(-180deg);transform-origin:left bottom}}',
    'swing-left-bck': '{0%{transform:rotateY(0);transform-origin:left bottom}100%{transform:rotateY(180deg);transform-origin:left bottom}}',
    'swing-top-left-fwd': '{0%{transform:rotate3d(-1,1,0,0deg);transform-origin:0 0}100%{transform:rotate3d(-1,1,0,-180deg);transform-origin:0 0}}',
    'swing-top-left-bck': '{0%{transform:rotate3d(-1,1,0,0deg);transform-origin:0 0}100%{transform:rotate3d(-1,1,0,180deg);transform-origin:0 0}}',
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
