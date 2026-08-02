import type { Theme } from '@unocss/preset-mini'

export function rotateBasic(theme: Theme) {
  const keyframes: Record<string, string> = {
    'rotate-center': '{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}',
    'rotate-top': '{0%{transform:rotate(0);transform-origin:top}100%{transform:rotate(360deg);transform-origin:top}}',
    'rotate-tr': '{0%{transform:rotate(0);transform-origin:top right}100%{transform:rotate(360deg);transform-origin:top right}}',
    'rotate-right': '{0%{transform:rotate(0);transform-origin:right}100%{transform:rotate(360deg);transform-origin:right}}',
    'rotate-br': '{0%{transform:rotate(0);transform-origin:bottom right}100%{transform:rotate(360deg);transform-origin:bottom right}}',
    'rotate-bottom': '{0%{transform:rotate(0);transform-origin:bottom}100%{transform:rotate(360deg);transform-origin:bottom}}',
    'rotate-bl': '{0%{transform:rotate(0);transform-origin:bottom left}100%{transform:rotate(360deg);transform-origin:bottom left}}',
    'rotate-left': '{0%{transform:rotate(0);transform-origin:left}100%{transform:rotate(360deg);transform-origin:left}}',
    'rotate-tl': '{0%{transform:rotate(0);transform-origin:top left}100%{transform:rotate(360deg);transform-origin:top left}}',
    'rotate-hor-center': '{0%{transform:rotateX(0)}100%{transform:rotateX(-360deg)}}',
    'rotate-hor-top': '{0%{transform:rotateX(0);transform-origin:top}100%{transform:rotateX(-360deg);transform-origin:top}}',
    'rotate-hor-bottom': '{0%{transform:rotateX(0);transform-origin:bottom}100%{transform:rotateX(360deg);transform-origin:bottom}}',
    'rotate-vert-center': '{0%{transform:rotateY(0)}100%{transform:rotateY(360deg)}}',
    'rotate-vert-left': '{0%{transform:rotateY(0);transform-origin:left}100%{transform:rotateY(360deg);transform-origin:left}}',
    'rotate-vert-right': '{0%{transform:rotateY(0);transform-origin:right}100%{transform:rotateY(-360deg);transform-origin:right}}',
    'rotate-diagonal-1': '{0%{transform:rotate3d(1,1,0,0deg)}50%{transform:rotate3d(1,1,0,-180deg)}100%{transform:rotate3d(1,1,0,-360deg)}}',
    'rotate-diagonal-2': '{0%{transform:rotate3d(-1,1,0,0deg)}50%{transform:rotate3d(-1,1,0,180deg)}100%{transform:rotate3d(-1,1,0,360deg)}}',
    'rotate-diagonal-tr': '{0%{transform:rotate3d(1,1,0,0deg);transform-origin:100% 0}50%{transform:rotate3d(1,1,0,-180deg);transform-origin:100% 0}100%{transform:rotate3d(1,1,0,-360deg);transform-origin:100% 0}}',
    'rotate-diagonal-br': '{0%{transform:rotate3d(-1,1,0,0deg);transform-origin:100% 100%}50%{transform:rotate3d(-1,1,0,-180deg);transform-origin:100% 100%}100%{transform:rotate3d(-1,1,0,-360deg);transform-origin:100% 100%}}',
    'rotate-diagonal-bl': '{0%{transform:rotate3d(1,1,0,0deg);transform-origin:0 100%}50%{transform:rotate3d(1,1,0,180deg);transform-origin:0 100%}100%{transform:rotate3d(1,1,0,360deg);transform-origin:0 100%}}',
    'rotate-diagonal-tl': '{0%{transform:rotate3d(-1,1,0,0deg);transform-origin:0 0}50%{transform:rotate3d(-1,1,0,180deg);transform-origin:0 0}100%{transform:rotate3d(-1,1,0,360deg);transform-origin:0 0}}',
  }
  // 0:[0], [1,14] 2:[15,20]
  const duration = ['.6s', '.5s', '.4s']

  // 0, [1, 12] [11, 13, 14] [15, 20]
  const timingFns = ['ease-in-out', 'cubic-bezier(.455,.03,.515,.955)', 'cubic-bezier(.645,.045,.355,1.000)', 'linear']
  const mode = 'both'

  for (const index in Object.keys(keyframes)) {
    const key = Object.keys(keyframes)[index]
    theme.animation!.keyframes![key] = keyframes[key]

    const durationIndex = (parseInt(index) < 1) ? 0 : (parseInt(index) < 15 ? 1 : 2)
    theme.animation!.durations![key] = duration[durationIndex]

    if (parseInt(index) < 1)
      theme.animation!.timingFns![key] = timingFns[0]
    else if (parseInt(index) < 15)
      theme.animation!.timingFns![key] = [11, 13, 14].includes(parseInt(index)) ? timingFns[2] : timingFns[1]
    else
      theme.animation!.timingFns![key] = timingFns[3]

    theme.animation!.mode![key] = mode
  }

  return theme
}
