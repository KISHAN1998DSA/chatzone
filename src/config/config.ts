const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const googleApiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

export const APP_CONFIG = {
    SUPABASE_URL: supabaseUrl,
    SUPABASE_ANON_KEY: supabaseAnonKey,
    GOOGLE_AI_API_KEY: googleApiKey,
}