---
title: "Interface: FontProvider"
---

[**@qqax/design-editor**](../README.md)

***

[@qqax/design-editor](../README.md) / FontProvider

# Interface: FontProvider

Defined in: [providers/fonts.ts:15](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/fonts.ts#L15)

Plug in your own font source. The editor calls `list` to populate the Fonts
panel and `load` when the user selects a font (the provider is responsible
for injecting the

## Font-face

declaration or stylesheet).

## Methods

### list()

> **list**(`opts?`): `Promise`\<[`FontDescriptor`](FontDescriptor.md)[]\>

Defined in: [providers/fonts.ts:17](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/fonts.ts#L17)

Return the list of available fonts, optionally filtered by search.

#### Parameters

##### opts?

###### search?

`string`

###### signal?

`AbortSignal`

#### Returns

`Promise`\<[`FontDescriptor`](FontDescriptor.md)[]\>

***

### load()

> **load**(`family`, `opts?`): `Promise`\<`void`\>

Defined in: [providers/fonts.ts:19](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/fonts.ts#L19)

Load a font family (and optional weight/style) so it can be rendered on canvas.

#### Parameters

##### family

`string`

##### opts?

###### style?

`string`

###### weight?

`number`

#### Returns

`Promise`\<`void`\>
