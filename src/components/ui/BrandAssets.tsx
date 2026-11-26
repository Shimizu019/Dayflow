interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <svg className={`w-7 h-7 ${className ?? ''}`} viewBox="0 0 32 32" fill="none">
      <path d="M7 22C7 12.5 14.2 6 24.5 6C24.5 16.3 18 23.5 8.5 23.5H7V22Z" fill="#6338E8" />
      <path d="M7 25.5C11 21 15.5 18 22 16.5C18.5 22.5 13 26 7 26V25.5Z" fill="#9D7CF8" />
    </svg>
  );
}

export interface PiggyBank3DProps {
  className?: string;
}

export function PiggyBank3D({ className }: PiggyBank3DProps) {
  return (
    <svg
      className={`w-24 h-24 drop-shadow-md ${className ?? ''}`}
      viewBox="0 0 110 110"
      fill="none"
    >
      <defs>
        <radialGradient id="pigBody" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#A685FA" />
          <stop offset="55%" stopColor="#7448F2" />
          <stop offset="100%" stopColor="#4D24C7" />
        </radialGradient>
        <radialGradient id="pigSnout" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#C4B0FC" />
          <stop offset="100%" stopColor="#875EF5" />
        </radialGradient>
        <linearGradient id="goldCoin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path d="M22 24L23.5 28L27.5 29.5L23.5 31L22 35L20.5 31L16.5 29.5L20.5 28L22 24Z" fill="#B79DF8" />
      <path d="M16 44L17 46.5L19.5 47.5L17 48.5L16 51L15 48.5L12.5 47.5L15 46.5L16 44Z" fill="#FBBF24" />
      <circle cx="88" cy="24" r="2" fill="#C4B5FD" />
      <ellipse cx="64" cy="30" rx="8.5" ry="5.5" transform="rotate(-12 64 30)" fill="url(#goldCoin)" stroke="#FDE68A" strokeWidth="1" />
      <rect x="46" y="75" width="9" height="14" rx="4.5" fill="#4D24C7" />
      <rect x="71" y="75" width="9" height="14" rx="4.5" fill="#4D24C7" />
      <path d="M87 56C93 54 96 48 92 45C89 43 87 47 90 49C93 51 97 48 96 44" stroke="#875EF5" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 39C43 31 50 28 55 35Z" fill="#6338E8" />
      <ellipse cx="63" cy="58" rx="26" ry="22" fill="url(#pigBody)" />
      <rect x="57" y="38" width="13" height="3.2" rx="1.6" fill="#32148C" />
      <rect x="42" y="76" width="9.5" height="14" rx="4.5" fill="#6338E8" />
      <rect x="66" y="76" width="9.5" height="14" rx="4.5" fill="#6338E8" />
      <ellipse cx="37" cy="59" rx="7" ry="9" fill="url(#pigSnout)" />
      <circle cx="35.5" cy="57" r="1.4" fill="#4D24C7" />
      <circle cx="35.5" cy="61" r="1.4" fill="#4D24C7" />
      <circle cx="46" cy="51" r="2.3" fill="#231259" />
      <circle cx="46.8" cy="50.2" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

export interface GoalThumbnailProps {
  theme: 'beach' | 'laptop';
  className?: string;
}

export function GoalThumbnail({ theme, className }: GoalThumbnailProps) {
  if (theme === 'beach') {
    return (
      <svg
        className={`w-14 h-14 rounded-2xl shrink-0 shadow-xs ${className ?? ''}`}
        viewBox="0 0 64 64"
        fill="none"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#skyGrad)" />
        <ellipse cx="38" cy="18" rx="12" ry="4.5" fill="white" fillOpacity={0.85} />
        <ellipse cx="32" cy="19" rx="7" ry="3.5" fill="white" fillOpacity={0.85} />
        <rect y="33" width="64" height="14" fill="url(#seaGrad)" />
        <path d="M0 46 Q16 43 32 46 T64 46 L64 64 L0 64 Z" fill="url(#sandGrad)" />
        <path d="M0 46 Q16 43 32 46 T64 46" stroke="white" strokeWidth="1.8" strokeOpacity={0.85} />
      </svg>
    );
  }
  return (
    <svg
      className={`w-14 h-14 rounded-2xl shrink-0 shadow-xs ${className ?? ''}`}
      viewBox="0 0 64 64"
      fill="none"
    >
      <defs>
        <linearGradient id="lapBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="screenGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#lapBg)" />
      <rect x="15" y="16" width="34" height="23" rx="3" fill="#1E1B4B" />
      <rect x="17.5" y="18.5" width="29" height="18" rx="1.5" fill="url(#screenGlow)" />
      <circle cx="32" cy="27.5" r="4" fill="#A5B4FC" fillOpacity={0.5} />
      <path d="M10 40H54L51 45H13L10 40Z" fill="#374151" />
      <rect x="27" y="40" width="10" height="1.5" rx="0.75" fill="#9CA3AF" />
    </svg>
  );
}

export interface BenjuAvatarProps {
  className?: string;
}

export function BenjuAvatar({ className }: BenjuAvatarProps) {
  return (
    <svg
      className={`w-20 h-20 rounded-full ${className ?? ''}`}
      viewBox="0 0 96 96"
      fill="none"
    >
      <circle cx="48" cy="48" r="48" fill="#DDD5F8" />
      <path d="M18 92C20 75 32 68 48 68C64 68 76 75 78 92" fill="#5D32E6" />
      <rect x="42" y="56" width="12" height="15" rx="6" fill="#F2C2A8" />
      <rect x="33" y="27" width="30" height="36" rx="15" fill="#F7CEB6" />
      <circle cx="33" cy="46" r="3.5" fill="#F2C2A8" />
      <circle cx="63" cy="46" r="3.5" fill="#F2C2A8" />
      <path d="M32 42C31 28 38 20 50 21C60 22 65 29 64 42C63 35 58 31 51 31C43 31 35 34 32 42Z" fill="#231F38" />
      <path d="M36 25C41 19 54 19 59 26C54 24 43 24 36 25Z" fill="#231F38" />
      <path d="M39 40.5C40.5 39.5 42.5 39.5 44 40.5" stroke="#231F38" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M52 40.5C53.5 39.5 55.5 39.5 57 40.5" stroke="#231F38" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="41.5" cy="44.5" r="2" fill="#231F38" />
      <circle cx="54.5" cy="44.5" r="2" fill="#231F38" />
      <path d="M44 52.5C46 54.8 50 54.8 52 52.5" stroke="#B96B56" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
