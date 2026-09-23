export const MOTION = {
  ease: {
    relaxed: 'power2.out',
    cinematic: 'power3.inOut',
    out: 'power3.out',
    emphatic: 'power4.out',
    expo: 'expo.out',
  },
  scrub: {
    soft: 0.9,
    direct: 0.45,
  },
  duration: {
    fast: 0.35,
    medium: 0.7,
    slow: 1.1,
    micro: 0.55,
    text: 0.9,
    largeType: 1.2,
    section: 1.35,
  },
  stagger: {
    words: 0.1,
    editorial: 0.12,
    marks: 0.08,
    cards: 0.14,
  },
} as const

export const MOTION_MEDIA = {
  desktop: '(min-width: 821px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 820px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const
