import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

const incomingMedia = [
  { xPercent: 18, yPercent: 0, scale: 1.08, clipPath: 'inset(0 0 0 28%)' },
  { xPercent: -16, yPercent: 8, scale: 0.94, clipPath: 'inset(18% 0 0 0)' },
  { xPercent: 0, yPercent: 15, scale: 1.06, clipPath: 'inset(0 24% 0 0)' },
  { xPercent: 20, yPercent: -6, scale: 0.92, clipPath: 'inset(0 0 22% 0)' },
  { xPercent: -12, yPercent: 0, scale: 1.1, clipPath: 'inset(0 18% 0 0)' },
] as const

export const createJourneyTimeline: SectionAnimation = (scope, conditions) => {
  if (!conditions.desktop) return

  const film = scope.querySelector<HTMLElement>('.journey-film')
  const stage = scope.querySelector<HTMLElement>('.journey-film__stage')
  const scenes = selectAll<HTMLElement>(scope, '.experience-scene')
  const markers = selectAll<HTMLElement>(scope, '.journey-film__navigation li')
  const progress = scope.querySelector<HTMLElement>('.journey-film__track i')
  const bridge = scope.querySelector<HTMLElement>('.journey-film__bridge')

  if (!film || !stage || scenes.length === 0) return

  const copies = scenes.map((scene) => scene.querySelector<HTMLElement>('.experience-scene__copy'))
  const media = scenes.map((scene) => scene.querySelector<HTMLElement>('.experience-scene__media'))
  const numbers = scenes.map((scene) => scene.querySelector<HTMLElement>('.experience-scene__number'))
  const animatedTargets = [...copies, ...media, ...numbers, bridge].filter(Boolean)

  gsap.set(scenes, { autoAlpha: 0, zIndex: 0 })
  gsap.set(scenes[0], { autoAlpha: 1, zIndex: 2 })
  gsap.set(copies[0], { autoAlpha: 1, xPercent: 0, yPercent: 0, clipPath: 'inset(0 0 0% 0)' })
  gsap.set(media[0], { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, clipPath: 'inset(0 0 0% 0)' })
  gsap.set(numbers[0], { autoAlpha: 1, xPercent: 0 })
  gsap.set(markers, { opacity: 0.28, x: 0 })
  gsap.set(markers[0], { opacity: 1, x: 8 })
  gsap.set(progress, { scaleY: 0, transformOrigin: 'top center' })
  gsap.set(bridge, { autoAlpha: 0, xPercent: -12 })

  const timeline = gsap.timeline({
    defaults: { ease: MOTION.ease.cinematic },
    scrollTrigger: {
      trigger: film,
      start: 'top top',
      end: () => `+=${window.innerHeight * 5.8}`,
      scrub: 0.58,
      pin: stage,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ...performanceCallbacks(animatedTargets),
    },
  })

  timeline.to(progress, { scaleY: 0.08, duration: 0.35, ease: 'none' }, 0)

  scenes.slice(1).forEach((scene, index) => {
    const previousIndex = index
    const currentIndex = index + 1
    const position = currentIndex
    const direction = currentIndex % 2 === 0 ? -1 : 1
    const incoming = incomingMedia[index]

    timeline
      .set(scene, { autoAlpha: 1, zIndex: 3 }, position)
      .to(copies[previousIndex], {
        autoAlpha: 0,
        xPercent: -10 * direction,
        duration: 0.38,
      }, position)
      .to(media[previousIndex], {
        autoAlpha: 0.13,
        xPercent: -5 * direction,
        yPercent: -4,
        scale: 0.88,
        duration: 0.66,
      }, position)
      .to(numbers[previousIndex], { autoAlpha: 0, xPercent: -18 * direction, duration: 0.32 }, position)
      .fromTo(
        media[currentIndex],
        { ...incoming, autoAlpha: 0 },
        {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          clipPath: 'inset(0 0 0% 0)',
          autoAlpha: 1,
          duration: 0.72,
        },
        position + 0.02,
      )
      .fromTo(
        copies[currentIndex],
        { autoAlpha: 0, xPercent: 12 * direction, clipPath: direction > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
        { autoAlpha: 1, xPercent: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.64 },
        position + 0.16,
      )
      .fromTo(
        numbers[currentIndex],
        { autoAlpha: 0, xPercent: 18 * direction },
        { autoAlpha: 1, xPercent: 0, duration: 0.55 },
        position + 0.12,
      )
      .to(markers[previousIndex], { opacity: 0.28, x: 0, duration: 0.24 }, position)
      .to(markers[currentIndex], { opacity: 1, x: 8, duration: 0.34 }, position + 0.1)
      .to(progress, { scaleY: currentIndex / (scenes.length - 1), duration: 0.7, ease: 'none' }, position)
      .set(scenes[previousIndex], { autoAlpha: 0, zIndex: 0 }, position + 0.72)
      .set(scene, { zIndex: 2 }, position + 0.73)
  })

  const finalPosition = scenes.length
  timeline
    .to(progress, { scaleY: 1, duration: 0.45, ease: 'none' }, finalPosition - 0.22)
    .fromTo(bridge, { autoAlpha: 0, xPercent: -12 }, { autoAlpha: 1, xPercent: 0, duration: 0.62 }, finalPosition - 0.18)
    .to(media[media.length - 1], { scale: 0.94, xPercent: -4, duration: 0.75 }, finalPosition - 0.18)
    .to(copies[copies.length - 1], { xPercent: 4, duration: 0.75 }, finalPosition - 0.18)
}
