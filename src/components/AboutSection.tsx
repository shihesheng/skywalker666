import { createAboutTimeline } from '../animation/sections/about.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { aboutContent, type StoryImage as StoryImageData } from '../data/siteContent'
import { StoryImage } from './StoryImage'

const profileScenes: Array<{
  number: string
  lead: string
  accent: string
  image: StoryImageData
  labels: string[]
}> = [
  {
    number: '01',
    lead: '边做',
    accent: '边学.',
    image: { src: '/images/profile-story-01.jpg', alt: '个人经历照片一', label: 'PROFILE / 01' },
    labels: aboutContent.labels.slice(0, 3),
  },
  {
    number: '02',
    lead: '把想法',
    accent: '做出来.',
    image: { src: '/images/profile-story-02.jpg', alt: '个人经历照片二', label: 'PROFILE / 02' },
    labels: aboutContent.labels.slice(2, 4),
  },
  {
    number: '03',
    lead: '走出',
    accent: '舒适区.',
    image: { src: '/images/profile-story-03.jpg', alt: '个人经历照片三', label: 'PROFILE / 03' },
    labels: aboutContent.labels.slice(4),
  },
]

export function AboutSection() {
  const sectionRef = useSectionTimeline<HTMLElement>(createAboutTimeline)

  return (
    <section
      ref={sectionRef}
      className="about-cinema"
      aria-labelledby="about-title"
      data-fd-id="section-personal-intro"
    >
      <div className="about-cinema__sticky">
        <div className="about-cinema__chrome" aria-hidden="true">
          <span>ABOUT / PROFILE</span>
          <span className="about-cinema__chrome-line" />
          <span>01—03</span>
        </div>

        <header className="about-cinema__opening" data-about-opening>
          <span className="about-cinema__signal" aria-hidden="true" />
          <p className="section-kicker">{aboutContent.eyebrow}</p>
          <p className="about-cinema__premise">不止是几行自我介绍。</p>
          <h2 id="about-title">
            <span>个人简介</span>
            <span>从 <em>经历</em> 开始.</span>
          </h2>
          <p className="about-cinema__opening-note">{aboutContent.englishTitle}</p>
        </header>

        <div className="about-cinema__scenes">
          {profileScenes.map((scene, index) => (
            <article
              className={`about-cinema__scene ${index % 2 === 1 ? 'about-cinema__scene--reverse' : ''}`}
              data-about-scene
              key={scene.number}
            >
              <div className="about-cinema__copy">
                <div className="about-cinema__scene-meta">
                  <span>{scene.number}</span>
                  <span>PERSONAL NOTE</span>
                </div>
                <h3>
                  <span>{scene.lead}</span>
                  <em>{scene.accent}</em>
                </h3>
                <p>{aboutContent.body[index]}</p>
                <ul aria-label="个人关键词">
                  {scene.labels.map((label) => <li key={label}>{label}</li>)}
                </ul>
              </div>

              <div className="about-cinema__visual">
                <StoryImage {...scene.image} />
                <span className="about-cinema__image-index" aria-hidden="true">0{index + 1}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="about-cinema__progress" aria-hidden="true">
          {profileScenes.map((scene) => <i key={scene.number} />)}
        </div>
      </div>
    </section>
  )
}
