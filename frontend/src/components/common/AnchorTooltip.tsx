import React, { useRef, useState, useId } from 'react';
import './AnchorTooltip.css';

export interface AnchorTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AnchorTooltip: React.FC<AnchorTooltipProps> = ({
  content,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, '');
  const anchorName = `--tip-${uniqueId}`;

  const showTooltip = () => {
    setIsVisible(true);
    try {
      if (popoverRef.current && typeof (popoverRef.current as any).showPopover === 'function') {
        (popoverRef.current as any).showPopover();
      }
    } catch {
      // Graceful fallback
    }
  };

  const hideTooltip = () => {
    setIsVisible(false);
    try {
      if (popoverRef.current && typeof (popoverRef.current as any).hidePopover === 'function') {
        (popoverRef.current as any).hidePopover();
      }
    } catch {
      // Graceful fallback
    }
  };

  return (
    <div
      className={`anchor-tooltip-wrapper ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <div
        className="anchor-tooltip-trigger"
        style={{ anchorName: anchorName } as React.CSSProperties}
      >
        {children}
      </div>

      <div
        ref={popoverRef}
        // @ts-ignore - React 18 popover attribute
        popover="auto"
        className="anchor-tooltip-popover"
        style={{
          display: isVisible ? 'block' : 'none',
          // @ts-ignore - CSS anchor attribute
          positionAnchor: anchorName,
        }}
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
};

