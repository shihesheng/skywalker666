import { useLayoutEffect, useRef } from 'react'
import { MOTION_MEDIA } from './config'
import { gsap, ScrollTrigger } from './gsap'
import type { AnimationConditions, SectionAnimation } from './types'

export function useSectionTimeline<T extends HTMLElement>(createAnimation: SectionAnimation) {
  const scopeRef = useRef<T>(null)

  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    const media = gsap.matchMedia()

    media.add(MOTION_MEDIA, (context) => {
      const conditions = context.conditions as AnimationConditions

      if (conditions.reduced) {
        gsap.set(scope.querySelectorAll('[data-motion]'), { clearProps: 'all' })
        return
      }

      const gsapContext = gsap.context(() => createAnimation(scope, conditions), scope)
      return () => gsapContext.revert()
    })

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshFrame)
      media.revert()
    }
  }, [createAnimation])

  return scopeRef
}
