---
title: "Interface: PersistenceProvider"
---

[**@qqax/design-editor**](../README.md)

***

[@qqax/design-editor](../README.md) / PersistenceProvider

# Interface: PersistenceProvider

Defined in: [providers/persistence.ts:7](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/persistence.ts#L7)

Plug in a persistence backend for autosave/load. The default provider stores
scenes in `localStorage`; you can supply a server-side adapter here.

## Methods

### list()?

> `optional` **list**(): `Promise`\<`object`[]\>

Defined in: [providers/persistence.ts:13](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/persistence.ts#L13)

Optional: enumerate stored scenes (used by host-app scene pickers).

#### Returns

`Promise`\<`object`[]\>

***

### load()

> **load**(`sceneKey`): `Promise`\<[`IScene`](IScene.md) \| `null`\>

Defined in: [providers/persistence.ts:11](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/persistence.ts#L11)

Load a previously saved scene, or null if none exists.

#### Parameters

##### sceneKey

`string`

#### Returns

`Promise`\<[`IScene`](IScene.md) \| `null`\>

***

### save()

> **save**(`sceneKey`, `scene`): `Promise`\<`void`\>

Defined in: [providers/persistence.ts:9](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/persistence.ts#L9)

Persist the given scene under the provided key.

#### Parameters

##### sceneKey

`string`

##### scene

[`IScene`](IScene.md)

#### Returns

`Promise`\<`void`\>
