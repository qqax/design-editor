import throttle from 'lodash/throttle';

import Base from './Base';
import { LayerType } from '../common/constants';

/**
 * Undo / Redo — Full-canvas JSON snapshot approach
 *
 * Fabric.js v6 best practice:
 *   save  → JSON.stringify(canvas.toJSON(propertiesToInclude))
 *   restore → canvas.loadFromJSON(json).then(…)
 *
 * `enlivenObjects` is fragile with custom classes, z-ordering, and clipPath.
 * `loadFromJSON` handles everything internally — class resolution, async image
 * loading, proper instantiation via the classRegistry, and z-order.
 *
 * An `isActive` flag prevents saves while a restore is in progress (the canvas
 * fires object:added etc. during loadFromJSON which would corrupt the stack).
 */
class History extends Base {
  private redos: string[] = [];

  private undos: string[] = [];

  /** Stringified JSON of the current canvas state */
  private current = '';

  /** True while a restore is in progress — gates saves */
  public isActive = false;

  // ── capture a deep-copy snapshot of the canvas ────────────────────────
  private captureState = (): string => {
    const json = (this.canvas as any).toJSON(
      this.config.propertiesToInclude as any
    );
    // Strip clipPath from every object. Our custom fromObject() methods
    // bypass Fabric's internal clipPath enliven pipeline, so clipPath
    // survives as a plain JSON object → _drawClipPath() crashes calling
    // _set() on it.  The editor re-applies clipPath (= Frame reference)
    // in restoreState(), so it never needs to be serialized.
    if (json.objects) {
      json.objects = json.objects.map(this.stripClipPath);
    }
    return JSON.stringify(json);
  };

  /** Recursively remove clipPath from an object and its children (groups) */
  private stripClipPath = (obj: any): any => {
    const { clipPath, ...rest } = obj;
    // Handle groups / activeSelection that contain nested objects
    if (rest.objects && Array.isArray(rest.objects)) {
      rest.objects = rest.objects.map(this.stripClipPath);
    }
    return rest;
  };

  public initialize = () => {
    this.current = this.captureState();
  };

  public getStatus = () => {
    return {
      hasUndo: this.undos.length >= 1,
      hasRedo: this.redos.length > 0,
    };
  };

  // ── save current state to the undo stack ───────────────────────────────
  public save = () => {
    if (this.isActive) return; // never save during restore
    try {
      this.undos.push(this.current); // push OLD state
      this.current = this.captureState(); // snapshot the NEW state
      this.redos = []; // new action → clear redo
    } catch (err) {
      console.error('[History.save]', err);
    }
    this.emitStatus();
  };

  // ── undo ──────────────────────────────────────────────────────────────
  public undo = throttle(() => {
    if (this.isActive || this.undos.length < 1) return;
    const prev = this.undos.pop()!;
    this.redos.push(this.current); // save current → redo
    this.current = prev;
    this.restoreState(prev);
  }, 100);

  // ── redo ──────────────────────────────────────────────────────────────
  public redo = throttle(() => {
    if (this.isActive || this.redos.length < 1) return;
    const next = this.redos.pop()!;
    this.undos.push(this.current); // save current → undo
    this.current = next;
    this.restoreState(next);
  }, 100);

  // ── restore — the heart of undo / redo ────────────────────────────────
  private restoreState = (stateStr: string) => {
    this.isActive = true;
    const json = JSON.parse(stateStr);

    (this.canvas as any)
      .loadFromJSON(json)
      .then(() => {
        // Re-apply clipPath — loadFromJSON strips it, and our editor uses
        // the Frame object as the clip mask for all objects inside it.
        if (this.config.clipToFrame) {
          const { frame } = this.editor.frame;
          if (frame) {
            this.canvas.getObjects().forEach((obj: any) => {
              if (
                obj.type !== LayerType.FRAME &&
                obj.type !== LayerType.BACKGROUND
              ) {
                obj.clipPath = frame;
              }
            });
          }
        }

        this.canvas.requestRenderAll();

        // Sync React state so layer panel, toolbar, and active selection update
        this.editor.objects.updateContextObjects();
        this.editor.state.setActiveObject(null);
        this.emitStatus();
      })
      .catch((err: any) => {
        console.error('[History.restoreState]', err);
      })
      .finally(() => {
        this.isActive = false;
      });
  };

  public reset = () => {
    this.redos = [];
    this.undos = [];
    this.emitStatus();
  };

  public emitStatus = () => {
    this.editor.emit('history:changed', {
      hasUndo: this.undos.length >= 1,
      hasRedo: this.redos.length > 0,
    });
  };

  public get status() {
    return {
      undos: this.undos,
      redos: this.redos,
      state: this.current,
    };
  }
}

export default History;
