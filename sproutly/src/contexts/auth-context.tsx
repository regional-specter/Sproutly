import type { Session, User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/supabase';
import {
  fetchProfile,
  profileNeedsOnboarding,
  userHasPlants,
} from '@/lib/plants';
import type { Profile } from '@/types/database';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  needsOnboarding: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hasPlants, setHasPlants] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async (userId: string) => {
    const [nextProfile, plantsExist] = await Promise.all([
      fetchProfile(userId),
      userHasPlants(userId),
    ]);
    setProfile(nextProfile);
    setHasPlants(plantsExist);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user.id) return;
    await loadUserData(session.user.id);
  }, [loadUserData, session?.user.id]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session);
      if (data.session?.user.id) {
        await loadUserData(data.session.user.id);
      }
      setIsLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user.id) {
        await loadUserData(nextSession.user.id);
      } else {
        setProfile(null);
        setHasPlants(false);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadUserData]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      needsOnboarding: Boolean(session) && profileNeedsOnboarding(profile, hasPlants),
      refreshProfile,
    }),
    [session, profile, isLoading, hasPlants, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
