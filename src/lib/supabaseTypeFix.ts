// Temporary type fix while database types are being regenerated
// This file provides an untyped Supabase client to bypass TypeScript errors
// when the auto-generated types.ts file is empty or outdated.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Create a Supabase client without strict typing to avoid build errors
// when the database schema types are not yet generated
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Type helper for table queries - allows any table name
export const fromTable = (tableName: string) => supabase.from(tableName);
