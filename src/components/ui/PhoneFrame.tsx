interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative w-full max-w-[390px] h-[820px] sm:h-[836px] bg-[#F8F7FC] rounded-[44px] shadow-phone overflow-hidden flex flex-col border-[6px] border-white select-none">
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">{children}</div>
    </div>
  );
}
