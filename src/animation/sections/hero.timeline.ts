import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks } from '../utils'

export const createHeroTimeline: SectionAnimation = (scope, conditions) => {
  const heading = scope.querySelector('.hero__heading')
  const portrait = scope.querySelector('.hero__portrait')
  const line = scope.querySelector('.hero__line')
  const targets = [heading, portrait, line].filter(Boolean)
  const distance = conditions.mobile ? 38 : 72

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scope,
      start: 'top top',
      end: 'bottom top',
      scrub: MOTION.scrub.soft,
      invalidateOnRefresh: true,
      ...performanceCallbacks(targets),
    },
  })

  timeline
    .to(heading, { yPercent: -distance / 5, force3D: true }, 0)
    .to(portrait, { yPercent: -8, force3D: true }, 0)
    .to(line, { scaleX: 0.72, transformOrigin: 'right center', force3D: true }, 0)
}
