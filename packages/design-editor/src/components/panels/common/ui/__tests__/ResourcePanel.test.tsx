// Rewritten by Claude (Claude Code).
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { en } from '../../../../../messages';
import { ResourcePanel } from '../ResourcePanel';

import type { DesignResource, ResourceProvider } from '../../provider';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const demo: DesignResource = {
  id: 'demo-1',
  name: 'Demo One',
  categoryId: 'demo',
  thumbnailUrl: 'https://example.com/demo.png',
  canvasBg: '#abcdef',
  scene: {
    id: 's',
    frame: { width: 200, height: 200 },
    layers: [],
    metadata: {},
  },
};

const provider: ResourceProvider = {
  categories: async () => [{ id: 'demo', name: 'Demo', order: 1 }],
  list: async () => ({ items: [demo] }),
};

const panel = (
  overrides: Partial<Parameters<typeof ResourcePanel>[0]> = {}
) => (
  <ResourcePanel
    emptyMessage={en.templates.empty}
    errorLoadMoreMessage={en.templates.errorLoadMore}
    errorMessage={en.templates.error}
    noMatchMessage={en.templates.noMatch}
    noResourceAvailableMessage={en.templates.unavailable}
    onApplyResource={() => {}}
    placeholder={en.templates.search}
    provider={provider}
    {...overrides}
  />
);

describe('ResourcePanel', () => {
  it('applies the resource whose thumbnail is clicked', async () => {
    const onApplyResource = vi.fn();
    render(panel({ onApplyResource }));

    await waitFor(() => expect(screen.getByTitle('Demo One')).toBeDefined());
    fireEvent.click(screen.getByTitle('Demo One'));

    expect(onApplyResource).toHaveBeenCalledTimes(1);
    expect(onApplyResource.mock.calls[0][0]).toMatchObject({
      id: 'demo-1',
      canvasBg: '#abcdef',
    });
  });

  it('offers text presets with their size and weight', () => {
    const onAddPlainText = vi.fn();
    render(panel({ onAddPlainText }));

    fireEvent.click(screen.getByTitle(en.textDesigns.addPreset('Heading', 72)));

    expect(onAddPlainText).toHaveBeenCalledWith({
      key: 'heading',
      text: 'Heading',
      fontSize: 72,
      fontWeight: 800,
    });
  });

  it('explains an empty provider', async () => {
    render(
      panel({
        provider: {
          categories: async () => [],
          list: async () => ({ items: [] }),
        },
      })
    );
    await waitFor(() =>
      expect(screen.getByText(en.templates.unavailable)).toBeDefined()
    );
  });
});
