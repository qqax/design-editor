// delete
export function isDelete(event: KeyboardEvent) {
  return event.key === 'Delete' || event.key === 'Backspace';
}

// save or update template
export function isCtrlS(event: KeyboardEvent) {
  return event.ctrlKey && event.code === 'KeyS';
}

// select all
export function isCtrlA(event: KeyboardEvent) {
  return event.ctrlKey && event.code === 'KeyA';
}

// copy
export function isCtrlC(event: KeyboardEvent) {
  return event.ctrlKey && event.code === 'KeyC';
}

// paste
export function isCtrlV(event: KeyboardEvent) {
  return event.ctrlKey && event.code === 'KeyV';
}

// redo
export function isCtrlY(event: KeyboardEvent) {
  return event.ctrlKey && event.code === 'KeyY';
}

// cut
export function isCtrlX(event: KeyboardEvent) {
  return event.ctrlKey && event.code === 'KeyX';
}

// nudge
export function isArrowUp(event: KeyboardEvent) {
  return event.code === 'ArrowUp';
}

// nudge
export function isArrowDown(event: KeyboardEvent) {
  return event.code === 'ArrowDown';
}

// nudge
export function isArrowLeft(event: KeyboardEvent) {
  return event.code === 'ArrowLeft';
}

// nudge
export function isArrowRight(event: KeyboardEvent) {
  return event.code === 'ArrowRight';
}

// modifier
export function isShift(event: KeyboardEvent) {
  return event.shiftKey;
}

// lineHeight--
export function isAltDown(event: KeyboardEvent) {
  return event.altKey && event.code === 'ArrowDown';
}

// lineHeight++
export function isAltUp(event: KeyboardEvent) {
  return event.altKey && event.code === 'ArrowUp';
}

// charSpacing++
export function isAltRight(event: KeyboardEvent) {
  return event.altKey && event.code === 'ArrowRight';
}

// charSpacing--
export function isAltLeft(event: KeyboardEvent) {
  return event.altKey && event.code === 'ArrowLeft';
}

// redo
export function isCtrlShiftZ(event: KeyboardEvent) {
  return event.ctrlKey && event.shiftKey && event.code === 'KeyZ';
}

// undo
export function isCtrlZ(event: KeyboardEvent) {
  return event.ctrlKey && !event.shiftKey && event.code === 'KeyZ';
}

// zoom reset
export function isCtrlOne(event: KeyboardEvent) {
  return event.ctrlKey && event.key === '1';
}

// zoom in
export function isCtrlMinus(event: KeyboardEvent) {
  return event.ctrlKey && event.key === '-';
}

// zoom out
export function isCtrlEqual(event: KeyboardEvent) {
  return event.ctrlKey && event.key === '=';
}

// zoom to fit
export function isCtrlZero(event: KeyboardEvent) {
  return event.ctrlKey && event.key === '0';
}
// }
