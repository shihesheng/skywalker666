import { createEndingTimeline } from '../animation/sections/ending.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { outroContent, siteMeta } from '../data/siteContent'
import { StoryImage } from './StoryImage'

export function OutroSection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createEndingTimeline)

  return (
    <footer ref={sectionRef} className="outro section-shell" aria-labelledby="outro-title">
      <div className="outro__fragments" aria-hidden="true">
        {outroContent.fragments.map((fragment, index) => (
          <StoryImage {...fragment} className={`outro__fragment outro__fragment--${index + 1}`} key={fragment.src} />
        ))}
      </div>
      <div
        className="outro__copy"
        data-motion
      >
        <span className="section-kicker">05 / THANK YOU</span>
        <h2 id="outro-title">{outroContent.title}</h2>
        <p className="outro__english">{outroContent.englishTitle}</p>
        <p className="outro__note">{outroContent.note}</p>
        <div className="outro__signature">
          <strong>{siteMeta.name}</strong>
          <span>{siteMeta.englishRole}</span>
        </div>
      </div>
    </footer>
  )
}
