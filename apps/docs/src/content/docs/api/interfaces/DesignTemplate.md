---
title: "Interface: DesignTemplate"
---

[**@qqax/design-editor**](../README.md)

***

[@qqax/design-editor](../README.md) / DesignTemplate

# Interface: DesignTemplate

Defined in: [providers/templates.ts:4](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L4)

A single design template — a fully composed scene the user can apply as a starting point.

## Properties

### canvasBg?

> `optional` **canvasBg?**: `string`

Defined in: [providers/templates.ts:12](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L12)

Canvas background colour applied when this template is clicked.

***

### categoryId

> **categoryId**: `string`

Defined in: [providers/templates.ts:7](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L7)

***

### id

> **id**: `string`

Defined in: [providers/templates.ts:5](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L5)

***

### name

> **name**: `string`

Defined in: [providers/templates.ts:6](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L6)

***

### scene

> **scene**: [`IScene`](IScene.md)

Defined in: [providers/templates.ts:10](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L10)

***

### tags?

> `optional` **tags?**: `string`[]

Defined in: [providers/templates.ts:16](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L16)

Free-text tags used for search matching alongside `name`.

***

### thumbnailUrl?

> `optional` **thumbnailUrl?**: `string`

Defined in: [providers/templates.ts:9](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L9)

Pre-rendered thumbnail. If omitted, the editor renders one at runtime from `scene`.

***

### workspaceBg?

> `optional` **workspaceBg?**: `string`

Defined in: [providers/templates.ts:14](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L14)

Workspace background colour applied when this template is clicked.
