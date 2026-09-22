import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks } from '../utils'

export const createEndingTimeline: SectionAnimation = (scope) => {
  const copy = scope.querySelector('.outro__copy')
  const title = scope.querySelector('.outro__copy h2')
  const english = scope.querySelector('.outro__english')
  const note = scope.querySelector('.outro__note')
  const signature = scope.querySelector('.outro__signature')
  const fragments = Array.from(scope.querySelectorAll('.outro__fragment'))
  const targets = [copy, title, english, note, signature, ...fragments].filter(Boolean)

  gsap.timeline({
    scrollTrigger: {
      trigger: scope,
      start: 'top bottom',
      end: 'center 48%',
      scrub: MOTION.scrub.soft,
      invalidateOnRefresh: true,
      ...performanceCallbacks(targets),
    },
  })
    .fromTo(fragments[0], { xPercent: -14, yPercent: 12 }, { xPercent: 0, yPercent: -3, ease: 'none', force3D: true }, 0)
    .fromTo(fragments[1], { xPercent: 12, yPercent: -8 }, { xPercent: 0, yPercent: 3, ease: 'none', force3D: true }, 0)
    .fromTo(fragments[2], { xPercent: 18, yPercent: 14 }, { xPercent: 0, yPercent: -2, ease: 'none', force3D: true }, 0)
    .fromTo(
      title,
      { xPercent: -6, clipPath: 'inset(0 100% 0 0)' },
      { xPercent: 0, clipPath: 'inset(0 0% 0 0)', ease: MOTION.ease.cinematic },
      0.08,
    )
    .fromTo(english, { xPercent: 12 }, { xPercent: 0, ease: 'none' }, 0.2)
    .fromTo([note, signature], { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, ease: MOTION.ease.relaxed }, 0.38)
}
