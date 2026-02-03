import React from 'react';
import type { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems: { view: ViewType; label: string; icon: string }[] = [
    { view: 'rooms', label: 'Rooms', icon: '🏢' },
    { view: 'calendar', label: 'Schedule', icon: '📅' },
    { view: 'booking-form', label: 'New Booking', icon: '➕' },
    { view: 'overview', label: 'Overview', icon: '📋' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>🗓️</span>
        <span style={styles.brandText}>Room Booking</span>
      </div>
      <div style={styles.navItems}>
        {navItems.map((item) => (
          <button
            key={item.view}
            style={{
              ...styles.navButton,
              ...(currentView === item.view ? styles.activeNavButton : {}),
            }}
            onClick={() => onNavigate(item.view)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    padding: '0 24px',
    height: '60px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandIcon: {
    fontSize: '24px',
  },
  brandText: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '600',
  },
  navItems: {
    display: 'flex',
    gap: '8px',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#9ca3af',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeNavButton: {
    backgroundColor: '#374151',
    color: '#ffffff',
  },
  navIcon: {
    fontSize: '16px',
  },
  navLabel: {},
};

export default Navigation;
