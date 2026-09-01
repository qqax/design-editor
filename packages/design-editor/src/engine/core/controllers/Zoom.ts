import { Point } from 'fabric';

import Base from './Base';

class Zoom extends Base {
  zoomIn() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio += 0.05;
    const center = this.canvas.getCenterPoint();
    this.zoomToPoint(new Point(center.x, center.y), zoomRatio);
    this.state.setZoomRatio(zoomRatio);
  }

  zoomOut() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio -= 0.05;
    const center = this.canvas.getCenterPoint();
    this.zoomToPoint(new Point(center.x, center.y), zoomRatio);
    this.state.setZoomRatio(zoomRatio);
  }

  zoomToOne() {
    const center = this.canvas.getCenterPoint();
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    this.zoomToPoint(new Point(center.x, center.y), 1);
    this.state.setZoomRatio(1);
  }

  zoomToFit() {
    console.group('[EDITOR DEBUG] zoomToFit');

    console.log('canvas', {
      width: this.canvas.width,
      height: this.canvas.height,
    });

    console.log('zoom', this.canvas.getZoom());

    console.log(
      'viewportTransform',
      this.canvas.viewportTransform,
    );

    console.log('frame', {
      left: this.editor.frame.frame.left,
      top: this.editor.frame.frame.top,
      width: this.editor.frame.frame.width,
      height: this.editor.frame.frame.height,
    });

    console.trace('[EDITOR DEBUG] zoomToFit called');
    console.groupEnd();

    const zoom = this.editor.frame.fitRatio;

    // After centerObject(), the frame center is at the canvas element center.
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;

    // Use the frame's actual getCenterPoint after ensuring coords are fresh
    const frame = this.editor.frame.frame as any;
    try {
      frame.setCoords?.();
    } catch {
      /* ignore */
    }
    const frameCenter = frame.getCenterPoint();

    const tx = canvasW / 2 - frameCenter.x * zoom;
    const ty = canvasH / 2 - frameCenter.y * zoom;

    console.log('[zoomToFit] canvasW:', canvasW, 'canvasH:', canvasH);
    console.log('[zoomToFit] zoom:', zoom);
    console.log(
      '[zoomToFit] frame.left:',
      frame.left,
      'frame.top:',
      frame.top,
      'frame.width:',
      frame.width,
      'frame.height:',
      frame.height
    );
    console.log('[zoomToFit] frameCenter:', frameCenter);
    console.log('[zoomToFit] tx:', tx, 'ty:', ty);
    console.log(
      '[zoomToFit] frame left edge on screen:',
      frame.left * zoom + tx
    );
    console.log(
      '[zoomToFit] frame right edge on screen:',
      (frame.left + frame.width) * zoom + tx
    );

    this.canvas.setViewportTransform([zoom, 0, 0, zoom, tx, ty]);
    this.canvas.requestRenderAll();
    this.state.setZoomRatio(zoom);
  }

  zoomToRatio(zoomRatio: number) {
    const center = this.canvas.getCenterPoint();
    this.zoomToPoint(new Point(center.x, center.y), zoomRatio);
    this.state.setZoomRatio(zoomRatio);
  }

  zoomToPoint(point: Point, zoom: number) {
    const minZoom = 10;
    const maxZoom = 300;
    let zoomRatio = zoom;
    if (zoom <= minZoom / 100) {
      zoomRatio = minZoom / 100;
    } else if (zoom >= maxZoom / 100) {
      zoomRatio = maxZoom / 100;
    }
    this.canvas.zoomToPoint(point, zoomRatio);
    this.state.setZoomRatio(zoomRatio);
  }
}

export default Zoom;
