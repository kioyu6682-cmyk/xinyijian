import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '缺少 Supabase 配置：请在 .env 中设置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY（仅使用 anon 公钥）',
  );
}

if (supabaseAnonKey.includes('service_role')) {
  throw new Error('禁止在前端使用 service_role 密钥，请改用 Supabase 控制台中的 anon 公钥');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
