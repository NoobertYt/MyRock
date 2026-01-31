
import { Accessory } from './types';

export const ACCESSORIES: Accessory[] = [
  {
    id: 'cool-shades',
    name: 'Cool Shades',
    price: 50,
    icon: '🕶️',
    type: 'glasses',
    style: { top: '32%', left: '50%', transform: 'translateX(-50%)', fontSize: '4.8rem', zIndex: 30 }
  },
  {
    id: 'top-hat',
    name: 'Fancy Top Hat',
    price: 150,
    icon: '🎩',
    type: 'hat',
    style: { top: '-38%', left: '50%', transform: 'translateX(-50%)', fontSize: '6.5rem', zIndex: 50 }
  },
  {
    id: 'crown',
    name: 'Royal Crown',
    price: 500,
    icon: '👑',
    type: 'hat',
    style: { top: '-45%', left: '50%', transform: 'translateX(-50%)', fontSize: '6.5rem', zIndex: 50 }
  },
  {
    id: 'halo',
    name: 'Golden Halo',
    price: 400,
    icon: '😇',
    type: 'hat',
    style: { top: '-55%', left: '50%', transform: 'translateX(-50%)', fontSize: '6rem', zIndex: 10, opacity: 0.8 }
  },
  {
    id: 'headphones',
    name: 'Pro Audio',
    price: 250,
    icon: '🎧',
    type: 'other',
    style: { top: '15%', left: '50%', transform: 'translateX(-50%)', fontSize: '7rem', zIndex: 20 }
  },
  {
    id: 'monocle',
    name: 'Monocle',
    price: 200,
    icon: '🧐',
    type: 'glasses',
    style: { top: '28%', left: '26%', fontSize: '4rem', zIndex: 30 }
  },
  {
    id: 'flower',
    name: 'Cute Flower',
    price: 30,
    icon: '🌸',
    type: 'other',
    style: { top: '5%', left: '72%', fontSize: '3.5rem', zIndex: 20 }
  },
  {
    id: 'bow-tie',
    name: 'Red Bow Tie',
    price: 80,
    icon: '🎀',
    type: 'other',
    style: { top: '78%', left: '50%', transform: 'translateX(-50%)', fontSize: '4rem', zIndex: 45 }
  },
  {
    id: 'viking',
    name: 'Viking Helm',
    price: 450,
    icon: '🪖',
    type: 'hat',
    style: { top: '-32%', left: '50%', transform: 'translateX(-50%)', fontSize: '6.5rem', zIndex: 50 }
  },
  {
    id: 'cat-ears',
    name: 'Cat Ears',
    price: 120,
    icon: '🐱',
    type: 'hat',
    style: { top: '-25%', left: '50%', transform: 'translateX(-50%)', fontSize: '6rem', zIndex: 15 }
  },
  {
    id: 'chef-hat',
    name: 'Chef Hat',
    price: 180,
    icon: '👨‍🍳',
    type: 'hat',
    style: { top: '-48%', left: '50%', transform: 'translateX(-50%)', fontSize: '7rem', zIndex: 50 }
  }
];

export const LEVEL_UP_EXP = 100;
