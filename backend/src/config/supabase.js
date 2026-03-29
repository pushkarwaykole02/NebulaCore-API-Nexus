import { createClient } from '@supabase/supabase-js';
import { env } from '../utils/env.js';
import logger from '../utils/logger.js';

const supabaseUrl = env('SUPABASE_URL');
const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
	logger.error('Supabase configuration is missing. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
	process.exit(1);
}

export const supabase = createClient(supabaseUrl, serviceRoleKey, {
	auth: { persistSession: false, autoRefreshToken: false }
});

