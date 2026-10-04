import { createJourneyTimeline } from '../animation/sections/journey.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { journeyIntro } from '../data/siteContent'
import { StoryImage } from './StoryImage'

const expansionSources = [
  new URL('../../woyuwailian/e1871ccb124f8f12fc3ceeeb58e2a7dd.jpg', import.meta.url).href,
  new URL('../../woyuwailian/d856c003901469ed3fc00235fd52d94b.jpg', import.meta.url).href,
  new URL('../../woyuwailian/60ceefc2a6c5eeccfae829dd32182667.jpg', import.meta.url).href,
  new URL('../../woyuwailian/bfa480fedba9688594735b2c6068e92d.jpg', import.meta.url).href,
  new URL('../../woyuwailian/c8ef2257ca952bccb3c12cdf1ce1a146.jpg', import.meta.url).href,
  new URL('../../woyuwailian/47dabacbd1e1a632ce4274390ad1b183.jpg', import.meta.url).href,
  new URL('../../woyuwailian/40198ae8185e358303b55ad1e52c9b26.jpg', import.meta.url).href,
  new URL('../../woyuwailian/0b4430ee3d2217d8d139cea9c9921be9.jpg', import.meta.url).href,
  new URL('../../woyuwailian/ba3fa963f8078908e69cb5ee177b5892.jpg', import.meta.url).href,
  new URL('../../woyuwailian/a6cefd3e6babdb1c6d2347fe84b48c47.jpg', import.meta.url).href,
  new URL('../../woyuwailian/8f0d3fa9836561429ec547034cb2249a.jpg', import.meta.url).href,
  new URL('../../woyuwailian/658765e0d248fc9192de0a47c3e3270f.jpg', import.meta.url).href,
  new URL('../../woyuwailian/a952aa2c141e8a048465af33b4694465.jpg', import.meta.url).href,
  new URL('../../woyuwailian/c452402df199839376e07184461252d3.jpg', import.meta.url).href,
  new URL('../../woyuwailian/4cec16fb4ef9033b50f658badc42e062.jpg', import.meta.url).href,
  new URL('../../woyuwailian/3ff9c81094bfb5d3d4ad191d2b82f1c1.jpg', import.meta.url).href,
  new URL('../../woyuwailian/c6d05a4f20f2acac8f6aaff1eaf6cbe7.jpg', import.meta.url).href,
  new URL('../../woyuwailian/2f264b5232b6b2a628a2ce1c40f8b780.jpg', import.meta.url).href,
  new URL('../../woyuwailian/ddc59ec6d9a342af9dfcde2ccadc2588.jpg', import.meta.url).href,
  new URL('../../woyuwailian/b163a628733aa7d9dbbc1c6164bf21f6.jpg', import.meta.url).href,
]

const expansionImages = expansionSources.map((src, index) => ({
  src,
  alt: `我与外联活动记录 ${String(index + 1).padStart(2, '0')}`,
  label: `MEMORY / ${String(index + 1).padStart(2, '0')}`,
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
              <StoryImage {...image} eager={index < 5} />
              <div className="journey-universe__caption">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>EXTERNAL RELATIONS / MEMORY</p>
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
