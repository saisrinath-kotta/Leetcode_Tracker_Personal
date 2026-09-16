import React, { useEffect, useState } from 'react';
import { User as UserIcon, Shield, Award, Flame, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { apiRequest } from '../services/api';

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const res = await apiRequest('/auth/me');
        setUser(res.user);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        <span>Loading developer profile...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 border border-destructive/30 rounded-xl bg-destructive/5 text-destructive text-sm text-center">
        {error || 'Unable to load profile.'}
      </div>
    );
  }

  const initials = (user.username || 'DM').substring(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-indigo-400" /> Developer Profile
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Your personal DSA Master learning profile and account preferences.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{user.username}</h2>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <Badge variant="topic" className="mt-1 uppercase text-[10px]">
              {user.preferences?.defaultLanguage || 'JavaScript'} Track
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/60 pt-4">
          <div className="p-3 bg-secondary/20 rounded-lg space-y-1">
            <span className="text-xs font-semibold text-muted-foreground block">Daily Target Goal:</span>
            <span className="text-sm font-semibold text-foreground">
              {user.preferences?.dailyGoal || 2} Problems / Day
            </span>
          </div>
          <div className="p-3 bg-secondary/20 rounded-lg space-y-1">
            <span className="text-xs font-semibold text-muted-foreground block">Active Learning Track:</span>
            <span className="text-sm font-semibold text-foreground">
              500 LeetCode Catalog
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

