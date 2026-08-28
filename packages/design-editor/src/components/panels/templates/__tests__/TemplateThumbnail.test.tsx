'use client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { TemplateThumbnail } from '../TemplateThumbnail'
import type { DesignTemplate } from '../../../../providers/templates'

afterEach(() => cleanup())

const t: DesignTemplate = {
  id: 'tt-1',
  name: 'Test Template',
  categoryId: 'cat',
  thumbnailUrl: 'https://example.com/x.png',
  scene: { id: 's', frame: { width: 100, height: 100 }, layers: [], metadata: {} } as any,
}

describe('TemplateThumbnail', () => {
  it('renders the thumbnail image', () => {
    render(<TemplateThumbnail template={t} onClick={() => {}} />)
    const img = screen.getByAltText('Test Template') as HTMLImageElement
    expect(img.src).toBe('https://example.com/x.png')
  })

  it('calls onClick with the template when clicked', () => {
    const onClick = vi.fn()
    render(<TemplateThumbnail template={t} onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledWith(t)
  })
})
