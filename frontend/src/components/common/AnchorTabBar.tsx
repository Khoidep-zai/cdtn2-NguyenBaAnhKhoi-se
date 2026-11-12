import React, { useRef, useEffect, useState } from 'react';
import './AnchorTabBar.css';

export interface TabOption {
  id: string;
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

export interface AnchorTabBarProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const AnchorTabBar: React.FC<AnchorTabBarProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  // Update fallback position for browsers that do not support native CSS Anchor Positioning
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const tabRect = activeTabRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div ref={containerRef} className={`anchor-tab-bar-container ${className}`} role="tablist">
      {/* Sliding indicator element (uses CSS Anchor Positioning or fallback) */}
      <div
        className="anchor-tab-indicator"
        style={{
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
        }}
        aria-hidden="true"
      />

      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={isActive ? activeTabRef : null}
            role="tab"
            aria-selected={isActive}
            className={`anchor-tab-item ${isActive ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="anchor-tab-badge">{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

