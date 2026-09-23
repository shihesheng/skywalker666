import assert from 'node:assert/strict'
import test from 'node:test'
import { journeyEmissionConfigs as configs, sampleEmission } from '../src/animation/sections/journeyEmission.ts'

const sizes = [[821, 900], [1440, 900], [1920, 1080], [2560, 1080]]
const geometry = (width, height) => ({ width, height, cardWidth: width * .8, cardHeight: width * .6 })
const visible = (frame, g) => frame.scale > .002
  && Math.abs(frame.x) - g.cardWidth * frame.scale / 2 < g.width / 2
  && Math.abs(frame.y) - g.cardHeight * frame.scale / 2 < g.height / 2

test('a single stream maintains four or five visible generations, never a batch', () => {
  assert.equal(configs.length, 20)
  assert.equal(new Set(configs.map(c => c.start)).size, 20)
  assert(configs.at(-1).start > .7)
  for (const [width, height] of sizes) {
    const g = geometry(width, height)
    for (let step = 0; step <= 1000; step++) {
      const progress = step / 1000
      const frames = configs.map(c => sampleEmission((progress - c.start) / c.duration, c, g))
      const count = frames.filter(f => visible(f, g)).length
      assert(count <= 5, `${width}x${height} at ${progress}: ${count} images`)
      if (progress > .19 && progress < .79) assert(count >= 4, 'gap in established stream')
    }
  }
})

test('images stay front-facing, with strong depth and lower-left trajectories', () => {
  const g = geometry(1440, 900)
  assert(configs.some(c => c.direction[0] < 0 && c.direction[1] > 0))
  for (const config of configs) {
    let previous = sampleEmission(0, config, g)
    assert.equal(previous.scale, 0)
    for (let step = 1; step <= 100; step++) {
      const frame = sampleEmission(step / 100, config, g)
      assert(frame.scale > previous.scale)
      assert(Math.hypot(frame.x, frame.y) > Math.hypot(previous.x, previous.y))
      assert(!('rotation' in frame))
      previous = frame
    }
    assert(sampleEmission(.7, config, g).scale / sampleEmission(.1, config, g).scale > 10)
  }
})

test('all images really escape without fading, and reverse sampling is deterministic', () => {
  for (const [width, height] of sizes) {
    const g = geometry(width, height)
    for (const config of configs) {
      assert(config.start + config.duration <= 1)
      const before = sampleEmission(.4, config, g)
      const final = sampleEmission(1, config, g)
      assert(!visible(final, g))
      assert(!('opacity' in final))
      assert.deepEqual(sampleEmission(.4, config, g), before)
      assert.equal(sampleEmission(0, config, g).scale, 0)
    }
  }
})
