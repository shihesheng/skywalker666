import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

export const createVisionTimeline: SectionAnimation = (scope, conditions) => {
  if (!conditions.desktop) return

  const introTitle = scope.querySelector('.future__intro h2')
  const introEnglish = scope.querySelector('.future__english')
  const introBody = scope.querySelector('.future__intro-body')

  gsap.timeline({
    scrollTrigger: {
      trigger: scope.querySelector('.future__intro'),
      start: 'top 82%',
      end: 'center 48%',
      scrub: MOTION.scrub.direct,
      invalidateOnRefresh: true,
    },
  })
    .fromTo(introTitle, { xPercent: -9, clipPath: 'inset(0 100% 0 0)' }, { xPercent: 0, clipPath: 'inset(0 0% 0 0)', ease: MOTION.ease.cinematic }, 0)
    .fromTo(introEnglish, { xPercent: 16 }, { xPercent: 0, ease: 'none' }, 0)
    .fromTo(introBody, { yPercent: 16 }, { yPercent: 0, ease: 'none' }, 0)

  const plans = selectAll<HTMLElement>(scope, '.plan')
  plans.forEach((plan, index) => {
    const copy = plan.querySelector('.plan__copy')
    const number = plan.querySelector('.plan__number')
    const notes = plan.querySelectorAll('.plan__notes > *')
    const line = plan.querySelector('.plan__connection-line')
    const arrow = plan.querySelector('.plan__arrow')
    const direction = index % 2 === 0 ? -1 : 1
    const targets = [copy, number, line, arrow, ...Array.from(notes)].filter(Boolean)

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: plan,
        start: 'top 84%',
        end: 'center 42%',
        scrub: MOTION.scrub.direct,
        invalidateOnRefresh: true,
        ...performanceCallbacks(targets),
      },
    })

    timeline
      .fromTo(
        copy,
        {
          xPercent: 8 * direction,
          clipPath: direction < 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
        },
        { xPercent: 0, clipPath: 'inset(0 0% 0 0)', ease: MOTION.ease.cinematic },
        0,
      )
      .fromTo(number, { xPercent: -12 * direction, y: 74 }, { xPercent: 0, y: -28, ease: 'none', force3D: true }, 0)

    if (notes.length) {
      timeline.fromTo(
        notes,
        { x: 30 * direction, y: 18, autoAlpha: 0 },
        { x: 0, y: 0, autoAlpha: 1, stagger: 0.05, ease: MOTION.ease.relaxed },
        0.32,
      )
    }

    if (line) timeline.fromTo(line, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', ease: 'none' }, 0.24)
    if (arrow) timeline.fromTo(arrow, { x: 24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: MOTION.ease.relaxed }, 0.42)
  })
}
