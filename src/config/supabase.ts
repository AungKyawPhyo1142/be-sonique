import { ENV } from '@/env';
import logger from '@/logger';
import { createClient } from '@supabase/supabase-js';

const supabaseURL = ENV.SUPABASE_URL;
const supabaseKey = ENV.SUPABASE_KEY;

logger.info(`Connecting to Supabase at ${supabaseURL}`);

const supabase = createClient(supabaseURL, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
    },
  },
});

// Test the connection and bucket access
supabase.storage
  .getBucket('songs')
  .then(() => {
    logger.info('Successfully connected to songs bucket.');
  })
  .catch((error) => {
    logger.error('Failed to access songs bucket:', error);
  });

supabase.storage
  .getBucket('users')
  .then(() => {
    logger.info('Successfully connected to users bucket.');
  })
  .catch((error) => {
    logger.error('Failed to access users bucket:', error);
  });
export default supabase;
