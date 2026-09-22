import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

export const createJourneyTimeline: SectionAnimation = (scope, conditions) => {
  const chapters = selectAll<HTMLElement>(scope, '.event')

  chapters.forEach((chapter) => {
    const copy = chapter.querySelector('.event__copy')
    const photos = chapter.querySelector('.event__photos')
    const isFast = chapter.classList.contains('event--fast')
    const verticalDistance = conditions.mobile ? 20 : isFast ? 88 : 42
    const horizontalDistance = conditions.desktop && isFast ? 52 : 0
    const targets = [copy, photos].filter(Boolean)

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: chapter,
        start: 'top bottom',
        end: 'bottom top',
        scrub: MOTION.scrub.soft,
        invalidateOnRefresh: true,
        ...performanceCallbacks(targets),
      },
    })
      .fromTo(copy, { y: conditions.mobile ? 10 : 22 }, { y: conditions.mobile ? -10 : -22, force3D: true }, 0)
      .fromTo(
        photos,
        { x: horizontalDistance, y: verticalDistance },
        { x: -horizontalDistance, y: -verticalDistance, force3D: true },
        0,
      )
  })
}
