import type { Theme } from '@unocss/preset-mini'

export function bounceAttention(theme: Theme) {
  const keyframes: Record<string, string> = {
    'bounce-top': '{0%{transform:translateY(-11.25rem);animation-timing-function:ease-in;opacity:1}24%{opacity:1}40%{transform:translateY(-6rem);animation-timing-function:ease-in}65%{transform:translateY(-3rem);animation-timing-function:ease-in}82%{transform:translateY(-1.5rem);animation-timing-function:ease-in}93%{transform:translateY(-1rem);animation-timing-function:ease-in}25%,55%,75%,87%{transform:translateY(0);animation-timing-function:ease-out}100%{transform:translateY(0);animation-timing-function:ease-out;opacity:1}}',
    'bounce-bottom': '{0%{transform:translateY(11.25rem);animation-timing-function:ease-in;opacity:1}24%{opacity:1}40%{transform:translateY(6rem);animation-timing-function:ease-in}65%{transform:translateY(3rem);animation-timing-function:ease-in}82%{transform:translateY(1.5rem);animation-timing-function:ease-in}93%{transform:translateY(1rem);animation-timing-function:ease-in}25%,55%,75%,87%{transform:translateY(0);animation-timing-function:ease-out}100%{transform:translateY(0);animation-timing-function:ease-out;opacity:1}}',
    'bounce-left': '{0%{transform:translateX(-12rem);animation-timing-function:ease-in;opacity:1}24%{opacity:1}40%{transform:translateX(-21.5rem);animation-timing-function:ease-in}65%{transform:translateX(-3.25rem);animation-timing-function:ease-in}82%{transform:translateX(-1.625rem);animation-timing-function:ease-in}93%{transform:translateX(-1rem);animation-timing-function:ease-in}25%,55%,75%,87%,98%{transform:translateX(0);animation-timing-function:ease-out}100%{transform:translateX(0);animation-timing-function:ease-out;opacity:1}}',
    'bounce-right': '{0%{transform:translateX(12rem);animation-timing-function:ease-in;opacity:1}24%{opacity:1}40%{transform:translateX(21.5rem);animation-timing-function:ease-in}65%{transform:translateX(3.25rem);animation-timing-function:ease-in}82%{transform:translateX(1.625rem);animation-timing-function:ease-in}93%{transform:translateX(1rem);animation-timing-function:ease-in}25%,55%,75%,87%,98%{transform:translateX(0);animation-timing-function:ease-out}100%{transform:translateX(0);animation-timing-function:ease-out;opacity:1}}',
  }
  const duration: Record<string, string> = {
    'bounce-top': '.9s',
    'bounce-bottom': '.9s',
    'bounce-left': '.8s',
    'bounce-right': '.8s',
  }
  const mode = 'both'

  for (const key in keyframes) {
    theme.animation!.keyframes![key] = keyframes[key]
    theme.animation!.durations![key] = duration[key]
    theme.animation!.mode![key] = mode
  }
  return theme
}
