'use client'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { TemplatesPanel } from '../panels/templates/TemplatesPanel'
import type { TemplateProvider } from '../../providers/templates'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

beforeEach(() => {
  ;(globalThis as any).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const fakeProvider: TemplateProvider = {
  async categories() {
    return [{ id: 'demo', name: 'Demo', order: 1 }]
  },
  async list() {
    return {
      items: [{
        id: 'demo-1', name: 'Demo One', categoryId: 'demo',
        thumbnailUrl: 'https://example.com/demo.png',
        canvasBg: '#abcdef',
        scene: { id: 's', frame: { width: 200, height: 200 }, layers: [], metadata: {} } as any,
      }],
    }
  },
}

describe('TemplatesPanel integration with apply handler', () => {
  it('invokes onApplyTemplate with the template when its thumbnail is clicked', async () => {
    const onApplyTemplate = vi.fn()
    render(<TemplatesPanel provider={fakeProvider} onApplyTemplate={onApplyTemplate} />)
    await waitFor(() => expect(screen.getByTitle('Demo One')).toBeDefined())
    fireEvent.click(screen.getByTitle('Demo One'))
    expect(onApplyTemplate).toHaveBeenCalledTimes(1)
    expect(onApplyTemplate.mock.calls[0][0].id).toBe('demo-1')
    expect(onApplyTemplate.mock.calls[0][0].canvasBg).toBe('#abcdef')
  })
})
