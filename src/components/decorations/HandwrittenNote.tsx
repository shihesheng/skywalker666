type HandwrittenNoteProps = {
  children?: string
  className?: string
}

export function HandwrittenNote({ children = 'NOTE', className = '' }: HandwrittenNoteProps) {
  return <span className={`handwritten-note ${className}`}>{children}</span>
}
