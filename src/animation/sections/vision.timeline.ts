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

  const plans = selectAll<HTMLElement>(scope, '.future__deck .plan')
  const tabs = selectAll<HTMLElement>(scope, '.future__tab')
  const pageContents = plans.map((plan) => selectAll<HTMLElement>(plan, '.plan__copy, .plan__notes'))
  const stack = scope.querySelector<HTMLElement>('.future__plans')
  if (!stack || plans.length < 2 || tabs.length !== plans.length) return

  const stackPosition = (depth: number) => ({
    x: depth * 90,
    y: depth * -65,
    scale: 1 - depth * 0.075,
    rotation: 0,
  })

  plans.forEach((plan, index) => {
    gsap.set(plan, {
      ...stackPosition(index),
      zIndex: plans.length - index,
      transformOrigin: '50% 50%',
      force3D: false,
    })
    gsap.set(tabs[index], {
      x: index * 127,
      y: index * -32,
      scale: 1 - index * 0.075,
      zIndex: plans.length - index,
      transformOrigin: 'center center',
    })
    // A receding sheet reads as a surface, not four sets of competing copy.
    if (index > 0) gsap.set(pageContents[index], { autoAlpha: 0 })
  })

  const pageTurn = gsap.timeline({
    defaults: { ease: MOTION.ease.cinematic },
    scrollTrigger: {
      id: 'future-page-stack',
      trigger: stack,
      start: 'top top',
      end: 'bottom bottom',
      scrub: MOTION.scrub.direct,
      invalidateOnRefresh: true,
      ...performanceCallbacks([...plans, ...tabs], 'transform'),
    },
  })

  for (let current = 0; current < plans.length - 1; current++) {
    const position = current * 1.22 + 0.16
    // The current sheet slides away like a paper page while the remaining
    // sheets advance one place in the stack. All motion is reversible.
    pageTurn.to(plans[current], {
      xPercent: -132,
      yPercent: 34,
      scale: 0.84,
      rotation: -4,
      duration: 0.92,
      ease: 'power3.inOut',
    }, position)
    pageTurn.to(tabs[current], {
      x: () => -window.innerWidth * 0.8,
      y: () => window.innerHeight * 0.26,
      scale: 0.8,
      rotation: -4,
      duration: 0.92,
      ease: 'power3.inOut',
    }, position)

    plans.slice(current + 1).forEach((plan, index) => {
      pageTurn.to(plan, {
        ...stackPosition(index),
        duration: 0.92,
        ease: MOTION.ease.cinematic,
      }, position)
      pageTurn.to(tabs[current + index + 1], {
        x: index * 127,
        y: index * -32,
        scale: 1 - index * 0.075,
        duration: 0.92,
        ease: MOTION.ease.cinematic,
      }, position)
    })
    pageTurn.to(pageContents[current + 1], {
      autoAlpha: 1,
      duration: 0.24,
      ease: 'none',
    }, position + 0.58)
  }

  // Give the last sheet a held reading beat before normal vertical scrolling.
  pageTurn.to({ hold: 0 }, { hold: 1, duration: 0.48 }, (plans.length - 2) * 1.22 + 1.08)
}
