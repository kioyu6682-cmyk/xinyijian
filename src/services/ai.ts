// src/services/ai.ts
import type { 
  ClothingItem, 
  Outfit, 
  AIRecommendation, 
  WeatherCondition,
  OccasionType,
  StyleType,
  BodyData,
  BodyType
} from '../types';

// 颜色搭配规则
const COLOR_COMPATIBILITY: Record<string, string[]> = {
  '白色': ['黑色', '灰色', '蓝色', '米色', '卡其色', '粉色'],
  '黑色': ['白色', '灰色', '红色', '金色', '银色', '牛仔蓝'],
  '灰色': ['白色', '黑色', '粉色', '蓝色', '黄色'],
  '蓝色': ['白色', '灰色', '米色', '棕色', '粉色'],
  '米色': ['白色', '棕色', '卡其色', '蓝色', '黑色'],
  '卡其色': ['白色', '黑色', '米色', '棕色', '海军蓝'],
  '粉色': ['白色', '灰色', '米色', '海军蓝'],
  '红色': ['黑色', '白色', '灰色', '米色'],
};

// 场合搭配规则
const OCCASION_STYLES: Record<OccasionType, StyleType[]> = {
  commute: ['business', 'minimalist'],
  date: ['casual', 'luxury', 'sweet', 'edgy'],
  party: ['luxury', 'bohemian', 'edgy'],
  sport: ['sporty'],
  travel: ['casual', 'sporty'],
  home: ['casual'],
  interview: ['business', 'minimalist'],
};

// 身材类型适配规则
const BODY_TYPE_RECOMMENDATIONS: Record<BodyType, string[]> = {
  hourglass: ['强调腰线', '合身剪裁', '平衡上下身'],
  pear: ['上身为亮点', 'A字裙', '高腰裤'],
  apple: ['宽松上衣', '直筒裤', 'V领设计'],
  rectangle: ['创造曲线', '腰带', '层次感'],
  'inverted-triangle': ['平衡肩宽', 'A字裙', '深色上衣'],
};

// 风格标签映射
const STYLE_TAGS: Record<StyleType, string[]> = {
  minimalist: ['简约', '干净', '舒适'],
  casual: ['休闲', '随性', '自然'],
  business: ['专业', '干练', '得体'],
  vintage: ['复古', '怀旧', '经典'],
  sporty: ['运动', '活力', '舒适'],
  bohemian: ['波西米亚', '自由', '浪漫'],
  luxury: ['奢华', '高级', '精致'],
  sweet: ['甜美', '可爱', '温柔'],
  edgy: ['酷感', '个性', '前卫'],
  preppy: ['学院风', '经典', '整洁'],
};

export class AIService {
  private static instance: AIService;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // 计算颜色兼容性得分
  calculateColorScore(color1: string, color2: string): number {
    const compatibleColors = COLOR_COMPATIBILITY[color1] || [];
    if (compatibleColors.includes(color2)) return 1.0;

    const neutralColors = ['白色', '黑色', '灰色', '米色', '卡其色'];
    if (neutralColors.includes(color1) && neutralColors.includes(color2)) return 0.8;

    return 0.3;
  }

