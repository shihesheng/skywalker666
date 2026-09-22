import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks } from '../utils'

export const createTransitionTimeline: SectionAnimation = (scope, conditions) => {
  const firstLine = scope.querySelector('#responsibility-title')
  const secondLine = scope.querySelector('.responsibility__second')
  const body = scope.querySelector('.responsibility__body')
  const distance = conditions.mobile ? 20 : 42
  const targets = [firstLine, secondLine, body].filter(Boolean)

  gsap.timeline({
    scrollTrigger: {
      trigger: scope,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: MOTION.scrub.soft,
      invalidateOnRefresh: true,
      ...performanceCallbacks(targets),
    },
  })
    .fromTo(firstLine, { x: -distance }, { x: 0, ease: 'none', force3D: true }, 0)
    .fromTo(secondLine, { x: distance }, { x: 0, ease: 'none', force3D: true }, 0)
    .fromTo(body, { opacity: 0 }, { opacity: 1, ease: MOTION.ease.relaxed }, 0.42)
}
