'use client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react'
import { TemplatesPanel } from '../TemplatesPanel'
import type {
  TemplateProvider, TemplateCategory, DesignTemplate,
} from '../../../../providers/templates'

afterEach(() => { cleanup(); vi.useRealTimers() })

const cats: TemplateCategory[] = [
  { id: 'a', name: 'Cat A', order: 1 },
  { id: 'b', name: 'Cat B', order: 2 },
]
const all: DesignTemplate[] = [
  { id: 'a-1', name: 'A One', categoryId: 'a', thumbnailUrl: 'https://x/a1.png',
    scene: { id: '1', frame: { width: 100, height: 100 }, layers: [], metadata: {} } as any },
  { id: 'b-1', name: 'B One', categoryId: 'b', thumbnailUrl: 'https://x/b1.png', tags: ['promo'],
    scene: { id: '2', frame: { width: 100, height: 100 }, layers: [], metadata: {} } as any },
]

function makeProvider(): TemplateProvider {
  return {
    async categories() { return cats },
    async list({ categoryId, search }) {
      let items = all.slice()
      if (categoryId) items = items.filter(t => t.categoryId === categoryId)
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(t => t.name.toLowerCase().includes(q) || (t.tags ?? []).some(tag => tag.toLowerCase().includes(q)))
      }
      return { items }
    },
  }
}

describe('TemplatesPanel', () => {
  it('renders a row per category in browse mode', async () => {
    render(<TemplatesPanel provider={makeProvider()} onApplyTemplate={() => {}} />)
    await waitFor(() => {
      expect(screen.getByText('Cat A')).toBeDefined()
      expect(screen.getByText('Cat B')).toBeDefined()
    })
  })

  it('switches to category-detail mode when See more is clicked', async () => {
    render(<TemplatesPanel provider={makeProvider()} onApplyTemplate={() => {}} />)
    await waitFor(() => expect(screen.getAllByText('See more').length).toBeGreaterThan(0))
    fireEvent.click(screen.getAllByText('See more')[0])
    await waitFor(() => expect(screen.getByText('← Back')).toBeDefined())
    // Cat B row is no longer rendered
    expect(screen.queryByText('Cat B')).toBeNull()
  })

  it('returns to browse mode when Back is clicked', async () => {
    render(<TemplatesPanel provider={makeProvider()} onApplyTemplate={() => {}} />)
    await waitFor(() => expect(screen.getAllByText('See more').length).toBeGreaterThan(0))
    fireEvent.click(screen.getAllByText('See more')[0])
    await waitFor(() => expect(screen.getByText('← Back')).toBeDefined())
    fireEvent.click(screen.getByText('← Back'))
    await waitFor(() => expect(screen.getByText('Cat B')).toBeDefined())
  })

  it('enters search mode when typing in the search bar (debounced)', async () => {
    vi.useFakeTimers()
    render(<TemplatesPanel provider={makeProvider()} onApplyTemplate={() => {}} />)
    await act(async () => { vi.advanceTimersByTime(0) })
    const input = screen.getByPlaceholderText('Search templates') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'promo' } })
    await act(async () => { vi.advanceTimersByTime(350) })
    vi.useRealTimers()
    await waitFor(() => expect(screen.getByAltText('B One')).toBeDefined())
    // category headings gone
    expect(screen.queryByText('Cat A')).toBeNull()
  })

  it('calls onApplyTemplate when a template is clicked', async () => {
    const onApply = vi.fn()
    render(<TemplatesPanel provider={makeProvider()} onApplyTemplate={onApply} />)
    await waitFor(() => expect(screen.getByTitle('A One')).toBeDefined())
    fireEvent.click(screen.getByTitle('A One'))
    expect(onApply).toHaveBeenCalledTimes(1)
    expect(onApply.mock.calls[0][0].id).toBe('a-1')
  })

  it('shows an empty state when the provider returns no categories', async () => {
    const empty: TemplateProvider = {
      async categories() { return [] },
      async list() { return { items: [] } },
    }
    render(<TemplatesPanel provider={empty} onApplyTemplate={() => {}} />)
    await waitFor(() => {
      expect(screen.getByText(/No templates available/i)).toBeDefined()
    })
  })
})
