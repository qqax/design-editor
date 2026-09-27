// Created by Claude (Claude Code).
import { ActiveSelection, Canvas, Group, Rect } from 'fabric';
import { describe, expect, it, vi } from 'vitest';

import { ObjectsGrouping } from '../core/controllers/objects/ObjectsGrouping';
import { ObjectsSelection } from '../core/controllers/objects/ObjectsSelection';
import { resolveLayerLabels } from '../core/utils/layer-name';

import type { ObjectsContext } from '../core/controllers/objects/ObjectsContext';

const setup = () => {
  const canvas = new Canvas(document.createElement('canvas'));
  const rects = ['a', 'b', 'c'].map(
    (id, i) =>
      new Rect({
        id,
        name: id,
        left: i * 20,
        top: 0,
        width: 10,
        height: 10,
      } as never)
  );
  canvas.add(...rects);
  const context = {
    canvas,
    editor: {
      layerLabels: resolveLayerLabels({ group: 'Группа' }),
      history: { save: vi.fn() },
      frame: { frame: null },
    },
    state: { setActiveObject: vi.fn() },
    config: { clipToFrame: false },
    getRefObject: () => null,
    findOneById: (id: string) =>
      canvas.getObjects().find((object) => object.id === id) ?? null,
    updateContextObjects: vi.fn(),
  } as unknown as ObjectsContext;
  return {
    canvas,
    selection: new ObjectsSelection(context),
    grouping: new ObjectsGrouping(context),
  };
};

describe('ObjectsSelection.selectMany', () => {
  it('selects in stacking order whatever order the ids come in', () => {
    const { canvas, selection } = setup();
    selection.selectMany(['c', 'a']);
    const active = canvas.getActiveObject();
    expect(active).toBeInstanceOf(ActiveSelection);
    expect((active as ActiveSelection).getObjects().map((o) => o.id)).toEqual([
      'a',
      'c',
    ]);
  });
});

describe('ObjectsGrouping', () => {
  it('groups the selection in place without leaving copies on the canvas', () => {
    const { canvas, selection, grouping } = setup();
    selection.selectMany(['a', 'b']);
    grouping.group();

    const stack = canvas.getObjects();
    expect(stack).toHaveLength(2);
    expect(stack[0]).toBeInstanceOf(Group);
    expect(stack[0].name).toBe('Группа 1');
    expect((stack[0] as Group).getObjects().map((o) => o.id)).toEqual([
      'a',
      'b',
    ]);
    expect(stack[1].id).toBe('c');
  });

  it('ungroups back onto the canvas at the same place in the stack', () => {
    const { canvas, selection, grouping } = setup();
    const bounds = () =>
      canvas.getObjects().map((o) => {
        const { left, top } = o.getBoundingRect();
        return [Math.round(left), Math.round(top)];
      });
    const before = bounds();

    selection.selectMany(['a', 'b']);
    grouping.group();
    grouping.ungroup();
    canvas.discardActiveObject();

    expect(canvas.getObjects().map((o) => o.id)).toEqual(['a', 'b', 'c']);
    expect(bounds()).toEqual(before);
  });
});
