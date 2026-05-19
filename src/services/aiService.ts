import type { ChatMessage } from '../types/chat';

interface WeatherData {
  city: string;
  condition: string;
  temperature: number;
  timestamp: number;
}

interface ConversationContext {
  lastTopic: string | null;
  interactionCount: number;
  history: ChatMessage[];
  weatherCache: Map<string, WeatherData>;
  lastWeatherQuery: WeatherData | null;
  userProfile: {
    style?: string;
    preferences?: string[];
    bodyType?: string;
  };
}

let conversationContext: ConversationContext = {
  lastTopic: null,
  interactionCount: 0,
  history: [],
  weatherCache: new Map(),
  lastWeatherQuery: null,
  userProfile: {},
};

const generateWeather = (city: string): WeatherData => {
  const conditions = ['晴朗', '多云', '阴天', '小雨', '中雨', '大雨', '雷阵雨', '雾霾', '大风'];
  const weights = [0.25, 0.2, 0.15, 0.15, 0.1, 0.05, 0.05, 0.03, 0.02];
  
  let random = Math.random();
  let condition = '晴朗';
  for (let i = 0; i < conditions.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      condition = conditions[i];
      break;
    }
  }
  
  const month = new Date().getMonth() + 1;
  let baseTemp: number;
  
  if (month >= 12 || month <= 2) {
    baseTemp = 5 + Math.random() * 8;
  } else if (month >= 3 && month <= 5) {
    baseTemp = 12 + Math.random() * 12;
  } else if (month >= 6 && month <= 8) {
    baseTemp = 25 + Math.random() * 10;
  } else {
    baseTemp = 15 + Math.random() * 10;
  }
  
  return {
    city,
    condition,
    temperature: Math.round(baseTemp),
    timestamp: Date.now(),
  };
};

const getWeatherResponse = (city: string): string => {
  const cacheKey = city.toLowerCase();
  const cached = conversationContext.weatherCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 300000) {
    const { condition, temperature } = cached;
    conversationContext.lastWeatherQuery = cached;
    return formatWeatherResponse(city, condition, temperature);
  }
  
  const weather = generateWeather(city);
  conversationContext.weatherCache.set(cacheKey, weather);
  conversationContext.lastWeatherQuery = weather;
  
  return formatWeatherResponse(city, weather.condition, weather.temperature);
};

