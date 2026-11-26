import React from "react";

const FloatingActionButton: React.FC<{onClick: () => void; visible?: boolean}> = ({onClick, visible = true}) => {
  return (
    <button
      onClick={onClick}
      className={visible ? "fab-purple-orb absolute left-1/2 -translate-x-1/2 top-[1px] w-[52px] h-[52px] rounded-full hover:brightness-105 active:scale-95 text-white flex items-center justify-center transition-all z-10" : "hidden"}
      aria-label="Add New"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5"/>
      </svg>
    </button>
  )
}

export default FloatingActionButton
