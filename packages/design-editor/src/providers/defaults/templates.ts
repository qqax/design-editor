import data from './templates.data.json';

import type {
  DesignTemplate,
  TemplateCategory,
  TemplateListOpts,
  TemplateListResult,
  TemplateProvider,
} from '../templates';

interface BundledData {
  categories: TemplateCategory[];
  templates: DesignTemplate[];
}

const DEFAULT_LIMIT = 12;

function compareCategories(a: TemplateCategory, b: TemplateCategory): number {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  return a.name.localeCompare(b.name);
}

function matchesSearch(template: DesignTemplate, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (template.name.toLowerCase().includes(q)) return true;
  return (template.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
}

/**
 * The default template provider — backed by a small bundled JSON.
 * Host apps should supply their own `TemplateProvider` for production use.
 */
export function createDefaultTemplateProvider(): TemplateProvider {
  const bundled = data as BundledData;

  return {
    async categories() {
      return [...bundled.categories].sort(compareCategories);
    },

    async list(opts: TemplateListOpts): Promise<TemplateListResult> {
      const limit = opts.limit ?? DEFAULT_LIMIT;

      let filtered = bundled.templates.slice();
      if (opts.categoryId) {
        filtered = filtered.filter((t) => t.categoryId === opts.categoryId);
      }
      if (opts.search) {
        filtered = filtered.filter((t) => matchesSearch(t, opts.search!));
      }

      // stable sort by id for deterministic pagination
      filtered.sort((a, b) => a.id.localeCompare(b.id));

      let startIndex = 0;
      if (opts.cursor) {
        const idx = filtered.findIndex((t) => t.id === opts.cursor);
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
