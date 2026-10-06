import { MOTION } from '../config'
import { gsap } from '../gsap'
import type { SectionAnimation } from '../types'
import { performanceCallbacks, selectAll } from '../utils'

const TAU = Math.PI * 2
const CIRCULATION_SPEED = 0.065
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const wrap = (value: number, span: number) => ((value + span / 2) % span + span) % span - span / 2
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

export const createJourneyOrbitTimeline: SectionAnimation = (scope, conditions) => {
  if (!conditions.desktop) return

  const stage = scope.querySelector<HTMLElement>('.orbit-bridge__sticky')
  const copy = scope.querySelector<HTMLElement>('[data-orbit-copy]')
  const intro = scope.querySelector<HTMLElement>('[data-orbit-intro]')
  const cards = selectAll<HTMLElement>(scope, '[data-orbit-card]')
  if (!stage || !copy || !intro || !cards.length) return

  // One photo ribbon: compact tangent-aligned ring, scroll-driven unrolling,
  // then continuous circulation along the lower arc.
  const motion = { expansion: 0 }
  let direction = 1
  let phase = 0
  let tickerAttached = false
  const originalStyles = cards.map(card => card.getAttribute('style'))
  const delays = cards.map((_, index) => index / Math.max(1, cards.length - 1) * 0.06)
  let width = 0
  let height = 0
  let radius = 0
  let arcRadius = 0
  let arcSpan = 0
  let scaleStart = 1
  let scaleEnd = 1
  let arcApex = 0

  const render = () => {
    cards.forEach((card, index) => {
      const delay = delays[index]
      const progress = gsap.utils.clamp(0, 1, (motion.expansion - delay) / (1 - delay))
      const unfurl = Math.sin(progress * Math.PI)
      const currentRadius = mix(radius, arcRadius, progress)
      const centerX = width * (0.5 + 0.13 * unfurl)
      const centerY = mix(height * 0.5, arcApex + arcRadius, progress)
      const span = mix(TAU, arcSpan, progress)
      const baseAngle = (index / cards.length - 0.5) * span
      const circulationWeight = Math.max(0, (progress - 0.85) / 0.15)
      // A shared sweep curls the ribbon sideways during unfolding. Avoid
      // wrapping this sweep: the open ends must travel continuously, not jump.
      const angle = wrap(baseAngle + phase * circulationWeight, span) - unfurl * 0.85
      const x = centerX + Math.sin(angle) * currentRadius
      const y = centerY - Math.cos(angle) * currentRadius
      const scale = mix(scaleStart, scaleEnd, progress)
      // A full half-turn, briefly held upside down, then unwind onto the arc.
      // Keep this separate from the path's sideways sweep so that it cannot
      // cancel the 180-degree flip of the center card.
      const flip = 180 * smooth(progress / 0.42) * (1 - smooth((progress - 0.58) / 0.42))
      const rotation = (angle + unfurl * 0.85) * 180 / Math.PI + flip
      card.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`
    })
  }

  const measure = () => {
    width = stage.clientWidth
    height = stage.clientHeight
    radius = Math.min(height * 0.39, width * 0.32)
    arcRadius = width * 0.92
    // Twelve unique photos; both ends of the circulating ribbon are offscreen.
    arcSpan = 1.8
    // Cap vertical whitespace in tall desktop windows.
    arcApex = Math.min(height * 0.76, width * 0.47)
    const cardWidth = cards[0].offsetWidth
    scaleStart = radius * 0.38 / cardWidth
    scaleEnd = Math.min(width * 0.112, height * 0.27 * 0.71, 166) / cardWidth
    render()
  }
  measure()
  gsap.set(copy, { autoAlpha: 0, y: 20 })
  gsap.set(intro, { autoAlpha: 1 })

  let sceneActive = false
  // Pointer height selects direction only. Speed stays constant even when
  // the pointer is stationary; the neutral band retains the last direction.
  const tick = (_time: number, deltaMs: number) => {
    if (document.hidden || motion.expansion < 0.999999) return
    const dt = Math.min(deltaMs, 50) / 1000
    phase = wrap(phase + direction * CIRCULATION_SPEED * dt, arcSpan)
    render()
  }
  const syncTicker = () => {
    const shouldRun = sceneActive && !document.hidden
    if (shouldRun === tickerAttached) return
    tickerAttached = shouldRun
    if (shouldRun) gsap.ticker.add(tick)
    else gsap.ticker.remove(tick)
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      id: 'journey-orbit-transition',
      trigger: scope,
      start: 'top top',
      end: 'bottom bottom',
      scrub: MOTION.scrub.soft,
      onRefresh: measure,
      ...performanceCallbacks([...cards, copy, intro], 'transform, opacity'),
    },
  })
  timeline
    .to(motion, { expansion: 1, duration: 0.68, ease: 'power2.inOut', onUpdate: render }, 0.08)
    .to(intro, { autoAlpha: 0, duration: 0.16, ease: 'none' }, 0.1)
    .to(copy, { autoAlpha: 1, y: 0, duration: 0.22, ease: MOTION.ease.out }, 0.43)
    .to({}, { duration: 0.24 }, 0.76)
  // Keep circulating while the scene is visible, including after the sticky
  // hold ends. Stop the ticker entirely when this section leaves the screen.
  const visibility = new IntersectionObserver(([entry]) => {
    sceneActive = entry.isIntersecting
    syncTicker()
  })
  visibility.observe(stage)

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || !sceneActive) return
    const position = (event.clientY - stage.getBoundingClientRect().top) / height
    if (position < 0.44) direction = -1
    else if (position > 0.56) direction = 1
  }
  stage.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.addEventListener('visibilitychange', syncTicker)

  return () => {
    stage.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('visibilitychange', syncTicker)
    visibility.disconnect()
    gsap.ticker.remove(tick)
    // Direct transform writes must also revert on breakpoint changes/unmount.
    cards.forEach((card, index) => {
      const style = originalStyles[index]
      if (style === null) card.removeAttribute('style')
      else card.setAttribute('style', style)
    })
  }
}