const formatWeatherResponse = (city: string, condition: string, temperature: number): string => {
  const suggestions: Record<string, string[]> = {
    '晴朗': [
      `${city}今天天气${condition}，气温${temperature}度，适合穿亮色衣物！`,
      `${city}今日${condition}，阳光明媚，气温${temperature}度，很适合外出！`,
      `${city}今天${condition}，温度${temperature}度，记得做好防晒哦！`,
      `${city}今天阳光很好，气温${temperature}度，穿浅色衣服更清爽！`,
      `${city}今日${condition}，${temperature}度，适合穿短袖T恤或连衣裙！`,
    ],
    '多云': [
      `${city}今天${condition}，气温${temperature}度，可以搭配一件薄外套。`,
      `${city}今日${condition}，温度${temperature}度，天气舒适宜人！`,
      `${city}今天${condition}，气温${temperature}度，适合户外活动！`,
      `${city}今日${condition}，${temperature}度，穿针织衫或衬衫很合适！`,
    ],
    '阴天': [
      `${city}今天${condition}，气温${temperature}度，建议带一件外套以防变天。`,
      `${city}今日${condition}，温度${temperature}度，适合穿休闲风格。`,
      `${city}今天${condition}，气温${temperature}度，记得带伞哦！`,
      `${city}今日${condition}，${temperature}度，可以穿卫衣搭配牛仔裤！`,
    ],
    '小雨': [
      `${city}今天有${condition}，气温${temperature}度，记得带伞，穿防水鞋！`,
      `${city}今日${condition}，温度${temperature}度，建议穿轻便雨具。`,
      `${city}今天${condition}，气温${temperature}度，适合穿深色衣物。`,
      `${city}今日${condition}，${temperature}度，穿风衣或雨衣比较合适！`,
    ],
    '中雨': [
      `${city}今天${condition}，气温${temperature}度，记得带雨伞，注意保暖！`,
      `${city}今日${condition}，温度${temperature}度，建议穿防水外套。`,
      `${city}今天${condition}，气温${temperature}度，出行注意安全！`,
    ],
    '大雨': [
      `${city}今天${condition}，气温${temperature}度，尽量减少外出，注意安全！`,
      `${city}今日${condition}，温度${temperature}度，记得穿雨靴和雨衣！`,
      `${city}今天${condition}，气温${temperature}度，在家休息最舒服！`,
    ],
    '雷阵雨': [
      `${city}今天有${condition}，气温${temperature}度，避免户外活动！`,
      `${city}今日${condition}，温度${temperature}度，关好门窗注意安全！`,
      `${city}今天${condition}，气温${temperature}度，雷电天气请勿外出！`,
    ],
    '雾霾': [
      `${city}今天${condition}，气温${temperature}度，记得戴口罩！`,
      `${city}今日${condition}，温度${temperature}度，减少户外活动！`,
      `${city}今天${condition}，气温${temperature}度，注意空气质量！`,
    ],
    '大风': [
      `${city}今天${condition}，气温${temperature}度，建议穿防风外套！`,
      `${city}今日${condition}，温度${temperature}度，注意固定好衣物！`,
      `${city}今天${condition}，气温${temperature}度，发型可能会乱哦！`,
    ],
  };
  
  const responseList = suggestions[condition] || [`${city}今天${condition}，气温${temperature}度。`];
  return responseList[Math.floor(Math.random() * responseList.length)];
};

