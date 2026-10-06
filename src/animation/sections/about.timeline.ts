import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

export const createAboutTimeline: SectionAnimation = (scope, conditions) => {
  if (!conditions.desktop) return

  const opening = scope.querySelector<HTMLElement>('[data-about-opening]')
  const pages = selectAll<HTMLElement>(scope, '[data-about-page]')
  const progress = selectAll<HTMLElement>(scope, '.about-cinema__progress i')
  const backdropWords = selectAll<HTMLElement>(scope, '.about-cinema__backdrop span')

  if (!opening || pages.length === 0) return

  const copies = pages.map((page) => page.querySelector<HTMLElement>('.about-cinema__copy'))
  const targets = [opening, ...pages, ...copies, ...progress, ...backdropWords].filter(Boolean)

  gsap.set(pages, {
    autoAlpha: 0,
    yPercent: 108,
    rotationX: 18,
    scale: 0.86,
    transformOrigin: '50% 100%',
  })
  gsap.set(progress, { scaleX: 0.28, opacity: 0.28, transformOrigin: 'left center' })

  const timeline = gsap.timeline({
    defaults: { ease: MOTION.ease.cinematic },
    scrollTrigger: {
      trigger: scope,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.65,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ...performanceCallbacks(targets),
    },
  })

  timeline
    .fromTo(
      opening.querySelectorAll('h2 > span, .about-cinema__premise, .about-cinema__opening-note'),
      { yPercent: 34, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      { yPercent: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.8, stagger: 0.08 },
      0,
    )
    .to(opening, { yPercent: -16, scale: 0.9, autoAlpha: 0, duration: 0.55 }, 0.72)
    .fromTo(backdropWords[0], { xPercent: -12 }, { xPercent: 6, duration: 4.2, ease: 'none' }, 0.75)
    .fromTo(backdropWords[1], { xPercent: 12 }, { xPercent: -6, duration: 4.2, ease: 'none' }, 0.75)

  pages.forEach((page, index) => {
    const position = 0.92 + index * 1.12
    const previous = pages[index - 1]

    if (previous) {
      timeline
        .to(previous, {
          yPercent: -64,
          rotationX: -76,
          scale: 0.76,
          autoAlpha: 0,
          duration: 0.72,
          ease: 'power2.in',
        }, position - 0.22)
        .set(previous, { zIndex: index }, position + 0.5)
    }

    timeline
      .set(page, { zIndex: index + 3 }, position - 0.08)
      .to(
        page,
        { autoAlpha: 1, yPercent: 0, rotationX: 0, scale: 1, duration: 0.78, ease: MOTION.ease.cinematic },
        position,
      )
      .fromTo(
        copies[index],
        { y: 38, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: MOTION.ease.out },
        position + 0.25,
      )
      .to(progress, { opacity: 0.28, scaleX: 0.28, duration: 0.2 }, position)
      .to(progress[index], { opacity: 1, scaleX: 1, duration: 0.35 }, position + 0.08)
  })

  timeline.to(pages[pages.length - 1], {
    yPercent: -42,
    rotationX: -68,
    scale: 0.8,
    autoAlpha: 0,
    duration: 0.7,
    ease: 'power2.in',
  }, 4.02)
}
