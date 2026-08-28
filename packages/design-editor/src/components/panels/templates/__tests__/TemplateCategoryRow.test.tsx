'use client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { TemplateCategoryRow } from '../TemplateCategoryRow'
import type { TemplateProvider, DesignTemplate } from '../../../../providers/templates'

afterEach(() => cleanup())

const tpl = (id: string, categoryId = 'social-media'): DesignTemplate => ({
  id, name: `Template ${id}`, categoryId,
  thumbnailUrl: `https://example.com/${id}.png`,
  scene: { id: 's', frame: { width: 100, height: 100 }, layers: [], metadata: {} } as any,
})

function provider(items: DesignTemplate[]): TemplateProvider {
  return {
    async categories() { return [] },
    async list({ categoryId }) {
      return { items: items.filter(t => !categoryId || t.categoryId === categoryId) }
    },
  }
}

describe('TemplateCategoryRow', () => {
  it('renders the category name and See more link', async () => {
    const p = provider([tpl('a')])
    render(
      <TemplateCategoryRow
        category={{ id: 'social-media', name: 'Social Media' }}
        provider={p}
        onSelect={() => {}}
        onSeeMore={() => {}}
      />,
    )
    expect(screen.getByText('Social Media')).toBeDefined()
    expect(screen.getByText('See more')).toBeDefined()
  })

  it('loads and shows templates from the category', async () => {
    const p = provider([tpl('a'), tpl('b'), tpl('c', 'other')])
    render(
      <TemplateCategoryRow
        category={{ id: 'social-media', name: 'Social Media' }}
        provider={p}
        onSelect={() => {}}
        onSeeMore={() => {}}
      />,
    )
    await waitFor(() => {
      expect(screen.getByAltText('Template a')).toBeDefined()
      expect(screen.getByAltText('Template b')).toBeDefined()
    })
    expect(screen.queryByAltText('Template c')).toBeNull()
  })

  it('invokes onSeeMore when the link is clicked', () => {
    const p = provider([tpl('a')])
    const onSeeMore = vi.fn()
    render(
      <TemplateCategoryRow
        category={{ id: 'social-media', name: 'Social Media' }}
        provider={p}
        onSelect={() => {}}
        onSeeMore={onSeeMore}
      />,
    )
    fireEvent.click(screen.getByText('See more'))
    expect(onSeeMore).toHaveBeenCalledWith('social-media')
  })

  it('invokes onSelect when a template is clicked', async () => {
    const p = provider([tpl('a')])
    const onSelect = vi.fn()
    render(
      <TemplateCategoryRow
        category={{ id: 'social-media', name: 'Social Media' }}
        provider={p}
        onSelect={onSelect}
        onSeeMore={() => {}}
      />,
    )
    await waitFor(() => expect(screen.getByTitle('Template a')).toBeDefined())
    fireEvent.click(screen.getByTitle('Template a'))
    expect(onSelect.mock.calls[0][0].id).toBe('a')
  })
})
