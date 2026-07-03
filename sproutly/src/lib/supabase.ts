import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import { assertSupabaseEnv, env } from '@/lib/env';
import type { Database } from '@/types/database';

assertSupabaseEnv();

export const supabase = createClient<Database>(env.supabaseUrl!, env.supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
