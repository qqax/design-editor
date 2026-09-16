'use client';

import * as React from 'react';

interface UseResourceCategoriesParams<T> {
  load: (signal: AbortSignal) => Promise<T[]>;
}

export function useResourceCategories<T>({
  load,
}: UseResourceCategoriesParams<T>) {
  const [state, setState] = React.useState<{
    data: T[];
    loading: boolean;
    error: boolean;
  }>({
    data: [],
    loading: true,
    error: false,
  });

  const reload = React.useCallback(() => {
    const controller = new AbortController();

    setState((prev) => ({
      ...prev,
      loading: true,
      error: false,
    }));

    load(controller.signal)
      .then((data) => {
        setState({
          data,
          loading: false,
          error: false,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        if ((error as { name?: string })?.name === 'AbortError') {
          return;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: true,
        }));
      });

    return () => controller.abort();
  }, [load]);

  React.useEffect(() => {
    return reload();
  }, [reload]);

  return {
    categories: state.data,
    loading: state.loading,
    error: state.error,
    reload,
  };
}
