import { createVisionTimeline } from '../animation/sections/vision.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { futureIntro, plans, type PlanChapter } from '../data/siteContent'
import { DoodleArrow } from './decorations/DoodleArrow'
import { HandwrittenNote } from './decorations/HandwrittenNote'

function Plan({ plan }: { plan: PlanChapter }) {
  return (
    <article
      className={`plan plan--${plan.id}`}
      data-motion
      aria-labelledby={`plan-${plan.id}`}
    >
      <span className="plan__number" data-motion aria-hidden="true">{plan.id}</span>
      <div className="plan__copy">
        <span className="plan__label">PLAN {plan.id}</span>
        <h3 id={`plan-${plan.id}`}>{plan.title}</h3>
        <p className="plan__english">{plan.englishTitle}</p>
        <div className="plan__body">
          {plan.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <blockquote>{plan.statement}</blockquote>
      </div>

      {plan.notes && (
        <div className={`plan__notes ${plan.id === '02' ? 'plan__notes--questions' : ''}`} aria-label="补充要点">
          {plan.notes.map((note, index) => (
            plan.id === '02'
              ? <HandwrittenNote key={note} className={`plan__question plan__question--${index + 1}`}>{note}</HandwrittenNote>
              : <span key={note}>{note}</span>
          ))}
          {plan.id === '02' && <strong>We know what to do.</strong>}
        </div>
      )}

      {plan.id === '03' && <span className="plan__connection-line" aria-hidden="true" />}
      {plan.id === '04' && <DoodleArrow className="plan__arrow" direction="left" />}
    </article>
  )
}

export function FutureSection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createVisionTimeline)

  return (
    <section ref={sectionRef} className="future section-shell" aria-labelledby="future-title">
      <header className="future__intro">
        <p className="section-kicker">{futureIntro.eyebrow}</p>
        <h2 id="future-title">{futureIntro.title}</h2>
        <p className="future__english">{futureIntro.englishTitle}</p>
        <div className="future__intro-body">
          {futureIntro.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </header>

      <div className="future__plans">
        {plans.map((plan) => <Plan plan={plan} key={plan.id} />)}
      </div>
    </section>
  )
}
