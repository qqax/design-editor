'use client';

import * as React from 'react';

import { useMessages } from '../../../../messages';
import { useSceneThumbnail } from '../model';

import type { DesignResource } from '../provider';

interface Props {
  resource: DesignResource;
  onClick: (t: DesignResource) => void;
}

export function ResourceThumbnail({ resource, onClick }: Props) {
  const m = useMessages();
  const ref = React.useRef<HTMLButtonElement>(null);
  const { src, loading } = useSceneThumbnail(
    {
      id: resource.id,
      scene: resource.scene,
      thumbnailUrl: resource.thumbnailUrl,
      canvasBg: resource.canvasBg,
    },
    ref
  );

  const aspectRatio =
    resource.scene?.frame?.width && resource.scene.frame.height
      ? `${resource.scene.frame.width} / ${resource.scene.frame.height}`
      : '1 / 1';

  return (
    <button
      ref={ref}
      className="de-resource-thumb"
      onClick={() => onClick(resource)}
      style={{ aspectRatio }}
      title={resource.name}
      type="button"
    >
      {src ? (
        <img alt={resource.name} src={src} />
      ) : (
        <div
          aria-label={loading ? m.panel.loadingThumbnail : m.panel.noPreview}
          className="de-resource-placeholder"
          data-loading={loading}
        />
      )}
    </button>
  );
}
