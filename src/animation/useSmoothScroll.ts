import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, requestScrollRefresh, ScrollTrigger } from './gsap'

const DISABLE_SMOOTH_SCROLL = '(max-width: 820px), (pointer: coarse), (prefers-reduced-motion: reduce)'

export function useSmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia(DISABLE_SMOOTH_SCROLL)
    let disposeLenis = () => undefined

    const configure = () => {
      disposeLenis()
      disposeLenis = () => undefined

      if (media.matches) {
        document.documentElement.classList.remove('has-smooth-scroll')
        requestScrollRefresh()
        return
      }

      const lenis = new Lenis({
        autoRaf: false,
        duration: 1.05,
        easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.92,
      })

      const updateScrollTrigger = () => ScrollTrigger.update()
      const resizeLenis = () => lenis.resize()
      const tick = (time: number) => lenis.raf(time * 1000)

      document.documentElement.classList.add('has-smooth-scroll')
      lenis.on('scroll', updateScrollTrigger)
      ScrollTrigger.addEventListener('refresh', resizeLenis)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      requestScrollRefresh()

      disposeLenis = () => {
        gsap.ticker.remove(tick)
        gsap.ticker.lagSmoothing(500, 33)
        ScrollTrigger.removeEventListener('refresh', resizeLenis)
        lenis.off('scroll', updateScrollTrigger)
        lenis.destroy()
        document.documentElement.classList.remove('has-smooth-scroll')
      }
    }

    configure()
    media.addEventListener('change', configure)

    return () => {
      media.removeEventListener('change', configure)
      disposeLenis()
    }
  }, [])
}
