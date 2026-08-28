import { describe, it, expect } from 'vitest'

// IScene and ILayer are structural types — we test the expected shape through
// object literals that should satisfy the interfaces at compile-time and pass
// runtime shape assertions
import type { IScene, ILayer } from '../../types'

function makeScene(overrides: Partial<IScene> = {}): IScene {
  return {
    id: 'test-scene',
    name: 'Test Scene',
    layers: [],
    frame: { width: 800, height: 600 },
    metadata: {},
    ...overrides,
  }
}

describe('IScene structure', () => {
  it('has required id field', () => {
    const scene = makeScene()
    expect(scene.id).toBe('test-scene')
  })

  it('has required name field', () => {
    const scene = makeScene()
    expect(scene.name).toBe('Test Scene')
  })

  it('has layers array', () => {
    const scene = makeScene()
    expect(Array.isArray(scene.layers)).toBe(true)
  })

  it('has frame with width and height', () => {
    const scene = makeScene()
    expect(scene.frame.width).toBe(800)
    expect(scene.frame.height).toBe(600)
  })

  it('layers can hold multiple items', () => {
    const layers: ILayer[] = [
      { id: 'l1', type: 'StaticText' } as unknown as ILayer,
      { id: 'l2', type: 'StaticImage' } as unknown as ILayer,
    ]
    const scene = makeScene({ layers })
    expect(scene.layers).toHaveLength(2)
  })

  it('accepts metadata object', () => {
    const scene = makeScene({ metadata: { animated: false, version: '1.0' } })
    expect(scene.metadata).toMatchObject({ animated: false })
  })

  it('scene id should be a non-empty string', () => {
    const scene = makeScene({ id: 'unique-id-123' })
    expect(scene.id).toMatch(/^.+$/)
  })

  it('frame dimensions are numbers', () => {
    const scene = makeScene({ frame: { width: 1920, height: 1080 } })
    expect(typeof scene.frame.width).toBe('number')
    expect(typeof scene.frame.height).toBe('number')
  })
})
