// types/index.ts
// 心衣间 App 完整类型定义

// 用户相关
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  bodyData: BodyData;
  stats: UserStats;
  badges: Badge[];
}

export interface UserPreferences {
  style: StyleType[];
  colorPalette: string[];
  occasion: OccasionType[];
  notification: boolean;
  privacy: PrivacySettings;
}

export interface PrivacySettings {
  shareWardrobe: boolean;
  shareOutfits: boolean;
  allowRecommendations: boolean;
}

export interface BodyData {
  height: number; // cm
  weight: number; // kg
  bust?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  bodyType: BodyType;
  skinTone?: string;
}

export type BodyType = 'hourglass' | 'pear' | 'apple' | 'rectangle' | 'inverted-triangle';
export type StyleType = 'minimalist' | 'casual' | 'business' | 'vintage' | 'sporty' | 'bohemian' | 'luxury' | 'sweet' | 'edgy' | 'preppy';
export type OccasionType = 'commute' | 'date' | 'party' | 'sport' | 'travel' | 'home' | 'interview';

export interface UserStats {
  totalItems: number;
  totalValue: number;
  utilizationRate: number;
  carbonSaved: number; // kg
  outfitsCreated: number;
  communityLikes: number;
  challengeCompleted: number;
  badgeCount: number;
}

// 衣物相关
export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  subCategory: string;
  brand?: string;
  color: string;
  colors: string[];
  pattern: PatternType;
  material: string;
  season: SeasonType[];
  style: StyleType[];
  occasion: OccasionType[];
  size: string;
  fit: FitType;
  price: number;
  purchaseDate?: Date;
  purchaseChannel?: string;
  images: string[];
  thumbnail: string;
  wearCount: number;
  lastWorn?: Date;
  isFavorite: boolean;
  isArchived: boolean;
  tags: string[];
  notes?: string;
  careInstructions?: string;
  sustainability?: SustainabilityInfo;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type ClothingCategory = 
  | 'tops' | 'bottoms' | 'dresses' | 'outerwear' 
  | 'shoes' | 'bags' | 'accessories' | 'underwear';

export type PatternType = 'solid' | 'striped' | 'checkered' | 'floral' | 'polka-dot' | 'graphic' | 'abstract' | 'animal';
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
export type FitType = 'tight' | 'regular' | 'loose' | 'oversized';

export interface SustainabilityInfo {
  materialSource?: string;
  isRecycled: boolean;
  carbonFootprint?: number;
  waterUsage?: number;
  ethicalCertification?: string[];
}

// 搭配相关
export interface Outfit {
  id: string;
  name: string;
  items: OutfitItem[];
  occasion: OccasionType;
  weather?: WeatherCondition;
  temperature?: number;
  style: StyleType;
  season: SeasonType;
  isAiGenerated: boolean;
  aiConfidence?: number;
  image?: string;
  thumbnail: string;
  wearCount: number;
  lastWorn?: Date;
  isFavorite: boolean;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  likes: number;
  isPublic: boolean;
  fitScore?: number;
  colorScore?: number;
  styleScore?: number;
  occasionScore?: number;
  totalScore?: number;
  styleTags?: string[];
}

export interface OutfitItem {
  itemId: string;
  position: number;
  layer: number;
  transform?: OutfitTransform;
}

export interface OutfitTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

// 天气相关
export interface WeatherCondition {
  temperature: number;
  feelsLike: number;
  humidity: number;
  condition: WeatherType;
  windSpeed: number;
  uvIndex: number;
  precipitation: number;
  location: string;
  forecast: WeatherForecast[];
}

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'foggy' | 'stormy';

export interface WeatherForecast {
  date: Date;
  temperature: number;
  condition: WeatherType;
  precipitation: number;
}

// AI推荐相关
export interface AIRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  outfit?: Outfit;
  items?: ClothingItem[];
  confidence: number;
  reason: string[];
  context: RecommendationContext;
  isRead: boolean;
  isApplied: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export type RecommendationType = 
  | 'daily' | 'weather-based' | 'occasion-based' | 'style-discovery' 
  | 'item-combination' | 'new-item' | 'sleeping-item' | 'trend' | 'challenge' 
  | 'one-item-multiple-outfits' | 'week-outfits' | 'body-type-based';

