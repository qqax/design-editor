import { describe, it, expect } from 'vitest'

// Test the VERSION export from the package entry point
import { VERSION } from '../../index'

describe('package entry point', () => {
  it('exports a VERSION constant', () => {
    expect(VERSION).toBeDefined()
  })

  it('VERSION is a string', () => {
    expect(typeof VERSION).toBe('string')
  })

  it('VERSION is not empty', () => {
    expect(VERSION.length).toBeGreaterThan(0)
  })
})

// Test that engine barrel re-exports key symbols
import { LayerType } from '../types/index'
import { defaultEditorConfig } from '../core/common/constants'

describe('engine re-exports through package entry', () => {
  it('LayerType is accessible', () => {
    expect(LayerType).toBeDefined()
  })

  it('defaultEditorConfig is accessible', () => {
    expect(defaultEditorConfig).toBeDefined()
  })
})
