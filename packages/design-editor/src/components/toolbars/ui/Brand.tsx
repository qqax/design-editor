import React from 'react';

import { useMessages } from '../../../messages';

interface BrandProps {
  title: React.ReactNode;
}

export const Brand = ({ title }: BrandProps) => {
  const m = useMessages().toolbar;
  return <span className="de-brand de-hide-mobile">{title || m.brand}</span>;
};