  // 生成搭配推荐
  async generateOutfitRecommendation(
    items: ClothingItem[],
    weather: WeatherCondition,
    occasion: OccasionType,
    style?: StyleType
  ): Promise<Partial<Outfit> & { confidence: number; reason: string[] }> {
    const suitableStyles = OCCASION_STYLES[occasion];
    const targetStyle = style || suitableStyles[0];

    // 筛选候选单品
    let candidates = items.filter(item => 
      !item.isArchived &&
      (item.style.includes(targetStyle) || suitableStyles.some(s => item.style.includes(s)))
    );

    // 根据天气筛选
    if (weather.temperature < 15) {
      candidates = candidates.filter(item => 
        item.category === 'outerwear' || !['丝绸', '亚麻'].includes(item.material)
      );
    } else if (weather.temperature > 28) {
      candidates = candidates.filter(item => 
        item.category !== 'outerwear' || item.material === '亚麻'
      );
    }

    // 智能选择单品
    const selectedItems: ClothingItem[] = [];
    const reasons: string[] = [];

    // 选择上衣/连衣裙
    const tops = candidates.filter(item => 
      item.category === 'tops' || item.category === 'dresses'
    );
    if (tops.length > 0) {
      // 优先选择最近购买的
      const top = tops.sort((a, b) => 
        new Date(b.purchaseDate || 0).getTime() - new Date(a.purchaseDate || 0).getTime()
      )[0];
      selectedItems.push(top);
      if (new Date(top.purchaseDate || 0).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) {
        reasons.push('优先展示新购入单品');
      }
    }

    // 如果不是连衣裙，选择下装
    if (!selectedItems.some(item => item.category === 'dresses')) {
      const bottoms = candidates.filter(item => item.category === 'bottoms');
      if (bottoms.length > 0) {
        const topColor = selectedItems[0]?.color;
        const compatibleBottoms = bottoms.filter(bottom =>
          this.calculateColorScore(topColor, bottom.color) > 0.5
        );
        const pool = compatibleBottoms.length > 0 ? compatibleBottoms : bottoms;
        selectedItems.push(pool[Math.floor(Math.random() * pool.length)]);
        if (compatibleBottoms.length > 0) {
          reasons.push('颜色搭配和谐');
        }
      }
    }

    // 选择外套
    if (weather.temperature < 20) {
      const outerwear = candidates.filter(item => item.category === 'outerwear');
      if (outerwear.length > 0) {
        selectedItems.push(outerwear[0]);
        reasons.push('根据天气添加保暖外套');
      }
    }

    // 选择鞋子
    const shoes = candidates.filter(item => item.category === 'shoes');
    if (shoes.length > 0) {
      selectedItems.push(shoes[0]);
    }

    // 计算置信度
    const confidence = Math.min(0.5 + (selectedItems.length * 0.1) + (reasons.length * 0.1), 0.95);

    return {
      items: selectedItems.map((item, index) => ({
        itemId: item.id,
        position: index + 1,
        layer: item.category === 'outerwear' ? 3 : item.category === 'tops' ? 2 : 1,
      })),
      occasion,
      weather,
      temperature: weather.temperature,
      style: targetStyle,
      season: 'all',
      isAiGenerated: true,
      thumbnail: selectedItems.map(item => item.thumbnail).join(''),
      confidence,
      reason: reasons,
    };
  }

  // 生成个性化推荐
  async generatePersonalizedRecommendations(
    items: ClothingItem[],
    _userPreferences: unknown
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];
    const now = new Date();

    // 检查沉睡衣物
    const sleepingItems = items.filter(item => {
      if (!item.lastWorn) return true;
      const days = (now.getTime() - item.lastWorn.getTime()) / (1000 * 60 * 60 * 24);
      return days > 30 && item.wearCount < 5;
    });

    if (sleepingItems.length > 0) {
      recommendations.push({
        id: `rec_sleeping_${Date.now()}`,
        type: 'sleeping-item',
        title: '沉睡衣物唤醒',
        description: `您的${sleepingItems[0].name}已沉睡${Math.floor((now.getTime() - (sleepingItems[0].lastWorn?.getTime() || 0)) / (1000 * 60 * 60 * 24))}天，不妨搭配${sleepingItems.length > 1 ? '其他单品' : '下装'}重温一下？`,
        items: sleepingItems.slice(0, 3),
        confidence: 0.85,
        reason: ['高价值单品闲置', '适合当前季节', '可搭配现有衣物'],
        context: {},
        isRead: false,
        isApplied: false,
        createdAt: new Date(),
      });
    }

    // 检查新购入单品
    const newItems = items.filter(item => {
      const days = (now.getTime() - new Date(item.purchaseDate || 0).getTime()) / (1000 * 60 * 60 * 24);
      return days < 7 && item.wearCount < 2;
    });

    if (newItems.length > 0) {
      recommendations.push({
        id: `rec_new_${Date.now()}`,
        type: 'new-item',
        title: '新衣搭配灵感',
        description: `检测到您购入${newItems[0].name}，这里有3种搭配方案供您参考`,
        items: newItems,
        confidence: 0.92,
        reason: ['基于您的衣橱历史', '符合您的风格偏好', '适合多种场合'],
        context: {},
        isRead: false,
        isApplied: false,
        createdAt: new Date(),
      });
    }

