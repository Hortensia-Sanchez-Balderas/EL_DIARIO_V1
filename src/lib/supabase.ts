import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || ""

const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || ""

export const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
)