const getOutfitSuggestion = (_city?: string, userMessage?: string): string => {
  const colors = ['红色', '蓝色', '黑色', '白色', '灰色', '粉色', '紫色', '黄色', '绿色', '橙色', '棕色', '米色', '卡其色'];
  const clothingItems = ['外套', '衣服', '裙子', '裤子', '衬衫', 'T恤', '毛衣', '卫衣', '连衣裙', '牛仔裤', '短裤', '短裙', '风衣', '夹克', '西装', '吊带', '背心', '开衫', '针织衫'];
  
  let detectedColor = '';
  let detectedItem = '';
  
  if (userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    for (const color of colors) {
      if (userMessage.includes(color)) {
        detectedColor = color;
        break;
      }
    }
    for (const item of clothingItems) {
      if (userMessage.includes(item)) {
        detectedItem = item;
        break;
      }
    }
  }
  
  const specificSuggestions: string[] = [
    `${detectedColor}${detectedItem}很百搭！可以搭配黑色牛仔裤和白色T恤，简约又时尚！`,
    `当然可以穿${detectedColor}${detectedItem}！建议搭配浅色内搭，再配一双小白鞋就很好看！`,
    `${detectedColor}${detectedItem}很有气质！可以搭配同色系的裙子或裤子，整体造型很协调！`,
    `喜欢${detectedColor}${detectedItem}！推荐搭配深色牛仔裤，再配上一条简约的项链，很有层次感！`,
    `${detectedColor}${detectedItem}是个不错的选择！可以内搭一件衬衫，下身穿半身裙，优雅又大方！`,
  ];
  
  const suggestions: string[] = [
    '根据今天的情况，我建议你穿简约的T恤搭配牛仔裤，既舒适又时尚！',
    '我觉得你可以尝试一件衬衫搭配半身裙，很有气质！',
    '推荐你穿一件针织衫搭配阔腿裤，优雅又舒适！',
    '今天很适合穿连衣裙，搭配一双小白鞋就很好看！',
    '建议你穿一件卫衣搭配运动裤，休闲又时尚！',
    '我推荐你穿风衣搭配牛仔裤，经典又百搭！',
    '试试穿西装外套搭配短裙，干练又不失女性魅力！',
    '穿吊带裙外搭一件小开衫，温柔又优雅！',
    '卫衣搭配短裙是今年的流行趋势哦！',
    '牛仔外套搭配连衣裙，休闲又时尚！',
  ];
  
  if (detectedColor && detectedItem) {
    return specificSuggestions[Math.floor(Math.random() * specificSuggestions.length)];
  }
  
  if (conversationContext.lastWeatherQuery) {
    const { city: lastCity, condition, temperature } = conversationContext.lastWeatherQuery;
    const weatherBasedSuggestions: Record<string, string[]> = {
      '晴朗': [
        `根据${lastCity}今天${condition}、${temperature}度的天气，我建议你穿浅色T恤搭配牛仔裤，清爽又时尚！`,
        `${lastCity}今天${condition}，很适合穿连衣裙或半身裙，记得做好防晒！`,
        `根据${lastCity}的天气，建议你穿一件薄款衬衫搭配短裤，很清爽！`,
        `${lastCity}今日${condition}，${temperature}度，穿吊带裙或短款上衣很合适！`,
        `在${lastCity}这样的好天气，推荐穿白色连衣裙配草帽，很有夏日风情！`,
      ],
      '多云': [
        `根据${lastCity}今天${condition}、${temperature}度的天气，我建议你穿一件薄外套搭配T恤，温度刚好！`,
        `${lastCity}今天${condition}，很适合穿针织衫搭配牛仔裤，舒适又好看！`,
        `根据天气情况，建议你穿一件风衣搭配连衣裙，很有层次感！`,
        `${lastCity}今日${condition}，${temperature}度，可以穿薄卫衣或开衫！`,
      ],
      '阴天': [
        `根据${lastCity}今天${condition}、${temperature}度的天气，我建议你穿一件外套以防变天！`,
        `${lastCity}今天${condition}，适合穿深色系的衣服，比如黑色或深蓝色的上衣！`,
        `根据天气，建议你穿一件卫衣搭配长裤，保暖又时尚！`,
        `${lastCity}今日${condition}，${temperature}度，穿夹克或牛仔外套很不错！`,
      ],
      '小雨': [
        `根据${lastCity}今天有${condition}、${temperature}度的天气，建议你穿防水外套和深色衣物！`,
        `${lastCity}今天${condition}，记得穿防水鞋和带伞，建议穿简约的搭配！`,
        `根据天气，建议你穿一件防水风衣搭配牛仔裤，实用又好看！`,
        `${lastCity}今日${condition}，${temperature}度，穿深色外套和防水靴比较合适！`,
      ],
      '中雨': [
        `根据${lastCity}今天${condition}、${temperature}度的天气，建议穿防水外套和雨靴！`,
        `${lastCity}今天${condition}，尽量穿深色防水衣物，记得带伞！`,
        `根据天气，建议你穿一件厚实的防水外套，注意保暖！`,
      ],
      '大雨': [
        `根据${lastCity}今天${condition}、${temperature}度的天气，建议穿防水外套和雨靴，减少外出！`,
        `${lastCity}今天${condition}，穿防水衣物最重要，记得带好雨具！`,
        `根据天气，建议你穿一件防水风衣和雨靴，注意安全！`,
      ],
      '雷阵雨': [
        `根据${lastCity}今天有${condition}、${temperature}度的天气，避免外出，在家穿舒适的衣服就好！`,
        `${lastCity}今天${condition}，建议穿轻便的衣物，方便活动！`,
        `根据天气，建议你穿舒适的家居服，注意安全！`,
      ],
      '雾霾': [
        `根据${lastCity}今天${condition}、${temperature}度的天气，建议穿长袖衣物，记得戴口罩！`,
        `${lastCity}今天${condition}，适合穿浅色系衣服，减少户外活动！`,
        `根据天气，建议你穿一件外套，注意防护！`,
      ],
      '大风': [
        `根据${lastCity}今天${condition}、${temperature}度的天气，建议穿防风外套和长裤！`,
        `${lastCity}今天${condition}，建议穿紧身衣物，避免被风吹乱！`,
        `根据天气，建议你穿一件防风风衣，注意保暖！`,
      ],
    };
    
    const suggestionsList = weatherBasedSuggestions[condition] || suggestions;
    return suggestionsList[Math.floor(Math.random() * suggestionsList.length)];
  }
  
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};

