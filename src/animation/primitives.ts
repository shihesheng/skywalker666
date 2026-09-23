import { MOTION } from './config'
import { gsap } from './gsap'
import type { AnimationConditions } from './types'
import { performanceCallbacks, selectAll } from './utils'

type MotionTarget = Parameters<typeof gsap.set>[0]
type MotionTimeline = ReturnType<typeof gsap.timeline>
type TimelinePosition = number | string

type TypographyRevealOptions = {
  direction?: 'up' | 'left' | 'right'
  duration?: number
  stagger?: number
  distance?: number
}
type EditorialSlideOptions = {
  content: MotionTarget
  line?: MotionTarget
  direction?: 'left' | 'right' | 'up'
  duration?: number
  lineDuration?: number
  stagger?: number
}

const revealState = (direction: NonNullable<TypographyRevealOptions['direction']>, distance: number) => {
  if (direction === 'left') return { x: distance, y: 0, clipPath: 'inset(0 0 0 100%)' }
  if (direction === 'right') return { x: -distance, y: 0, clipPath: 'inset(0 100% 0 0)' }
  return { x: 0, y: distance, clipPath: 'inset(0 0 100% 0)' }
}

export function typographyReveal(
  timeline: MotionTimeline,
  targets: MotionTarget,
  options: TypographyRevealOptions = {},
  position: TimelinePosition = 0,
) {
  const direction = options.direction ?? 'up'
  const distance = options.distance ?? 28

  return timeline.fromTo(
    targets,
    revealState(direction, distance),
    {
      x: 0,
      y: 0,
      clipPath: 'inset(0 0 0% 0)',
      duration: options.duration ?? MOTION.duration.largeType,
      stagger: options.stagger ?? MOTION.stagger.words,
      ease: MOTION.ease.emphatic,
    },
    position,
  )
}
export function editorialSlide(
  timeline: MotionTimeline,
  options: EditorialSlideOptions,
  position: TimelinePosition = 0,
) {
  const direction = options.direction ?? 'left'
  const from = revealState(direction, direction === 'up' ? 18 : 24)

  if (options.line) {
    timeline.fromTo(
      options.line,
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: direction === 'right' ? 'right center' : 'left center',
        duration: options.lineDuration ?? MOTION.duration.micro,
        ease: MOTION.ease.out,
      },
      position,
    )
  }

  return timeline.fromTo(
    options.content,
    from,
    {
      x: 0,
      y: 0,
      clipPath: 'inset(0 0 0% 0)',
      duration: options.duration ?? MOTION.duration.text,
      stagger: options.stagger ?? MOTION.stagger.editorial,
      ease: MOTION.ease.out,
    },
    typeof position === 'number' ? position + 0.12 : `${position}+=0.12`,
  )
}

export function drawSvgPaths(
  timeline: MotionTimeline,
  paths: SVGGeometryElement[],
  position: TimelinePosition = 0,
) {
  paths.forEach((path) => {
    const length = Math.max(path.getTotalLength(), 1)
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
  })

  return timeline.to(
    paths,
    {
      strokeDashoffset: 0,
      duration: MOTION.duration.text,
      stagger: MOTION.stagger.marks,
      ease: MOTION.ease.out,
    },
    position,
  )
}

export function addDepthParallax(scope: HTMLElement, conditions: AnimationConditions) {
  const layers = selectAll<HTMLElement>(scope, '[data-depth]')
  const mobileFactor = conditions.mobile ? 0.45 : 1
  const distance = {
    background: -14,
    content: -5,
    foreground: -24,
  } as const

  layers.forEach((layer) => {
    const level = (layer.dataset.depth ?? 'content') as keyof typeof distance
    gsap.to(layer, {
      y: distance[level] * mobileFactor,
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        trigger: scope,
        start: 'top bottom',
        end: 'bottom top',
        scrub: MOTION.scrub.soft,
        invalidateOnRefresh: true,
        ...performanceCallbacks(layer),
      },
    })
  })
}

export function paperStackReveal(
  timeline: MotionTimeline,
  papers: MotionTarget,
  position: TimelinePosition = 0,
) {
  return timeline.fromTo(
    papers,
    { y: 52, scale: 0.985, rotation: 1.8 },
    {
      y: 0,
      scale: 1,
      rotation: 0,
      duration: MOTION.duration.section,
      stagger: MOTION.stagger.cards,
      ease: MOTION.ease.expo,
    },
    position,
  )
}
