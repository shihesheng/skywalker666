import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

export const createMeaningTimeline: SectionAnimation = (scope, conditions) => {
  if (!conditions.desktop) return

  const scrollArea = scope.querySelector<HTMLElement>('.meaning__scroll')
  const sticky = scope.querySelector<HTMLElement>('.meaning__sticky')
  const chapters = selectAll<HTMLElement>(scope, '.meaning__chapter')
  const counters = selectAll<HTMLElement>(scope, '.meaning__counter span')
  const ghosts = selectAll<HTMLElement>(scope, '.meaning__ghost')

  if (!scrollArea || !sticky || chapters.length === 0) return

  gsap.set(chapters, { autoAlpha: 0, y: 32, clipPath: 'inset(0 0 100% 0)' })
  gsap.set(chapters[0], { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)' })
  gsap.set(counters, { opacity: 0.34, scale: 1 })
  gsap.set(counters[0], { opacity: 1, scale: 1.22 })
  gsap.set(ghosts, { autoAlpha: 0 })
  gsap.set(ghosts[0], { autoAlpha: 1 })

  const timeline = gsap.timeline({
    defaults: { ease: MOTION.ease.cinematic },
    scrollTrigger: {
      trigger: scrollArea,
      start: 'top top',
      end: () => `+=${window.innerHeight * (chapters.length - 0.25)}`,
      scrub: MOTION.scrub.soft,
      pin: sticky,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      ...performanceCallbacks([...chapters, ...ghosts]),
    },
  })

  chapters.slice(1).forEach((chapter, index) => {
    const previous = chapters[index]
    const position = index + 1

    timeline
      .to(previous, { autoAlpha: 0, y: -24, duration: 0.38 }, position)
      .to(ghosts[index], { autoAlpha: 0, duration: 0.25 }, position)
      .to(counters[index], { opacity: 0.34, scale: 1, duration: 0.25 }, position)
      .fromTo(
        chapter,
        { autoAlpha: 0, y: 32, clipPath: 'inset(0 0 100% 0)' },
        { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.62 },
        position + 0.08,
      )
      .to(ghosts[index + 1], { autoAlpha: 1, duration: 0.42 }, position + 0.08)
      .to(counters[index + 1], { opacity: 1, scale: 1.22, duration: 0.35 }, position + 0.08)
  })
}
