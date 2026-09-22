import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks } from '../utils'

export const createAboutTimeline: SectionAnimation = (scope, conditions) => {
  const copy = scope.querySelector('.about__copy')
  const largeImage = scope.querySelector('.about__image--large')
  const smallImage = scope.querySelector('.about__image--small')
  const targets = [copy, largeImage, smallImage].filter(Boolean)
  const strength = conditions.mobile ? 0.56 : 1

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scope,
      start: 'top bottom',
      end: 'bottom top',
      scrub: MOTION.scrub.soft,
      invalidateOnRefresh: true,
      ...performanceCallbacks(targets),
    },
  })
    .fromTo(copy, { y: 32 * strength }, { y: -28 * strength, force3D: true }, 0)
    .fromTo(largeImage, { y: 64 * strength }, { y: -48 * strength, force3D: true }, 0)
    .fromTo(smallImage, { y: 10 * strength }, { y: -70 * strength, force3D: true }, 0)
}