    return recommendations;
  }

  // 根据用户输入生成穿搭方案
  async generateOutfitFromUserInput(
    items: ClothingItem[],
    userInput: string,
    bodyData?: BodyData
  ): Promise<Partial<Outfit> & { confidence: number; reason: string[]; styleAnalysis: string }> {
    // 解析用户输入
    const parsedInput = this.parseUserInput(userInput);
    const { occasion = 'commute', style = 'minimalist', bodyType = bodyData?.bodyType } = parsedInput;

    // 筛选候选单品
    let candidates = items.filter(item => 
      !item.isArchived &&
      (item.occasion.includes(occasion) || item.style.includes(style))
    );

    // 根据身材类型优化选择
    if (bodyType) {
      candidates = this.filterItemsByBodyType(candidates, bodyType);
    }

    // 智能选择单品
    const selectedItems: ClothingItem[] = [];
    const reasons: string[] = [];

    // 选择上衣/连衣裙
    const tops = candidates.filter(item => 
      item.category === 'tops' || item.category === 'dresses'
    );
    if (tops.length > 0) {
      const top = tops[Math.floor(Math.random() * tops.length)];
      selectedItems.push(top);
    }

    // 如果不是连衣裙，选择下装
    if (!selectedItems.some(item => item.category === 'dresses')) {
      const bottoms = candidates.filter(item => item.category === 'bottoms');
      if (bottoms.length > 0) {
        const topColor = selectedItems[0]?.color;
        const compatibleBottoms = bottoms.filter(bottom =>
          this.calculateColorScore(topColor, bottom.color) > 0.5
        );
        const pool = compatibleBottoms.length > 0 ? compatibleBottoms : bottoms;
        selectedItems.push(pool[Math.floor(Math.random() * pool.length)]);
        if (compatibleBottoms.length > 0) {
          reasons.push('颜色搭配和谐');
        }
      }
    }

    // 选择外套
    const outerwear = candidates.filter(item => item.category === 'outerwear');
    if (outerwear.length > 0) {
      selectedItems.push(outerwear[0]);
    }

    // 选择鞋子
    const shoes = candidates.filter(item => item.category === 'shoes');
    if (shoes.length > 0) {
      selectedItems.push(shoes[0]);
    }

    // 选择配饰
    const accessories = candidates.filter(item => item.category === 'accessories');
    if (accessories.length > 0) {
      selectedItems.push(accessories[0]);
    }

    // 生成风格分析
    const styleAnalysis = this.generateStyleAnalysis(selectedItems, occasion, bodyType);

    // 计算置信度
    const confidence = Math.min(0.6 + (selectedItems.length * 0.08) + (reasons.length * 0.1), 0.95);

    return {
      items: selectedItems.map((item, index) => ({
        itemId: item.id,
        position: index + 1,
        layer: item.category === 'outerwear' ? 3 : item.category === 'tops' ? 2 : 1,
      })),
      occasion,
      style,
      season: 'all',
      isAiGenerated: true,
      thumbnail: selectedItems.map(item => item.thumbnail).join(''),
      confidence,
      reason: reasons,
      styleAnalysis,
    };
  }

  // 生成一衣多穿方案
  async generateOneItemMultipleOutfits(
    items: ClothingItem[],
    targetItemId: string,
    count: number = 3
  ): Promise<AIRecommendation[]> {
    const targetItem = items.find(item => item.id === targetItemId);
    if (!targetItem) {
      return [];
    }

    const recommendations: AIRecommendation[] = [];
    const occasions: OccasionType[] = ['commute', 'date', 'casual', 'sport'];

    for (let i = 0; i < Math.min(count, occasions.length); i++) {
      const occasion = occasions[i];
      const suitableStyles = OCCASION_STYLES[occasion];
      const style = suitableStyles[Math.floor(Math.random() * suitableStyles.length)];

      // 筛选候选单品
      let candidates = items.filter(item => 
        !item.isArchived &&
        item.id !== targetItemId &&
        (item.occasion.includes(occasion) || item.style.includes(style))
      );

      // 智能选择单品
      const selectedItems: ClothingItem[] = [targetItem];
      const reasons: string[] = [`以${targetItem.name}为核心`];

      // 根据目标单品类型选择搭配
      if (targetItem.category === 'tops') {
        // 选择下装
        const bottoms = candidates.filter(item => item.category === 'bottoms');
        if (bottoms.length > 0) {
          const compatibleBottoms = bottoms.filter(bottom =>
            this.calculateColorScore(targetItem.color, bottom.color) > 0.5
          );
          const pool = compatibleBottoms.length > 0 ? compatibleBottoms : bottoms;
          selectedItems.push(pool[Math.floor(Math.random() * pool.length)]);
        }
      } else if (targetItem.category === 'bottoms') {
        // 选择上衣
        const tops = candidates.filter(item => item.category === 'tops');
        if (tops.length > 0) {
          const compatibleTops = tops.filter(top =>
            this.calculateColorScore(targetItem.color, top.color) > 0.5
          );
          const pool = compatibleTops.length > 0 ? compatibleTops : tops;
          selectedItems.push(pool[Math.floor(Math.random() * pool.length)]);
        }
      }

      // 选择鞋子
      const shoes = candidates.filter(item => item.category === 'shoes');
      if (shoes.length > 0) {
        selectedItems.push(shoes[0]);
      }

      // 生成搭配
      const outfit: Partial<Outfit> = {
        items: selectedItems.map((item, index) => ({
          itemId: item.id,
          position: index + 1,
          layer: item.category === 'outerwear' ? 3 : item.category === 'tops' ? 2 : 1,
        })),
        occasion,
        style,
        season: 'all',
        isAiGenerated: true,
        thumbnail: selectedItems.map(item => item.thumbnail).join(''),
      };

      recommendations.push({
        id: `rec_one_item_${Date.now()}_${i}`,
        type: 'one-item-multiple-outfits',
        title: `${targetItem.name}的${occasion === 'commute' ? '通勤' : occasion === 'date' ? '约会' : occasion === 'sport' ? '运动' : '休闲'}搭配`,
        description: `以${targetItem.name}为核心，打造适合${occasion === 'commute' ? '通勤' : occasion === 'date' ? '约会' : occasion === 'sport' ? '运动' : '休闲'}的穿搭方案`,
        outfit: outfit as Outfit,
        items: selectedItems,
        confidence: 0.85,
        reason: reasons,
        context: {},
        isRead: false,
        isApplied: false,
        createdAt: new Date(),
      });
    }

    return recommendations;
  }

  // 生成一周穿搭不重样
  async generateWeekOutfits(
    items: ClothingItem[],
    weather: WeatherCondition
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const occasions: OccasionType[] = ['commute', 'commute', 'commute', 'commute', 'commute', 'casual', 'casual'];

    // 记录已使用的单品
    const usedItemIds = new Set<string>();

    for (let i = 0; i < days.length; i++) {
      const occasion = occasions[i];
      const suitableStyles = OCCASION_STYLES[occasion];
      const style = suitableStyles[Math.floor(Math.random() * suitableStyles.length)];

      // 筛选候选单品（优先未使用的）
      let candidates = items.filter(item => 
        !item.isArchived &&
        !usedItemIds.has(item.id) &&
        (item.occasion.includes(occasion) || item.style.includes(style))
      );

      // 如果没有未使用的，使用已使用的
      if (candidates.length === 0) {
        candidates = items.filter(item => 
          !item.isArchived &&
          (item.occasion.includes(occasion) || item.style.includes(style))
        );
      }

      // 智能选择单品
      const selectedItems: ClothingItem[] = [];
      const reasons: string[] = [];

      // 选择上衣/连衣裙
      const tops = candidates.filter(item => 
        item.category === 'tops' || item.category === 'dresses'
      );
      if (tops.length > 0) {
        const top = tops[Math.floor(Math.random() * tops.length)];
        selectedItems.push(top);
        usedItemIds.add(top.id);
      }

      // 如果不是连衣裙，选择下装
      if (!selectedItems.some(item => item.category === 'dresses')) {
        const bottoms = candidates.filter(item => item.category === 'bottoms');
        if (bottoms.length > 0) {
          const topColor = selectedItems[0]?.color;
          const compatibleBottoms = bottoms.filter(bottom =>
            this.calculateColorScore(topColor, bottom.color) > 0.5
          );
          const pool = compatibleBottoms.length > 0 ? compatibleBottoms : bottoms;
          const bottom = pool[Math.floor(Math.random() * pool.length)];
          selectedItems.push(bottom);
          usedItemIds.add(bottom.id);
          if (compatibleBottoms.length > 0) {
            reasons.push('颜色搭配和谐');
          }
        }
      }

      // 选择外套（如果需要）
      if (weather.temperature < 20) {
        const outerwear = candidates.filter(item => item.category === 'outerwear');
        if (outerwear.length > 0) {
          const outer = outerwear[Math.floor(Math.random() * outerwear.length)];
          selectedItems.push(outer);
          usedItemIds.add(outer.id);
          reasons.push('根据天气添加保暖外套');
        }
      }

      // 选择鞋子
      const shoes = candidates.filter(item => item.category === 'shoes');
      if (shoes.length > 0) {
        const shoe = shoes[Math.floor(Math.random() * shoes.length)];
        selectedItems.push(shoe);
        usedItemIds.add(shoe.id);
      }

      // 生成搭配
      const outfit: Partial<Outfit> = {
        items: selectedItems.map((item, index) => ({
          itemId: item.id,
          position: index + 1,
          layer: item.category === 'outerwear' ? 3 : item.category === 'tops' ? 2 : 1,
        })),
        occasion,
        weather,
        temperature: weather.temperature,
        style,
        season: 'all',
        isAiGenerated: true,
        thumbnail: selectedItems.map(item => item.thumbnail).join(''),
      };

      recommendations.push({
        id: `rec_week_${Date.now()}_${i}`,
        type: 'week-outfits',
        title: `${days[i]}穿搭方案`,
        description: `适合${occasion === 'commute' ? '通勤' : '休闲'}的每日穿搭，与其他天不重复`,
        outfit: outfit as Outfit,
        items: selectedItems,
        confidence: 0.8,
        reason: reasons,
        context: { weather },
        isRead: false,
        isApplied: false,
        createdAt: new Date(),
      });
    }

    return recommendations;
  }

  // 解析用户输入
  private parseUserInput(input: string): {
    occasion?: OccasionType;
    style?: StyleType;
    bodyType?: BodyType;
    height?: number;
    weight?: number;
  } {
    const result: {
      occasion?: OccasionType;
      style?: StyleType;
      bodyType?: BodyType;
      height?: number;
      weight?: number;
    } = {};

    // 解析身高体重
    const heightWeightMatch = input.match(/(\d+)cm\/(\d+)斤/);
    if (heightWeightMatch) {
      result.height = parseInt(heightWeightMatch[1]);
      result.weight = parseInt(heightWeightMatch[2]);
    }

    // 解析场合
    if (input.includes('通勤')) result.occasion = 'commute';
    if (input.includes('约会')) result.occasion = 'date';
    if (input.includes('休闲')) result.occasion = 'casual';
    if (input.includes('运动')) result.occasion = 'sport';

    // 解析风格
    if (input.includes('甜酷')) result.style = 'edgy';
    if (input.includes('甜美')) result.style = 'sweet';
    if (input.includes('简约')) result.style = 'minimalist';
    if (input.includes('休闲')) result.style = 'casual';
    if (input.includes('商务')) result.style = 'business';

    // 解析身材类型
    if (input.includes('梨形')) result.bodyType = 'pear';
    if (input.includes('苹果形')) result.bodyType = 'apple';
    if (input.includes('沙漏形')) result.bodyType = 'hourglass';
    if (input.includes('矩形')) result.bodyType = 'rectangle';
    if (input.includes('倒三角')) result.bodyType = 'inverted-triangle';

    return result;
  }

  // 根据身材类型筛选单品
  private filterItemsByBodyType(items: ClothingItem[], bodyType: BodyType): ClothingItem[] {
    // 这里可以根据身材类型添加更具体的筛选逻辑
    // 暂时返回所有物品，后续可以根据实际需求优化
    return items;
  }

  // 生成风格分析
  private generateStyleAnalysis(items: ClothingItem[], occasion: OccasionType, bodyType?: BodyType): string {
    let analysis = '';

    // 分析风格
    const styles = new Set<StyleType>();
    items.forEach(item => {
      item.style.forEach(style => styles.add(style));
    });

    const styleList = Array.from(styles);
    if (styleList.length > 0) {
      analysis += `本套穿搭融合了${styleList.map(s => STYLE_TAGS[s]?.[0] || s).join('、')}风格，`;
    }

    // 分析场合适配
    analysis += `非常适合${occasion === 'commute' ? '通勤' : occasion === 'date' ? '约会' : occasion === 'sport' ? '运动' : '休闲'}场合，`;

    // 分析身材适配
    if (bodyType) {
      const recommendations = BODY_TYPE_RECOMMENDATIONS[bodyType];
      if (recommendations) {
        analysis += `通过${recommendations.join('、')}的设计，能够很好地展现您的身材优势。`;
      }
    }

    return analysis;
  }

  // 对穿搭进行评分
  async rateOutfit(
    outfit: Outfit,
    items: ClothingItem[],
    bodyData?: BodyData
  ): Promise<{
    colorScore: number;
    styleScore: number;
    occasionScore: number;
    bodyFitScore: number;
    totalScore: number;
    suggestions: string[];
    styleTags: string[];
  }> {
    // 获取搭配中的单品
    const outfitItems = outfit.items.map(item => 
      items.find(i => i.id === item.itemId)
    ).filter(Boolean) as ClothingItem[];

    // 计算颜色得分
    let colorScore = 0;
    if (outfitItems.length >= 2) {
      let totalColorScore = 0;
      let colorPairs = 0;
      for (let i = 0; i < outfitItems.length; i++) {
        for (let j = i + 1; j < outfitItems.length; j++) {
          totalColorScore += this.calculateColorScore(outfitItems[i].color, outfitItems[j].color);
          colorPairs++;
        }
      }
      colorScore = colorPairs > 0 ? totalColorScore / colorPairs : 1;
    } else {
      colorScore = 1;
    }

    // 计算风格得分
    const styles = new Set<StyleType>();
    outfitItems.forEach(item => {
      item.style.forEach(style => styles.add(style));
    });
    const styleScore = styles.size > 0 ? Math.min(1, 0.7 + (styles.size * 0.1)) : 0.5;

    // 计算场合得分
    const occasionScore = outfitItems.some(item => 
      item.occasion.includes(outfit.occasion)
    ) ? 0.9 : 0.6;

    // 计算身材适配得分
    let bodyFitScore = 0.8;
    if (bodyData) {
      // 这里可以添加更具体的身材适配评分逻辑
      bodyFitScore = 0.85;
    }

    // 计算总分
    const totalScore = (colorScore + styleScore + occasionScore + bodyFitScore) / 4;

    // 生成建议
    const suggestions: string[] = [];
    if (colorScore < 0.7) {
      suggestions.push('可以尝试更和谐的颜色搭配');
    }
    if (styleScore < 0.7) {
      suggestions.push('可以增加风格的统一性');
    }
    if (occasionScore < 0.7) {
      suggestions.push('可以选择更适合场合的单品');
    }
    if (bodyFitScore < 0.7) {
      suggestions.push('可以选择更适合身材的剪裁');
    }

    // 生成风格标签
    const styleTags: string[] = [];
    styles.forEach(style => {
      const tags = STYLE_TAGS[style] || [];
      tags.forEach(tag => styleTags.push(tag));
    });

    return {
      colorScore: Math.round(colorScore * 100),
      styleScore: Math.round(styleScore * 100),
      occasionScore: Math.round(occasionScore * 100),
      bodyFitScore: Math.round(bodyFitScore * 100),
      totalScore: Math.round(totalScore * 100),
      suggestions,
      styleTags: [...new Set(styleTags)],
    };
  }

  // 生成风格诊断
  async generateStyleDiagnosis(
    items: ClothingItem[],
    outfits: Outfit[]
  ): Promise<{
    styleTags: string[];
    preferredStyles: StyleType[];
    styleScore: number;
    recommendations: string[];
  }> {
    // 分析用户的风格偏好
    const styleCount: Record<StyleType, number> = {} as Record<StyleType, number>;
    items.forEach(item => {
      item.style.forEach(style => {
        styleCount[style] = (styleCount[style] || 0) + 1;
      });
    });

    // 分析搭配中的风格
    outfits.forEach(outfit => {
      styleCount[outfit.style] = (styleCount[outfit.style] || 0) + 2; // 搭配的权重更高
    });

    // 找出最偏好的风格
    const preferredStyles = Object.entries(styleCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([style]) => style as StyleType);

    // 生成风格标签
    const styleTags: string[] = [];
    preferredStyles.forEach(style => {
      const tags = STYLE_TAGS[style] || [];
      tags.forEach(tag => styleTags.push(tag));
    });

    // 计算风格得分
    const totalItems = items.length + outfits.length * 2;
    const totalStyleScore = Object.values(styleCount).reduce((sum, count) => sum + count, 0);
    const styleScore = totalItems > 0 ? Math.min(100, Math.round((totalStyleScore / totalItems) * 100)) : 0;

    // 生成推荐
    const recommendations: string[] = [];
    if (preferredStyles.includes('minimalist')) {
      recommendations.push('可以尝试添加一些有设计感的配饰，增加穿搭的层次感');
    }
    if (preferredStyles.includes('casual')) {
      recommendations.push('可以尝试将休闲单品与更正式的单品搭配，打造平衡的风格');
    }
    if (preferredStyles.includes('business')) {
      recommendations.push('可以尝试在商务穿搭中加入一些个性化元素，展现个人风格');
    }

    return {
      styleTags: [...new Set(styleTags)],
      preferredStyles,
      styleScore,
      recommendations,
    };
  }
}

export const aiService = AIService.getInstance();