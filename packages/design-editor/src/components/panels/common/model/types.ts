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
