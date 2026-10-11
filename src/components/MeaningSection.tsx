import { createMeaningTimeline } from '../animation/sections/meaning.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { meaningChapters, meaningIntro, type MeaningChapter } from '../data/siteContent'

const sculpturePaths: Record<string, { primary: string; secondary: string; label: string }> = {
  '01': {
    primary: 'M14 62 C30 24 61 76 86 40',
    secondary: 'M18 68 C37 40 58 63 82 34',
    label: 'SEND / RECEIVE',
  },
  '02': {
    primary: 'M14 25 C36 10 48 67 78 48 C91 40 82 78 43 84',
    secondary: 'M18 31 C41 18 49 73 82 54',
    label: 'THREE POINT NETWORK',
  },
  '03': {
    primary: 'M18 86 C35 70 52 49 79 17',
    secondary: 'M25 92 C42 74 58 53 85 23',
    label: 'IDEA / ACTION / LAND',
  },
  '04': {
    primary: 'M18 61 C28 17 74 10 86 48 C96 79 55 94 25 74',
    secondary: 'M22 66 C35 28 69 20 81 50 C89 72 57 85 31 72',
    label: 'ONE SHARED SYSTEM',
  },
}

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
      {fallback && <MeaningVisual chapter={chapter} fallback />}
      {chapter.id === '03' && (
        <div className="meaning__process" aria-hidden="true">
          <span>确认信息</span><i /><span>沟通时间</span><i /><span>协调现场</span><i /><span>处理变化</span>
        </div>
      )}
    </article>
  )
}

function MeaningVisual({ chapter, fallback = false }: { chapter: MeaningChapter; fallback?: boolean }) {
  const path = sculpturePaths[chapter.id]

  return (
    <div
      className={`meaning__visual-layer meaning__visual-layer--${chapter.id}${fallback ? ' meaning__visual-layer--fallback' : ''}`}
      data-motion={!fallback ? true : undefined}
      aria-hidden="true"
    >
      <span className="meaning__visual-word">{chapter.englishTitle}</span>
      <div className="meaning__sculpture">
        <span className="meaning__visual-field" />
        <span className="meaning__visual-plane meaning__visual-plane--far" />
        <svg className="meaning__visual-geometry meaning__visual-geometry--back" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="meaning__visual-path meaning__visual-path--shadow" d={path.secondary} pathLength="100" />
          <path className="meaning__visual-path meaning__visual-path--glow" d={path.primary} pathLength="100" />
          <path className="meaning__visual-path meaning__visual-path--core" d={path.primary} pathLength="100" />
        </svg>
        <i className="meaning__visual-orbit meaning__visual-orbit--back" />

        <span className="meaning__visual-node meaning__visual-node--a"><i className="meaning__node-radar" /><b>01</b><small>NODE</small></span>
        <span className="meaning__visual-node meaning__visual-node--b"><i className="meaning__node-radar" /><b>02</b><small>NODE</small></span>
        <span className="meaning__visual-node meaning__visual-node--c"><i className="meaning__node-radar" /><b>03</b><small>NODE</small></span>

        <svg className="meaning__visual-geometry meaning__visual-geometry--front" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="meaning__visual-path meaning__visual-path--signal" d={path.primary} pathLength="100" />
          <circle className="meaning__visual-packet meaning__visual-packet--one" r="0.72">
            <animateMotion dur="6.4s" repeatCount="indefinite" path={path.primary} />
          </circle>
          <circle className="meaning__visual-packet meaning__visual-packet--two" r="0.42">
            <animateMotion begin="-3.2s" dur="6.4s" repeatCount="indefinite" path={path.primary} />
          </circle>
        </svg>
        <i className="meaning__visual-orbit meaning__visual-orbit--front" />
        <span className="meaning__visual-pulse" />
        <span className="meaning__visual-telemetry"><i>SYS.{chapter.id}</i><i>SIGNAL / ACTIVE</i></span>
        <span className="meaning__visual-caption">{path.label}</span>
      </div>
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
