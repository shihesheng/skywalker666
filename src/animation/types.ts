export type AnimationConditions = {
  desktop: boolean
  mobile: boolean
  reduced: boolean
}

export type SectionAnimation = (
  scope: HTMLElement,
  conditions: AnimationConditions,
) => void | (() => void)