export interface RecommendationContext {
  weather?: WeatherCondition;
  occasion?: OccasionType;
  timeOfDay?: string;
  userMood?: string;
  recentItems?: string[];
  upcomingEvents?: string[];
  bodyData?: BodyData;
  userInput?: string;
}

// 社区相关
export interface Post {
  id: string;
  type: PostType;
  author: User;
  content: string;
  images: string[];
  outfit?: Outfit;
  items?: ClothingItem[];
  tags: string[];
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PostType = 'outfit-share' | 'item-review' | 'style-tip' | 'challenge' | 'question' | 'bottle';

export interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  theme: string;
  coverImage: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  submissions: Post[];
  prizes?: string[];
  rules: string[];
  isActive: boolean;
  isJoined: boolean;
}

export interface Bottle {
  id: string;
  item: ClothingItem;
  sender: User;
  receiver?: User;
  message?: string;
  status: BottleStatus;
  createdAt: Date;
  matchedAt?: Date;
  completedAt?: Date;
  ecoImpact: EcoImpact;
}

export type BottleStatus = 'floating' | 'matched' | 'in-transit' | 'received' | 'completed';

export interface EcoImpact {
  carbonSaved: number;
  waterSaved: number;
  wasteReduced: number;
}

// 日历/记录相关
export interface CalendarEntry {
  id: string;
  date: Date;
  outfit: Outfit;
  weather: WeatherCondition;
  occasion: OccasionType;
  mood: string;
  rating: number;
  photos: string[];
  notes?: string;
  location?: string;
}

// 穿搭日历相关
export interface OutfitCalendar {
  id: string;
  userId: string;
  entries: CalendarEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// 穿搭评分相关
export interface OutfitRating {
  id: string;
  outfitId: string;
  userId: string;
  colorScore: number;
  styleScore: number;
  occasionScore: number;
  bodyFitScore: number;
  totalScore: number;
  suggestions: string[];
  styleTags: string[];
  createdAt: Date;
}

// 灵感与趋势相关
export interface StyleTrend {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  outfits: Outfit[];
  popularity: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inspiration {
  id: string;
  title: string;
  description: string;
  style: StyleType[];
  occasion: OccasionType[];
  bodyType: BodyType[];
  images: string[];
  outfits: Outfit[];
  isSaved: boolean;
  createdAt: Date;
}

export interface StyleTutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  images: string[];
  videos?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

// 个人中心与成长体系相关
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;
  unlockedAt: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserStyleProfile {
  id: string;
  userId: string;
  styleTags: string[];
  styleScore: number;
  preferredColors: string[];
  preferredStyles: StyleType[];
  preferredOccasions: OccasionType[];
  bodyTypeRecommendations: string[];
  updatedAt: Date;
}

// 购物/电商相关
export interface ShoppingItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  url: string;
  platform: string;
  matchScore: number;
  matchReason: string[];
  similarItems: string[];
  compatibility: CompatibilityCheck;
}

export interface CompatibilityCheck {
  wardrobeItems: string[];
  canFormOutfit: boolean;
  suggestedOutfits: string[];
  missingItems?: string[];
}

// 穿搭清单相关
export interface OutfitList {
  id: string;
  userId: string;
  name: string;
  type: 'shopping' | 'wishlist';
  items: ShoppingItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 通知相关
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export type NotificationType = 
  | 'recommendation' | 'weather-alert' | 'challenge' | 'social' 
  | 'bottle' | 'system' | 'reminder' | 'badge-unlocked' | 'outfit-scheduled';

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ResponseMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// 配置类型
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  features: {
    aiRecommendation: boolean;
    arTryOn: boolean;
    socialSharing: boolean;
    eCommerce: boolean;
    offlineMode: boolean;
  };
  limits: {
    maxWardrobeSize: number;
    maxOutfitsPerDay: number;
    maxPhotosPerItem: number;
  };
}