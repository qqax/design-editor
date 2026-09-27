import Base from './Base';
import { NO_OFFSETS, offsetGuides, snapOffset } from '../utils/guides';

import type { FabricObject } from 'fabric';

import type { ControllerOptions } from '../common/interfaces';
import type { Guide, PageOffsets } from '../utils/guides';

/** Snap distance in screen pixels */
const SNAP_DISTANCE = 6;

class Guides extends Base {
  private guides: Guide[] = [];

  private snapping = false;

  private offsets: PageOffsets = NO_OFFSETS;

  constructor(props: ControllerOptions) {
    super(props);
    this.canvas.on('object:moving', ({ target }) => this.snap(target));
  }

  public get list(): readonly Guide[] {
    return this.guides;
  }

  public setGuides(guides: Guide[]) {
    this.guides = guides;
  }

  public setSnapping(enabled: boolean) {
    this.snapping = enabled;
  }

  public setOffsets(offsets: PageOffsets) {
    this.offsets = offsets;
  }

  private snap(target: FabricObject) {
    if (!this.snapping) return;
    const { frame } = this.editor.frame;
    const guides = [
      ...this.guides,
      ...offsetGuides(this.offsets, frame.width, frame.height),
    ];
    if (!guides.length) return;
    const rect = target.getBoundingRect();
    const { x, y } = snapOffset(
      {
        left: rect.left - frame.left,
        top: rect.top - frame.top,
        width: rect.width,
        height: rect.height,
      },
      guides,
      SNAP_DISTANCE / this.canvas.getZoom()
    );
    if (!x && !y) return;
    target.set({ left: target.left + x, top: target.top + y });
    target.setCoords();
  }
}

export default Guides;
