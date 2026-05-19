import { createContext, useContext, type ReactNode } from 'react';
import { useWardrobe } from '../hooks/useWardrobe';

type WardrobeCtx = ReturnType<typeof useWardrobe>;

const WardrobeContext = createContext<WardrobeCtx | null>(null);

export function WardrobeProvider({ children }: { children: ReactNode }) {
  const value = useWardrobe();
  return <WardrobeContext.Provider value={value}>{children}</WardrobeContext.Provider>;
}

export function useWardrobeContext(): WardrobeCtx {
  const ctx = useContext(WardrobeContext);
  if (!ctx) throw new Error('useWardrobeContext must be used within WardrobeProvider');
  return ctx;
}
