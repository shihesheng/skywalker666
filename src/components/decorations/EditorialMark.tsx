type EditorialMarkProps = {
  className?: string
}
export function EditorialMark({ className = '' }: EditorialMarkProps) {
  return (
    <svg
      className={`editorial-mark ${className}`}
      viewBox="0 0 320 150"
      data-motion
      data-depth="background"
      aria-hidden="true"
      focusable="false"
    >
      <path data-draw d="M18 54C88 47 174 31 286 17" />
      <path data-draw d="M62 42C69 69 78 96 91 126" />
      <path data-draw d="M92 126C148 119 206 119 272 126" />
      <rect className="editorial-mark__square" x="279" y="10" width="13" height="13" />
      <circle className="editorial-mark__point" cx="92" cy="126" r="3" />
    </svg>
  )
}
