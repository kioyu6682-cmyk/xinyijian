type DetailType = 'clothing' | 'outfit' | 'post' | 'eco' | 'style';

const store: Record<string, string | null> = {};

export const detailStore = {
  set(type: DetailType, id: string) {
    store[type] = id;
  },
  get(type: DetailType): string | null {
    return store[type] ?? null;
  },
  clear(type: DetailType) {
    store[type] = null;
  },
};
