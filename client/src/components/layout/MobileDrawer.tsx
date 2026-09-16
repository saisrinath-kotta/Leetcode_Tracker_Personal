import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Code2,
  BookOpen,
  RotateCcw,
  BarChart2,
  FileText,
  History,
  Settings,
  User,
  Target,
} from 'lucide-react';
import { clsx } from 'clsx';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Auto-close on route navigation
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Handle Escape key and body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mainItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Practice', path: '/practice', icon: Target },
    { name: 'Problems', path: '/problems', icon: BookOpen },
    { name: 'Review', path: '/review', icon: RotateCcw },
    { name: 'Progress', path: '/progress', icon: BarChart2 },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Submissions', path: '/submissions', icon: History },
  ];

  const bottomItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-card border-r border-border p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none">DSA Master</span>
                <span className="text-[9px] text-muted-foreground mt-0.5 font-mono">
                  Understand. Solve. Master.
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {mainItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50',
                      isActive ? 'bg-primary/10 text-primary font-semibold border border-primary/20' : 'text-muted-foreground hover:bg-secondary'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="my-4 border-t border-border/60" />

          <nav className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50',
                      isActive ? 'bg-primary/10 text-primary font-semibold border border-primary/20' : 'text-muted-foreground hover:bg-secondary'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
          DSA Master • Target 500 LeetCode
        </div>
      </div>
    </div>
  );
};
