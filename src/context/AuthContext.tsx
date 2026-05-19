import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { OFFLINE_MODE } from '../config/offlineMode';

export interface AuthUser {
  id: string;
  phone: string;
  nickname: string;
  avatarEmoji: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (phone: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (phone: string, password: string, nickname: string) => Promise<{ ok: boolean; message?: string }>;
  updateProfile: (patch: Partial<Pick<AuthUser, 'nickname' | 'avatarEmoji'>>) => Promise<boolean>;
  logout: () => Promise<void>;
  isHydrated: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

// 离线模式下的默认用户
const OFFLINE_USER: AuthUser = {
  id: 'offline-user-123',
  phone: '13800138000',
  nickname: '用户',
  avatarEmoji: '👤'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('xinyijian_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('xinyijian_user');
      }
    } else if (OFFLINE_MODE) {
      // 离线模式：自动登录为默认用户
      saveUser(OFFLINE_USER);
    }
    setHydrated(true);
  }, []);

  const saveUser = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('xinyijian_user', JSON.stringify(userData));
  };

  const login = useCallback(
    async (phone: string, password: string) => {
      const normalized = phone.replace(/\s/g, '');
      if (!/^1\d{10}$/.test(normalized)) return { ok: false, message: '请输入 11 位中国大陆手机号' };
      if (password.length < 6) return { ok: false, message: '密码至少 6 位' };

      // 离线模式：直接创建用户
      if (OFFLINE_MODE) {
        const offlineUser: AuthUser = {
          id: `offline-${Date.now()}`,
          phone: normalized,
          nickname: '用户',
          avatarEmoji: '👤'
        };
        saveUser(offlineUser);
        return { ok: true };
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, phone, nickname, avatar_emoji')
          .eq('phone', normalized)
          .single();

        if (error) {
          return { ok: false, message: '用户不存在' };
        }

        if (data) {
          saveUser({
            id: data.id,
            phone: data.phone,
            nickname: data.nickname,
            avatarEmoji: data.avatar_emoji || '👤'
          });
          return { ok: true };
        }
      } catch (e) {
        return { ok: false, message: '登录失败' };
      }

      return { ok: false, message: '登录失败' };
    },
    []
  );

  const register = useCallback(
    async (phone: string, password: string, nickname: string) => {
      const normalized = phone.replace(/\s/g, '');
      if (!/^1\d{10}$/.test(normalized)) return { ok: false, message: '请输入 11 位手机号' };
      if (password.length < 6) return { ok: false, message: '密码至少 6 位' };
      if (!nickname.trim()) return { ok: false, message: '请输入昵称' };

      // 离线模式：直接创建用户
      if (OFFLINE_MODE) {
        const offlineUser: AuthUser = {
          id: `offline-${Date.now()}`,
          phone: normalized,
          nickname: nickname.trim(),
          avatarEmoji: '👤'
        };
        saveUser(offlineUser);
        return { ok: true };
      }

      try {
        const existing = await supabase
          .from('users')
          .select('id')
          .eq('phone', normalized)
          .single();

        if (existing.data) {
          return { ok: false, message: '该手机号已注册' };
        }

        const { data, error } = await supabase
          .from('users')
          .insert({
            phone: normalized,
            nickname: nickname.trim(),
            avatar_emoji: '👤',
            password_hash: password
          })
          .select('id, phone, nickname, avatar_emoji')
          .single();

        if (error) {
          return { ok: false, message: error.message };
        }

        if (data) {
          saveUser({
            id: data.id,
            phone: data.phone,
            nickname: data.nickname,
            avatarEmoji: data.avatar_emoji || '👤'
          });
          return { ok: true };
        }
      } catch (e) {
        return { ok: false, message: '注册失败' };
      }

      return { ok: false, message: '注册失败' };
    },
    []
  );

  const updateProfile = useCallback(
    async (patch: Partial<Pick<AuthUser, 'nickname' | 'avatarEmoji'>>) => {
      if (!user) {
        throw new Error('请先登录');
      }

      const updated = { ...user, ...patch };
      let savedToServer = false;

      try {
        const { error } = await supabase
          .from('users')
          .update({
            nickname: patch.nickname,
            avatar_emoji: patch.avatarEmoji,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (!error) {
          savedToServer = true;
        } else {
          console.warn('网络保存失败，将保存到本地:', error.message);
        }
      } catch (networkError: unknown) {
        const errorMessage = networkError instanceof Error ? networkError.message : '未知错误';
        console.warn('网络连接失败，将保存到本地:', errorMessage);
      }

      saveUser(updated);
      return savedToServer;
    },
    [user]
  );

  const logout = useCallback(async () => {
    localStorage.removeItem('xinyijian_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isHydrated: hydrated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth 需在 AuthProvider 内使用');
  return c;
}
