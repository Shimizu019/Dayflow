import { useNavigate } from 'react-router-dom';
import { BenjuAvatar } from '@/components/ui/BrandAssets';
import { Archive, RotateCcw, Settings2, Palette, Info, CircleHelp, ChevronRight } from 'lucide-react';

interface MenuItem {
  label: string;
  action: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
  soon?: boolean;
}

export default function ProfileScreen() {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      label: 'Backup Data',
      action: () => {},
      icon: <Archive className="w-[18px] h-[18px]" strokeWidth={1.9} />,
      disabled: true,
      soon: true,
    },
    {
      label: 'Restore Data',
      action: () => {},
      icon: <RotateCcw className="w-[18px] h-[18px]" strokeWidth={1.9} />,
      disabled: true,
      soon: true,
    },
    {
      label: 'App Settings',
      action: () => {},
      icon: <Settings2 className="w-[18px] h-[18px]" strokeWidth={1.9} />,
    },
    {
      label: 'Theme',
      action: () => navigate('/theme'),
      icon: <Palette className="w-[18px] h-[18px]" strokeWidth={1.9} />,
    },
    {
      label: 'About Dayflow',
      action: () => {},
      icon: <Info className="w-[18px] h-[18px]" strokeWidth={1.9} />,
    },
    {
      label: 'Help & Support',
      action: () => {},
      icon: <CircleHelp className="w-[18px] h-[18px]" strokeWidth={1.9} />,
    },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar relative flex flex-col justify-between bg-[#F8F7FC] px-5 pt-3 pb-[calc(112px+env(safe-area-inset-bottom))]">
      <div>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-1 rounded-full bg-white shadow-card ring-1 ring-[#EAE4FC] mb-2.5">
            <BenjuAvatar className="w-[72px] h-[72px]" />
          </div>
          <h1 className="text-[17px] font-extrabold leading-tight text-ink-900">Benju Guzman</h1>
          <p className="text-[11px] font-medium text-ink-500 mt-1">Local Device Storage · Offline Mode</p>
        </div>

        <div className="bg-white rounded-[22px] border border-[#ECE8FA] divide-y divide-[#F0EDF8] overflow-hidden shadow-card px-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.action()}
              disabled={item.disabled}
              className={`w-full grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 py-2.5 px-2.5 min-h-[60px] text-left transition-colors ${
                item.disabled
                  ? 'text-[#8D879F] cursor-not-allowed'
                  : 'text-ink-900 hover:bg-brand-50/60'
              }`}
            >
              <span className={`w-10 h-10 rounded-[14px] bg-[#F4F1FE] flex items-center justify-center shrink-0 ${item.disabled ? 'text-[#8D879F]' : 'text-brand-600'}`}>
                {item.icon}
              </span>
              <span className={`min-w-0 text-[13px] font-semibold ${item.disabled ? 'text-[#8D879F]' : 'text-ink-900'}`}>{item.label}</span>
              {item.soon ? (
                <span className="rounded-full bg-[#F4F1FE] px-2 py-1 text-[9px] font-semibold text-[#7B768F]">Soon</span>
              ) : (
                <ChevronRight className="w-4 h-4 text-ink-400" strokeWidth={1.9} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <div className="text-center text-[11px] font-medium text-ink-400 mt-4">
          Dayflow v1.0.2
        </div>
      </div>
    </div>
  );
}
