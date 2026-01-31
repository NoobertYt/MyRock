
import React, { useState } from 'react';
import { Accessory } from '../types';
import { ACCESSORIES } from '../constants';

interface RockProps {
  name: string;
  equippedIds: string[];
  onClick: (x: number, y: number) => void;
}

const Rock: React.FC<RockProps> = ({ name, equippedIds, onClick }) => {
  const [isJumping, setIsJumping] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setIsJumping(true);
    onClick(e.clientX, e.clientY);
    setTimeout(() => setIsJumping(false), 200);
  };

  // Sort accessories by type/zIndex so hats are on top of glasses
  const equippedAccessories = ACCESSORIES
    .filter(acc => equippedIds.includes(acc.id))
    .sort((a, b) => (a.style.zIndex as number || 0) - (b.style.zIndex as number || 0));

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Rock Container */}
      <div 
        onClick={handleClick}
        className={`relative w-72 h-64 cursor-pointer transition-transform duration-200 cubic-bezier(0.34, 1.56, 0.64, 1) active:scale-90 ${
          isJumping ? '-translate-y-12' : 'translate-y-0'
        }`}
      >
        {/* The Rock Shape */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#a3a3a3] to-[#737373] shadow-[inset_-12px_-12px_24px_rgba(0,0,0,0.4),10px_25px_40px_rgba(0,0,0,0.25)]"
             style={{ borderRadius: '48% 52% 60% 40% / 45% 45% 55% 55%' }}>
          
          {/* Eyes Container */}
          <div className="absolute top-[38%] left-0 w-full flex justify-around px-12">
            <div className="w-5 h-5 bg-black rounded-full shadow-md relative overflow-hidden">
               <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="w-5 h-5 bg-black rounded-full shadow-md relative overflow-hidden">
               <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Blush */}
          <div className="absolute top-[52%] left-[20%] w-8 h-4 bg-pink-400 opacity-30 blur-md rounded-full"></div>
          <div className="absolute top-[52%] right-[20%] w-8 h-4 bg-pink-400 opacity-30 blur-md rounded-full"></div>

          {/* Mouth */}
          <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-12 h-6 border-b-4 border-black/70 rounded-full"></div>
        </div>

        {/* Accessories Overlay with Animation */}
        {equippedAccessories.map((acc) => (
          <div 
            key={acc.id} 
            className="absolute pointer-events-none drop-shadow-2xl animate-accessory-pop"
            style={acc.style}
          >
            {acc.icon}
          </div>
        ))}
      </div>

      {/* Shadow */}
      <div 
        className={`w-56 h-8 bg-black/20 blur-xl rounded-[100%] transition-all duration-300 mt-4 ${
          isJumping ? 'scale-50 opacity-10' : 'scale-100 opacity-100'
        }`}
      ></div>

      {/* Name Tag */}
      <div className="mt-10 bg-white/90 backdrop-blur-md px-8 py-3 rounded-2xl shadow-xl border-b-4 border-stone-300 hover:scale-105 transition-transform cursor-default">
        <h2 className="text-3xl font-black text-stone-800 uppercase tracking-tighter">{name || 'Rocky'}</h2>
      </div>

      <style>{`
        @keyframes accessory-pop {
          0% { transform: scale(0) translate(-50%, 0); opacity: 0; }
          70% { transform: scale(1.2) translate(-50%, -10px); opacity: 1; }
          100% { transform: scale(1) translate(-50%, 0); opacity: 1; }
        }
        /* Specific pop for items that don't have translateX(-50%) in their style */
        .animate-accessory-pop:not([style*="translateX(-50%)"]) {
          animation: accessory-pop-simple 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-accessory-pop[style*="translateX(-50%)"] {
           /* Handled by standard keyframe if we match the transform exactly or use a wrapper */
        }
        @keyframes accessory-pop-simple {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Rock;
