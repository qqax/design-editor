'use client'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { renderHook, waitFor, cleanup } from '@testing-library/react'
import * as React from 'react'
import { useSceneThumbnail } from '../useSceneThumbnail'
import type { DesignTemplate } from '../../../../providers/templates'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const mockTemplate = (overrides: Partial<DesignTemplate> = {}): DesignTemplate => ({
  id: 't1',
  name: 'Test',
  categoryId: 'cat',
  scene: { id: 's1', frame: { width: 100, height: 100 }, layers: [], metadata: {} } as any,
  ...overrides,
})

// Simulate an IntersectionObserver that immediately marks the element visible.
beforeEach(() => {
  ;(globalThis as any).IntersectionObserver = class {
    constructor(private cb: (entries: IntersectionObserverEntry[]) => void) {}
    observe(el: Element) {
      this.cb([{ isIntersecting: true, target: el } as any])
    }
    unobserve() {}
    disconnect() {}
  }
})

describe('useSceneThumbnail', () => {
  it('returns thumbnailUrl directly when present', () => {
    const t = mockTemplate({ thumbnailUrl: 'https://example.com/thumb.png' })
    const ref = React.createRef<HTMLDivElement>()
    const { result } = renderHook(() => useSceneThumbnail(t, ref))
    expect(result.current.src).toBe('https://example.com/thumb.png')
    expect(result.current.loading).toBe(false)
  })

  it('renders scene via editor.renderer when thumbnailUrl is missing', async () => {
    const toDataURL = vi.fn().mockResolvedValue('data:image/png;base64,AAA')
    const t = mockTemplate()
    const ref = React.createRef<HTMLDivElement>()

    const { result, rerender } = renderHook(
      ({ editorObj }: { editorObj: any }) => {
        // simulate ref attached
        ;(ref as any).current = document.createElement('div')
        return useSceneThumbnail(t, ref, editorObj)
      },
      { initialProps: { editorObj: { renderer: { toDataURL } } } },
    )

    rerender({ editorObj: { renderer: { toDataURL } } })

    await waitFor(() => {
      expect(result.current.src).toBe('data:image/png;base64,AAA')
    })
    expect(toDataURL).toHaveBeenCalledTimes(1)
  })

  it('reuses cached data url for the same template id', async () => {
    const toDataURL = vi.fn().mockResolvedValue('data:image/png;base64,BBB')
    const t = mockTemplate({ id: 'cache-key' })
    const ref1 = React.createRef<HTMLDivElement>()
    ;(ref1 as any).current = document.createElement('div')

    const r1 = renderHook(() =>
      useSceneThumbnail(t, ref1, { renderer: { toDataURL } } as any),
    )
    await waitFor(() => expect(r1.result.current.src).toBeDefined())

    const ref2 = React.createRef<HTMLDivElement>()
    ;(ref2 as any).current = document.createElement('div')
    const r2 = renderHook(() =>
      useSceneThumbnail(t, ref2, { renderer: { toDataURL } } as any),
    )
    expect(r2.result.current.src).toBe('data:image/png;base64,BBB')
    expect(toDataURL).toHaveBeenCalledTimes(1) // not called twice
  })
})
