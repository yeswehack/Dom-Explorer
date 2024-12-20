import { createClient, type SupabaseClient as _SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase.types";

export type SupabaseClient = _SupabaseClient<Database, "public", Database["public"]>;

let supabase: SupabaseClient;

export function getSupabaseClient() {
  if (!supabase) {
    const config = useRuntimeConfig();
    supabase = createClient<Database>(
      config.public.supabaseUrl,
      config.public.supabaseKey,
    );
  }
  return supabase;
}
