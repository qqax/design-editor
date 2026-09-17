import type { BundledData } from '../model';
import type {
  DesignResource,
  ResourceCategory,
  ResourceListOpts,
  ResourceListResult,
  ResourceProvider,
} from '../provider';

const DEFAULT_LIMIT = 12;

function compareCategories(a: ResourceCategory, b: ResourceCategory): number {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  return a.name.localeCompare(b.name);
}

function matchesSearch(design: DesignResource, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (design.name.toLowerCase().includes(q)) return true;
  return (design.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
}

/**
 * The default text design provider — backed by a small bundled JSON.
 * Host apps should supply their own `TextDesignProvider` for production use.
 */
export function createDefaultDesignProvider(
  bundled: BundledData
): ResourceProvider {
  return {
    async categories() {
      return [...bundled.categories].sort(compareCategories);
    },

    async list({
      limit: externalLimit,
      categoryId,
      search,
      cursor,
    }: ResourceListOpts): Promise<ResourceListResult> {
      const limit = externalLimit ?? DEFAULT_LIMIT;

      let filtered = bundled.resources.slice();
      if (categoryId) {
        filtered = filtered.filter((d) => d.categoryId === categoryId);
      }
      if (search) {
        filtered = filtered.filter((d) => matchesSearch(d, search));
      }

      // stable sort by id for deterministic pagination
      filtered.sort((a, b) => a.id.localeCompare(b.id));

      let startIndex = 0;
      if (cursor) {
        const idx = filtered.findIndex((d) => d.id === cursor);
        startIndex = idx >= 0 ? idx + 1 : 0;
      }

      const slice = filtered.slice(startIndex, startIndex + limit);
      const last = slice[slice.length - 1];
      const nextCursor =
        last && startIndex + slice.length < filtered.length
          ? last.id
          : undefined;

      return { items: slice, nextCursor };
    },
  };
}
