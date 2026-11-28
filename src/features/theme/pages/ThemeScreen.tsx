import { useNavigate } from 'react-router-dom';
import { useDayflowStore } from '@/store/useDayflowStore';

const colors = [
  { name: 'Brand Purple', value: '#6D42EF', color: '#6D42EF' },
  { name: 'Indigo', value: '#6366F1', color: '#6366F1' },
  { name: 'Purple', value: '#A855F7', color: '#A855F7' },
  { name: 'Green', value: '#10B981', color: '#10B981' },
];

const fonts = ['Plus Jakarta Sans', 'Inter', 'System Font'];

export default function ThemeScreen() {
  const navigate = useNavigate();
  const {
    theme,
    applyTheme,
    resetTheme,
  } = useDayflowStore();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col px-5 pt-2 pb-[calc(96px+env(safe-area-inset-bottom))]">
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
        <h3 className="text-semibold text-ink-500 mb-3">Appearance Mode</h3>
        <div className="flex gap-3">
          <button
            key="light"
            onClick={() => applyTheme('light')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${
              theme.mode === 'light'
                ? 'bg-brand-600 text-white'
                : 'bg-[#F4F1FE] text-ink-900 hover:bg-brand-50/80'
            }`}
          >
            Light Mode
          </button>
          <button
            key="dark"
            onClick={() => applyTheme('dark')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${
              theme.mode === 'dark'
                ? 'bg-brand-600 text-white'
                : 'bg-[#F4F1FE] text-ink-900 hover:bg-brand-50/80'
            }`}
          >
            Dark Mode
          </button>
        </div>
        <p className="text-xs text-ink-400 mt-2">Choose Light Mode or Dark Mode</p>
      </div>

      <div className="mb-6">
        <h3 className="text-semibold text-ink-500 mb-3">Accent Color</h3>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => applyTheme(theme.mode, c.value)}
              className={`rounded-full w-10 h-10 border-2 transition-all ${
                theme.primaryColor === c.value
                  ? 'border-white ring-2 ring-brand-600 scale-110'
                  : 'border-transparent'
              }`}
              style={{ backgroundColor: c.color }}
            />
          ))}
        </div>
        <p className="text-xs text-ink-400 mt-2">Select accent color</p>
      </div>

      <div className="mb-6">
        <h3 className="text-semibold text-ink-500 mb-3">Font</h3>
        <div className="grid grid-cols-3 gap-2">
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => applyTheme(theme.mode, theme.primaryColor, f)}
              className={`rounded-lg text-sm font-medium transition-all ${
                theme.fontFamily === f
                  ? 'bg-brand-600 text-white border-white ring-1'
                  : 'text-ink-900 hover:bg-brand-50/60 border-transparent'
              } border-[1px]`}
              style={{ fontFamily: f === 'System Font' ? 'system-ui' : f }}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-400 mt-2">Select font family</p>
      </div>

      <div className="mt-auto">
        <div className="bg-[#F4F1FE] rounded-xl p-4 mb-6 border border-[#EAE4FC]">
          <p className="text-xs text-ink-500 mb-2">Live Preview</p>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Sample text</p>
            <p className="text-[11px] text-ink-400">₱0.00 · Today</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 rounded-xl py-3 bg-brand-600 text-white font-bold transition-colors active:scale-[0.985]"
          >
            Apply
          </button>
          <button
            onClick={() => {
              resetTheme();
              navigate('/profile');
            }}
            className="flex-1 rounded-xl py-3 bg-gray-200 text-ink-900 font-bold transition-colors active:scale-[0.985]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
