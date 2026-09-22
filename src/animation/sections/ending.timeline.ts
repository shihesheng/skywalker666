import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks } from '../utils'

export const createEndingTimeline: SectionAnimation = (scope) => {
  const copy = scope.querySelector('.outro__copy')
  const fragments = scope.querySelectorAll('.outro__fragment')
  const targets = [copy, ...Array.from(fragments)].filter(Boolean)

  gsap.timeline({
    scrollTrigger: {
      trigger: scope,
      start: 'top bottom',
      end: 'center center',
      scrub: MOTION.scrub.soft,
      invalidateOnRefresh: true,
      ...performanceCallbacks(targets),
    },
  })
    .fromTo(copy, { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, ease: MOTION.ease.relaxed, force3D: true }, 0)
    .fromTo(fragments, { yPercent: 6 }, { yPercent: -4, stagger: 0.06, ease: 'none', force3D: true }, 0)
}
