// Created by Claude (Claude Code).
// Browser APIs jsdom lacks; Radix primitives and lazy thumbnails need them.

const noop = () => {};

class ObserverStub {
  observe = noop;

  unobserve = noop;

  disconnect = noop;
}

if (!('ResizeObserver' in globalThis)) {
  Object.assign(globalThis, { ResizeObserver: ObserverStub });
}

if (!('IntersectionObserver' in globalThis)) {
  Object.assign(globalThis, { IntersectionObserver: ObserverStub });
}
