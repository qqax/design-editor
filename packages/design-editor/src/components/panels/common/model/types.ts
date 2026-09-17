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

export type PanelsConfigType = Record<
  PanelKey,
  {
    showPanel: boolean;
    provider: ResourceProvider;
    renderProp:
      | React.ReactNode
      | ((props: {
          onAddResource: (resource: string | DesignResource) => void;
        }) => React.ReactNode);
  }
>;
