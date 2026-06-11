import { createClient } from '@supabase/supabase-js'
import type { Bindings } from '../types/bindings'

export function createSupabaseClient(env: Bindings) {
  return createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
}