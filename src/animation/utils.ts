import { gsap } from './gsap'

type GsapTarget = Parameters<typeof gsap.set>[0]

export function selectAll<T extends Element>(scope: Element, selector: string): T[] {
  return Array.from(scope.querySelectorAll<T>(selector))
}

export function performanceCallbacks(targets: GsapTarget, properties = 'transform, opacity') {
  const prepare = () => gsap.set(targets, { willChange: properties })
  const release = () => gsap.set(targets, { clearProps: 'willChange' })

  return {
    onEnter: prepare,
    onEnterBack: prepare,
    onLeave: release,
    onLeaveBack: release,
  }
}
