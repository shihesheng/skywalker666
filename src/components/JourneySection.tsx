import { createJourneyTimeline } from '../animation/sections/journey.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { experiences, journeyIntro, type Experience } from '../data/siteContent'
import { StoryImage } from './StoryImage'
import { HandwrittenNote } from './decorations/HandwrittenNote'
import { Tape } from './decorations/Tape'

function ExperienceChapter({ experience }: { experience: Experience }) {
  return (
    <article className={`event event--${experience.tone}`} aria-labelledby={`event-${experience.id}`}>
      {experience.tone === 'launch' && <span className="event__background-word" aria-hidden="true">LAUNCH</span>}
      <span className="event__number" aria-hidden="true">{experience.id}</span>

      <div className="event__copy" data-motion>
        <span className="event__label">EVENT {experience.id}</span>
        <h3 id={`event-${experience.id}`}>{experience.title}</h3>
        <p className="event__english">{experience.englishTitle}</p>
        <div className="event__body">
          {experience.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {experience.keywords && (
          <ul className="event__keywords" aria-label="关键词">
            {experience.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
          </ul>
        )}
      </div>

      <div
        className={`event__photos event__photos--${experience.images.length}`}
        data-motion
      >
        {experience.images.map((image, index) => (
          <div className={`event__photo event__photo--${index + 1}`} key={image.src}>
            {(experience.tone === 'opening' || experience.tone === 'climax') && index === 1 && <Tape />}
            <StoryImage {...image} />
          </div>
        ))}
      </div>

      {experience.annotation && (
        <HandwrittenNote className="event__annotation">{experience.annotation}</HandwrittenNote>
      )}
    </article>
  )
}

export function JourneySection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createJourneyTimeline)

  return (
    <section ref={sectionRef} className="journey" aria-labelledby="journey-title">
      <header className="journey__intro section-shell">
        <div className="journey__intro-index" aria-hidden="true">02</div>
        <div>
          <p className="section-kicker">{journeyIntro.eyebrow}</p>
          <h2 id="journey-title">{journeyIntro.title}</h2>
        </div>
        <div className="journey__intro-copy">
          <p className="journey__english">{journeyIntro.englishTitle}</p>
          <p>{journeyIntro.body}</p>
        </div>
      </header>

      <div className="journey__chapters section-shell">
        <aside className="journey__rail" aria-hidden="true">
          <span>MEMORIES</span>
          <span className="journey__rail-line" />
          <span>01—06</span>
        </aside>
        {experiences.map((experience) => (
          <ExperienceChapter experience={experience} key={experience.id} />
        ))}
      </div>
    </section>
  )
}
