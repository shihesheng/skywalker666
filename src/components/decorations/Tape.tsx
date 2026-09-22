type TapeProps = {
  className?: string
}

export function Tape({ className = '' }: TapeProps) {
  return <span className={`tape ${className}`} aria-hidden="true" />
}
