import { describe, it, expect } from 'vitest'
import { createDefaultTemplateProvider } from '../templates'

describe('defaultTemplateProvider', () => {
  it('returns categories sorted by order then name', async () => {
    const p = createDefaultTemplateProvider()
    const cats = await p.categories()
    expect(cats.map(c => c.id)).toEqual([
      'signage',
      'tv-ads',
      'ads-retail',
      'social-media',
      'posters',
      'banners',
      'cards',
    ])
  })

  it('lists all templates when no filter is given', async () => {
    const p = createDefaultTemplateProvider()
    const res = await p.list({ limit: 100 })
    expect(res.items.length).toBeGreaterThanOrEqual(13)
    expect(res.nextCursor).toBeUndefined()
  })

  it('filters by categoryId', async () => {
    const p = createDefaultTemplateProvider()
    const res = await p.list({ categoryId: 'posters', limit: 100 })
    expect(res.items.length).toBeGreaterThan(0)
    expect(res.items.every(t => t.categoryId === 'posters')).toBe(true)
  })

  it('filters by search (case-insensitive over name + tags)', async () => {
    const p = createDefaultTemplateProvider()
    const byName = await p.list({ search: 'BIRTHDAY' })
    expect(byName.items.some(t => t.id === 'cd-001')).toBe(true)

    const byTag = await p.list({ search: 'sale' })
    expect(byTag.items.some(t => t.tags?.includes('sale'))).toBe(true)
  })

  it('paginates with cursor and exposes nextCursor until exhausted', async () => {
    const p = createDefaultTemplateProvider()
    const page1 = await p.list({ limit: 3 })
    expect(page1.items.length).toBe(3)
    expect(page1.nextCursor).toBeDefined()

    const page2 = await p.list({ limit: 3, cursor: page1.nextCursor })
    expect(page2.items.length).toBe(3)
    // pages don't overlap
    const ids1 = new Set(page1.items.map(t => t.id))
    expect(page2.items.every(t => !ids1.has(t.id))).toBe(true)
  })

  it('returns nextCursor=undefined on the final page', async () => {
    const p = createDefaultTemplateProvider()
    const res = await p.list({ categoryId: 'posters', limit: 100 })
    expect(res.nextCursor).toBeUndefined()
  })
})
