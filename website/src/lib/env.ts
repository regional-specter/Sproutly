function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const fromProcess =
      typeof process !== "undefined" ? process.env[key] : undefined;
    if (fromProcess) return fromProcess;

    const fromVite = (import.meta.env as Record<string, string | undefined>)[key];
    if (fromVite) return fromVite;
  }
  return undefined;
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = readEnv(
    "VITE_SUPABASE_URL",
    "SUPABASE_URL",
    "EXPO_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
  );
  const anonKey = readEnv(
    "VITE_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
    "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to website/.env.local",
    );
  }

  return { url, anonKey };
}
