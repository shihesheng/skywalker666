import { DEBUG_LAYOUT } from '../../config'

type SectionNumberProps = {
  number: string
  label: string
}

export function SectionNumber({ number, label }: SectionNumberProps) {
  if (!DEBUG_LAYOUT) return null

  return <span className="section-number">{number} {label}</span>
}
