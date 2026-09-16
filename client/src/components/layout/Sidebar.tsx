import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  BookOpen,
  RotateCcw,
  BarChart2,
  FileText,
  History,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Practice', path: '/practice', icon: Target },
    { name: 'Problems', path: '/problems', icon: BookOpen },
    { name: 'Review', path: '/review', icon: RotateCcw },
    { name: 'Progress', path: '/progress', icon: BarChart2 },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Submissions', path: '/submissions', icon: History },
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside
      aria-label="Application Main Sidebar"
      className={clsx(
        'hidden md:flex flex-col border-r border-border/80 bg-card/70 backdrop-blur-md transition-all duration-300 z-30 relative h-screen sticky top-0 select-none',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base tracking-tight leading-none bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
                DSA Master
              </span>
              <span className="text-[9px] text-muted-foreground font-mono font-medium mt-1 truncate">
                Understand. Solve. Review.
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-2 overflow-y-auto space-y-4">
        {/* Main Nav */}
        <nav aria-label="Main Navigation" className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative focus:outline-none focus:ring-2 focus:ring-primary/50',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    {!collapsed && <span>{item.name}</span>}
                    {collapsed && (
                      <div
                        role="tooltip"
                        className="absolute left-full ml-2 px-2.5 py-1 bg-popover text-popover-foreground text-xs font-semibold rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-border"
                      >
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-2 border-t border-border/60 px-2" />

        {/* Bottom Nav */}
        <nav aria-label="Account Settings Navigation" className="space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative focus:outline-none focus:ring-2 focus:ring-primary/50',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && <span>{item.name}</span>}
                {collapsed && (
                  <div
                    role="tooltip"
                    className="absolute left-full ml-2 px-2.5 py-1 bg-popover text-popover-foreground text-xs font-semibold rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-border"
                  >
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Widget */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl border border-indigo-500/20 bg-indigo-950/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-foreground">500 LeetCode</div>
              <div className="text-[9px] text-muted-foreground">Catalog Mode</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
