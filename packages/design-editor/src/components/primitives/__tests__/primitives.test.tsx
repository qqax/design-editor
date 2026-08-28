'use client'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import * as React from 'react'

afterEach(() => {
  cleanup()
})

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
import { Button, Input, Slider, Popover, Tooltip, Select } from '../index'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDefined()
  })

  it('applies variant via data attribute', () => {
    render(<Button variant="primary">x</Button>)
    expect(screen.getByRole('button').dataset.variant).toBe('primary')
  })
})

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeDefined()
  })
})

describe('Slider', () => {
  it('renders slider element', () => {
    render(<Slider value={50} onValueChange={() => {}} aria-label="Volume" />)
    expect(screen.getByRole('slider')).toBeDefined()
  })
})

// For Popover, Tooltip, and Select, radix primitives render to portals and might need user interaction or complex setup to test fully in JSDOM, 
// so we do very basic smoke tests just to ensure they don't crash on render.

describe('Popover', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Popover content={<div>Content</div>}>
        <button>Trigger</button>
      </Popover>
    )
    expect(container).toBeDefined()
  })
})

describe('Tooltip', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Tooltip title="Help text">
        <button>Hover me</button>
      </Tooltip>
    )
    expect(container).toBeDefined()
  })
})

describe('Select', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Select 
        options={[{ value: '1', label: 'One' }]} 
        value="1" 
      />
    )
    expect(container).toBeDefined()
  })
})
