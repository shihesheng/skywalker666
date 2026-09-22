import { createHeroTimeline } from '../animation/sections/hero.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { heroContent, siteMeta } from '../data/siteContent'
import { StoryImage } from './StoryImage'
import { DoodleArrow } from './decorations/DoodleArrow'
import { HandwrittenNote } from './decorations/HandwrittenNote'

export function HeroSection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createHeroTimeline)

  return (
    <section ref={sectionRef} className="hero section-shell" aria-labelledby="hero-title">
      <span className="section-kicker">{heroContent.eyebrow}</span>
      <header className="hero__heading" data-motion>
        <p className="hero__role">{siteMeta.role}</p>
        <h1 id="hero-title">{siteMeta.name}</h1>
        <p className="hero__kicker">{heroContent.kicker}</p>
      </header>

      <div className="hero__portrait" data-motion>
        <StoryImage {...heroContent.image} eager />
        <HandwrittenNote className="hero__note">start here</HandwrittenNote>
      </div>

      <DoodleArrow className="hero__arrow" direction="down" />
      <span className="hero__line" data-motion aria-hidden="true" />
      <span className="hero__scroll-note">SCROLL TO BEGIN</span>
    </section>
  )
}
