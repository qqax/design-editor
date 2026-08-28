import { describe, it, expect } from 'vitest'
import { LayerType } from '../types/index'

describe('LayerType enum', () => {
  it('has STATIC_TEXT value', () => {
    expect(LayerType.STATIC_TEXT).toBe('StaticText')
  })

  it('has STATIC_IMAGE value', () => {
    expect(LayerType.STATIC_IMAGE).toBe('StaticImage')
  })

  it('has FRAME value', () => {
    expect(LayerType.FRAME).toBe('Frame')
  })

  it('has BACKGROUND value', () => {
    expect(LayerType.BACKGROUND).toBe('Background')
  })

  it('has BACKGROUND_IMAGE value', () => {
    expect(LayerType.BACKGROUND_IMAGE).toBe('BackgroundImage')
  })

  it('has STATIC_VECTOR value', () => {
    expect(LayerType.STATIC_VECTOR).toBe('StaticVector')
  })

  it('has ACTIVE_SELECTION value', () => {
    expect(LayerType.ACTIVE_SELECTION).toBe('activeSelection')
  })

  it('has STATIC_VIDEO value', () => {
    expect(LayerType.STATIC_VIDEO).toBe('StaticVideo')
  })
})
