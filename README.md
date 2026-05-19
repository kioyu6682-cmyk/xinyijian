# 心衣间 (XinYiJian) - AI时尚伴侣

一个智能衣橱管理应用，融合AI图像识别、天气分析、AR增强现实与可持续时尚社区。

## 功能特性

### 核心功能
- 🤖 **AI智能推荐** - 基于天气、场合、个人风格的穿搭推荐
- 📸 **拍照入橱** - 快速添加衣物到数字衣橱
- 🌤️ **天气感知** - 实时天气数据驱动的穿搭建议
- 👗 **虚拟试衣间** - AR预览搭配效果
- 📊 **穿搭分析** - 衣物利用率统计与优化建议

### 社区功能
- 🏆 **穿搭挑战** - 参与主题穿搭活动
- 🌊 **衣物漂流** - 闲置衣物流转平台
- 💡 **搭配求助** - 社区达人帮你解决穿搭难题
- 🌱 **环保贡献** - 追踪碳减排数据

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **状态管理**: React Hooks + Context
- **样式方案**: CSS Modules
- **后端 / 数据**: [Supabase](https://supabase.com)（Auth、PostgreSQL、RLS）
- **本地缓存**: 演示模式与离线兜底

## 环境变量

复制 `.env.example` 为 `.env` 并填写：

| 变量 | 说明 |
|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | **仅** anon 公钥（禁止 service_role） |

若曾在源码中暴露过 `service_role`，请在 Supabase Dashboard → Project Settings → API 中 **Reset service_role key**。

## 项目结构

```
xinyijian-app/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 可复用组件
│   │   ├── TodayCard.tsx   # 今日着装卡片
│   │   ├── InspirationCard.tsx
│   │   ├── ClothesGrid.tsx
│   │   └── VirtualFittingRoom.tsx
│   ├── pages/              # 页面组件
│   │   ├── HomePage.tsx    # 首页
│   │   ├── WardrobePage.tsx # 衣橱页
│   │   ├── MatchPage.tsx   # 搭配页
│   │   └── CommunityPage.tsx # 社区页
│   ├── hooks/              # 自定义Hooks
│   │   ├── useWardrobe.ts  # 衣橱管理
│   │   └── useOutfit.ts    # 搭配管理
│   ├── types/              # TypeScript类型定义
│   ├── data/               # JSON数据文件
│   ├── utils/              # 工具函数
│   ├── App.tsx             # 主应用组件
│   └── main.tsx            # 应用入口
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 快速开始

### 安装依赖
```bash
npm install
cp .env.example .env
# 编辑 .env，填入 Supabase URL 与 anon 公钥
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 设计文档

### 设计理念
"静谧的美术馆，跃动的灵感源" - 采用极简主义与大量留白，像美术馆一样突出每一件衣物的美感。

### 核心用户
- 20-35岁都市白领
- 时尚前沿学生
- 注重生活品质的年轻人

### 用户痛点解决
1. **决策困难** → AI一键推荐今日穿搭
2. **衣橱记忆困难** → 数字衣橱全局视图
3. **风格固化** → 风格盲盒突破舒适区
4. **线上购物不确定性** → 虚拟试穿预览效果
5. **闲置衣物处理** → 衣物漂流瓶流转平台

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License
