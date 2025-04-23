import { APP_CONFIG } from '@/config/config';
import { createClient } from '@supabase/supabase-js';

// These would typically be environment variables
const supabaseUrl = APP_CONFIG.SUPABASE_URL;
const supabaseAnonKey = APP_CONFIG.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Chat = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
};

export type Message = {
  id: string;
  chat_id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
}; 