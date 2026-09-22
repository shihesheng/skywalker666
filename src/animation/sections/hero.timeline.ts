import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks } from '../utils'

export const createHeroTimeline: SectionAnimation = (scope, conditions) => {
  const heading = scope.querySelector('.hero__heading')
  const title = scope.querySelector('.hero h1')
  const role = scope.querySelector('.hero__role')
  const kicker = scope.querySelector('.hero__kicker')
  const portrait = scope.querySelector('.hero__portrait')
  const line = scope.querySelector('.hero__line')
  const note = scope.querySelector('.hero__note')
  const arrow = scope.querySelector('.hero__arrow')
  const targets = [heading, title, role, kicker, portrait, line, note, arrow].filter(Boolean)

  gsap.timeline({ defaults: { ease: MOTION.ease.cinematic } })
    .fromTo(line, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'right center', duration: 0.85 }, 0)
    .fromTo(role, { xPercent: -30, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.55 }, 0.12)
    .fromTo(
      title,
      { xPercent: -5, clipPath: 'inset(0 100% 0 0)' },
      { xPercent: 0, clipPath: 'inset(0 0% 0 0)', duration: 1.05 },
      0.16,
    )
    .fromTo(kicker, { xPercent: 14, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.7 }, 0.5)
    .fromTo(
      portrait,
      { xPercent: 12, scale: 1.045, clipPath: 'inset(4% 100% 4% 0)' },
      { xPercent: 0, scale: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.05 },
      0.38,
    )
    .fromTo([note, arrow], { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.48 }, 0.88)

  const distance = conditions.mobile ? 28 : 55
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scope,
      start: 'top top',
      end: 'bottom top',
      scrub: MOTION.scrub.soft,
      invalidateOnRefresh: true,
      ...performanceCallbacks(targets),
    },
  })
    .to(heading, { y: -distance, force3D: true }, 0)
    .to(portrait, { y: -distance * 0.42, scale: 0.985, force3D: true }, 0)
    .to(line, { scaleX: 0.68, transformOrigin: 'right center', force3D: true }, 0)
}
