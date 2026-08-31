---
title: "Interface: DesignEditorProps"
---

[**@qqax/design-editor**](../README.md)

***

[@qqax/design-editor](../README.md) / DesignEditorProps

# Interface: DesignEditorProps

Defined in: [components/DesignEditor.tsx:384](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L384)

Props for the top-level [DesignEditor](../functions/DesignEditor.md) component.

## Properties

### backgroundRemovalProvider?

> `optional` **backgroundRemovalProvider?**: [`BackgroundRemovalProvider`](BackgroundRemovalProvider.md)

Defined in: [components/DesignEditor.tsx:398](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L398)

Background removal provider. Defaults to `@imgly/background-removal` if installed.

***

### className?

> `optional` **className?**: `string`

Defined in: [components/DesignEditor.tsx:402](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L402)

Optional className applied to the editor root for outer styling.

***

### fontProvider?

> `optional` **fontProvider?**: [`FontProvider`](FontProvider.md)

Defined in: [components/DesignEditor.tsx:396](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L396)

Font provider. Defaults to a Google Fonts provider.

***

### initialScene?

> `optional` **initialScene?**: `any`

Defined in: [components/DesignEditor.tsx:386](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L386)

A serialized scene to load on mount, or any scene-shaped object with optional `canvasBg`/`workspaceBg`.

***

### onBack?

> `optional` **onBack?**: () => `void`

Defined in: [components/DesignEditor.tsx:390](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L390)

Called when the user clicks the back button in the toolbar.

#### Returns

`void`

***

### onExport?

> `optional` **onExport?**: (`blob`, `format`, `scene`) => `void` \| `Promise`\<`void`\>

Defined in: [components/DesignEditor.tsx:392](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L392)

Called when the user exports the design. Receives the rendered Blob, output format, and raw scene JSON.

#### Parameters

##### blob

`Blob`

##### format

`"png"` \| `"svg"` \| `"jpg"`

##### scene

[`IScene`](IScene.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### persistenceProvider?

> `optional` **persistenceProvider?**: [`PersistenceProvider`](PersistenceProvider.md)

Defined in: [components/DesignEditor.tsx:400](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L400)

Autosave/scene persistence provider. Defaults to a `localStorage` provider.

***

### sceneKey?

> `optional` **sceneKey?**: `string`

Defined in: [components/DesignEditor.tsx:388](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L388)

Stable key identifying the scene for persistence; passed to the persistence provider.

***

### templateProvider?

> `optional` **templateProvider?**: [`TemplateProvider`](TemplateProvider.md)

Defined in: [components/DesignEditor.tsx:394](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L394)

Template provider. Defaults to a small bundled starter set.

***

### templatesPanel?

> `optional` **templatesPanel?**: `TemplatesPanelRenderProp`

Defined in: [components/DesignEditor.tsx:404](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L404)

Custom render override for the Templates panel — useful to inject host-app template UI.

***

### title?

> `optional` **title?**: `ReactNode`

Defined in: [components/DesignEditor.tsx:406](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/components/DesignEditor.tsx#L406)

Optional title to display in the toolbar. Defaults to "Design Studio".
