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
  const visual = scope.querySelector<HTMLElement>('.meaning__visual')
  const chapters = selectAll<HTMLElement>(scope, '.meaning__chapter')
  const counters = selectAll<HTMLElement>(scope, '.meaning__counter span')
  const ghosts = selectAll<HTMLElement>(scope, '.meaning__ghost')
  const visuals = selectAll<HTMLElement>(scope, '.meaning__visual-layer')

  if (!scrollArea || !sticky || !visual || chapters.length === 0) return

  gsap.set(chapters, { autoAlpha: 0, xPercent: 0, yPercent: 0, clipPath: 'inset(0 0 0% 0)' })
  gsap.set(chapters[0], { autoAlpha: 1 })
  gsap.set(counters, { opacity: 0.24, x: 0, scale: 1 })
  gsap.set(counters[0], { opacity: 1, x: -8, scale: 1.18 })
  gsap.set(ghosts, { autoAlpha: 0, xPercent: 0 })
  gsap.set(ghosts[0], { autoAlpha: 1 })
  gsap.set(visuals, {
    autoAlpha: 0,
    scale: 0.9,
    xPercent: 0,
    yPercent: 0,
    rotationX: 4,
    rotationY: -10,
    transformPerspective: 1100,
    transformOrigin: '50% 50%',
  })
  gsap.set(visuals[0], { autoAlpha: 1, scale: 1, rotationX: 0, rotationY: 0 })

  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let sceneActive = false
  let tickerAttached = false

  const renderParallax = () => {
    currentX += (targetX - currentX) * 0.075
    currentY += (targetY - currentY) * 0.075
    visual.style.setProperty('--meaning-pfx', `${currentX.toFixed(2)}px`)
    visual.style.setProperty('--meaning-pfy', `${currentY.toFixed(2)}px`)
    visual.style.setProperty('--meaning-pmx', `${(currentX * 0.48).toFixed(2)}px`)
    visual.style.setProperty('--meaning-pmy', `${(currentY * 0.48).toFixed(2)}px`)
    visual.style.setProperty('--meaning-pbx', `${(currentX * -0.12).toFixed(2)}px`)
    visual.style.setProperty('--meaning-pby', `${(currentY * -0.12).toFixed(2)}px`)
  }

  const syncTicker = () => {
    if (sceneActive === tickerAttached) return
    tickerAttached = sceneActive
    if (sceneActive) gsap.ticker.add(renderParallax)
    else gsap.ticker.remove(renderParallax)
  }

  const handlePointerMove = (event: PointerEvent) => {
    const bounds = sticky.getBoundingClientRect()
    targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 14
    targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10
  }

  const resetParallax = () => {
    targetX = 0
    targetY = 0
  }

  const visibility = new IntersectionObserver(([entry]) => {
    sceneActive = entry.isIntersecting
    syncTicker()
  })
  visibility.observe(sticky)
  sticky.addEventListener('pointermove', handlePointerMove, { passive: true })
  sticky.addEventListener('pointerleave', resetParallax)

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
    const visualNodes = selectAll<HTMLElement>(visuals[currentIndex], '.meaning__visual-node')
    const visualPaths = selectAll<SVGPathElement>(
      visuals[currentIndex],
      '.meaning__visual-path--core, .meaning__visual-path--glow',
    )
    const visualPackets = selectAll<SVGCircleElement>(visuals[currentIndex], '.meaning__visual-packet')

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
        scale: 0.9,
        xPercent: -5 * direction,
        rotationY: 9 * direction,
        duration: 0.48,
      }, position)
      .fromTo(
        visuals[currentIndex],
        { autoAlpha: 0, scale: 0.9, xPercent: 7 * direction, rotationY: -12 * direction, rotationX: 4, rotationZ: 1.8 * direction, filter: 'blur(8px)' },
        { autoAlpha: 1, scale: 1, xPercent: 0, rotationY: 0, rotationX: 0, rotationZ: 0, filter: 'blur(0px)', duration: 0.72 },
        position + 0.04,
      )
      .fromTo(
        visualPaths,
        { strokeDasharray: 100, strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 0.86, stagger: 0.08, ease: 'power2.inOut' },
        position + 0.08,
      )
      .fromTo(
        visualPackets,
        { opacity: 0, scale: 0.2, transformOrigin: 'center' },
        { opacity: 1, scale: 1, stagger: 0.1, duration: 0.38 },
        position + 0.24,
      )
      .fromTo(
        visualNodes,
        { opacity: 0.12, filter: 'blur(5px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: currentIndex === 2 ? 0.09 : 0.055,
          duration: currentIndex === 2 ? 0.42 : 0.34,
        },
        position + 0.14,
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

  return () => {
    sticky.removeEventListener('pointermove', handlePointerMove)
    sticky.removeEventListener('pointerleave', resetParallax)
    visibility.disconnect()
    gsap.ticker.remove(renderParallax)
    ;['--meaning-pfx', '--meaning-pfy', '--meaning-pmx', '--meaning-pmy', '--meaning-pbx', '--meaning-pby']
      .forEach((property) => visual.style.removeProperty(property))
  }
}
