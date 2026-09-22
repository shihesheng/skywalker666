import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

const chapterEntrances = [
  { xPercent: 9, yPercent: 0, clipPath: 'inset(0 0 0 100%)' },
  { xPercent: -8, yPercent: 0, clipPath: 'inset(0 100% 0 0)' },
  { xPercent: 0, yPercent: 9, clipPath: 'inset(100% 0 0 0)' },
] as const

export const createMeaningTimeline: SectionAnimation = (scope, conditions) => {
  if (!conditions.desktop) return

  const scrollArea = scope.querySelector<HTMLElement>('.meaning__scroll')
  const sticky = scope.querySelector<HTMLElement>('.meaning__sticky')
  const chapters = selectAll<HTMLElement>(scope, '.meaning__chapter')
  const counters = selectAll<HTMLElement>(scope, '.meaning__counter span')
  const ghosts = selectAll<HTMLElement>(scope, '.meaning__ghost')
  const visuals = selectAll<HTMLElement>(scope, '.meaning__visual-layer')

  if (!scrollArea || !sticky || chapters.length === 0) return

  gsap.set(chapters, { autoAlpha: 0, xPercent: 0, yPercent: 0, clipPath: 'inset(0 0 0% 0)' })
  gsap.set(chapters[0], { autoAlpha: 1 })
  gsap.set(counters, { opacity: 0.24, x: 0, scale: 1 })
  gsap.set(counters[0], { opacity: 1, x: -8, scale: 1.18 })
  gsap.set(ghosts, { autoAlpha: 0, xPercent: 0 })
  gsap.set(ghosts[0], { autoAlpha: 1 })
  gsap.set(visuals, { autoAlpha: 0, scale: 0.9, xPercent: 0, yPercent: 0 })
  gsap.set(visuals[0], { autoAlpha: 1, scale: 1 })

  const animatedTargets = [...chapters, ...ghosts, ...visuals, ...counters]
  const timeline = gsap.timeline({
    defaults: { ease: MOTION.ease.cinematic },
    scrollTrigger: {
      trigger: scrollArea,
      start: 'top top',
      end: () => `+=${window.innerHeight * 3.7}`,
      scrub: 0.38,
      pin: sticky,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ...performanceCallbacks(animatedTargets),
    },
  })

  chapters.slice(1).forEach((chapter, index) => {
    const previousIndex = index
    const currentIndex = index + 1
    const position = currentIndex
    const entrance = chapterEntrances[index]
    const direction = currentIndex % 2 === 0 ? -1 : 1
    const visualChildren = visuals[currentIndex]?.children

    timeline
      .set(chapter, { visibility: 'visible' }, position)
      .fromTo(
        chapter,
        { ...entrance, autoAlpha: 0 },
        {
          xPercent: 0,
          yPercent: 0,
          clipPath: 'inset(0 0% 0 0)',
          autoAlpha: 1,
          duration: 0.58,
        },
        position,
      )
      .to(chapters[previousIndex], {
        autoAlpha: 0.08,
        xPercent: -5 * direction,
        yPercent: -2,
        duration: 0.5,
      }, position)
      .to(visuals[previousIndex], {
        autoAlpha: 0,
        scale: 0.82,
        xPercent: -7 * direction,
        duration: 0.42,
      }, position)
      .fromTo(
        visuals[currentIndex],
        { autoAlpha: 0, scale: 0.88, xPercent: 9 * direction },
        { autoAlpha: 1, scale: 1, xPercent: 0, duration: 0.58 },
        position + 0.04,
      )
      .fromTo(
        visualChildren,
        { xPercent: 12 * direction, opacity: 0 },
        { xPercent: 0, opacity: 1, stagger: 0.035, duration: 0.36 },
        position + 0.12,
      )
      .to(ghosts[previousIndex], { autoAlpha: 0, xPercent: -4 * direction, duration: 0.32 }, position)
      .fromTo(
        ghosts[currentIndex],
        { autoAlpha: 0, xPercent: 4 * direction },
        { autoAlpha: 1, xPercent: 0, duration: 0.52 },
        position + 0.06,
      )
      .to(counters[previousIndex], { opacity: 0.24, x: 0, scale: 1, duration: 0.24 }, position)
      .to(counters[currentIndex], { opacity: 1, x: -8, scale: 1.18, duration: 0.34 }, position + 0.06)
      .set(chapters[previousIndex], { autoAlpha: 0 }, position + 0.58)
  })
}
