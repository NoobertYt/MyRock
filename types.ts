
// Add React import to resolve the namespace error for CSSProperties on line 8
import React from 'react';

export interface Accessory {
  id: string;
  name: string;
  price: number;
  icon: string;
  type: 'hat' | 'glasses' | 'other';
  style: React.CSSProperties;
}

export interface RockState {
  name: string;
  coins: number;
  level: number;
  exp: number;
  equippedIds: string[];
  unlockedIds: string[];
}
