import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

export const createAboutTimeline: SectionAnimation = (scope, conditions) => {
  if (!conditions.desktop) return

  const opening = scope.querySelector<HTMLElement>('[data-about-opening]')
  const scenes = selectAll<HTMLElement>(scope, '[data-about-scene]')
  const progress = selectAll<HTMLElement>(scope, '.about-cinema__progress i')

  if (!opening || scenes.length === 0) return

  const copies = scenes.map((scene) => scene.querySelector<HTMLElement>('.about-cinema__copy'))
  const visuals = scenes.map((scene) => scene.querySelector<HTMLElement>('.about-cinema__visual'))
  const targets = [opening, ...scenes, ...copies, ...visuals, ...progress].filter(Boolean)

  gsap.set(scenes, { autoAlpha: 0, zIndex: 1 })
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
    .to(opening, { yPercent: -12, scale: 0.94, autoAlpha: 0, duration: 0.55 }, 0.72)

  scenes.forEach((scene, index) => {
    const position = 1.05 + index * 1.05
    const previous = scenes[index - 1]
    const direction = index % 2 === 0 ? 1 : -1

    if (previous) {
      timeline
        .to(previous, { autoAlpha: 0, yPercent: -7, scale: 0.975, duration: 0.42 }, position - 0.2)
        .set(previous, { zIndex: 1 }, position + 0.24)
    }

    timeline
      .set(scene, { zIndex: 3 }, position - 0.05)
      .fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28 }, position)
      .fromTo(
        visuals[index],
        {
          xPercent: 9 * direction,
          scale: 1.075,
          clipPath: direction > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
        },
        { xPercent: 0, scale: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.72 },
        position,
      )
      .fromTo(
        copies[index],
        { xPercent: -7 * direction, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.58 },
        position + 0.12,
      )
      .to(progress, { opacity: 0.28, scaleX: 0.28, duration: 0.2 }, position)
      .to(progress[index], { opacity: 1, scaleX: 1, duration: 0.35 }, position + 0.08)
      .to(visuals[index], { yPercent: -2.4, duration: 0.72, ease: 'none' }, position + 0.48)
  })
}
