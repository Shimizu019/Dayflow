import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ThemeScreen() {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('brand');
  const [selectedFont, setSelectedFont] = useState('Plus Jakarta Sans');

  const colors = [
    { name: 'Brand Purple', value: 'brand', color: '#6D42EF' },
    { name: 'Indigo', value: 'indigo', color: '#6366F1' },
    { name: 'Purple', value: 'purple', color: '#A855F7' },
    { name: 'Green', value: 'green', color: '#10B981' },
  ];

  const fonts = [
    'Plus Jakarta Sans',
    'Inter',
    'System Font',
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col px-5 pt-2 pb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/profile')}
          className="p-1.5 -ml-1.5 rounded-xl text-ink-900 hover:bg-brand-100/60 transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-[17px] font-bold text-ink-900">Theme Customization</h1>
      </div>

      <div className="mb-6">
        <h3 className="text-semibold text-ink-500 mb-3">Color Customization</h3>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedColor(c.value)}
              className={`rounded-full w-8 h-8 border-2 transition-colors ${
                selectedColor === c.value
                  ? `border-brand-600 ring-2 ring-brand-600 ring-offset-1`
                  : `border-transparent bg-${c.value === 'brand' ? 'brand-500' : c.value === 'indigo' ? 'indigo-100' : c.value === 'purple' ? 'purple-100' : 'green-100'} border-${c.value === 'brand' ? 'brand-600' : c.value === 'indigo' ? 'indigo-400' : c.value === 'purple' ? 'purple-400' : 'green-400'}`
              }`}
              style={{ backgroundColor: c.color }}
            />
          ))}
        </div>
        <p className="text-xs text-ink-400 mt-2">Select theme color</p>
      </div>

      <div className="mb-6">
        <h3 className="text-semibold text-ink-500 mb-3">Font Customization</h3>
        <div className="grid grid-cols-3 gap-2">
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFont(f)}
              className={`rounded-lg text-sm font-medium transition-colors ${
                selectedFont === f
                  ? 'bg-brand-600 text-white'
                  : 'text-ink-900 hover:bg-brand-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-400 mt-2">Select font</p>
      </div>

      <div>
        <h3 className="text-semibold text-ink-500 mb-3">Live Preview</h3>
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <p className="text-ink-900 mb-2">Sample text showing how colors and font affect application components.</p>
          <div className="bg-white p-3 rounded-md">
            <p className="text-sm font-medium">Card content example</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {}}
            className="flex-1 rounded-xl py-2 bg-brand-600 text-white font-bold transition-colors hover:bg-brand-700"
          >
            Apply
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 rounded-xl py-2 bg-gray-200 text-ink-900 font-bold transition-colors hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
