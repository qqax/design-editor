'use client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { TemplateGrid } from '../TemplateGrid'
import type { TemplateProvider, DesignTemplate } from '../../../../providers/templates'

afterEach(() => cleanup())

function mockProvider(items: DesignTemplate[]): TemplateProvider {
  return {
    async categories() { return [] },
    async list({ cursor, limit = 12 }) {
      const start = cursor ? items.findIndex(t => t.id === cursor) + 1 : 0
      const slice = items.slice(start, start + limit)
      const last = slice[slice.length - 1]
      const nextCursor = last && start + slice.length < items.length ? last.id : undefined
      return { items: slice, nextCursor }
    },
  }
}

const makeTemplate = (id: string): DesignTemplate => ({
  id, name: `Template ${id}`, categoryId: 'cat',
  thumbnailUrl: `https://example.com/${id}.png`,
  scene: { id: 's', frame: { width: 100, height: 100 }, layers: [], metadata: {} } as any,
})

describe('TemplateGrid', () => {
  it('renders an empty state when no items', async () => {
    const p = mockProvider([])
    render(<TemplateGrid provider={p} listOpts={{}} emptyMessage="Nothing here" onSelect={() => {}} />)
    await waitFor(() => {
      expect(screen.getByText('Nothing here')).toBeDefined()
    })
  })

  it('renders the first page of templates', async () => {
    const p = mockProvider([makeTemplate('a'), makeTemplate('b')])
    render(<TemplateGrid provider={p} listOpts={{}} emptyMessage="" onSelect={() => {}} />)
    await waitFor(() => {
      expect(screen.getByAltText('Template a')).toBeDefined()
      expect(screen.getByAltText('Template b')).toBeDefined()
    })
  })

  it('loads more on button click and appends results', async () => {
    const p = mockProvider([
      makeTemplate('a'), makeTemplate('b'), makeTemplate('c'),
    ])
    render(<TemplateGrid provider={p} listOpts={{ limit: 2 }} emptyMessage="" onSelect={() => {}} />)
    await waitFor(() => expect(screen.getByAltText('Template a')).toBeDefined())
    fireEvent.click(screen.getByText('Load more'))
    await waitFor(() => expect(screen.getByAltText('Template c')).toBeDefined())
  })

  it('forwards clicks to onSelect', async () => {
    const onSelect = vi.fn()
    const p = mockProvider([makeTemplate('a')])
    render(<TemplateGrid provider={p} listOpts={{}} emptyMessage="" onSelect={onSelect} />)
    await waitFor(() => expect(screen.getByAltText('Template a')).toBeDefined())
    fireEvent.click(screen.getByTitle('Template a'))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][0].id).toBe('a')
  })
})
