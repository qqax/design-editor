import type { IScene } from '../engine';

/** A single design template — a fully composed scene the user can apply as a starting point. */
export interface DesignTemplate {
  id: string;
  name: string;
  categoryId: string;
  /** Pre-rendered thumbnail. If omitted, the editor renders one at runtime from `scene`. */
  thumbnailUrl?: string;
  scene: IScene;
  /** Canvas background colour applied when this template is clicked. */
  canvasBg?: string;
  /** Workspace background colour applied when this template is clicked. */
  workspaceBg?: string;
  /** Free-text tags used for search matching alongside `name`. */
  tags?: string[];
}

/** A grouping of templates (e.g. "Social Media", "Posters"). */
export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  /** Lower values sort earlier in the panel. */
  order?: number;
}

export interface TemplateListOpts {
  categoryId?: string;
  search?: string;
  cursor?: string;
  /** Defaults to 12 if omitted. */
  limit?: number;
  signal?: AbortSignal;
}

export interface TemplateListResult {
  items: DesignTemplate[];
  /** Opaque cursor for the next page. Undefined when no more pages. */
  nextCursor?: string;
}

/**
 * Plug in your own template library. The editor calls `categories()` once
 * to render the panel, then `list()` per category, per search query,
 * and on "Load more".
 */
export interface TemplateProvider {
  categories: (opts?: { signal?: AbortSignal }) => Promise<TemplateCategory[]>;
  list: (opts: TemplateListOpts) => Promise<TemplateListResult>;
}
