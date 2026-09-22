import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks } from '../utils'

export const createAboutTimeline: SectionAnimation = (scope, conditions) => {
  const copy = scope.querySelector('.about__copy')
  const rule = scope.querySelector('.about__rule')
  const largeImage = scope.querySelector('.about__image--large')
  const smallImage = scope.querySelector('.about__image--small')
  const marginNote = scope.querySelector('.about__margin-note')
  const targets = [copy, rule, largeImage, smallImage, marginNote].filter(Boolean)
  const strength = conditions.mobile ? 0.58 : 1

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
    .fromTo(
      copy,
      { x: -38 * strength, y: 38 * strength, clipPath: 'inset(0 0 0 8%)' },
      { x: 14 * strength, y: -26 * strength, clipPath: 'inset(0 0 0 0%)', force3D: true },
      0,
    )
    .fromTo(
      largeImage,
      { x: 34 * strength, y: 70 * strength, clipPath: 'inset(0 0 24% 0)' },
      { x: -10 * strength, y: -45 * strength, clipPath: 'inset(0 0 0% 0)', force3D: true },
      0,
    )
    .fromTo(
      smallImage,
      { x: -22 * strength, y: 8 * strength, clipPath: 'inset(18% 0 0 0)' },
      { x: 12 * strength, y: -66 * strength, clipPath: 'inset(0% 0 0 0)', force3D: true },
      0,
    )
    .fromTo(rule, { scaleX: 0.2 }, { scaleX: 1, transformOrigin: 'left center' }, 0.1)
    .fromTo(marginNote, { yPercent: 22 }, { yPercent: -16, force3D: true }, 0)
}
