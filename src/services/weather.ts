// src/services/weather.ts
import type { WeatherCondition, WeatherForecast } from '../types';

const MOCK_WEATHER: WeatherCondition = {
  temperature: 23,
  feelsLike: 21,
  humidity: 75,
  condition: 'rainy',
  windSpeed: 12,
  uvIndex: 2,
  precipitation: 0.8,
  location: '上海市静安区',
  forecast: [
    { date: new Date(Date.now() + 86400000), temperature: 25, condition: 'cloudy', precipitation: 0.1 },
    { date: new Date(Date.now() + 172800000), temperature: 27, condition: 'sunny', precipitation: 0 },
    { date: new Date(Date.now() + 259200000), temperature: 22, condition: 'rainy', precipitation: 0.6 },
  ]
};

export class WeatherService {
  private static instance: WeatherService;

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(_location?: string): Promise<WeatherCondition> {
    // 实际项目中这里会调用天气API
    // const response = await fetch(`https://api.weather.com/v1/current?location=${location}`);
    // return response.json();

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_WEATHER;
  }

  async getForecast(days: number = 7): Promise<WeatherForecast[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_WEATHER.forecast.slice(0, days);
  }

  getClothingSuggestion(weather: WeatherCondition): string {
    const { temperature, condition } = weather;

    if (temperature < 10) {
      return '建议穿着羽绒服、毛衣等保暖衣物';
    } else if (temperature < 20) {
      return condition === 'rainy' 
        ? '建议穿着防风外套，内搭针织衫，记得带伞'
        : '建议穿着轻薄外套或风衣';
    } else if (temperature < 30) {
      return '建议穿着T恤、衬衫等透气衣物';
    } else {
      return '建议穿着短袖、短裤等清凉衣物，注意防晒';
    }
  }

  getWeatherIcon(condition: string): string {
    const icons: Record<string, string> = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      windy: '💨',
      stormy: '⛈️',
      foggy: '🌫️',
    };
    return icons[condition] || '🌤️';
  }
}

export const weatherService = WeatherService.getInstance();
