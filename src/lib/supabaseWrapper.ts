import { supabase } from './supabaseClient';

// 简化的网络检查 - 只使用浏览器原生状态
const isOnline = (): boolean => {
  return navigator.onLine;
};

// 常用的Supabase操作封装 - 简化版本
export const supabaseWrapper = {
  select: async <T>(
    table: string,
    queryFn: (query: any) => any,
    fallback: T[] = []
  ): Promise<T[]> => {
    // 如果浏览器显示离线，直接返回回退数据
    if (!isOnline()) {
      console.log(`浏览器离线，表 ${table} 使用回退数据`);
      return fallback;
    }

    try {
      const query = supabase.from(table);
      const { data, error } = await queryFn(query);
      
      if (error) {
        console.error(`Supabase查询错误 (${table}):`, error);
        return fallback;
      }
      
      return data || fallback;
    } catch (error) {
      console.warn(`Supabase请求失败 (${table})，使用回退数据`);
      return fallback;
    }
  },

  insert: async <T>(
    table: string,
    data: any,
    options: { select?: boolean } = {}
  ): Promise<T | null> => {
    if (!isOnline()) {
      console.log(`浏览器离线，跳过表 ${table} 的插入操作`);
      return null;
    }

    try {
      let query = supabase.from(table).insert(data);
      if (options.select) {
        query = query.select().single();
      }
      
      const { data: result, error } = await query;
      
      if (error) {
        console.error(`Supabase插入错误 (${table}):`, error);
        return null;
      }
      
      return result || null;
    } catch (error) {
      console.warn(`Supabase插入失败 (${table})`);
      return null;
    }
  },

  update: async <T>(
    table: string,
    data: any,
    filterFn: (query: any) => any,
    options: { select?: boolean } = {}
  ): Promise<T | null> => {
    if (!isOnline()) {
      console.log(`浏览器离线，跳过表 ${table} 的更新操作`);
      return null;
    }

    try {
      let query = supabase.from(table).update(data);
      query = filterFn(query);
      if (options.select) {
        query = query.select().single();
      }
      
      const { data: result, error } = await query;
      
      if (error) {
        console.error(`Supabase更新错误 (${table}):`, error);
        return null;
      }
      
      return result || null;
    } catch (error) {
      console.warn(`Supabase更新失败 (${table})`);
      return null;
    }
  },

  delete: async (
    table: string,
    filterFn: (query: any) => any
  ): Promise<boolean> => {
    if (!isOnline()) {
      console.log(`浏览器离线，跳过表 ${table} 的删除操作`);
      return false;
    }

    try {
      const query = supabase.from(table).delete();
      const { error } = await filterFn(query);
      
      if (error) {
        console.error(`Supabase删除错误 (${table}):`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn(`Supabase删除失败 (${table})`);
      return false;
    }
  }
};
