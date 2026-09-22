type DoodleArrowProps = {
  className?: string
  direction?: 'left' | 'right' | 'down'
}

export function DoodleArrow({ className = '', direction = 'right' }: DoodleArrowProps) {
  return (
    <svg
      className={`doodle-arrow doodle-arrow--${direction} ${className}`}
      viewBox="0 0 120 52"
      aria-hidden="true"
    >
      <path d="M5 29c25-19 49 13 85-7" />
      <path d="m82 12 14 9-11 14" />
    </svg>
  )
}
