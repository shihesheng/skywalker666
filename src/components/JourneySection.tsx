import { createJourneyTimeline } from '../animation/sections/journey.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { experiences, journeyIntro, type Experience } from '../data/siteContent'
import { StoryImage } from './StoryImage'
import { HandwrittenNote } from './decorations/HandwrittenNote'
import { Tape } from './decorations/Tape'

function ExperienceScene({ experience }: { experience: Experience }) {
  return (
    <article
      className={`experience-scene experience-scene--${experience.tone}`}
      data-experience={experience.id}
      aria-labelledby={`event-${experience.id}`}
    >
      <span className="experience-scene__number" aria-hidden="true">{experience.id}</span>

      <div className="experience-scene__copy" data-motion>
        <span className="event__label">EVENT {experience.id}</span>
        <h3 id={`event-${experience.id}`}>{experience.title}</h3>
        <p className="experience-scene__english">{experience.englishTitle}</p>
        <div className="experience-scene__body">
          {experience.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {experience.keywords && (
          <ul className="experience-scene__keywords" aria-label="关键词">
            {experience.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
          </ul>
        )}
      </div>

      <div className={`experience-scene__media experience-scene__media--${experience.images.length}`} data-motion>
        {experience.images.map((image, index) => (
          <div className={`experience-scene__photo experience-scene__photo--${index + 1}`} key={image.src}>
            {(experience.tone === 'opening' || experience.tone === 'climax') && index === 1 && <Tape />}
            <StoryImage {...image} />
          </div>
        ))}
      </div>

      {experience.annotation && (
        <HandwrittenNote className="experience-scene__annotation">{experience.annotation}</HandwrittenNote>
      )}
    </article>
  )
}

export function JourneySection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createJourneyTimeline)

  return (
    <section ref={sectionRef} className="journey journey-cinematic" aria-labelledby="journey-title">
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

      <div className="journey-film">
        <div className="journey-film__stage">
          <div className="journey-film__inner section-shell">
            <aside className="journey-film__navigation" aria-hidden="true">
              <span className="journey-film__label">FIELD NOTES</span>
              <ol>
                {experiences.map((experience) => <li key={experience.id}>{experience.id}</li>)}
              </ol>
              <span className="journey-film__track"><i /></span>
            </aside>

            <div className="journey-film__scenes">
              {experiences.map((experience) => (
                <ExperienceScene experience={experience} key={experience.id} />
              ))}
            </div>

            <div className="journey-film__bridge" aria-hidden="true">
              <span>FROM MOMENTS</span>
              <i />
              <span>TO MEANING</span>
            </div>
            <span className="journey-film__chapter" aria-hidden="true">MEMORIES / 01—06</span>
          </div>
        </div>
      </div>
    </section>
  )
}
