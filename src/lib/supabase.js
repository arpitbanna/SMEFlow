import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rrklkeygiaiznrrmulpo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya2xrZXlnaWFpem5ycm11bHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTQxMTgsImV4cCI6MjA4ODgzMDExOH0.EAZZ7Znwjti8j-32mcxgjOqP9kV_qBXPORc-p360biw'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
