import React, { useState } from 'react';
import './PromptDetailPage.css';
import { BackIcon, ArrowRightIcon } from '../components/Icons';

type ModuleType = 'home' | 'wardrobe' | 'community' | 'me';

interface PromptData {
  id: string;
  title: string;
  description: string;
  prompt: string;
  image: string;
  variables: Array<{
    name: string;
    description: string;
    example: string;
  }>;
  output: string;
}

const PROMPTS: Record<ModuleType, PromptData[]> = {
  home: [
    {
      id: 'outfit-recommendation',
      title: '智能穿搭推荐',
      description: '根据天气、场合和用户风格偏好，生成个性化穿搭方案',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=fashion%20stylist%20ai%20recommendation%20interface%20elegant%20minimalist%20soft%20pink%20background&size=800x600',
      prompt: `你是一位专业的时尚穿搭顾问。请根据以下信息为用户生成今日穿搭推荐：

【用户信息】
- 风格偏好：{style}
- 常用场合：{occasion}
- 衣橱单品：{items}

【天气信息】
- 温度：{temperature}°C
- 天气状况：{weather}
- 湿度：{humidity}%
- 风速：{windSpeed}km/h

【要求】
1. 选择3-5件合适的单品组成一套穿搭
2. 考虑温度和天气的适配性
3. 符合用户的风格偏好
4. 适合指定场合
5. 提供搭配理由和风格分析

【输出格式】
{
  "items": ["单品ID1", "单品ID2", ...],
  "reason": ["搭配理由1", "搭配理由2", ...],
  "styleAnalysis": "风格分析",
  "tips": ["穿搭建议1", "穿搭建议2"]
}`,
      variables: [
        {
          name: 'style',
          description: '用户风格偏好',
          example: '简约、商务、休闲、甜美'
        },
        {
          name: 'occasion',
          description: '穿着场合',
          example: '通勤、约会、运动、休闲'
        },
        {
          name: 'items',
          description: '用户衣橱中的单品列表',
          example: '白色衬衫、黑色西裤、小白鞋...'
        },
        {
          name: 'temperature',
          description: '当前温度',
          example: '22'
        },
        {
          name: 'weather',
          description: '天气状况',
          example: '晴、多云、雨、雪'
        }
      ],
      output: `{
  "items": ["item1", "item2", "item3", "item4"],
  "reason": [
    "白色衬衫透气性好，适合22°C的天气",
    "黑色西裤简约大方，符合商务风格",
    "灰色西装外套保暖且专业",
    "小白鞋舒适百搭"
  ],
  "styleAnalysis": "这套穿搭体现了简约商务风格，黑白灰配色经典耐看，层次分明",
  "tips": [
    "可以搭配一条简约的项链增加亮点",
    "建议选择简约的手表配饰"
  ]
}`
    },
    {
      id: 'weather-adaptation',
      title: '天气适配建议',
      description: '根据天气变化提供穿搭调整建议',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=weather%20adaptation%20fashion%20styling%20umbrella%20raincoat%20elegant%20soft%20pink%20background&size=800x600',
      prompt: `你是一位专业的时尚穿搭顾问。请根据天气变化为用户提供穿搭调整建议：

【当前穿搭】
{currentOutfit}

【天气变化】
- 原天气：{oldWeather}
- 新天气：{newWeather}
- 温度变化：{tempChange}°C

【要求】
1. 分析天气变化对当前穿搭的影响
2. 提出具体的调整建议
3. 推荐需要添加或替换的单品
4. 保持整体风格协调

【输出格式】
{
  "impact": "天气变化影响分析",
  "adjustments": ["调整建议1", "调整建议2"],
  "recommendedItems": ["推荐单品1", "推荐单品2"],
  "styleTips": "风格保持建议"
}`,
      variables: [
        {
          name: 'currentOutfit',
          description: '当前穿搭描述',
          example: '白色衬衫 + 黑色西裤 + 小白鞋'
        },
        {
          name: 'oldWeather',
          description: '原天气状况',
          example: '晴，22°C'
        },
        {
          name: 'newWeather',
          description: '新天气状况',
          example: '多云，18°C'
        },
        {
          name: 'tempChange',
          description: '温度变化',
          example: '-4'
        }
      ],
      output: `{
  "impact": "温度下降4度，当前穿搭可能偏凉，需要增加保暖层",
  "adjustments": [
    "添加一件薄外套或开衫",
    "可以替换为长袖衬衫",
    "考虑添加围巾等配饰"
  ],
  "recommendedItems": ["灰色开衫", "针织围巾"],
  "styleTips": "保持简约风格，选择中性色的配饰"
}`
    }
  ],
  wardrobe: [
    {
      id: 'item-analysis',
      title: '单品智能分析',
      description: '分析衣橱单品的风格、搭配潜力和使用建议',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=clothing%20item%20analysis%20fashion%20wardrobe%20elegant%20minimalist%20soft%20pink%20background&size=800x600',
      prompt: `你是一位专业的时尚穿搭顾问。请对用户衣橱中的单品进行智能分析：

【单品信息】
- 名称：{itemName}
- 类别：{category}
- 颜色：{color}
- 材质：{material}
- 风格：{style}
- 场合：{occasion}
- 季节：{season}
- 品牌：{brand}
- 价格：{price}
- 标签：{tags}

【要求】
1. 分析单品的风格特征
2. 评估搭配潜力
3. 推荐搭配方案
4. 提供使用建议
5. 分析单品价值

【输出格式】
{
  "styleFeatures": ["风格特征1", "风格特征2"],
  "matchPotential": "搭配潜力评估",
  "combinations": [
    {
      "name": "搭配方案名称",
      "items": ["搭配单品1", "搭配单品2"],
      "occasion": "适用场合",
      "description": "搭配描述"
    }
  ],
  "usageTips": ["使用建议1", "使用建议2"],
  "valueAnalysis": "单品价值分析"
}`,
      variables: [
        {
          name: 'itemName',
          description: '单品名称',
          example: '白色衬衫'
        },
        {
          name: 'category',
          description: '单品类别',
          example: '上衣'
        },
        {
          name: 'color',
          description: '颜色',
          example: '白色'
        },
        {
          name: 'material',
          description: '材质',
          example: '棉'
        }
      ],
      output: `{
  "styleFeatures": ["简约大方", "百搭实用", "商务休闲"],
  "matchPotential": "这是一件百搭单品，可以搭配多种风格，适合多种场合",
  "combinations": [
    {
      "name": "商务休闲",
      "items": ["黑色西裤", "小白鞋", "简约手表"],
      "occasion": "通勤、会议",
      "description": "简约大方，适合商务场合"
    },
    {
      "name": "休闲日常",
      "items": ["牛仔裤", "帆布鞋", "棒球帽"],
      "occasion": "日常、休闲",
      "description": "轻松舒适，适合日常穿着"
    }
  ],
  "usageTips": [
    "可以搭配不同颜色的下装",
    "适合叠穿，增加层次感",
    "注意保养，保持整洁"
  ],
  "valueAnalysis": "这是一件高价值单品，百搭实用，利用率高"
}`
    },
    {
      id: 'wardrobe-optimization',
      title: '衣橱优化建议',
      description: '分析衣橱结构，提供优化建议',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wardrobe%20optimization%20closet%20organization%20fashion%20minimalist%20elegant%20soft%20pink%20background&size=800x600',
      prompt: `你是一位专业的时尚穿搭顾问。请分析用户的衣橱结构并提供优化建议：

【衣橱信息】
- 总单品数：{totalItems}
- 各类别数量：{categoryDistribution}
- 颜色分布：{colorDistribution}
- 风格分布：{styleDistribution}
- 利用率：{utilizationRate}
- 总价值：{totalValue}

【要求】
1. 分析衣橱结构
2. 识别优势和不足
3. 提供优化建议
4. 推荐需要补充的单品
5. 建议需要清理的单品

【输出格式】
{
  "structureAnalysis": "衣橱结构分析",
  "strengths": ["优势1", "优势2"],
  "weaknesses": ["不足1", "不足2"],
  "optimizationSuggestions": ["优化建议1", "优化建议2"],
  "itemsToAdd": ["建议添加单品1", "建议添加单品2"],
  "itemsToRemove": ["建议清理单品1", "建议清理单品2"],
  "overallRating": "整体评分"
}`,
      variables: [
        {
          name: 'totalItems',
          description: '总单品数',
          example: '50'
        },
        {
          name: 'categoryDistribution',
          description: '各类别数量分布',
          example: '上衣:20, 下装:15, 外套:8, 鞋履:7'
        },
        {
          name: 'utilizationRate',
          description: '利用率',
          example: '0.65'
        }
      ],
      output: `{
  "structureAnalysis": "衣橱以简约风格为主，颜色偏中性，利用率中等",
  "strengths": [
    "单品数量适中，不会造成选择困难",
    "颜色搭配协调，易于搭配",
    "风格统一，易于管理"
  ],
  "weaknesses": [
    "外套数量偏少，应对天气变化能力不足",
    "配饰较少，搭配变化有限",
    "利用率有待提高"
  ],
  "optimizationSuggestions": [
    "增加外套数量，提高应对天气变化的能力",
    "添加配饰，增加搭配变化",
    "定期整理，提高利用率"
  ],
  "itemsToAdd": ["风衣", "针织开衫", "围巾", "项链"],
  "itemsToRemove": ["重复的单品", "长期未穿的单品"],
  "overallRating": "7.5/10"
}`
    }
  ],
  community: [
    {
      id: 'post-generation',
      title: '社区帖子生成',
      description: '根据用户穿搭生成社区分享帖子',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=social%20media%20fashion%20post%20community%20sharing%20elegant%20soft%20pink%20background&size=800x600',
      prompt: `你是一位专业的时尚穿搭顾问。请根据用户的穿搭生成社区分享帖子：

【穿搭信息】
- 穿搭描述：{outfitDescription}
- 风格：{style}
- 场合：{occasion}
- 心情：{mood}
- 穿搭故事：{story}

【要求】
1. 生成吸引人的标题
2. 撰写穿搭描述
3. 添加相关标签
4. 生成互动话题
5. 提供穿搭建议

【输出格式】
{
  "title": "帖子标题",
  "content": "帖子内容",
  "tags": ["标签1", "标签2"],
  "discussionTopics": ["话题1", "话题2"],
  "outfitTips": ["穿搭建议1", "穿搭建议2"]
}`,
      variables: [
        {
          name: 'outfitDescription',
          description: '穿搭描述',
          example: '白色衬衫 + 黑色西裤 + 小白鞋'
        },
        {
          name: 'style',
          description: '风格',
          example: '简约商务'
        },
        {
          name: 'occasion',
          description: '场合',
          example: '通勤'
        }
      ],
      output: `{
  "title": "今日通勤穿搭：简约商务风",
  "content": "今天穿了一套简约商务风的穿搭，白色衬衫搭配黑色西裤，简约大方。小白鞋让整体造型更轻松，不会太严肃。这套穿搭适合通勤，既专业又舒适。",
  "tags": ["通勤穿搭", "简约风格", "商务风"],
  "discussionTopics": [
    "大家平时通勤都穿什么风格？",
    "有没有推荐的通勤穿搭单品？"
  ],
  "outfitTips": [
    "简约风格适合多种场合",
    "小白鞋是百搭单品"
  ]
}`
    },
    {
      id: 'interaction-response',
      title: '互动回复生成',
      description: '生成对社区帖子的互动回复',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=social%20interaction%20chat%20conversation%20fashion%20community%20elegant%20soft%20pink%20background&size=800x600',
      prompt: `你是一位专业的时尚穿搭顾问。请生成对社区帖子的互动回复：

【帖子信息】
- 帖子标题：{postTitle}
- 帖子内容：{postContent}
- 作者：{author}
- 风格：{style}

【要求】
1. 生成有价值的回复
2. 提供穿搭建议
3. 表达赞赏或观点
4. 引导互动

【输出格式】
{
  "reply": "回复内容",
  "suggestions": ["建议1", "建议2"],
  "engagement": "互动引导"
}`,
      variables: [
        {
          name: 'postTitle',
          description: '帖子标题',
          example: '今日通勤穿搭'
        },
        {
          name: 'postContent',
          description: '帖子内容',
          example: '今天穿了一套简约商务风的穿搭...'
        },
        {
          name: 'author',
          description: '作者',
          example: '林一'
        }
      ],
      output: `{
  "reply": "这套穿搭简约大方，很适合通勤！白色衬衫和黑色西裤是经典搭配，小白鞋让整体造型更轻松。",
  "suggestions": [
    "可以尝试搭配一条简约的项链增加亮点",
    "建议选择简约的手表配饰"
  ],
  "engagement": "大家平时通勤都穿什么风格呢？欢迎分享！"
}`
    }
  ],
  me: [
    {
      id: 'style-analysis',
      title: '个人风格分析',
      description: '分析用户的穿搭风格特征和发展建议',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=personal%20style%20analysis%20fashion%20portrait%20elegant%20minimalist%20soft%20pink%20background&size=800x600',
      prompt: `你是一位专业的时尚穿搭顾问。请分析用户的个人风格：

【用户信息】
- 穿搭历史：{outfitHistory}
- 偏好风格：{preferredStyles}
- 常用场合：{commonOccasions}
- 喜欢的颜色：{favoriteColors}
- 身材特征：{bodyType}

【要求】
1. 分析用户的风格特征
2. 识别风格优势
3. 提供风格发展建议
4. 推荐适合的单品
5. 制定风格提升计划

【输出格式】
{
  "styleProfile": "风格画像",
  "styleFeatures": ["风格特征1", "风格特征2"],
  "strengths": ["优势1", "优势2"],
  "developmentSuggestions": ["发展建议1", "发展建议2"],
  "recommendedItems": ["推荐单品1", "推荐单品2"],
  "improvementPlan": ["提升计划1", "提升计划2"]
}`,
      variables: [
        {
          name: 'outfitHistory',
          description: '穿搭历史',
          example: '最近30天穿搭记录'
        },
        {
          name: 'preferredStyles',
          description: '偏好风格',
          example: '简约、商务、休闲'
        },
        {
          name: 'bodyType',
          description: '身材特征',
          example: '梨形身材'
        }
      ],
      output: `{
  "styleProfile": "简约商务风，注重实用性和专业性",
  "styleFeatures": [
    "偏好简约大方的风格",
    "注重穿搭的实用性",
    "适合商务场合"
  ],
  "strengths": [
    "风格统一，易于管理",
    "适合多种场合",
    "穿搭效率高"
  ],
  "developmentSuggestions": [
    "可以尝试更多颜色搭配",
    "增加配饰的使用",
    "尝试不同风格的单品"
  ],
  "recommendedItems": ["风衣", "针织开衫", "围巾", "项链"],
  "improvementPlan": [
    "每周尝试一种新的搭配方式",
    "每月添加一件新的配饰",
    "定期整理衣橱，优化单品组合"
  ]
}`
    },
    {
      id: 'wardrobe-planning',
      title: '衣橱规划建议',
      description: '根据用户需求制定衣橱规划',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=wardrobe%20planning%20capsule%20closet%20fashion%20minimalist%20elegant%20soft%20pink%20background&size=800x600',
      prompt: `你是一位专业的时尚穿搭顾问。请为用户制定衣橱规划：

【用户需求】
- 目标风格：{targetStyle}
- 主要场合：{mainOccasions}
- 预算：{budget}
- 现有单品：{existingItems}
- 季节：{season}

【要求】
1. 分析现有衣橱
2. 识别需要补充的单品
3. 制定采购计划
4. 优化单品组合
5. 控制预算

【输出格式】
{
  "currentAnalysis": "现有衣橱分析",
  "itemsNeeded": [
    {
      "name": "单品名称",
      "category": "类别",
      "priority": "优先级",
      "estimatedPrice": "预估价格",
      "reason": "购买理由"
    }
  ],
  "shoppingPlan": "采购计划",
  "budgetAllocation": "预算分配",
  "optimizationTips": ["优化建议1", "优化建议2"]
}`,
      variables: [
        {
          name: 'targetStyle',
          description: '目标风格',
          example: '简约商务'
        },
        {
          name: 'mainOccasions',
          description: '主要场合',
          example: '通勤、会议、休闲'
        },
        {
          name: 'budget',
          description: '预算',
          example: '5000'
        }
      ],
      output: `{
  "currentAnalysis": "现有衣橱以简约风格为主，基础单品充足，但缺少一些季节性单品",
  "itemsNeeded": [
    {
      "name": "风衣",
      "category": "外套",
      "priority": "高",
      "estimatedPrice": "800-1200",
      "reason": "春秋季节必备，适合多种场合"
    },
    {
      "name": "针织开衫",
      "category": "外套",
      "priority": "中",
      "estimatedPrice": "300-500",
      "reason": "适合室内外温差大的情况"
    }
  ],
  "shoppingPlan": "优先购买风衣，然后是针织开衫，最后考虑配饰",
  "budgetAllocation": "风衣:1000, 针织开衫:400, 配饰:600",
  "optimizationTips": [
    "选择百搭的颜色和款式",
    "注重单品的质量",
    "考虑单品的多场景适用性"
  ]
}`
    }
  ]
};

