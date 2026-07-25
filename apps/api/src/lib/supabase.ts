import { createClient } from '@supabase/supabase-js'
import type { Bindings } from '../types/bindings'
import type { Database } from '../types/database.types'

export function createSupabaseClient(env: Bindings) {
  return createClient<Database>(
    env.VITE_SUPABASE_URL, 
    env.VITE_SUPABASE_ANON_KEY
  );
}

export function createSupabaseClientWithAuth(env: Bindings, token: string) {
  return createClient<Database>(
    env.VITE_SUPABASE_URL, 
    env.VITE_SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}
