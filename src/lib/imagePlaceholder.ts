// 本地图片占位符生成器
// 当无法访问外部图片服务时使用

// 生成简单的渐变色占位图片 (SVG base64)
export const generatePlaceholderImage = (width: number = 400, height: number = 500, color: string = '#f0f0f0'): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e8e8e8;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
      <text x="${width/2}" y="${height/2}" text-anchor="middle" dominant-baseline="middle" fill="#999" font-size="14" font-family="sans-serif">
        图片占位
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg.replace(/\s+/g, ' ').trim())}`;
};

// 根据类别生成不同颜色的占位图片
export const getCategoryPlaceholder = (category: string): string => {
  const colors: Record<string, string> = {
    tops: '#FFE4E6',
    bottoms: '#E0E7FF',
    outerwear: '#FEF3C7',
    dresses: '#DBEAFE',
    shoes: '#D1FAE5',
    accessories: '#FCE7F3',
    bags: '#E0E7FF',
    hats: '#FEF9C3',
    socks: '#E0F2FE',
    underwear: '#F3E8FF'
  };
  
  return generatePlaceholderImage(400, 500, colors[category] || '#f0f0f0');
};

// 生成服装物品的占位图片
export const getClothingPlaceholder = (): string => {
  return generatePlaceholderImage(400, 500, '#FFE4E6');
};

// 生成穿搭图片占位
export const getOutfitPlaceholder = (): string => {
  return generatePlaceholderImage(600, 800, '#FCE7F3');
};

// 生成帖子图片占位
export const getPostPlaceholder = (): string => {
  return generatePlaceholderImage(600, 800, '#E0E7FF');
};
