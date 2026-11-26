interface StatusBarProps {
  time?: string;
}

export function StatusBar({ time = '9:41' }: StatusBarProps) {
  return (
    <div className="relative z-30 flex items-center justify-between px-7 pt-3.5 pb-1.5 text-[13px] font-bold text-ink-900 shrink-0 transition-colors">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-3 text-ink-900" viewBox="0 0 18 12" fill="currentColor">
          <rect x="1" y="8" width="2.6" height="4" rx="0.8" />
          <rect x="5.2" y="5.8" width="2.6" height="6.2" rx="0.8" />
          <rect x="9.4" y="3.2" width="2.6" height="8.8" rx="0.8" />
          <rect x="13.6" y="0.8" width="2.6" height="11.2" rx="0.8" />
        </svg>
        <svg className="w-4 h-3 text-ink-900" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.6a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8zm-3.6-2.1a5.2 5.2 0 017.2 0l1.1-1.2a6.8 6.8 0 00-9.4 0l1.1 1.2zm-2.5-2.6a8.8 8.8 0 0112.2 0l1.1-1.2a10.4 10.4 0 00-14.4 0l1.1 1.2z" />
        </svg>
        <div className="flex items-center">
          <div className="w-[22px] h-[11px] rounded-[3.5px] border border-ink-900/80 p-[1.5px] flex items-center">
            <div className="w-full h-full bg-ink-900 rounded-[1.5px]" />
          </div>
          <div className="w-[1.5px] h-[4px] bg-ink-900/80 rounded-r-sm ml-[1px]" />
        </div>
      </div>
    </div>
  );
}