interface PromptDetailPageProps {
  module?: ModuleType;
  onClose?: () => void;
}

export const PromptDetailPage: React.FC<PromptDetailPageProps> = ({ module = 'home', onClose }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  
  const prompts = PROMPTS[module] || [];
  
  const moduleNames: Record<ModuleType, string> = {
    home: '首页',
    wardrobe: '衣橱',
    community: '社区',
    me: '我的'
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'me' } }));
    }
  };

  return (
    <div className="prompt-detail-page">
      <div className="prompt-detail-page__header">
        <button type="button" className="prompt-detail-page__back" onClick={handleClose}>
          <BackIcon size={20} /> 返回
        </button>
        <h1 className="prompt-detail-page__title">{moduleNames[module]} - AI提示词</h1>
      </div>

      {!selectedPrompt ? (
        <div className="prompt-detail-page__list">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              className="prompt-card"
              onClick={() => setSelectedPrompt(prompt)}
            >
              <div className="prompt-card__image">
                <img src={prompt.image} alt={prompt.title} loading="lazy" />
              </div>
              <div className="prompt-card__content">
                <div className="prompt-card__header">
                  <h2 className="prompt-card__title">{prompt.title}</h2>
                  <span className="prompt-card__arrow"><ArrowRightIcon size={20} /></span>
                </div>
                <p className="prompt-card__description">{prompt.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="prompt-detail-page__detail">
          <button
            type="button"
            className="prompt-detail-page__back-small"
            onClick={() => setSelectedPrompt(null)}
          >
            ← 返回列表
          </button>
          
          <div className="prompt-detail">
            <h2 className="prompt-detail__title">{selectedPrompt.title}</h2>
            <p className="prompt-detail__description">{selectedPrompt.description}</p>
            
            <div className="prompt-detail__section">
              <h3 className="prompt-detail__section-title">变量说明</h3>
              <div className="prompt-detail__variables">
                {selectedPrompt.variables.map((variable, index) => (
                  <div key={index} className="variable-card">
                    <div className="variable-card__name">{variable.name}</div>
                    <div className="variable-card__description">{variable.description}</div>
                    <div className="variable-card__example">
                      <span className="variable-card__label">示例：</span>
                      <span className="variable-card__value">{variable.example}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="prompt-detail__section">
              <h3 className="prompt-detail__section-title">提示词模板</h3>
              <div className="prompt-detail__prompt">
                <button
                  type="button"
                  className="prompt-detail__toggle"
                  onClick={() => setShowFullPrompt(!showFullPrompt)}
                >
                  {showFullPrompt ? '收起' : '展开完整提示词'}
                </button>
                <pre className={showFullPrompt ? 'expanded' : ''}>
                  <code>{selectedPrompt.prompt}</code>
                </pre>
              </div>
            </div>

            <div className="prompt-detail__section">
              <h3 className="prompt-detail__section-title">输出示例</h3>
              <div className="prompt-detail__output">
                <pre>
                  <code>{selectedPrompt.output}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
