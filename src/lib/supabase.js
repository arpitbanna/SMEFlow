/* ===== SUPABASE CLIENT CONFIGURATION ===== */
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase credentials.
 * For production, move these to environment variables:
 *   VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rrklkeygiaiznrrmulpo.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya2xrZXlnaWFpem5ycm11bHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTQxMTgsImV4cCI6MjA4ODgzMDExOH0.EAZZ7Znwjti8j-32mcxgjOqP9kV_qBXPORc-p360biw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
