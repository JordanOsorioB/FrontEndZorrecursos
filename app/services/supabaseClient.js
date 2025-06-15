import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cjmbefxtbhdhypcuoxdi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbWJlZnh0YmhkaHlwY3VveGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMDYyOTMsImV4cCI6MjA1NDg4MjI5M30.LpXwzykwDSu4MWfhzAYuSMGI22UUykHcLdUZA2KxyZY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 