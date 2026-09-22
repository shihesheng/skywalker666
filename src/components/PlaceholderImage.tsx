import type { CSSProperties } from 'react'
import { DEBUG_LAYOUT } from '../config'

type PlaceholderImageProps = {
  label: string
  className?: string
  style?: CSSProperties
}

export function PlaceholderImage({ label, className = '', style }: PlaceholderImageProps) {
  return (
    <div className={`placeholder-image ${className}`} style={style} aria-label={label}>
      {DEBUG_LAYOUT && <span>{label}</span>}
    </div>
  )
}
