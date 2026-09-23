import { gsap, ScrollTrigger } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'
import { journeyEmissionConfigs, sampleEmission, SPAWN_END, APPROACH_END } from './journeyEmission'
import type { EmissionConfig } from './journeyEmission'

function createCardEmissionAnimation(card: HTMLElement, config: EmissionConfig, stage: HTMLElement) {
  const clock = { life: 0 }
  let geometry = { width: 0, height: 0, cardWidth: 0, cardHeight: 0 }
  let origin = { x: 0, y: 0 }

  // Read layout only on setup/refresh, never inside the animation render loop.
  const measure = () => {
    geometry = {
      width: stage.clientWidth,
      height: stage.clientHeight,
      cardWidth: card.offsetWidth,
      cardHeight: card.offsetHeight,
    }
    origin = {
      x: geometry.width / 2 - card.offsetLeft - geometry.cardWidth / 2,
      y: geometry.height / 2 - card.offsetTop - geometry.cardHeight / 2,
    }
  }
  const render = () => {
    const frame = sampleEmission(clock.life, config, geometry)
    card.style.transform = `translate3d(${origin.x + frame.x}px, ${origin.y + frame.y}px, 0) scale(${frame.scale})`
  }

  measure()
  render()
  const timeline = gsap.timeline({ onUpdate: render, defaults: { ease: 'none' } })
  timeline
    .to(clock, { life: SPAWN_END, duration: config.duration * SPAWN_END })
    .to(clock, { life: APPROACH_END, duration: config.duration * (APPROACH_END - SPAWN_END) })
    .to(clock, { life: 1, duration: config.duration * (1 - APPROACH_END) })

  return { timeline, measure, render }
}

export const createJourneyTimeline: SectionAnimation = (scope, conditions) => {
  if (!conditions.desktop) return

  const stage = scope.querySelector<HTMLElement>('.journey-universe__sticky')
  const center = scope.querySelector<HTMLElement>('.journey-universe__center')
  const cards = selectAll<HTMLElement>(scope, '[data-journey-card]')
  const orbits = selectAll<HTMLElement>(scope, '.journey-universe__orbit')
  const scrollLine = scope.querySelector<HTMLElement>('.journey-universe__scroll-note i')
  if (!stage || !center || cards.length === 0) return
  const originalTransforms = cards.map(card => card.style.transform)

  // Context-owned writes restore sizing on unmount/media changes. The direct
  // projected transforms are restored explicitly after child onUpdate callbacks.
  gsap.set(cards, {
    scale: 0,
    opacity: 1,
    z: 0,
    transformOrigin: '50% 50%',
    width: '80vw',
    height: '60vw',
    zIndex: (i: number) => cards.length - i,
  })
  gsap.set(center, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1 })
  gsap.set(orbits, { scale: 0.92, opacity: 0.65, transformOrigin: 'center center' })
  gsap.set(scrollLine, { scaleY: 0, transformOrigin: 'top center' })

  const emissions = cards.map((card, index) => createCardEmissionAnimation(card, journeyEmissionConfigs[index], stage))
  const refreshGeometry = () => emissions.forEach(({ measure, render }) => { measure(); render() })
  const master = gsap.timeline({
    scrollTrigger: {
      id: 'journey-emission',
      trigger: scope,
      // The existing 100svh CSS sticky stage holds the viewport; no double pin.
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.65,
      invalidateOnRefresh: true,
      ...performanceCallbacks([center, ...cards, ...orbits].filter(Boolean), 'transform'),
    },
  })

  emissions.forEach(({ timeline }, index) => master.add(timeline, journeyEmissionConfigs[index].start))
  master
    .to(center, { scale: 0.96, y: -8, duration: 0.5, ease: 'sine.inOut' }, 0)
    .to(center, { scale: 1, y: 0, duration: 0.5, ease: 'sine.inOut' }, 0.5)
    .to(orbits, { scale: 1.06, rotation: 12, duration: 1, ease: 'none' }, 0)
    .to(scrollLine, { scaleY: 1, duration: 1, ease: 'none' }, 0)

  ScrollTrigger.addEventListener('refresh', refreshGeometry)
  return () => {
    ScrollTrigger.removeEventListener('refresh', refreshGeometry)
    cards.forEach((card, index) => {
      if (originalTransforms[index]) card.style.transform = originalTransforms[index]
      else card.style.removeProperty('transform')
    })
  }
}
