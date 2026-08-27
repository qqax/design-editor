import data from './textDesigns.data.json';

import type {
  TextDesign,
  TextDesignCategory,
  TextDesignListOpts,
  TextDesignListResult,
  TextDesignProvider,
} from '../textDesigns';

interface BundledData {
  categories: TextDesignCategory[];
  textDesigns: TextDesign[];
}

const DEFAULT_LIMIT = 12;

function compareCategories(
  a: TextDesignCategory,
  b: TextDesignCategory
): number {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  return a.name.localeCompare(b.name);
}

function matchesSearch(design: TextDesign, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (design.name.toLowerCase().includes(q)) return true;
  return (design.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
}

/**
 * The default text design provider — backed by a small bundled JSON.
 * Host apps should supply their own `TextDesignProvider` for production use.
 */
export function createDefaultTextDesignProvider(): TextDesignProvider {
  const bundled = data as BundledData;

  return {
    async categories() {
      return [...bundled.categories].sort(compareCategories);
    },

    async list(opts: TextDesignListOpts): Promise<TextDesignListResult> {
      const limit = opts.limit ?? DEFAULT_LIMIT;

      let filtered = bundled.textDesigns.slice();
      if (opts.categoryId) {
        filtered = filtered.filter((d) => d.categoryId === opts.categoryId);
      }
      if (opts.search) {
        filtered = filtered.filter((d) => matchesSearch(d, opts.search!));
      }

      // stable sort by id for deterministic pagination
      filtered.sort((a, b) => a.id.localeCompare(b.id));

      let startIndex = 0;
      if (opts.cursor) {
        const idx = filtered.findIndex((d) => d.id === opts.cursor);
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
