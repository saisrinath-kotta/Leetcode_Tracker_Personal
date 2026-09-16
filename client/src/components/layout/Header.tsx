import React from 'react';
import { Search, Sun, Moon, Menu, User as UserIcon, Laptop, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Breadcrumbs } from './Breadcrumbs';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  theme: 'dark' | 'light' | 'system';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
  theme,
  onToggleTheme,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.username || 'Guest';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <header className="h-16 border-b border-border/80 bg-card/40 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 lg:px-8 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Trigger */}
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open Mobile Menu"
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs />
      </div>

      {/* Center / Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          aria-label="Search problems, topics, patterns"
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg border border-border/70 bg-secondary/30 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all w-44 sm:w-64 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Search className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">Search problems, topics...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border border-border ml-auto">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          aria-label={`Current theme: ${theme}. Toggle theme mode.`}
          title={`Current theme: ${theme}. Click to switch theme.`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Laptop className="w-4 h-4 text-indigo-400" />
          )}
        </Button>

        {/* User Profile Avatar / Sign In */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold leading-none text-foreground">{displayName}</span>
                  <span className="text-[10px] text-emerald-400 mt-0.5 font-mono">Active Session</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title="Log Out"
                aria-label="Log Out"
                className="p-1.5 ml-1 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm" className="text-xs">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
