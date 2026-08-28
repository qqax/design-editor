---
title: "Interface: TemplateProvider"
---

[**@qqax/design-editor**](../README.md)

***

[@qqax/design-editor](../README.md) / TemplateProvider

# Interface: TemplateProvider

Defined in: [providers/templates.ts:48](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L48)

Plug in your own template library. The editor calls `categories()` once
to render the panel, then `list()` per category, per search query,
and on "Load more".

## Methods

### categories()

> **categories**(`opts?`): `Promise`\<[`TemplateCategory`](TemplateCategory.md)[]\>

Defined in: [providers/templates.ts:49](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L49)

#### Parameters

##### opts?

###### signal?

`AbortSignal`

#### Returns

`Promise`\<[`TemplateCategory`](TemplateCategory.md)[]\>

***

### list()

> **list**(`opts`): `Promise`\<[`TemplateListResult`](TemplateListResult.md)\>

Defined in: [providers/templates.ts:50](https://github.com/qqax/design-editor/blob/9bd2fcc50485e7aa4ad06da59efddb714ea87591/src/providers/templates.ts#L50)

#### Parameters

##### opts

[`TemplateListOpts`](TemplateListOpts.md)

#### Returns

`Promise`\<[`TemplateListResult`](TemplateListResult.md)\>