const getTimeResponse = (): string => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
  
  const hour = now.getHours();
  let greeting = '';
  if (hour < 12) {
    greeting = '早上好！';
  } else if (hour < 18) {
    greeting = '下午好！';
  } else {
    greeting = '晚上好！';
  }
  
  return `${greeting}现在是${dateStr}，时间${timeStr}。`;
};

const getJokeResponse = (): string => {
  const jokes = [
    '为什么衣服总是不合身？因为它们有自己的"衣"见！',
    '牛仔裤为什么这么受欢迎？因为它们很"牛"！',
    '什么衣服最容易迷路？毛衣——因为它总是"毛"手毛脚！',
    '为什么时尚圈的人都很聪明？因为他们总是"穿"越时代！',
    '衣服们开会讨论什么？当然是"穿"什么最时髦啦！',
    '穿高跟鞋的女生为什么不容易感冒？因为她们"高冷"！',
    '为什么围巾总是很温暖？因为它"围"你着想！',
    '衬衫为什么喜欢交朋友？因为它"衣"见如故！',
  ];
  return jokes[Math.floor(Math.random() * jokes.length)];
};

const getGreetingResponse = (): string => {
  const greetings = [
    '你好呀！我是你的AI穿搭小助手，很高兴为你服务！',
    '嗨！欢迎来找我聊天，有什么可以帮你的吗？',
    '你好！今天心情怎么样？有什么穿搭问题想问我吗？',
    '嗨！很高兴见到你！需要什么帮助吗？',
    '你好呀！我可以帮你查询天气、推荐穿搭，有什么需要吗？',
    '你好！我是你的智能穿搭助手，随时为你服务！',
    '嗨！今天想聊点什么呢？穿搭、天气还是随便聊聊？',
    '你好呀！让我来帮你打造完美穿搭吧！',
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
};

const getFarewellResponse = (): string => {
  const farewells = [
    '再见！祝你今天过得愉快！',
    '拜拜！记得每天都要美美的！',
    '再见！期待下次为你服务！',
    '拜拜！有问题随时来找我！',
    '再见啦！祝你穿搭越来越好看！',
    '拜拜！下次见！',
    '再见！希望我的建议对你有帮助！',
  ];
  return farewells[Math.floor(Math.random() * farewells.length)];
};

const getThanksResponse = (): string => {
  const thanks = [
    '不客气！能帮到你我很开心！',
    '不用谢，这是我应该做的！',
    '很高兴能帮到你！',
    '不客气，祝你一切顺利！',
    '不用客气！有问题随时来找我！',
    '不客气啦！祝你今天心情愉快！',
  ];
  return thanks[Math.floor(Math.random() * thanks.length)];
};

const getEmotionResponse = (message: string): string => {
  if (message.includes('难过') || message.includes('伤心') || message.includes('不开心') || message.includes('郁闷')) {
    const responses = [
      '别难过，一切都会好起来的！',
      '抱抱你！有什么烦心事可以跟我说哦！',
      '别不开心啦，想想开心的事情！',
      '心情不好的时候，穿一件漂亮衣服心情也会变好哦！',
      '没事的，每个人都会有不开心的时候，过去了就好了！',
      '我在呢！可以陪你聊聊天！',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes('开心') || message.includes('高兴') || message.includes('快乐') || message.includes('兴奋')) {
    const responses = [
      '太好了！看到你开心我也很开心！',
      '太棒了！继续保持这份好心情！',
      '开心就好！希望每天都能这么开心！',
      '哈哈，真替你高兴！',
      '心情好的时候穿什么都好看！',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  return getDefaultResponse();
};

const getChattingResponse = (message: string): string => {
  const responses: Record<string, string[]> = {
    '漂亮': [
      '谢谢夸奖！你也很漂亮哦！',
      '嘻嘻，你眼光真好！',
      '谢谢！你今天也很美！',
    ],
    '好看': [
      '谢谢！你也很好看！',
      '嘻嘻，谢谢你！',
      '你今天的穿搭也很棒！',
    ],
    '爱': [
      '我也爱你呀！',
      '谢谢你的爱！',
      '被爱是很幸福的事情呢！',
    ],
    '喜欢': [
      '喜欢就好！',
      '能让你喜欢我很开心！',
      '谢谢你的喜欢！',
    ],
    '加油': [
      '加油！你一定可以的！',
      '相信自己！你很棒！',
      '冲冲冲！我支持你！',
    ],
    '努力': [
      '努力一定会有收获的！',
      '加油！坚持就是胜利！',
      '你已经很棒了！继续努力！',
    ],
    '坚持': [
      '坚持下去，一定会成功的！',
      '对！坚持就是胜利！',
      '相信你可以的！',
    ],
    '有趣': [
      '是呀！这个很有趣！',
      '哈哈，确实很有意思！',
      '我也觉得很有趣呢！',
    ],
    '有意思': [
      '是呀！很有意思！',
      '哈哈，确实有趣！',
      '我也这么觉得！',
    ],
  };
  
  for (const [keyword, responseList] of Object.entries(responses)) {
    if (message.includes(keyword)) {
      return responseList[Math.floor(Math.random() * responseList.length)];
    }
  }
  
  return getDefaultResponse();
};

const getDefaultResponse = (): string => {
  const responses = [
    '这是一个很棒的想法！让我来帮你分析一下。',
    '好的，我明白了。让我为你提供一些建议。',
    '谢谢你的分享！我来帮你分析一下。',
    '这个话题很有趣！让我们来聊聊吧。',
    '我很乐意为你提供帮助！让我想想...',
    '当然可以！让我们一起来探讨。',
    '好的，我来帮你分析一下。',
    '这个问题很有意思，让我来帮你解答。',
    '没问题！我来帮你看看。',
    '很高兴为你服务！请问还有什么需要帮助的？',
    '哇，这个想法不错！',
    '我觉得你说得很有道理！',
    '让我想想，你说的这个很有趣！',
    '好的，我来帮你想想办法！',
    '谢谢你告诉我这些！',
    '我明白了！让我来帮你分析一下。',
    '这个问题问得好！',
    '我很感兴趣！继续说说看。',
    '你说得对！确实是这样。',
    '很有见地！我很认同。',
    '原来如此！我学到了。',
    '这个我也很想了解！',
    '有意思！让我想想...',
    '你说得很有道理！',
    '我也这么觉得！',
    '确实是个值得思考的问题！',
    '好主意！我支持你！',
    '太棒了！这个想法很好！',
    '我很欣赏你的观点！',
    '继续保持！你做得很好！',
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateLocalResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  conversationContext.interactionCount++;
  
  const cityPattern = /(北京|上海|广州|深圳|杭州|成都|重庆|武汉|西安|南京|苏州|郑州|长沙|青岛|沈阳|宁波|东莞|无锡|合肥|佛山|大连|福州|厦门|哈尔滨|济南|温州|石家庄|长春|泉州|南宁|金华|常州|惠州|嘉兴|南通|徐州|太原|珠海|中山|烟台|保定|兰州|台州|绍兴|潍坊|扬州|南昌|贵阳|昆明|淄博|乌鲁木齐|呼和浩特|临沂|唐山|洛阳|盐城|汕头|廊坊|湖州|泰州|济宁|淮安|江门|湛江|连云港|芜湖|宜宾|邯郸|遵义|赣州|漳州|揭阳|桂林|柳州|三亚|海口|银川|西宁|拉萨)/;
  const cityMatch = lowerMessage.match(cityPattern);
  const city = cityMatch ? cityMatch[0] : null;

  const clothingKeywords = ['外套', '衣服', '裙子', '裤子', '衬衫', 'T恤', '毛衣', '卫衣', '连衣裙', '牛仔裤', '短裤', '短裙', '风衣', '夹克', '西装', '吊带', '背心', '开衫', '针织衫'];
  const outfitPatterns = [
    /能穿吗/,
    /可以穿吗/,
    /适合穿吗/,
    /怎么搭配/,
    /搭配什么/,
    /配什么/,
    /搭配/,
    /穿什么/,
    /应该穿/,
    /怎么穿/,
  ];
  
  const hasClothingKeyword = clothingKeywords.some(keyword => lowerMessage.includes(keyword));
  const matchesOutfitPattern = outfitPatterns.some(pattern => pattern.test(lowerMessage));
  const hasOutfitRequest = lowerMessage.includes('穿') && (lowerMessage.includes('建议') || lowerMessage.includes('推荐') || lowerMessage.includes('觉得'));
  
  if (hasClothingKeyword || matchesOutfitPattern || hasOutfitRequest) {
    conversationContext.lastTopic = 'outfit';
    return getOutfitSuggestion(city, userMessage);
  }

  if (lowerMessage.includes('天气') || lowerMessage.includes('下雨') || lowerMessage.includes('晴天') || 
      lowerMessage.includes('温度') || lowerMessage.includes('气温')) {
    const queryCity = city || '你所在的城市';
    return getWeatherResponse(queryCity);
  }

  if (lowerMessage.includes('时间') || lowerMessage.includes('几点') || lowerMessage.includes('现在')) {
    return getTimeResponse();
  }

  if (lowerMessage.includes('笑话') || lowerMessage.includes('搞笑')) {
    return getJokeResponse();
  }

  if (lowerMessage.includes('你好') || lowerMessage.includes('嗨') || lowerMessage.includes('哈喽') || lowerMessage.includes('hi')) {
    return getGreetingResponse();
  }

  if (lowerMessage.includes('再见') || lowerMessage.includes('拜拜') || lowerMessage.includes('走了')) {
    return getFarewellResponse();
  }

  if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢') || lowerMessage.includes('辛苦了')) {
    return getThanksResponse();
  }

  if (lowerMessage.includes('难过') || lowerMessage.includes('伤心') || lowerMessage.includes('不开心') || 
      lowerMessage.includes('郁闷') || lowerMessage.includes('开心') || lowerMessage.includes('高兴') ||
      lowerMessage.includes('快乐') || lowerMessage.includes('兴奋')) {
    return getEmotionResponse(userMessage);
  }

  if (lowerMessage.includes('漂亮') || lowerMessage.includes('好看') || lowerMessage.includes('爱') ||
      lowerMessage.includes('喜欢') || lowerMessage.includes('加油') || lowerMessage.includes('努力') ||
      lowerMessage.includes('坚持') || lowerMessage.includes('有趣') || lowerMessage.includes('有意思')) {
    return getChattingResponse(userMessage);
  }

  return getDefaultResponse();
};

const generateResponse = async (userMessage: string): Promise<string> => {
  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
    status: 'sent',
  };
  
  conversationContext.history.push(userMsg);
  if (conversationContext.history.length > 20) {
    conversationContext.history.shift();
  }

  return generateLocalResponse(userMessage);
};

export const sendMessage = async (
  message: ChatMessage
): Promise<ChatMessage> => {
  const content = await generateResponse(message.content);
  
  const response: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content,
    timestamp: new Date(),
    status: 'received',
  };
  
  conversationContext.history.push(response);
  
  return response;
};

export const generateId = (): string => {
  return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const resetConversation = (): void => {
  conversationContext = {
    lastTopic: null,
    interactionCount: 0,
    history: [],
    weatherCache: new Map(),
    lastWeatherQuery: null,
    userProfile: {},
  };
};
