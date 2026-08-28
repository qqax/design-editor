# Engine

Forked from [layerhub-io/layerhub-io](https://github.com/layerhub-io/layerhub-io) at commit
`5274851402beef2e6fc7f8e55ee65e7e95b73d65`. Original LICENSE preserved in this directory.

Subsequent modifications by Fastlab are documented in CHANGELOG.md at the package root.

## Why we forked

LayerHub upstream activity slowed in 2025. We needed a single bundle with strict
TypeScript and our own release cadence. Vendoring keeps the editor ergonomic
while preserving the original MIT license terms.

## Packages vendored

| Directory | Origin                         | Version |
|-----------|--------------------------------|---------|
| `core/`   | `@layerhub-io/core`            | 0.3.3   |
| `objects/`| `@layerhub-io/objects`         | 0.2.0   |
| `react/`  | `@layerhub-io/react`           | 0.3.3   |
| `types/`  | `@layerhub-io/types`           | 0.3.0   |

## Fabric.js version

The upstream layerhub-io engine was originally dependent on Fabric.js v5.x. We have fully migrated this vendored package to **Fabric.js v6**, taking advantage of the modern Promise-based APIs, ES6 classes, and improved TypeScript typings.
