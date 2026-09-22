import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({
  ignoreMobileResize: true,
  limitCallbacks: true,
})

let refreshFrame: number | undefined

export function requestScrollRefresh() {
  if (refreshFrame !== undefined) window.cancelAnimationFrame(refreshFrame)
  refreshFrame = window.requestAnimationFrame(() => {
    refreshFrame = undefined
    ScrollTrigger.refresh()
  })
}

export { gsap, ScrollTrigger }
