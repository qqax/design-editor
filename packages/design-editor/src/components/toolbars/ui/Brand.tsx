import React from 'react';

interface BrandProps {
  title: React.ReactNode;
}

export const Brand = ({ title }: BrandProps) => (
  <span className="de-brand de-hide-mobile">{title || 'Design Studio'}</span>
);
