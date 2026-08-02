import type { Theme } from '@unocss/preset-mini'

export function bounceInEntrances(theme: Theme) {
  const keyframes: Record<string, string> = {
    'bounce-in-top': '{0%{transform:translateY(-500px);animation-timing-function:ease-in;opacity:0}38%{transform:translateY(0);animation-timing-function:ease-out;opacity:1}55%{transform:translateY(-65px);animation-timing-function:ease-in}72%{transform:translateY(0);animation-timing-function:ease-out}81%{transform:translateY(-28px);animation-timing-function:ease-in}90%{transform:translateY(0);animation-timing-function:ease-out}95%{transform:translateY(-8px);animation-timing-function:ease-in}100%{transform:translateY(0);animation-timing-function:ease-out}}',
    'bounce-in-right': '{0%{transform:translateX(600px);animation-timing-function:ease-in;opacity:0}38%{transform:translateX(0);animation-timing-function:ease-out;opacity:1}55%{transform:translateX(68px);animation-timing-function:ease-in}72%{transform:translateX(0);animation-timing-function:ease-out}81%{transform:translateX(32px);animation-timing-function:ease-in}90%{transform:translateX(0);animation-timing-function:ease-out}95%{transform:translateX(8px);animation-timing-function:ease-in}100%{transform:translateX(0);animation-timing-function:ease-out}}',
    'bounce-in-bottom': '{0%{transform:translateY(500px);animation-timing-function:ease-in;opacity:0}38%{transform:translateY(0);animation-timing-function:ease-out;opacity:1}55%{transform:translateY(65px);animation-timing-function:ease-in}72%{transform:translateY(0);animation-timing-function:ease-out}81%{transform:translateY(28px);animation-timing-function:ease-in}90%{transform:translateY(0);animation-timing-function:ease-out}95%{transform:translateY(8px);animation-timing-function:ease-in}100%{transform:translateY(0);animation-timing-function:ease-out}}',
    'bounce-in-left': '{0%{transform:translateX(-600px);animation-timing-function:ease-in;opacity:0}38%{transform:translateX(0);animation-timing-function:ease-out;opacity:1}55%{transform:translateX(-68px);animation-timing-function:ease-in}72%{transform:translateX(0);animation-timing-function:ease-out}81%{transform:translateX(-28px);animation-timing-function:ease-in}90%{transform:translateX(0);animation-timing-function:ease-out}95%{transform:translateX(-8px);animation-timing-function:ease-in}100%{transform:translateX(0);animation-timing-function:ease-out}}',
    'bounce-in-fwd': '{0%{transform:scale(0);animation-timing-function:ease-in;opacity:0}38%{transform:scale(1);animation-timing-function:ease-out;opacity:1}55%{transform:scale(.7);animation-timing-function:ease-in}72%{transform:scale(1);animation-timing-function:ease-out}81%{transform:scale(.84);animation-timing-function:ease-in}89%{transform:scale(1);animation-timing-function:ease-out}95%{transform:scale(.95);animation-timing-function:ease-in}100%{transform:scale(1);animation-timing-function:ease-out}}',
    'bounce-in-bck': '{0%{transform:scale(7);animation-timing-function:ease-in;opacity:0}38%{transform:scale(1);animation-timing-function:ease-out;opacity:1}55%{transform:scale(1.5);animation-timing-function:ease-in}72%{transform:scale(1);animation-timing-function:ease-out}81%{transform:scale(1.24);animation-timing-function:ease-in}89%{transform:scale(1);animation-timing-function:ease-out}95%{transform:scale(1.04);animation-timing-function:ease-in}100%{transform:scale(1);animation-timing-function:ease-out}}',
  }
  const duration = '1.1s'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.mode![key] = mode
  }

  return theme
}
