import type { IScene } from '../engine';

/** A single text design — a pre-composed text layout the user can apply as a starting point. */
export interface TextDesign {
  id: string;
  name: string;
  categoryId: string;
  /** Pre-rendered thumbnail. If omitted, the editor renders one at runtime from `scene`. */
  thumbnailUrl?: string;
  scene: IScene;
  /** Canvas background colour applied when this design is clicked. */
  canvasBg?: string;
  /** Free-text tags used for search matching alongside `name`. */
  tags?: string[];
}

/** A grouping of text designs (e.g. "Headings", "Quotes"). */
export interface TextDesignCategory {
  id: string;
  name: string;
  description?: string;
  /** Lower values sort earlier in the panel. */
  order?: number;
}

export interface TextDesignListOpts {
  categoryId?: string;
  search?: string;
  cursor?: string;
  /** Defaults to 12 if omitted. */
  limit?: number;
  signal?: AbortSignal;
}

export interface TextDesignListResult {
  items: TextDesign[];
  /** Opaque cursor for the next page. Undefined when no more pages. */
  nextCursor?: string;
}

/**
 * Plug in your own text design library. The editor calls `categories()` once
 * to render the panel, then `list()` per category, per search query,
 * and on "Load more".
 */
export interface TextDesignProvider {
  categories: (opts?: {
    signal?: AbortSignal;
  }) => Promise<TextDesignCategory[]>;
  list: (opts: TextDesignListOpts) => Promise<TextDesignListResult>;
}
