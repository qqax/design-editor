---
title: "Interface: BackgroundRemovalProvider"
---

[**@qqax/design-editor**](../README.md)

***

[@qqax/design-editor](../README.md) / BackgroundRemovalProvider

# Interface: BackgroundRemovalProvider

Defined in: [providers/backgroundRemoval.ts:6](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/backgroundRemoval.ts#L6)

Plug in a background-removal backend. The default provider uses the
optional `@imgly/background-removal` peer dep to run in-browser; you can
supply a server-side provider here instead.

## Methods

### remove()

> **remove**(`input`, `opts?`): `Promise`\<`Blob`\>

Defined in: [providers/backgroundRemoval.ts:8](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/backgroundRemoval.ts#L8)

Remove the background from the given image and return a transparent-PNG Blob.

#### Parameters

##### input

`string` \| `Blob`

##### opts?

###### onProgress?

(`pct`) => `void`

###### signal?

`AbortSignal`

#### Returns

`Promise`\<`Blob`\>
