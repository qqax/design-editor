import type { IScene } from '../../../../engine';

/** A single design Resource — a fully composed scene the user can apply as a starting point. */
export interface DesignResource {
  id: string;
  name: string;
  categoryId: string;
  /** Pre-rendered thumbnail. If omitted, the editor renders one at runtime from `scene`. */
  thumbnailUrl?: string;
  scene: IScene;
  /** Canvas background colour applied when this Resource is clicked. */
  canvasBg?: string;
  /** Workspace background colour applied when this Resource is clicked. */
  workspaceBg?: string;
  /** Free-text tags used for search matching alongside `name`. */
  tags?: string[];
}

/** A grouping of Resources (e.g. "Social Media", "Posters"). */
export interface ResourceCategory {
  id: string;
  name: string;
  description?: string;
  /** Lower values sort earlier in the panel. */
  order?: number;
}

export interface ResourceListOpts {
  categoryId?: string;
  search?: string;
  cursor?: string;
  /** Defaults to 12 if omitted. */
  limit?: number;
  signal?: AbortSignal;
}

export interface ResourceListResult {
  items: DesignResource[];
  /** Opaque cursor for the next page. Undefined when no more pages. */
  nextCursor?: string;
}

/**
 * Plug in your own Resource library. The editor calls `categories()` once
 * to render the panel, then `list()` per category, per search query,
 * and on "Load more".
 */
export interface ResourceProvider {
  categories: (opts?: { signal?: AbortSignal }) => Promise<ResourceCategory[]>;
  list: (opts: ResourceListOpts) => Promise<ResourceListResult>;
}
