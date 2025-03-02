export const ENV = {
  APP: process.env.APP || 'be-sonique',
  CORS_ORIGIN: process.env.CORS_ORIGIN || true,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'temp-secret',
  NODE_ENV: (process.env.NODE_ENV || 'dev') as 'local' | 'dev' | 'production',
  PORT: process.env.PORT || 3000,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'temp-secret',
  SUPABASE_KEY: process.env.SUPABASE_KEY || 'temp-supabase-key',
  SUPABASE_URL: process.env.SUPABASE_URL || 'temp-supabase-url',
};

if (ENV.NODE_ENV === 'local' && !process.env.CORS_ORIGIN) {
  ENV.CORS_ORIGIN = 'http://localhost:8080';
}

if (ENV.NODE_ENV === 'dev' && process.env.DEV_DATABASE_URL) {
  ENV.DATABASE_URL = process.env.DEV_DATABASE_URL;
}
