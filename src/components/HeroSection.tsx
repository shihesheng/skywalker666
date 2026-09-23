import { createHeroTimeline } from '../animation/sections/hero.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { heroContent, siteMeta } from '../data/siteContent'
import { DoodleArrow } from './decorations/DoodleArrow'

export function HeroSection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createHeroTimeline)

  return (
    <section ref={sectionRef} className="hero section-shell" aria-labelledby="hero-title" data-fd-id="section-cover">
      <div className="hero__topline" data-motion data-fd-id="cover-identity">
        <span className="hero__topline-rule" data-editorial-line aria-hidden="true" />
        <span className="hero__brand-mark" aria-hidden="true" />
        <span>{heroContent.eyebrow}</span>
        <span>{heroContent.campus}</span>
      </div>

      <header className="hero__heading" data-motion data-depth="content">
        <p className="hero__role">{siteMeta.role}</p>
        <h1 id="hero-title" aria-label="外联副部竞选" data-fd-id="cover-title">
          {['外联副部', '竞选'].map((line, index) => (
            <span className={`hero__title-line${index === 1 ? ' hero__title-line--accent' : ''}`} data-title-line aria-hidden="true" key={line}>
              {Array.from(line).map((character) => <i className="hero__glyph" key={character}>{character}</i>)}
            </span>
          ))}
        </h1>
      </header>

      <div className="hero__meta" data-motion data-depth="foreground" data-fd-id="cover-meta">
        <span className="hero__meta-rule" aria-hidden="true" />
        <span>UNSWCSA</span>
        <span>2026</span>
        <p className="hero__signature">{heroContent.signature}</p>
      </div>

      <div className="hero__year" aria-hidden="true"><span>2026</span></div>

      <div className="hero__handoff" data-motion data-depth="foreground">
        <span>个人简介</span>
        <DoodleArrow className="hero__arrow" direction="down" />
      </div>
    </section>
  )
}
