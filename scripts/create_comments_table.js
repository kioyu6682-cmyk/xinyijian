import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('请设置环境变量 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY（见 .env.example）');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createCommentsTable() {
  console.log('=== 创建 comments 表 ===');
  
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS comments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        post_id VARCHAR(255) NOT NULL,
        user_id UUID REFERENCES users(id),
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
      CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
    `;
    
    const { error } = await supabase.rpc('execute_sql', { sql: createTableSQL });
    
    if (error) {
      console.error('❌ 创建表失败:', error.message);
      return;
    }
    
    console.log('✅ comments 表创建成功!');
    
  } catch (err) {
    console.error('❌ 异常:', err.message);
  }
}

createCommentsTable();