// @ts-nocheck

import {Point,} from 'fabric';

import Base from './Base';

class Guidelines extends Base {
  public viewportTransform: number[] = [];

  public aligningLineOffset: any;

  public aligningLineMargin: any;

  public aligningLineWidth: any;

  public aligningLineColor: any;

  public ctx: CanvasRenderingContext2D;

  constructor(props: any) {
    super(props);
    this.initAligningGuidelines(this.canvas);
  }

  initAligningGuidelines(canvas) {
    const ctx = canvas.getSelectionContext();
    const aligningLineOffset = 0;
    const aligningLineMargin = 16;
    const aligningLineWidth = 1.2;
    const aligningLineColor = '#e056fd';
    let viewportTransform;
    let zoom = canvas.getZoom();

    function drawVerticalLine(coords) {
      drawLine(
        coords.x + 0.5,
        coords.y1 > coords.y2 ? coords.y2 : coords.y1,
        coords.x + 0.5,
        coords.y2 > coords.y1 ? coords.y2 : coords.y1
      );
    }

    function drawHorizontalLine(coords) {
      drawLine(
        coords.x1 > coords.x2 ? coords.x2 : coords.x1,
        coords.y + 0.5,
        coords.x2 > coords.x1 ? coords.x2 : coords.x1,
        coords.y + 0.5
      );
    }

    function drawLine(x1, y1, x2, y2) {
      const vt = canvas.viewportTransform;
      ctx.save();
      ctx.lineWidth = aligningLineWidth;
      ctx.strokeStyle = aligningLineColor;
      ctx.beginPath();
      ctx.moveTo(
        (x1 + viewportTransform[4] / vt[0]) * zoom,
        (y1 + viewportTransform[5] / vt[0]) * zoom
      );
      ctx.lineTo(
        (x2 + viewportTransform[4] / vt[0]) * zoom,
        (y2 + viewportTransform[5] / vt[0]) * zoom
      );
      ctx.stroke();
      ctx.restore();
    }

    function isInRange(
      value1: any,
      value2: any,
      customAligningLineMargin?: number
    ) {
      const aligningMargin = customAligningLineMargin || aligningLineMargin;
      value1 = Math.round(value1);
      value2 = Math.round(value2);
      for (
        let i = value1 - aligningMargin, len = value1 + aligningMargin;
        i <= len;
        i++
      ) {
        if (i === value2) {
          return true;
        }
      }
      return false;
    }

    const verticalLines: any[] = [];
    const horizontalLines: any[] = [];

    canvas.on('mouse:down', function () {
      viewportTransform = canvas.viewportTransform;
      zoom = canvas.getZoom();
    });

    canvas.on('object:moving', function (e) {
      const activeObject = e.target;
      const canvasObjects = canvas.getObjects();
      const activeObjectCenter = activeObject.getCenterPoint();
      const activeObjectLeft = activeObjectCenter.x;
      const activeObjectTop = activeObjectCenter.y;
      const activeObjectBoundingRect = activeObject.getBoundingRect();
      const activeObjectHeight =
        activeObjectBoundingRect.height / viewportTransform[3];
      const activeObjectWidth =
        activeObjectBoundingRect.width / viewportTransform[0];
      let horizontalInTheRange = false;
      let verticalInTheRange = false;
      const transform = canvas._currentTransform;

      if (!transform) return;

      // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
      // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

      for (let i = canvasObjects.length; i--;) {
        if (
          canvasObjects[i] === activeObject ||
          canvasObjects[i].type === 'Background'
        )
          continue;
        const objectCenter = canvasObjects[i].getCenterPoint();
        const objectLeft = objectCenter.x;
        const objectTop = objectCenter.y;
        const objectBoundingRect = canvasObjects[i].getBoundingRect();
        const objectHeight = objectBoundingRect.height / viewportTransform[3];
        const objectWidth = objectBoundingRect.width / viewportTransform[0];
        const backgroundImageMargin =
          activeObject.type === 'BackgroundImage' &&
          canvasObjects[i].type === 'Frame'
            ? 30
            : false;
        // snap by the horizontal center line
        if (isInRange(objectLeft, activeObjectLeft, backgroundImageMargin)) {
          verticalInTheRange = true;
          if (canvasObjects[i].type === 'Frame') {
            verticalLines.push({
              x: objectLeft,
              y1: -5000,
              y2: 5000,
            });
          } else {
            verticalLines.push({
              x: objectLeft,
              y1:
                objectTop < activeObjectTop
                  ? objectTop - objectHeight / 2 - aligningLineOffset
                  : objectTop + objectHeight / 2 + aligningLineOffset,
              y2:
                activeObjectTop > objectTop
                  ? activeObjectTop +
                    activeObjectHeight / 2 +
                    aligningLineOffset
                  : activeObjectTop -
                    activeObjectHeight / 2 -
                    aligningLineOffset,
            });
          }
          activeObject.setPositionByOrigin(
            new Point(objectLeft, activeObjectTop),
            'center',
            'center'
          );
        }

        // snap by the left edge
        if (
          isInRange(
            objectLeft - objectWidth / 2,
            activeObjectLeft - activeObjectWidth / 2,
            backgroundImageMargin
          )
        ) {
          verticalInTheRange = true;

          if (canvasObjects[i].type === 'Frame') {
            verticalLines.push({
              x: objectLeft - objectWidth / 2,
              y1: -5000,
              y2: 5000,
            });
          } else {
            verticalLines.push({
              x: objectLeft - objectWidth / 2,
              y1:
                objectTop < activeObjectTop
                  ? objectTop - objectHeight / 2 - aligningLineOffset
                  : objectTop + objectHeight / 2 + aligningLineOffset,
              y2:
                activeObjectTop > objectTop
                  ? activeObjectTop +
                    activeObjectHeight / 2 +
                    aligningLineOffset
                  : activeObjectTop -
                    activeObjectHeight / 2 -
                    aligningLineOffset,
            });
          }
          activeObject.setPositionByOrigin(
            new Point(
              objectLeft - objectWidth / 2 + activeObjectWidth / 2,
              activeObjectTop
            ),
            'center',
            'center'
          );
        }

        // snap by the right edge
        if (
          isInRange(
            objectLeft + objectWidth / 2,
            activeObjectLeft + activeObjectWidth / 2,
            backgroundImageMargin
          )
        ) {
          verticalInTheRange = true;

          if (canvasObjects[i].type === 'Frame') {
            verticalLines.push({
              x: objectLeft + objectWidth / 2,
              y1: -5000,
              y2: 5000,
            });
          } else {
            verticalLines.push({
              x: objectLeft + objectWidth / 2,
              y1:
                objectTop < activeObjectTop
                  ? objectTop - objectHeight / 2 - aligningLineOffset
                  : objectTop + objectHeight / 2 + aligningLineOffset,
              y2:
                activeObjectTop > objectTop
                  ? activeObjectTop +
                    activeObjectHeight / 2 +
                    aligningLineOffset
                  : activeObjectTop -
                    activeObjectHeight / 2 -
                    aligningLineOffset,
            });
          }

          activeObject.setPositionByOrigin(
            new Point(
              objectLeft + objectWidth / 2 - activeObjectWidth / 2,
              activeObjectTop
            ),
            'center',
            'center'
          );
        }

        // snap by the vertical center line
        if (isInRange(objectTop, activeObjectTop, backgroundImageMargin)) {
          horizontalInTheRange = true;

          if (canvasObjects[i].type === 'Frame') {
            horizontalLines.push({
              y: objectTop,
              x1: -5000,
              x2: 5000,
            });
          } else {
            horizontalLines.push({
              y: objectTop,
              x1:
                objectLeft < activeObjectLeft
                  ? objectLeft - objectWidth / 2 - aligningLineOffset
                  : objectLeft + objectWidth / 2 + aligningLineOffset,
              x2:
                activeObjectLeft > objectLeft
                  ? activeObjectLeft +
                    activeObjectWidth / 2 +
                    aligningLineOffset
                  : activeObjectLeft -
                    activeObjectWidth / 2 -
                    aligningLineOffset,
            });
          }

          activeObject.setPositionByOrigin(
            new Point(activeObjectLeft, objectTop),
            'center',
            'center'
          );
        }

        // snap by the top edge
        if (
          isInRange(
            objectTop - objectHeight / 2,
            activeObjectTop - activeObjectHeight / 2,
            backgroundImageMargin
          )
        ) {
          horizontalInTheRange = true;

          if (canvasObjects[i].type === 'Frame') {
            horizontalLines.push({
              y: objectTop - objectHeight / 2,
              x1: -5000,
              x2: 5000,
            });
          } else {
            horizontalLines.push({
              y: objectTop - objectHeight / 2,
              x1:
                objectLeft < activeObjectLeft
                  ? objectLeft - objectWidth / 2 - aligningLineOffset
                  : objectLeft + objectWidth / 2 + aligningLineOffset,
              x2:
                activeObjectLeft > objectLeft
                  ? activeObjectLeft +
                    activeObjectWidth / 2 +
                    aligningLineOffset
                  : activeObjectLeft -
                    activeObjectWidth / 2 -
                    aligningLineOffset,
            });
          }

          activeObject.setPositionByOrigin(
            new Point(
              activeObjectLeft,
              objectTop - objectHeight / 2 + activeObjectHeight / 2
            ),
            'center',
            'center'
          );
        }

        // snap by the bottom edge
        if (
          isInRange(
            objectTop + objectHeight / 2,
            activeObjectTop + activeObjectHeight / 2,
            backgroundImageMargin
          )
        ) {
          horizontalInTheRange = true;

          if (canvasObjects[i].type === 'Frame') {
            horizontalLines.push({
              y: objectTop + objectHeight / 2,
              x1: -5000,
              x2: 5000,
            });
          } else {
            horizontalLines.push({
              y: objectTop + objectHeight / 2,
              x1:
                objectLeft < activeObjectLeft
                  ? objectLeft - objectWidth / 2 - aligningLineOffset
                  : objectLeft + objectWidth / 2 + aligningLineOffset,
              x2:
                activeObjectLeft > objectLeft
                  ? activeObjectLeft +
                    activeObjectWidth / 2 +
                    aligningLineOffset
                  : activeObjectLeft -
                    activeObjectWidth / 2 -
                    aligningLineOffset,
            });
          }

          activeObject.setPositionByOrigin(
            new Point(
              activeObjectLeft,
              objectTop + objectHeight / 2 - activeObjectHeight / 2
            ),
            'center',
            'center'
          );
        }
      }

      if (!horizontalInTheRange) {
        horizontalLines.length = 0;
      }

      if (!verticalInTheRange) {
        verticalLines.length = 0;
      }
    });

    canvas.on('before:render', function () {
      canvas.clearContext(canvas.contextTop);
    });

    canvas.on('after:render', function () {
      for (let i = verticalLines.length; i--;) {
        drawVerticalLine(verticalLines[i]);
      }
      for (let i = horizontalLines.length; i--;) {
        drawHorizontalLine(horizontalLines[i]);
      }

      verticalLines.length = horizontalLines.length = 0;
    });

    canvas.on('mouse:up', function () {
      verticalLines.length = horizontalLines.length = 0;
      canvas.renderAll();
    });
  }
}

export default Guidelines;
