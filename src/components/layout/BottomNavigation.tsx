import React from "react";

const BottomNavigation: React.FC = () => {
  return (
    <nav className="relative z-20 h-[88px] shrink-0 select-none">
      {/* SVG Curved Cutout Background */}
      <svg className="notched-nav-svg absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 378 88" preserveAspectRatio="none" fill="none">
        <path d="M0 44 Q0 18 26 18 L138 18 C148 18 153 22 155.5 30 A33.5 33.5 0 0 0 222.5 30 C225 22 230 18 240 18 L352 18 Q378 18 378 44 L378 88 L0 88 Z" fill="#FFFFFF"/>
      </svg>

      {/* Center FAB button area - absolute position inside the cutout */}
      <div className="relative z-10 flex items-center justify-center left-1/2 -translate-x-1/2 top-[1px]">
        {/* Navigation icons on left and right */}
        <div className="flex items-center gap-8">
          {/* Home tab */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))} 
            className="p-1.5 rounded-xl transition-colors flex-0"
            aria-label="Home"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.3 3.3a1.2 1.2 0 0 1 1.4 0l7.5 5.8c.5.4.8 1 .8 1.6V19a2 2 0 0 1-2 2h-4.2a.8.8 0 0 1-.8-.8v-4.4a2 2 0 0 0-4 0v4.4a.8.8 0 0 1-.8.8H5a2 2 0 0 1-2-2v-8.3c0-.6.3-1.2.8-1.6l7.5-5.8Z"/>
            </svg>
          </button>
          
          {/* Wallet tab */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'wallet' }))} 
            className="p-1.5 rounded-xl transition-colors flex-0"
            aria-label="My Wallet"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.1 3.05a9 9 0 0 0 0 17.9V3.05Z"/>
              <path d="M12.9 3.05v8.05h8.05a9.02 9.02 0 0 0-8.05-8.05Z"/>
              <path d="M12.9 12.9v8.05a9.02 9.02 0 0 0 8.05-8.05H12.9Z"/>
            </svg>
          </button>
        </div>

        {/* Center FAB - prominent purple circular button */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('show-add-new'))} 
          className="fab-purple-orb absolute left-1/2 -translate-x-1/2 top-[1px] w-[52px] h-[52px] rounded-full hover:brightness-105 active:scale-95 text-white flex items-center justify-center transition-all z-10"
          aria-label="Add New"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5"/>
          </svg>
        </button>
      </div>

      {/* Right side: Schedule and Profile */}
      <div className="flex items-center gap-8">
        {/* Schedule tab */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'schedule' }))} 
          className="p-1.5 rounded-xl transition-colors flex-0"
          aria-label="Schedule"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 2.5a1 1 0 0 1 1 1V5h7V3.5a1 1 0 1 1 2 0V5H19a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 19 21H5a2.5 2.5 0 0 1-2.5-2.5v-11A2.5 2.5 0 0 1 5 5h1.5V3.5a1 1 0 0 1 1-1ZM5 9.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9H5Z"/>
            <rect x="7" y="12.2" width="1.8" height="1.8" rx="0.5"/>
            <rect x="10" y="12.2" width="1.8" height="1.8" rx="0.5"/>
            <rect x="13" y="12.2" width="1.8" height="1.8" rx="0.5"/>
            <rect x="15.5" y="14.5" width="2.2" height="2.2" rx="0.6"/>
          </svg>
        </button>

        {/* Profile tab */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'profile' }))} 
          className="p-1.5 rounded-xl transition-colors flex-0"
          aria-label="Profile"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4 2.7a1.7 1.7 0 0 1 3.2 0l.3 1.1c.4.1.8.3 1.2.5l1-.5a1.7 1.7 0 0 1 2.3 2.3l-.5 1c.2.4.4.8.5 1.2l1.1.3a1.7 1.7 0 0 1 0 3.2l-1.1.3c-.1.4-.3.8-.5 1.2l.5 1a1.7 1.7 0 0 1-2.3 2.3l-1-.5c-.4.2-.8.4-1.2.5l-.3 1.1a1.7 1.7 0 0 1-3.2 0l-.3-1.1a6.4 6.4 0 0 1-1.2-.5l-1 .5a1.7 1.7 0 0 1-2.3-2.3l.5-1a6.4 6.4 0 0 1-.5-1.2l-1.1-.3a1.7 1.7 0 0 1 0-3.2l1.1-.3c.1-.4.3-.8.5-1.2l-.5-1a1.7 1.7 0 0 1 2.3-2.3l1 .5c.4-.2.8-.4 1.2-.5l.3-1.1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default BottomNavigation
