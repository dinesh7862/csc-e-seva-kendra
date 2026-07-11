// ============================================================
// E Seva Kendra — Supabase Client Configuration
// ============================================================
// This file initializes the Supabase client for use throughout the app.
// Configure your environment variables in .env.local to connect.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Supabase client instance — used for database, auth, and storage */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Check if Supabase is configured */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
