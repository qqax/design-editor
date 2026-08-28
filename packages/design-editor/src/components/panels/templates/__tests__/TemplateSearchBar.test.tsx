'use client'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { TemplateSearchBar } from '../TemplateSearchBar'

afterEach(() => { cleanup(); vi.useRealTimers() })

describe('TemplateSearchBar', () => {
  it('does not fire onChange immediately on keystroke (debounced)', () => {
    vi.useFakeTimers()
    const onChange = vi.fn()
    render(<TemplateSearchBar value="" onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search templates') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'sale' } })
    expect(onChange).not.toHaveBeenCalled()
    act(() => { vi.advanceTimersByTime(300) })
    expect(onChange).toHaveBeenCalledWith('sale')
  })

  it('reflects external value prop changes', () => {
    const { rerender } = render(<TemplateSearchBar value="" onChange={() => {}} />)
    rerender(<TemplateSearchBar value="external" onChange={() => {}} />)
    const input = screen.getByPlaceholderText('Search templates') as HTMLInputElement
    expect(input.value).toBe('external')
  })
})
