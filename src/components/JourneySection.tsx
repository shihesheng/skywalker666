import { createJourneyTimeline } from '../animation/sections/journey.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { journeyIntro } from '../data/siteContent'
import { StoryImage } from './StoryImage'

const expansionImages = Array.from({ length: 20 }, (_, index) => ({
  src: `/images/journey-expansion-${String(index + 1).padStart(2, '0')}.jpg`,
  alt: `我与外联扩散图片占位 ${index + 1}`,
  label: `EXPANSION / ${String(index + 1).padStart(2, '0')}`,
}))

export function JourneySection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createJourneyTimeline)

  return (
    <section
      ref={sectionRef}
      className="journey-universe"
      aria-labelledby="journey-title"
      data-fd-id="section-journey"
    >
      <div className="journey-universe__sticky">
        <div className="journey-universe__legend" aria-hidden="true">
          <span>(BEGINNING)</span>
          <span>(CONNECTION)</span>
          <span>(MEMORIES)</span>
        </div>

        <div className="journey-universe__orbits" aria-hidden="true">
          <i className="journey-universe__orbit journey-universe__orbit--1" />
          <i className="journey-universe__orbit journey-universe__orbit--2" />
          <i className="journey-universe__orbit journey-universe__orbit--3" />
          <b />
        </div>

        <header className="journey-universe__center">
          <p className="section-kicker">{journeyIntro.eyebrow}</p>
          <h2 id="journey-title">{journeyIntro.title}</h2>
          <p>{journeyIntro.englishTitle}</p>
          <span>{journeyIntro.body}</span>
        </header>

        <div className="journey-universe__cards">
          {expansionImages.map((image, index) => (
            <article
              className={`journey-universe__card journey-universe__card--${index + 1}`}
              data-journey-card
              key={image.src}
            >
              <StoryImage {...image} />
              <div className="journey-universe__caption">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>IMAGE PLACEHOLDER</p>
              </div>
            </article>
          ))}
        </div>

        <div className="journey-universe__scroll-note" aria-hidden="true">
          <span>SCROLL TO EXPAND</span>
          <i />
        </div>

      </div>
    </section>
  )
}
