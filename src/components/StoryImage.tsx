import { useState } from 'react'
import { requestScrollRefresh } from '../animation/gsap'
import type { StoryImage as StoryImageData } from '../data/siteContent'

type StoryImageProps = StoryImageData & {
  className?: string
  eager?: boolean
}

export function StoryImage({ src, alt, label, className = '', eager = false }: StoryImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className={`story-image ${failed ? 'is-placeholder' : ''} ${className}`}>
      {failed ? (
        <div className="story-image__fallback">
          <span>{label}</span>
          <small>{src}</small>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={requestScrollRefresh}
          onError={() => {
            setFailed(true)
            requestScrollRefresh()
          }}
        />
      )}
    </figure>
  )
}
