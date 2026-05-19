import React, { useState } from 'react';
import type { BodyData, BodyType } from '../types';

interface BodyDataInputProps {
  initialData?: BodyData;
  onBodyDataChange: (data: BodyData) => void;
}

const BodyDataInput: React.FC<BodyDataInputProps> = ({ initialData, onBodyDataChange }) => {
  const [height, setHeight] = useState<string>(initialData?.height?.toString() || '');
  const [weight, setWeight] = useState<string>(initialData?.weight?.toString() || '');
  const [bodyType, setBodyType] = useState<BodyType>(initialData?.bodyType || 'hourglass');
  const [waist, setWaist] = useState<string>(initialData?.waist?.toString() || '');
  const [hips, setHips] = useState<string>(initialData?.hips?.toString() || '');
  const [bust, setBust] = useState<string>(initialData?.bust?.toString() || '');

  const bodyTypes: { value: BodyType; label: string }[] = [
    { value: 'hourglass', label: '沙漏形' },
    { value: 'pear', label: '梨形' },
    { value: 'apple', label: '苹果形' },
    { value: 'rectangle', label: '矩形' },
    { value: 'inverted-triangle', label: '倒三角形' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bodyData: BodyData = {
      height: height ? parseInt(height) : 0,
      weight: weight ? parseInt(weight) : 0,
      bodyType,
      waist: waist ? parseInt(waist) : undefined,
      hips: hips ? parseInt(hips) : undefined,
      bust: bust ? parseInt(bust) : undefined,
    };
    onBodyDataChange(bodyData);
  };

  return (
    <div className="body-data-input">
      <h3 className="text-lg font-semibold mb-4">身材数据</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="height" className="block text-sm font-medium mb-1">身高 (cm)</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="160"
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-1">体重 (斤)</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="100"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="bust" className="block text-sm font-medium mb-1">胸围 (cm)</label>
            <input
              type="number"
              id="bust"
              value={bust}
              onChange={(e) => setBust(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="85"
            />
          </div>
          <div>
            <label htmlFor="waist" className="block text-sm font-medium mb-1">腰围 (cm)</label>
            <input
              type="number"
              id="waist"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="65"
            />
          </div>
          <div>
            <label htmlFor="hips" className="block text-sm font-medium mb-1">臀围 (cm)</label>
            <input
              type="number"
              id="hips"
              value={hips}
              onChange={(e) => setHips(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="90"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bodyType" className="block text-sm font-medium mb-1">身材类型</label>
          <select
            id="bodyType"
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value as BodyType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            {bodyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors"
        >
          保存身材数据
        </button>
      </form>
    </div>
  );
};

export default BodyDataInput;