import type React from 'react';

import type {
  DesignResource,
  ResourceCategory,
  ResourceProvider,
} from '../provider';

export interface ScrollRowType<CategoryType extends string> {
  id: string;
  label: string;
  src: string;
  category: CategoryType;
}

export interface GroupedCategoryResult<
  T extends ScrollRowType<CategoryType>,
  CategoryType extends string,
> {
  categoryId: CategoryType;
  categoryLabel: string;
  categoryItems: T[];
}

export interface BundledData {
  categories: ResourceCategory[];
  resources: DesignResource[];
}

export type PanelKey = 'templates' | 'upload' | 'text' | 'shapes' | 'stickers';

export type RenderPropType =
  | React.ReactNode
  | ((props: {
      onAddResource:
        ((resource: string) => void) | ((resource: DesignResource) => void);
    }) => React.ReactNode);

export type PanelsConfigType = Record<
  Extract<PanelKey, 'templates' | 'text'>,
  {
    showPanel?: boolean;
    provider: ResourceProvider;
    renderProp?: RenderPropType;
  }
> &
  Record<
    Exclude<PanelKey, 'templates' | 'text'>,
    {
      showPanel?: boolean;
      provider?: ResourceProvider;
      renderProp?: RenderPropType;
    }
  >;
