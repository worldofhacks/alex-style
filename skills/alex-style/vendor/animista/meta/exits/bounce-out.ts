import type { Theme } from '@unocss/preset-mini'

export function bounceOutExits(theme: Theme) {
  const keyframes: Record<string, string> = {
    'bounce-out-top': '{0%{transform:translateY(0);animation-timing-function:ease-out}5%{transform:translateY(-7.5rem);animation-timing-function:ease-in}15%{transform:translateY(0);animation-timing-function:ease-out}25%{transform:translateY(-9.5rem);animation-timing-function:ease-in}38%{transform:translateY(0);animation-timing-function:ease-out}52%{transform:translateY(-18.75rem);animation-timing-function:ease-in}70%{transform:translateY(0);animation-timing-function:ease-out}85%{opacity:1}100%{transform:translateY(-200rem);opacity:0}}',
    'bounce-out-right': '{0%{transform:translateX(0);animation-timing-function:ease-out}5%{transform:translateX(7.5rem);animation-timing-function:ease-in}15%{transform:translateX(0);animation-timing-function:ease-out}25%{transform:translateX(9.5rem);animation-timing-function:ease-in}38%{transform:translateX(0);animation-timing-function:ease-out}52%{transform:translateX(20rem);animation-timing-function:ease-in}65%{transform:translateX(0);animation-timing-function:ease-out}85%{opacity:1}100%{transform:translateX(250rem);opacity:0}}',
    'bounce-out-bottom': '{0%{transform:translateY(0);animation-timing-function:ease-out}5%{transform:translateY(7.5rem);animation-timing-function:ease-in}15%{transform:translateY(0);animation-timing-function:ease-out}25%{transform:translateY(9.5rem);animation-timing-function:ease-in}38%{transform:translateY(0);animation-timing-function:ease-out}52%{transform:translateY(18.75rem);animation-timing-function:ease-in}70%{transform:translateY(0);animation-timing-function:ease-out}85%{opacity:1}100%{transform:translateY(200rem);opacity:0}}',
    'bounce-out-left': '{0%{transform:translateX(0);animation-timing-function:ease-out}5%{transform:translateX(-7.5rem);animation-timing-function:ease-in}15%{transform:translateX(0);animation-timing-function:ease-out}25%{transform:translateX(-9.5rem);animation-timing-function:ease-in}38%{transform:translateX(0);animation-timing-function:ease-out}52%{transform:translateX(-20rem);animation-timing-function:ease-in}70%{transform:translateX(0);animation-timing-function:ease-out}85%{opacity:1}100%{transform:translateX(-250rem);opacity:0}}',
    'bounce-out-bck': '{0%{transform:translateZ(0);animation-timing-function:ease-out}5%{transform:translateZ(-25rem);animation-timing-function:ease-in}15%{transform:translateZ(0);animation-timing-function:ease-out}25%{transform:translateZ(-27.5rem);animation-timing-function:ease-in}38%{transform:translateZ(0);animation-timing-function:ease-out}52%{transform:translateZ(-50rem);animation-timing-function:ease-in}70%{transform:translateZ(0) scale(1);animation-timing-function:ease-out}85%{opacity:1}100%{transform:translateZ(-225rem) scale(0);animation-timing-function:ease-in;opacity:0}}',
    'bounce-out-fwd': '{0%{transform:translateZ(0);animation-timing-function:ease-out}5%{transform:translateZ(22.5rem);animation-timing-function:ease-in}15%{transform:translateZ(0);animation-timing-function:ease-out}25%{transform:translateZ(23.75rem);animation-timing-function:ease-in}38%{transform:translateZ(0);animation-timing-function:ease-out}52%{transform:translateZ(37.5rem);animation-timing-function:ease-in}70%{transform:translateZ(0);animation-timing-function:ease-out}85%{opacity:1}100%{transform:translateZ(125rem);animation-timing-function:ease-in;opacity:0}}',
  }
  const duration = '1.5s'
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration
    theme.animation!.mode![key] = mode
  }

  return theme
}
