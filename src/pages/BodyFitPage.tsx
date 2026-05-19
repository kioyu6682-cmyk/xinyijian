import React, { useState } from 'react';
import BodyDataInput from '../components/BodyDataInput';
import OutfitSimulator from '../components/OutfitSimulator';
import { aiService } from '../services/ai';
import type { BodyData, Outfit, ClothingItem } from '../types';

// 模拟数据
const mockOutfit: Outfit = {
  id: '1',
  name: '测试搭配',
  items: [
    { itemId: '1', position: 1, layer: 2 },
    { itemId: '2', position: 2, layer: 1 },
    { itemId: '3', position: 3, layer: 3 },
  ],
  occasion: 'commute',
  style: 'minimalist',
  temperature: 22,
  weather: { temperature: 22, condition: 'sunny', humidity: 60, windSpeed: 10 },
  season: 'spring',
  isAiGenerated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  thumbnail: '',
};

const mockItems: ClothingItem[] = [
  {
    id: '1',
    name: '白色衬衫',
    category: 'tops',
    color: '白色',
    material: '棉',
    style: ['minimalist', 'business'],
    occasion: ['commute', 'interview'],
    season: ['spring', 'autumn'],
    size: 'M',
    brand: 'Uniqlo',
    purchaseDate: '2024-01-01',
    price: 199,
    wearCount: 10,
    lastWorn: new Date(),
    isFavorite: true,
    isArchived: false,
    tags: ['百搭', '基础款'],
    notes: '适合通勤',
    thumbnail: '',
  },
  {
    id: '2',
    name: '黑色西裤',
    category: 'bottoms',
    color: '黑色',
    material: '羊毛',
    style: ['minimalist', 'business'],
    occasion: ['commute', 'interview'],
    season: ['spring', 'autumn', 'winter'],
    size: 'M',
    brand: 'Zara',
    purchaseDate: '2024-01-15',
    price: 299,
    wearCount: 8,
    lastWorn: new Date(),
    isFavorite: true,
    isArchived: false,
    tags: ['百搭', '职业'],
    notes: '显瘦效果好',
    thumbnail: '',
  },
  {
    id: '3',
    name: '灰色西装外套',
    category: 'outerwear',
    color: '灰色',
    material: '羊毛',
    style: ['minimalist', 'business'],
    occasion: ['commute', 'interview'],
    season: ['spring', 'autumn', 'winter'],
    size: 'M',
    brand: 'H&M',
    purchaseDate: '2024-02-01',
    price: 499,
    wearCount: 5,
    lastWorn: new Date(),
    isFavorite: false,
    isArchived: false,
    tags: ['职业', '正式'],
    notes: '版型好',
    thumbnail: '',
  },
];

const BodyFitPage: React.FC = () => {
  const [bodyData, setBodyData] = useState<BodyData | undefined>();
  const [optimizationTips, setOptimizationTips] = useState<string[]>([]);

  // 当身材数据变化时，生成优化建议
  const handleBodyDataChange = async (data: BodyData) => {
    setBodyData(data);
    
    // 生成优化建议
    const tips = generateOptimizationTips(data);
    setOptimizationTips(tips);
  };

  // 生成优化建议
  const generateOptimizationTips = (data: BodyData): string[] => {
    const tips: string[] = [];
    
    if (data.bodyType === 'pear') {
      tips.push('建议选择上身为亮点的搭配，如亮色或有图案的上衣');
      tips.push('推荐A字裙或高腰裤，能很好地平衡上下身比例');
    } else if (data.bodyType === 'apple') {
      tips.push('建议选择宽松上衣，避免紧身上衣');
      tips.push('推荐直筒裤，能拉长腿部线条');
      tips.push('V领设计能拉长颈部线条，显得更修长');
    } else if (data.bodyType === 'hourglass') {
      tips.push('强调腰线的设计能突出身材优势');
      tips.push('合身剪裁的衣物能很好地展现曲线');
    } else if (data.bodyType === 'rectangle') {
      tips.push('建议使用腰带创造曲线');
      tips.push('多层次穿搭能增加立体感');
    } else if (data.bodyType === 'inverted-triangle') {
      tips.push('建议选择深色上衣平衡肩宽');
      tips.push('A字裙能很好地平衡上下身比例');
    }
    
    return tips;
  };

  return (
    <div className="body-fit-page">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">穿搭效果模拟与身材适配</h1>
          <button
            type="button"
            className="w-11 h-11 rounded-full border border-gray-200 bg-white shadow-sm text-2xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'prompts' } }))}
            title="AI提示词"
          >
            💡
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 身材数据输入 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <BodyDataInput 
              initialData={bodyData} 
              onBodyDataChange={handleBodyDataChange} 
            />
            
            {/* 优化建议 */}
            {optimizationTips.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">智能优化建议</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {optimizationTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* 穿搭效果模拟 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <OutfitSimulator 
              outfit={mockOutfit} 
              items={mockItems} 
              bodyData={bodyData} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyFitPage;