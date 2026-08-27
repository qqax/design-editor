// @ts-nocheck
import {
  ActiveSelection,
  Canvas,
  Control,
  controlsUtils,
  Gradient,
  Group,
  Image,
  Object as FabricObject,
  Point,
  Shadow,
  Textbox,
  util,
} from 'fabric';

import Base from './Base';
import { drawCircleIcon } from '../utils/drawer';

import type { ControllerOptions } from '../common/interfaces';

class Personalization extends Base {
  constructor(props: ControllerOptions) {
    super(props);
    this.init();
  }

  init() {
    const rotationControlPosition = {
      y: this.config.controlsPosition.rotation === 'TOP' ? -0.5 : 0.5,
      offsetY: this.config.controlsPosition.rotation === 'TOP' ? -30 : 30,
    };

    // Disable context menu
    const upperCanvas = document.getElementsByClassName('upper-canvas')[0];
    if (upperCanvas) {
      upperCanvas.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      });
    }

    FabricObject.prototype.controls = FabricObject.prototype.controls || {};

    FabricObject.prototype.transparentCorners = false;
    FabricObject.prototype.cornerColor = '#20bf6b';
    FabricObject.prototype.cornerStyle = 'circle';
    FabricObject.prototype.borderColor = '#3782F7';
    FabricObject.prototype.cornerSize = 12;
    FabricObject.prototype.borderScaleFactor = 2.25;
    FabricObject.prototype.borderOpacityWhenMoving = 1;
    FabricObject.prototype.borderOpacity = 1;

    FabricObject.prototype.controls.tr = new Control({
      x: 0.5,
      y: -0.5,
      actionHandler: controlsUtils.scalingEqually,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    FabricObject.prototype.controls.tl = new Control({
      x: -0.5,
      y: -0.5,
      actionHandler: controlsUtils.scalingEqually,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    FabricObject.prototype.controls.bl = new Control({
      x: -0.5,
      y: 0.5,
      actionHandler: controlsUtils.scalingEqually,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    FabricObject.prototype.controls.br = new Control({
      x: 0.5,
      y: 0.5,
      actionHandler: controlsUtils.scalingEqually,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    FabricObject.prototype.controls.ml = new Control({
      x: -0.5,
      y: 0,
      actionHandler: controlsUtils.scalingXOrSkewingY,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    FabricObject.prototype.controls.mt = new Control({
      x: 0,
      y: -0.5,
      actionHandler: controlsUtils.scalingYOrSkewingX,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    FabricObject.prototype.controls.mb = new Control({
      x: 0,
      y: 0.5,
      actionHandler: controlsUtils.scalingYOrSkewingX,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    FabricObject.prototype.controls.mr = new Control({
      x: 0.5,
      y: 0,
      actionHandler: controlsUtils.scalingXOrSkewingY,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: controlsUtils.scaleOrSkewActionName,
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    FabricObject.prototype.controls.mtr = new Control({
      x: 0,
      y: 0.5,
      offsetY: 30,
      actionHandler: controlsUtils.rotationWithSnapping,
      cursorStyleHandler: controlsUtils.rotationStyleHandler,
      actionName: 'rotate',
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
      ...rotationControlPosition,
    });

    // Textbox controls
    Textbox.prototype.controls = Textbox.prototype.controls || {};
    Textbox.prototype.controls.tr = FabricObject.prototype.controls.tr;
    Textbox.prototype.controls.tl = FabricObject.prototype.controls.tl;
    Textbox.prototype.controls.bl = FabricObject.prototype.controls.bl;
    Textbox.prototype.controls.br = FabricObject.prototype.controls.br;

    Textbox.prototype.controls.mt = new Control({
      render: () => true,
    });

    Textbox.prototype.controls.mb = Textbox.prototype.controls.mt;

    Textbox.prototype.controls.mr = new Control({
      x: 0.5,
      y: 0,
      actionHandler: controlsUtils.changeWidth,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: 'resizing',
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    Textbox.prototype.controls.ml = new Control({
      x: -0.5,
      y: 0,
      actionHandler: controlsUtils.changeWidth,
      cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
      actionName: 'resizing',
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
    });

    Textbox.prototype.controls.mtr = new Control({
      x: 0,
      y: 0.5,
      offsetY: 30,
      actionHandler: controlsUtils.rotationWithSnapping,
      cursorStyleHandler: controlsUtils.rotationStyleHandler,
      actionName: 'rotate',
      render: drawCircleIcon,
      cornerSize: 28,
      withConnection: true,
      ...rotationControlPosition,
    });

    this.canvas.selectionColor = 'rgba(55, 130, 247, 0.15)';
    this.canvas.selectionBorderColor = '#3782F7';
    this.canvas.selectionLineWidth = 1.5;
    this.canvas.on('selection:created', (ev) => {
      const objects = this.canvas.getActiveObjects();
      const selection = this.canvas.getActiveObject();
      if (objects.length > 1) {
        selection.setControlsVisibility({
          mt: false,
          mb: false,
          mr: false,
          ml: false,
        });
        selection.padding = 10;
      }
    });
    this.canvas.on('mouse:over', (event) => {
      const { target } = event;
      const activeObjects = this.canvas.getActiveObject();
      if (
        target &&
        activeObjects !== target &&
        target.type !== 'Background' &&
        target.type !== 'BackgroundImage'
      ) {
        const bound = target.getBoundingRect();
        const ctx = this.canvas.getContext();
        ctx.strokeStyle = '#3782F7';
        ctx.lineWidth = 2.25;
        ctx.strokeRect(bound.left, bound.top, bound.width, bound.height);
      }
    });
  }
}

export default Personalization;
