/* ===== SUPABASE CLIENT CONFIGURATION ===== */
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase credentials loaded from environment variables.
 * Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
        '⚠️ Missing Supabase credentials!\n' +
        'Create a .env file in the project root with:\n' +
        '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
        '  VITE_SUPABASE_ANON_KEY=your-anon-key'
    );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
