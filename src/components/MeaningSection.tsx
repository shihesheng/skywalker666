import { createMeaningTimeline } from '../animation/sections/meaning.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { meaningChapters, meaningIntro, type MeaningChapter } from '../data/siteContent'

function MeaningContent({ chapter, fallback = false }: { chapter: MeaningChapter; fallback?: boolean }) {
  return (
    <article
      className={fallback ? 'meaning__fallback-chapter' : `meaning__chapter meaning__chapter--${chapter.id}`}
      data-motion={!fallback ? true : undefined}
    >
      <div className="meaning__chapter-heading">
        <span>{chapter.id}</span>
        <p>{chapter.englishTitle}</p>
      </div>
      <h3>{chapter.title}</h3>
      <div className="meaning__chapter-body">
        {chapter.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <blockquote>{chapter.statement}</blockquote>
      {chapter.id === '03' && (
        <div className="meaning__process" aria-hidden="true">
          <span>确认信息</span><i /><span>沟通时间</span><i /><span>协调现场</span><i /><span>处理变化</span>
        </div>
      )}
    </article>
  )
}

function MeaningVisual({ chapter }: { chapter: MeaningChapter }) {
  return (
    <div className={`meaning__visual-layer meaning__visual-layer--${chapter.id}`} data-motion aria-hidden="true">
      <span className="meaning__visual-word">{chapter.englishTitle}</span>
      <span className="meaning__visual-node meaning__visual-node--a">01</span>
      <span className="meaning__visual-node meaning__visual-node--b">02</span>
      <span className="meaning__visual-node meaning__visual-node--c">03</span>
      <i className="meaning__visual-link meaning__visual-link--a" />
      <i className="meaning__visual-link meaning__visual-link--b" />
      <i className="meaning__visual-ring" />
    </div>
  )
}

export function MeaningSection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createMeaningTimeline)

  return (
    <section ref={sectionRef} className="meaning" aria-labelledby="meaning-title">
      <header className="meaning__intro section-shell">
        <p className="section-kicker">{meaningIntro.eyebrow}</p>
        <h2 id="meaning-title">{meaningIntro.title}</h2>
        <p className="meaning__english">{meaningIntro.englishTitle}</p>
        <div className="meaning__intro-body">
          {meaningIntro.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </header>

      <div className="meaning__scroll">
        <div className="meaning__sticky section-shell">
          <div className="meaning__ghosts" aria-hidden="true">
            {meaningChapters.map((chapter) => (
              <span className="meaning__ghost" data-motion key={chapter.id}>{chapter.title}</span>
            ))}
          </div>
          <div className="meaning__visual">
            {meaningChapters.map((chapter) => <MeaningVisual chapter={chapter} key={chapter.id} />)}
          </div>
          <div className="meaning__counter" aria-hidden="true">
            {meaningChapters.map((chapter) => <span key={chapter.id}>{chapter.id}</span>)}
          </div>
          <div className="meaning__stage">
            {meaningChapters.map((chapter) => <MeaningContent chapter={chapter} key={chapter.id} />)}
          </div>
        </div>
      </div>

      <div className="meaning__fallback section-shell">
        {meaningChapters.map((chapter) => <MeaningContent chapter={chapter} fallback key={chapter.id} />)}
      </div>
    </section>
  )
}
