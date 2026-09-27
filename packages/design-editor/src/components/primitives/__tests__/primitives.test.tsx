// Checked and updated by Claude (Claude Code).
import * as React from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Button, Input, Popover, Select, Slider, Tooltip } from '..';

afterEach(() => {
  cleanup();
});

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('applies variant via data attribute', () => {
    render(<Button variant="primary">x</Button>);
    expect(screen.getByRole('button').dataset.variant).toBe('primary');
  });
});

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeDefined();
  });
});

describe('Slider', () => {
  it('renders slider element', () => {
    render(<Slider aria-label="Volume" onValueChange={() => {}} value={50} />);
    expect(screen.getByRole('slider')).toBeDefined();
  });
});

// For Popover, Tooltip, and Select, radix primitives render to portals and might need user interaction or complex setup to test fully in JSDOM,
// so we do very basic smoke tests just to ensure they don't crash on render.

describe('Popover', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Popover content={<div>Content</div>}>
        <button type="button">Trigger</button>
      </Popover>
    );
    expect(container).toBeDefined();
  });
});

describe('Tooltip', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Tooltip title="Help text">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    expect(container).toBeDefined();
  });
});

describe('Select', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Select options={[{ value: '1', label: 'One' }]} value="1" />
    );
    expect(container).toBeDefined();
  });
});
