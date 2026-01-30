import React, { useState } from 'react';

interface TrashTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const TrashTooltip: React.FC<TrashTooltipProps> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-150">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
};

export default TrashTooltip;
