import { useLayoutEffect, useRef } from 'react'
import { MOTION_MEDIA } from './config'
import { gsap, requestScrollRefresh } from './gsap'
import type { AnimationConditions, SectionAnimation } from './types'

export function useSectionTimeline<T extends HTMLElement>(createAnimation: SectionAnimation) {
  const scopeRef = useRef<T>(null)

  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    const media = gsap.matchMedia()
    let active = true

    media.add(MOTION_MEDIA, (context) => {
      const conditions = context.conditions as AnimationConditions

      if (conditions.reduced) {
        gsap.set(scope.querySelectorAll('[data-motion]'), { clearProps: 'all' })
        return
      }

      const gsapContext = gsap.context(() => createAnimation(scope, conditions), scope)
      return () => gsapContext.revert()
    })

    // ScrollTrigger must measure after fonts, lazy images, responsive layout and
    // bfcache/tab restores have settled. A single mount-time RAF is too early
    // for those asynchronous layout changes and can leave a scrubbed scene in
    // its hidden initial state until the next resize.
    const refresh = () => {
      if (active) requestScrollRefresh()
    }

    const resizeObserver = new ResizeObserver(refresh)
    resizeObserver.observe(scope)

    const pendingImages = Array.from(scope.querySelectorAll('img')).filter(
      (image) => !image.complete,
    )
    pendingImages.forEach((image) => {
      image.addEventListener('load', refresh, { once: true })
      image.addEventListener('error', refresh, { once: true })
    })

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    window.addEventListener('pageshow', refresh)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    document.fonts?.ready.then(refresh).catch(() => undefined)
    refresh()

    return () => {
      active = false
      resizeObserver.disconnect()
      pendingImages.forEach((image) => {
        image.removeEventListener('load', refresh)
        image.removeEventListener('error', refresh)
      })
      window.removeEventListener('pageshow', refresh)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      media.revert()
    }
  }, [createAnimation])

  return scopeRef
}
