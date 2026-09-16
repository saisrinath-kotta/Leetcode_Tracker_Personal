import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    practice: 'Practice',
    problems: 'Problems',
    review: 'Review',
    progress: 'Progress',
    notes: 'Notes',
    submissions: 'Submissions',
    settings: 'Settings',
    profile: 'Profile',
  };

  return (
    <nav aria-label="Breadcrumb navigation" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link to="/dashboard" className="hover:text-foreground flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[name] || (name.startsWith('287') ? '#287 Find Duplicate Number' : name.startsWith('1') ? '#1 Two Sum' : `Problem #${name}`);

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[200px]" aria-current="page">
                {displayName}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-foreground transition-colors truncate max-w-[150px]">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
