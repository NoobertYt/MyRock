
import React from 'react';
import { Accessory } from '../types';
import { ACCESSORIES } from '../constants';

interface ShopProps {
  coins: number;
  unlockedIds: string[];
  equippedIds: string[];
  onBuy: (item: Accessory) => void;
  onEquip: (id: string) => void;
  onUnequip: (id: string) => void;
}

const Shop: React.FC<ShopProps> = ({ coins, unlockedIds, equippedIds, onBuy, onEquip, onUnequip }) => {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50 w-full max-w-md flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-stone-800 flex items-center gap-3">
          <span className="bg-sky-100 p-2 rounded-2xl text-xl">🛍️</span> Boutique
        </h3>
        <div className="bg-stone-100 px-4 py-2 rounded-2xl font-black text-stone-500 text-sm tracking-wider">
          {ACCESSORIES.length} ITEMS
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {ACCESSORIES.map(item => {
            const isUnlocked = unlockedIds.includes(item.id);
            const isEquipped = equippedIds.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <div 
                key={item.id}
                className={`group p-5 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-3 relative overflow-hidden ${
                  isEquipped ? 'border-green-400 bg-green-50/50' : 
                  isUnlocked ? 'border-stone-100 bg-white hover:border-sky-200' : 
                  'border-transparent bg-stone-50/50'
                }`}
              >
                <div className="text-5xl h-16 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-center h-8 flex items-center justify-center leading-tight">
                  {item.name}
                </div>
                
                {!isUnlocked ? (
                  <button
                    onClick={() => onBuy(item)}
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                      canAfford 
                      ? 'bg-stone-900 text-white shadow-lg active:scale-95 hover:bg-black' 
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span>🪙</span>
                    <span>{item.price}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => isEquipped ? onUnequip(item.id) : onEquip(item.id)}
                    className={`w-full py-3 rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 ${
                      isEquipped 
                      ? 'bg-rose-500 text-white hover:bg-rose-600' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {isEquipped ? 'REMOVE' : 'WEAR'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          border: 2px solid #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Shop;
