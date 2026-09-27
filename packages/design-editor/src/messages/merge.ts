import type { EditorMessages } from './en';

/** Any subset of the texts; nested groups may be partial too */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type EditorMessagesOverride = DeepPartial<EditorMessages>;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Fills every text missing from `override` with the one from `base` */
export function mergeMessages<T extends object>(
  base: T,
  override: DeepPartial<T> | undefined
): T {
  if (!override) return base;
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  Object.entries(override).forEach(([key, value]) => {
    if (value === undefined) return;
    const current = result[key];
    result[key] =
      isPlainObject(current) && isPlainObject(value)
        ? mergeMessages(current, value)
        : // A text of the wrong kind (e.g. a string where a function is expected) is ignored.
          typeof current === typeof value
          ? value
          : current;
  });
  return result as T;
}
