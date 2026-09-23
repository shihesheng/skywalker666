import { MOTION } from '../config'
import { gsap } from '../gsap'
import { editorialSlide } from '../primitives'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

export const createHeroTimeline: SectionAnimation = (scope, conditions) => {
  const heading = scope.querySelector('.hero__heading')
  const titleLines = scope.querySelectorAll<HTMLElement>('[data-title-line]')
  const glyphs = selectAll<HTMLElement>(scope, '.hero__glyph')
  const role = scope.querySelector('.hero__role')
  const topline = scope.querySelector('.hero__topline')
  const toplineRule = scope.querySelector('.hero__topline-rule')
  const meta = scope.querySelector('.hero__meta')
  const metaRule = scope.querySelector('.hero__meta-rule')
  const metaCopy = scope.querySelectorAll('.hero__meta > :not(.hero__meta-rule)')
  const year = scope.querySelector('.hero__year')
  const yearType = scope.querySelector('.hero__year span')
  const handoff = scope.querySelector('.hero__handoff')
  const targets = [heading, ...titleLines, topline, meta, year, handoff].filter(Boolean)

  // Masks are padded for Chinese glyphs and removed when the entrance ends.
  // Scroll motion owns the outer wrappers; entrance motion owns their children.
  const intro = gsap.timeline({
    onComplete: () => {
      gsap.set([topline, role, handoff], { clearProps: 'clipPath' })
      gsap.set(titleLines, { overflow: 'visible' })
      gsap.set(glyphs, { clearProps: 'transform' })
    },
  })
  gsap.set(titleLines, { overflow: 'hidden' })
  editorialSlide(intro, { content: topline, line: toplineRule, direction: 'left' }, 0)
  editorialSlide(intro, { content: role, direction: 'left', duration: MOTION.duration.micro }, 0.1)
  intro
    .fromTo(glyphs, { yPercent: 115, x: 14 }, {
      yPercent: 0, x: 0, duration: MOTION.duration.largeType,
      stagger: 0.075, ease: MOTION.ease.emphatic,
    }, 0.18)
    .fromTo(metaRule, { scaleY: 0 }, {
      scaleY: 1, transformOrigin: 'top center', duration: 1.1, ease: MOTION.ease.expo,
    }, 0.62)
    .fromTo(metaCopy, { x: 28, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: MOTION.ease.out,
    }, 0.76)
    .fromTo(yearType, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: MOTION.ease.out }, 0.3)
    .fromTo(handoff, { x: -18, clipPath: 'inset(0 100% 0 0)' }, { x: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.72, ease: MOTION.ease.out }, 1.02)

  const distance = conditions.mobile ? 34 : 90
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      id: 'hero-cover-motion',
      trigger: scope,
      start: 'top top',
      end: 'bottom top',
      scrub: MOTION.scrub.soft,
      invalidateOnRefresh: true,
      ...performanceCallbacks(targets),
    },
  })
    .to(heading, { y: -distance, force3D: true }, 0)
    .to(titleLines[0], { x: conditions.mobile ? -8 : -28 }, 0)
    .to(titleLines[1], { x: conditions.mobile ? 18 : 84 }, 0)
    .to([topline, meta], { opacity: 0.2, y: -distance * 0.28, force3D: true }, 0)
    .to(year, { y: -distance * 0.6, x: distance * 0.3, scale: 1.06, force3D: true }, 0)
    .to(handoff, { y: -distance * 0.15, opacity: 0.32, force3D: true }, 0)
}
