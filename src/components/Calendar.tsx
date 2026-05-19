import React, { useState, useMemo } from 'react';
import type { Outfit } from '../types';

interface CalendarProps {
  outfits: Outfit[];
  onAddOutfit: (date: string) => void;
  onViewOutfit: (outfit: Outfit) => void;
}

const Calendar: React.FC<CalendarProps> = ({ outfits, onAddOutfit, onViewOutfit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 生成日历数据
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 获取当月第一天是星期几
    const firstDay = new Date(year, month, 1).getDay();
    // 获取当月有多少天
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // 生成日历网格
    const days = [];
    
    // 添加上个月的填充天数
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null, isCurrentMonth: false });
    }
    
    // 添加当月的天数
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const outfit = outfits.find(o => {
        const outfitDate = new Date(o.createdAt).toISOString().split('T')[0];
        return outfitDate === dateStr;
      });
      
      days.push({
        day: i,
        date: dateStr,
        isCurrentMonth: true,
        outfit
      });
    }
    
    return {
      year,
      month,
      days
    };
  }, [currentDate, outfits]);

  // 月份名称
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  // 星期名称
  const weekNames = ['日', '一', '二', '三', '四', '五', '六'];

  // 切换到上个月
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // 切换到下个月
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 切换到今天
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="calendar">
      {/* 日历头部 */}
      <div className="calendar-header flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          &lt;
        </button>
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {calendarData.year}年 {monthNames[calendarData.month]}
          </h3>
          <button 
            onClick={goToToday}
            className="text-xs text-blue-500 mt-1"
          >
            今天
          </button>
        </div>
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>
      
      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekNames.map((weekday, index) => (
          <div key={index} className="text-center text-sm font-medium">
            {weekday}
          </div>
        ))}
      </div>
      
      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.days.map((day, index) => (
          <div 
            key={index}
            className={`h-16 flex flex-col items-center justify-center rounded-lg cursor-pointer ${day.isCurrentMonth ? '' : 'text-gray-300'}`}
            style={{
              backgroundColor: day.outfit ? '#FCE7F3' : day.isCurrentMonth ? 'white' : 'transparent'
            }}
            onClick={() => day.isCurrentMonth && day.date && onAddOutfit(day.date)}
          >
            <span className={day.outfit ? 'font-bold text-pink-600' : ''}>
              {day.day}
            </span>
            {day.outfit && (
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-1"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* 今日穿搭 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">今日穿搭</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {(() => {
            const today = new Date().toISOString().split('T')[0];
            const todayOutfit = outfits.find(o => {
              const outfitDate = new Date(o.createdAt).toISOString().split('T')[0];
              return outfitDate === today;
            });
            
            if (todayOutfit) {
              return (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{todayOutfit.name}</p>
                    <p className="text-sm text-gray-600">
                      {todayOutfit.occasion === 'commute' ? '通勤' : todayOutfit.occasion === 'date' ? '约会' : todayOutfit.occasion === 'sport' ? '运动' : todayOutfit.occasion === 'party' ? '聚会' : '休闲'}
                    </p>
                  </div>
                  <button 
                    onClick={() => onViewOutfit(todayOutfit)}
                    className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm"
                  >
                    查看
                  </button>
                </div>
              );
            } else {
              return (
                <div className="text-center py-4 text-gray-500">
                  <p>今天还没有穿搭计划</p>
                  <button 
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      onAddOutfit(today);
                    }}
                    className="mt-2 px-3 py-1 bg-pink-500 text-white rounded-lg text-sm"
                  >
                    添加穿搭
                  </button>
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;