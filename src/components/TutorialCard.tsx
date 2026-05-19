import React from 'react';

interface TutorialCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  views: number;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ title, description, category, imageUrl, views }) => {
  return (
    <div className="tutorial-card bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-pink-500 text-white rounded-full text-xs">
            {category}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {views} 次观看
          </span>
          <button className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            阅读全文
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialCard;