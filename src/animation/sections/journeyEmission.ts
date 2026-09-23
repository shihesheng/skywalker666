// A single stream of pictures approaching the camera, not rotating batches.
// Directions alternate across the frame; positive y includes the lower-left exits.
const directions = [
  [1.56, 0.84], [-1.8, 1.2], [1.32, -1.56], [-2.04, -0.96],
  [0.96, 1.8], [-1.2, -1.68], [1.92, 0.36], [-0.84, 2.04],
  [1.44, -1.92], [-1.68, 1.08], [2.16, -0.6], [-1.32, -2.16],
  [1.08, 2.16], [-2.28, 0.48], [1.2, -2.28], [-0.96, 2.28],
  [2.04, -1.2], [-1.56, -1.44], [0.84, 2.4], [1.5, -0.24],
] as const

export const SPAWN_END = 0.16
export const APPROACH_END = 0.62
export type EmissionConfig = { start: number; duration: number; direction: readonly [number, number] }
export type EmissionGeometry = { width: number; height: number; cardWidth: number; cardHeight: number }

export const journeyEmissionConfigs: EmissionConfig[] = directions.map((direction, index) => ({
  start: 0.01 + index * 0.04,
  duration: 0.225,
  direction,
}))

/**
 * Project a distant, front-facing image toward the viewer. Projecting into 2D
 * preserves the reference's camera acceleration without crossing a CSS
 * perspective plane (which can create enormous/inverted bounding boxes).
 * All images share the same size curve: their different ages create depth.
 */
export function sampleEmission(progress: number, config: EmissionConfig, geometry: EmissionGeometry) {
  const p = Math.max(0, Math.min(1, progress))
  const approach = 0.68 * p
  // Equivalent to perspective 2000, z moving from -1000 toward the camera.
  const projection = 2000 / (3000 - 3000 * approach)
  const scale = 1.99 * approach * projection
  // Each picture crosses the edge at 80% of its own flight. Together with the
  // emission interval this yields 4–5 visible generations on any aspect ratio,
  // without hiding a picture to enforce a count or letting wide screens crowd.
  const edgeApproach = 0.68 * 0.8
  const edgeProjection = edgeApproach * 2000 / (3000 - 3000 * edgeApproach)
  const edgeX = (geometry.width / (2 * edgeProjection) + geometry.cardWidth * 1.99 / 2)
    / (Math.abs(config.direction[0]) * geometry.width)
  const edgeY = (geometry.height / (2 * edgeProjection) + geometry.cardHeight * 1.99 / 2)
    / (Math.abs(config.direction[1]) * geometry.height)
  const travel = Math.min(edgeX, edgeY)
  return {
    x: config.direction[0] * geometry.width * travel * approach * projection,
    y: config.direction[1] * geometry.height * travel * approach * projection,
    scale,
  }
}
