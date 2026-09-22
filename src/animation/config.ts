export const MOTION = {
  ease: {
    relaxed: 'power2.out',
    cinematic: 'power3.inOut',
  },
  scrub: {
    soft: 0.9,
    direct: 0.45,
  },
  duration: {
    fast: 0.35,
    medium: 0.7,
    slow: 1.1,
  },
} as const

export const MOTION_MEDIA = {
  desktop: '(min-width: 821px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 820px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const
