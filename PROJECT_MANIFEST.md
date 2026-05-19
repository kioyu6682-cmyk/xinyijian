# 心衣间 App 项目文件清单

## 项目结构
```
xinyijian-app/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── TodayCard.tsx
│   │   ├── InspirationCard.tsx
│   │   ├── ClothesGrid.tsx
│   │   └── VirtualFittingRoom.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── HomePage.css
│   │   ├── WardrobePage.tsx
│   │   ├── WardrobePage.css
│   │   ├── MatchPage.tsx
│   │   ├── MatchPage.css
│   │   ├── CommunityPage.tsx
│   │   └── CommunityPage.css
│   ├── hooks/
│   │   └── useWardrobe.ts
│   ├── types/
│   │   └── index.ts
│   ├── data/
│   │   ├── user.json
│   │   ├── wardrobe.json
│   │   ├── outfits.json
│   │   ├── community.json
│   │   └── weather.json
│   ├── utils/
│   │   └── index.ts
│   ├── services/
│   │   ├── weather.ts
│   │   └── ai.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## 技术栈
- React 18.2.0
- TypeScript 5.2.2
- Vite 5.0.8
- CSS Modules

## 核心功能模块
1. **首页 (HomePage)**
   - 今日着装智能卡片
   - 天气感知推荐
   - 灵感速递信息流
   - 快捷功能入口
   - 环保贡献统计

2. **衣橱 (WardrobePage)**
   - 衣物网格展示
   - 分类筛选
   - 沉睡提醒
   - 统计数据

3. **搭配 (MatchPage)**
   - 虚拟试衣间
   - 场景切换
   - AI推荐搭配
   - 单品选择器

4. **社区 (CommunityPage)**
   - 穿搭挑战
   - 衣物漂流瓶
   - 搭配求助
   - 热门分享

## 数据文件说明
- user.json: 用户信息和偏好设置
- wardrobe.json: 衣物数据（128件示例数据）
- outfits.json: 搭配方案和AI推荐
- community.json: 社区内容（挑战、漂流瓶、帖子）
- weather.json: 天气数据和穿衣建议

## 启动命令
```bash
npm install    # 安装依赖
npm run dev    # 启动开发服务器
npm run build  # 构建生产版本
```
