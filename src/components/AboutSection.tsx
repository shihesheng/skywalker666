import { createAboutTimeline } from '../animation/sections/about.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { aboutContent } from '../data/siteContent'
import { StoryImage } from './StoryImage'
import { HandwrittenNote } from './decorations/HandwrittenNote'
import { Tape } from './decorations/Tape'

export function AboutSection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createAboutTimeline)

  return (
    <section ref={sectionRef} className="about section-shell" aria-labelledby="about-title">
      <div className="about__rule" aria-hidden="true" />
      <div className="about__copy" data-motion>
        <p className="section-kicker">{aboutContent.eyebrow}</p>
        <h2 id="about-title">{aboutContent.title}</h2>
        <p className="about__english">{aboutContent.englishTitle}</p>
        <p className="body-copy">{aboutContent.body}</p>
        <HandwrittenNote>{aboutContent.note}</HandwrittenNote>
      </div>

      <div className="about__collage">
        <div className="about__image about__image--large" data-motion>
          <StoryImage {...aboutContent.images[0]} />
        </div>
        <div className="about__image about__image--small" data-motion>
          <Tape />
          <StoryImage {...aboutContent.images[1]} />
        </div>
        <p className="about__margin-note">PERSON / COMMUNITY / MOMENTS</p>
      </div>
    </section>
  )
}
