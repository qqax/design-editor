import { describe, it, expect } from 'vitest'
import { defaultEditorConfig, defaultFrameOptions, PROPERTIES_TO_INCLUDE } from '../core/common/constants'

describe('defaultEditorConfig', () => {
  it('has an id field', () => {
    expect(defaultEditorConfig).toHaveProperty('id')
  })

  it('has clipToFrame boolean', () => {
    expect(typeof defaultEditorConfig.clipToFrame).toBe('boolean')
  })

  it('has a background color', () => {
    expect(typeof defaultEditorConfig.background).toBe('string')
  })

  it('has propertiesToInclude array', () => {
    expect(Array.isArray(defaultEditorConfig.propertiesToInclude)).toBe(true)
  })

  it('has guidelines setting', () => {
    expect(typeof defaultEditorConfig.guidelines).toBe('boolean')
  })
})

describe('defaultFrameOptions', () => {
  it('is defined', () => {
    expect(defaultFrameOptions).toBeDefined()
  })

  it('has a width property', () => {
    expect(defaultFrameOptions).toHaveProperty('width')
  })
})

describe('PROPERTIES_TO_INCLUDE', () => {
  it('is an array', () => {
    expect(Array.isArray(PROPERTIES_TO_INCLUDE)).toBe(true)
  })

  it('includes id', () => {
    expect(PROPERTIES_TO_INCLUDE).toContain('id')
  })

  it('includes name', () => {
    expect(PROPERTIES_TO_INCLUDE).toContain('name')
  })

  it('includes src', () => {
    expect(PROPERTIES_TO_INCLUDE).toContain('src')
  })

  it('has at least 5 properties', () => {
    expect(PROPERTIES_TO_INCLUDE.length).toBeGreaterThanOrEqual(5)
  })
})

