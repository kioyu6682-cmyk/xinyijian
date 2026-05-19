import { useState, useCallback, useMemo, useEffect } from 'react';
import type { ClothingItem, ClothingCategory, PatternType, SeasonType, StyleType, OccasionType, FitType, SustainabilityInfo } from '../types';
import { supabaseWrapper } from '../lib/supabaseWrapper';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { OFFLINE_MODE, OFFLINE_CLOTHING_ITEMS } from '../config/offlineMode';

interface WardrobeStats {
  totalItems: number;
  totalValue: number;
  utilizationRate: number;
  favoriteCount: number;
  sleepingCount: number;
}

export function useWardrobe() {
  const { user } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    fetchItems();
  }, [user]);

  const MOCK_ITEMS: ClothingItem[] = [
    {
      id: 'mock-1',
      name: '白色棉质衬衫',
      category: 'tops',
      subCategory: '衬衫',
      brand: '优衣库',
      color: '#FFFFFF',
      colors: ['#FFFFFF'],
      pattern: 'solid',
      material: '棉质',
      season: ['spring', 'autumn'],
      style: ['minimalist', 'business'],
      occasion: ['commute', 'home'],
      size: 'M',
      fit: 'tight',
      price: 199,
      purchaseDate: new Date('2024-01-15'),
      purchaseChannel: '线下门店',
      images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=white%20cotton%20shirt%20fashion%20photography%20minimalist%20style'],
      thumbnail: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=white%20cotton%20shirt%20thumbnail',
      wearCount: 15,
      lastWorn: new Date('2024-03-10'),
      isFavorite: true,
      isArchived: false,
      tags: ['通勤', '百搭'],
      notes: '舒适透气，适合办公室穿着',
      careInstructions: '冷水机洗，低温烘干',
      sustainability: { isRecycled: false },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10'),
      userId: 'mock-user'
    },
    {
      id: 'mock-2',
      name: '高腰牛仔裤',
      category: 'bottoms',
      subCategory: '牛仔裤',
      brand: 'Zara',
      color: '#4A5568',
      colors: ['#4A5568'],
      pattern: 'solid',
      material: '牛仔布',
      season: ['spring', 'autumn', 'winter'],
      style: ['casual', 'edgy'],
      occasion: ['home', 'commute'],
      size: '28',
      fit: 'regular',
      price: 299,
      purchaseDate: new Date('2024-02-20'),
      purchaseChannel: '线上商城',
      images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=high%20waist%20jeans%20fashion%20photography%20street%20style'],
      thumbnail: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=high%20waist%20jeans%20thumbnail',
      wearCount: 20,
      lastWorn: new Date('2024-03-12'),
      isFavorite: true,
      isArchived: false,
      tags: ['百搭', '显瘦'],
      notes: '经典款式，显瘦效果好',
      careInstructions: '反面机洗，避免暴晒',
      sustainability: { isRecycled: true },
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-03-12'),
      userId: 'mock-user'
    },
    {
      id: 'mock-3',
      name: '粉色针织开衫',
      category: 'outerwear',
      subCategory: '开衫',
      brand: 'H&M',
      color: '#F8BBD9',
      colors: ['#F8BBD9'],
      pattern: 'solid',
      material: '羊毛混纺',
      season: ['spring', 'autumn'],
      style: ['sweet', 'casual'],
      occasion: ['date', 'home'],
      size: 'S',
      fit: 'loose',
      price: 249,
      purchaseDate: new Date('2024-03-01'),
      purchaseChannel: '线下门店',
      images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=pink%20knit%20cardigan%20fashion%20photography%20soft%20style'],
      thumbnail: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=pink%20knit%20cardigan%20thumbnail',
      wearCount: 8,
      lastWorn: new Date('2024-03-11'),
      isFavorite: false,
      isArchived: false,
      tags: ['甜美', '温柔风'],
      notes: '柔软舒适，颜色很显白',
      careInstructions: '手洗，平铺晾干',
      sustainability: { isRecycled: false },
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-11'),
      userId: 'mock-user'
    },
    {
      id: 'mock-4',
      name: '黑色小皮鞋',
      category: 'shoes',
      subCategory: '皮鞋',
      brand: '百丽',
      color: '#1A1A1A',
      colors: ['#1A1A1A'],
      pattern: 'solid',
      material: '真皮',
      season: ['spring', 'autumn', 'winter'],
      style: ['preppy', 'vintage'],
      occasion: ['commute', 'date'],
      size: '37',
      fit: 'regular',
      price: 599,
      purchaseDate: new Date('2024-01-20'),
      purchaseChannel: '线上商城',
      images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=black%20leather%20loafers%20fashion%20photography%20elegant'],
      thumbnail: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=black%20leather%20loafers%20thumbnail',
      wearCount: 25,
      lastWorn: new Date('2024-03-13'),
      isFavorite: true,
      isArchived: false,
      tags: ['百搭', '通勤'],
      notes: '舒适百搭，适合长时间穿着',
      careInstructions: '定期擦鞋油保养',
      sustainability: { isRecycled: false },
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-13'),
      userId: 'mock-user'
    },
    {
      id: 'mock-5',
      name: '米色风衣',
      category: 'outerwear',
      subCategory: '风衣',
      brand: 'Burberry',
      color: '#F5F5DC',
      colors: ['#F5F5DC'],
      pattern: 'solid',
      material: '棉质混纺',
      season: ['spring', 'autumn'],
      style: ['preppy', 'luxury'],
      occasion: ['commute', 'interview'],
      size: 'M',
      fit: 'loose',
      price: 1299,
      purchaseDate: new Date('2024-02-10'),
      purchaseChannel: '专柜',
      images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=beige%20trench%20coat%20fashion%20photography%20elegant%20style'],
      thumbnail: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=beige%20trench%20coat%20thumbnail',
      wearCount: 10,
      lastWorn: new Date('2024-03-08'),
      isFavorite: true,
      isArchived: false,
      tags: ['优雅', '正式'],
      notes: '经典款式，永不过时',
      careInstructions: '干洗',
      sustainability: { isRecycled: false },
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-03-08'),
      userId: 'mock-user'
    },
    {
      id: 'mock-6',
      name: '碎花连衣裙',
      category: 'dresses',
      subCategory: '长裙',
      brand: '乐町',
      color: '#FFE4E1',
      colors: ['#FFE4E1', '#FFB6C1', '#FFFFFF'],
      pattern: 'floral',
      material: '雪纺',
      season: ['summer'],
      style: ['sweet', 'casual'],
      occasion: ['date', 'travel'],
      size: 'S',
      fit: 'tight',
      price: 349,
      purchaseDate: new Date('2024-03-05'),
      purchaseChannel: '线上商城',
      images: ['https://neeko-copilot.bytedance.net/api/text2image?prompt=floral%20dress%20summer%20fashion%20photography%20sweet%20style'],
      thumbnail: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=floral%20dress%20thumbnail',
      wearCount: 3,
      lastWorn: new Date('2024-03-09'),
      isFavorite: false,
      isArchived: false,
      tags: ['碎花', '甜美'],
      notes: '轻薄透气，适合夏天',
      careInstructions: '冷水手洗',
      sustainability: { isRecycled: false },
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-09'),
      userId: 'mock-user'
    }
  ];

  const fetchItems = async () => {
    if (!user) return;

    setIsLoading(true);

    // 离线模式：直接使用预定义的离线数据
    if (OFFLINE_MODE) {
      console.log('使用离线模式');
      setItems(OFFLINE_CLOTHING_ITEMS as ClothingItem[]);
      localStorage.setItem('wardrobe_items', JSON.stringify(OFFLINE_CLOTHING_ITEMS));
      setIsLoading(false);
      return;
    }

    const data = await supabaseWrapper.select(
      'clothing_items',
      (query: any) => query.select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      []
    );

    if (data && data.length > 0) {
      const processedData = data.map((item: any) => ({
        ...item,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        lastWorn: item.last_worn ? new Date(item.last_worn) : undefined,
        purchaseDate: item.purchase_date ? new Date(item.purchase_date) : undefined,
        colors: item.colors || [],
        season: item.season || [],
        style: item.style || [],
        occasion: item.occasion || [],
        images: item.images || [],
        tags: item.tags || [],
        sustainability: item.sustainability || {}
      }));
      setItems(processedData);
      localStorage.setItem('wardrobe_items', JSON.stringify(processedData));
    } else {
      loadLocalData();
    }

    setIsLoading(false);
  };

  const loadLocalData = () => {
    const cached = localStorage.getItem('wardrobe_items');
    if (cached) {
      try {
        const cachedItems = JSON.parse(cached);
        setItems(cachedItems.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          lastWorn: item.lastWorn ? new Date(item.lastWorn) : undefined,
          purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined
        })));
      } catch (e) {
        console.error('解析缓存数据失败:', e);
        setItems(MOCK_ITEMS);
      }
    } else {
      setItems(MOCK_ITEMS);
    }
  };

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const stats = useMemo((): WardrobeStats => ({
    totalItems: items.length,
    totalValue: items.reduce((sum, item) => sum + item.price, 0),
    utilizationRate: items.filter(i => i.wearCount > 0).length / (items.length || 1),
    favoriteCount: items.filter(i => i.isFavorite).length,
    sleepingCount: items.filter(i => {
      if (!i.lastWorn) return true;
      const days = (Date.now() - i.lastWorn.getTime()) / (1000 * 60 * 60 * 24);
      return days > 30;
    }).length,
  }), [items]);

  const addItem = useCallback(async (item: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const now = new Date();
    const newItem: ClothingItem = {
      ...item,
      id: `local_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      userId: user.id
    };

    const data = await supabaseWrapper.insert('clothing_items', {
      user_id: user.id,
      name: item.name,
      category: item.category,
      sub_category: item.subCategory,
      brand: item.brand,
      color: item.color,
      colors: item.colors,
      pattern: item.pattern,
      material: item.material,
      season: item.season,
      style: item.style,
      occasion: item.occasion,
      size: item.size,
      fit: item.fit,
      price: item.price,
      purchase_date: item.purchaseDate,
      purchase_channel: item.purchaseChannel,
      images: item.images,
      thumbnail: item.thumbnail,
      wear_count: item.wearCount,
      last_worn: item.lastWorn,
      is_favorite: item.isFavorite,
      is_archived: item.isArchived,
      tags: item.tags,
      notes: item.notes,
      care_instructions: item.careInstructions,
      sustainability: item.sustainability
    }, { select: true });

    if (data && typeof data === 'object' && 'id' in data) {
      const itemData = data as Record<string, unknown>;
      const serverItem: ClothingItem = {
        id: String(itemData.id),
        name: String(itemData.name),
        category: itemData.category as ClothingCategory,
        subCategory: String(itemData.sub_category || ''),
        brand: itemData.brand ? String(itemData.brand) : undefined,
        color: String(itemData.color),
        colors: Array.isArray(itemData.colors) ? itemData.colors as string[] : [],
        pattern: itemData.pattern as PatternType,
        material: String(itemData.material),
        season: [...(Array.isArray(itemData.season) ? itemData.season : [])] as SeasonType[],
        style: [...(Array.isArray(itemData.style) ? itemData.style : [])] as StyleType[],
        occasion: [...(Array.isArray(itemData.occasion) ? itemData.occasion : [])] as OccasionType[],
        size: String(itemData.size),
        fit: itemData.fit as FitType,
        price: Number(itemData.price) || 0,
        purchaseDate: itemData.purchase_date ? new Date(String(itemData.purchase_date)) : undefined,
        purchaseChannel: itemData.purchase_channel ? String(itemData.purchase_channel) : undefined,
        images: Array.isArray(itemData.images) ? itemData.images as string[] : [],
        thumbnail: String(itemData.thumbnail || ''),
        wearCount: Number(itemData.wear_count) || 0,
        lastWorn: itemData.last_worn ? new Date(String(itemData.last_worn)) : undefined,
        isFavorite: Boolean(itemData.is_favorite),
        isArchived: Boolean(itemData.is_archived),
        tags: Array.isArray(itemData.tags) ? itemData.tags as string[] : [],
        notes: itemData.notes ? String(itemData.notes) : undefined,
        careInstructions: itemData.care_instructions ? String(itemData.care_instructions) : undefined,
        sustainability: (itemData.sustainability as SustainabilityInfo) || { isRecycled: false },
        createdAt: new Date(String(itemData.created_at)),
        updatedAt: new Date(String(itemData.updated_at)),
        userId: user.id
      };
      setItems(prev => [serverItem, ...prev]);
      return;
    }

    // 本地回退
    setItems(prev => [newItem, ...prev]);
    const cachedItems = [...items, newItem];
    localStorage.setItem('wardrobe_items', JSON.stringify(cachedItems));
  }, [user, items]);

  const toggleFavorite = useCallback(async (id: string) => {
    if (!user) return;

    const item = items.find(item => item.id === id);
    if (!item) return;

    const newFavorite = !item.isFavorite;
    const now = new Date();

    try {
      const { data } = await supabase
        .from('clothing_items')
        .update({ is_favorite: newFavorite, updated_at: now })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (data) {
        setItems(prev => prev.map(item =>
          item.id === id ? { ...item, isFavorite: data.is_favorite, updatedAt: new Date(data.updated_at) } : item
        ));
        return;
      }
    } catch (err) {
      console.warn('更新收藏状态失败，使用本地更新:', err);
    }

    // 本地回退
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, isFavorite: newFavorite, updatedAt: now } : item
    ));
    const updatedItems = items.map(i => i.id === id ? { ...i, isFavorite: newFavorite, updatedAt: now } : i);
    localStorage.setItem('wardrobe_items', JSON.stringify(updatedItems));
  }, [items, user]);

  const incrementWearCount = useCallback(async (id: string) => {
    if (!user) return;

    const item = items.find(item => item.id === id);
    if (!item) return;

    const newWearCount = item.wearCount + 1;
    const now = new Date();

    try {
      const { data } = await supabase
        .from('clothing_items')
        .update({
          wear_count: newWearCount,
          last_worn: now,
          updated_at: now
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (data) {
        setItems(prev => prev.map(item =>
          item.id === id ? {
            ...item,
            wearCount: data.wear_count,
            lastWorn: new Date(data.last_worn),
            updatedAt: new Date(data.updated_at)
          } : item
        ));
      } else {
        // 本地更新作为回退
        setItems(prev => prev.map(item =>
          item.id === id ? {
            ...item,
            wearCount: newWearCount,
            lastWorn: now,
            updatedAt: now
          } : item
        ));
      }
    } catch (err) {
      console.error('更新穿着次数失败:', err);
      // 本地更新作为回退
      setItems(prev => prev.map(item =>
        item.id === id ? {
          ...item,
          wearCount: newWearCount,
          lastWorn: now,
          updatedAt: now
        } : item
      ));
    }
  }, [items, user]);

  return {
    items,
    filteredItems,
    selectedCategory,
    setSelectedCategory,
    stats,
    addItem,
    toggleFavorite,
    incrementWearCount,
    isLoading,
  };
}
