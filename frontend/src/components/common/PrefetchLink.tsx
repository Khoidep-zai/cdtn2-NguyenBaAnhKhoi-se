import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { preloadRoute } from '../../utils/routerPreload';

export interface PrefetchLinkProps extends LinkProps {
  prefetch?: boolean;
}

/**
 * PrefetchLink: Extends standard React Router Link with automatic
 * prefetching of route chunks on hover and keyboard focus.
 */
export const PrefetchLink: React.FC<PrefetchLinkProps> = ({
  to,
  prefetch = true,
  onMouseEnter,
  onFocus,
  children,
  ...props
}) => {
  const targetPath = typeof to === 'string' ? to : to.pathname || '';

  const handlePrefetch = () => {
    if (prefetch && targetPath) {
      preloadRoute(targetPath);
    }
  };

  return (
    <Link
      to={to}
      onMouseEnter={(e) => {
        handlePrefetch();
        if (onMouseEnter) onMouseEnter(e);
      }}
      onFocus={(e) => {
        handlePrefetch();
        if (onFocus) onFocus(e);
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

