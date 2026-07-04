function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
}

export const env = {
  supabaseUrl: readEnv(
    'EXPO_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
  ),
  supabaseAnonKey: readEnv(
    'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ),
  geminiApiKey: readEnv('EXPO_PUBLIC_GEMINI_API'),
} as const;

export function assertSupabaseEnv(): void {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      'Missing Supabase env vars. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to sproutly/.env.local (next to package.json, not inside src/).',
    );
  }
}

export function assertGeminiEnv(): void {
  if (!env.geminiApiKey) {
    throw new Error(
      'Missing Gemini API key. Add EXPO_PUBLIC_GEMINI_API to sproutly/.env.local.',
    );
  }
}
