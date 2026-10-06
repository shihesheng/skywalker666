import { createJourneyOrbitTimeline } from '../animation/sections/journeyOrbit.timeline'
import { useSectionTimeline } from '../animation/useSectionTimeline'
import { personalPhotos } from '../data/personalPhotos'

export function JourneyOrbitTransition() {
  const sectionRef = useSectionTimeline<HTMLElement>(createJourneyOrbitTimeline)

  return (
    <section ref={sectionRef} className="orbit-bridge" aria-labelledby="orbit-bridge-title" data-fd-id="section-orbit-bridge">
      <div className="orbit-bridge__sticky">
        <div className="orbit-bridge__intro" data-orbit-intro aria-hidden="true">
          <p>生活中的我。</p>
          <small>SCROLL TO EXPLORE</small>
        </div>
        <header className="orbit-bridge__copy" data-orbit-copy>
          <p>PERSONAL PHOTO NOTES</p>
          <h2 id="orbit-bridge-title">个人剪影</h2>
          <small>A LITTLE MORE ABOUT ME</small>
        </header>
        <div className="orbit-bridge__ring" data-orbit-ring>
          {personalPhotos.map((photo, index) => (
            <figure
              className="orbit-bridge__card"
              data-orbit-card
              key={`${photo.id}-${index}`}
            >
              {photo.src ? (
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
              ) : (
                <div className="orbit-bridge__placeholder" role="img" aria-label={`个人照片预留位置 ${index % personalPhotos.length + 1}`}>
                  <span>PHOTO</span>
                  <strong>{String(index % personalPhotos.length + 1).padStart(2, '0')}</strong>
                  <i aria-hidden="true" />
                </div>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
