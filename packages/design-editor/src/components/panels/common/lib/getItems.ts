import type { GroupedCategoryResult, ScrollRowType } from '../model';

export const getItemsFactory =
  <T extends ScrollRowType<CategoryType>, CategoryType extends string>(
    items: T[],
    order: { key: CategoryType; label: string }[]
  ) =>
  (search: string): GroupedCategoryResult<T, CategoryType>[] => {
    const searchString = search.trim().toLowerCase();

    const categoriesMap = new Map<
      CategoryType,
      GroupedCategoryResult<T, CategoryType>
    >(
      order.map((o) => [
        o.key,
        {
          categoryId: o.key,
          categoryLabel: o.label,
          categoryItems: [],
        },
      ])
    );

    items.forEach((item) => {
      if (searchString) {
        const matchesLabel = item.label.toLowerCase().includes(searchString);
        const matchesId = item.id.toLowerCase().includes(searchString);

        if (!matchesLabel && !matchesId) return;
      }

      const categoryGroup = categoriesMap.get(item.category);
      if (categoryGroup) {
        categoryGroup.categoryItems.push(item);
      }
    });

    return Array.from(categoriesMap.values());
  };
