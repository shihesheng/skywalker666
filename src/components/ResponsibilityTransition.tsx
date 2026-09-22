import { createTransitionTimeline } from '../animation/sections/transition.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { transitionContent } from '../data/siteContent'

export function ResponsibilityTransition() {
  const sectionRef = useSectionTimeline<HTMLElement>(createTransitionTimeline)

  return (
    <section ref={sectionRef} className="responsibility section-shell" aria-labelledby="responsibility-title">
      <div className="responsibility__lines">
        <h2 id="responsibility-title" data-motion>{transitionContent.title}</h2>
        <h2 className="responsibility__second" data-motion>{transitionContent.secondLine}</h2>
      </div>
      <div className="responsibility__body" data-motion>
        {transitionContent.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>
  )
}
