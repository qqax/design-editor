import React from 'react';

import { useMessages } from '../../../messages';

export const DevelopmentBadge: React.FC = () => {
  const m = useMessages();
  return (
    <div className="de-dev-badge">
      <span className="de-dev-badge-dot" />
      {m.badge}
    </div>
  );
};
