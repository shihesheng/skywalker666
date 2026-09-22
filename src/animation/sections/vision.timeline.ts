import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

export const createVisionTimeline: SectionAnimation = (scope, conditions) => {
  const plans = selectAll<HTMLElement>(scope, '.plan')

  plans.forEach((plan) => {
    const number = plan.querySelector('.plan__number')
    const targets = [plan, number].filter(Boolean)
    const distance = conditions.mobile ? 26 : 70

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: plan,
        start: 'top bottom',
        end: 'bottom top',
        scrub: MOTION.scrub.soft,
        invalidateOnRefresh: true,
        ...performanceCallbacks(targets),
      },
    })
      .fromTo(plan, { opacity: 0.34, scale: 0.97 }, { keyframes: [{ opacity: 1, scale: 1 }, { opacity: 1, scale: 1 }, { opacity: 0.34, scale: 0.97 }], force3D: true }, 0)
      .fromTo(number, { y: distance }, { y: -distance, force3D: true }, 0)
  })
}
