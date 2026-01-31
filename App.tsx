
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Rock from './components/Rock';
import Shop from './components/Shop';
import FeedbackModal from './components/FeedbackModal';
import { Accessory, RockState } from './types';
import { LEVEL_UP_EXP } from './constants';
import { getRockWisdom } from './services/geminiService';
import { auth, logout, saveUserData, getUserData, submitIdea, loginWithEmail, registerWithEmail } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  value: number;
}

const App: React.FC = () => {
  const [state, setState] = useState<RockState>(() => {
    const saved = localStorage.getItem('pet-rock-save-2026');
    return saved ? JSON.parse(saved) : {
      name: '',
      coins: 0,
      level: 1,
      exp: 0,
      equippedIds: [],
      unlockedIds: []
    };
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isNaming, setIsNaming] = useState(!state.name);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [wisdom, setWisdom] = useState<string>("Hello! Submit your ideas to evolve me!");
  const [isWisdomLoading, setIsWisdomLoading] = useState(false);
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const particleIdRef = useRef(0);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        const cloudData = await getUserData(user.uid);
        if (cloudData) {
          setState(cloudData as RockState);
          if (cloudData.name) setIsNaming(false);
        }
        setIsSyncing(false);
        setIsAuthModalOpen(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Persistence & Sync
  useEffect(() => {
    localStorage.setItem('pet-rock-save-2026', JSON.stringify(state));
    if (currentUser && !isSyncing) {
      saveUserData(currentUser.uid, state);
    }
  }, [state, currentUser, isSyncing]);

  const handleRockClick = useCallback((x: number, y: number) => {
    const coinGain = 1 + Math.floor(state.level / 2);
    const expGain = 10;

    setState(prev => {
      let newExp = prev.exp + expGain;
      let newLevel = prev.level;
      if (newExp >= LEVEL_UP_EXP) {
        newExp = 0;
        newLevel += 1;
      }
      return {
        ...prev,
        coins: prev.coins + coinGain,
        exp: newExp,
        level: newLevel
      };
    });

    const newParticle: ClickParticle = {
      id: particleIdRef.current++,
      x,
      y: y - 40,
      value: coinGain
    };

    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 800);
  }, [state.level]);

  const handleBuy = (item: Accessory) => {
    if (state.coins >= item.price) {
      setState(prev => ({
        ...prev,
        coins: prev.coins - item.price,
        unlockedIds: [...prev.unlockedIds, item.id],
        equippedIds: [...prev.equippedIds, item.id]
      }));
    }
  };

  const handleEquip = (id: string) => {
    setState(prev => ({
      ...prev,
      equippedIds: [...prev.equippedIds, id]
    }));
  };

  const handleUnequip = (id: string) => {
    setState(prev => ({
      ...prev,
      equippedIds: prev.equippedIds.filter(eid => eid !== id)
    }));
  };

  const handleFeedbackSubmit = async (text: string) => {
    const ok = await submitIdea(currentUser?.uid || null, text);
    if (ok) {
      setWisdom("Your idea has been recorded! Thank you!");
    }
    return ok;
  };

  if (isNaming) {
    return (
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-2xl flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="text-8xl text-center mb-8 drop-shadow-xl animate-bounce">🪨</div>
          <h2 className="text-4xl font-black text-stone-900 text-center mb-2 tracking-tighter">New Friend</h2>
          <p className="text-stone-500 text-center mb-8 font-medium">Name your digital pebble to begin your legacy.</p>
          <input 
            autoFocus
            type="text"
            placeholder="Rocky"
            className="w-full bg-stone-100 border-2 border-transparent focus:border-sky-400 rounded-2xl p-5 text-2xl font-black mb-6 transition-all outline-none text-center text-stone-900 placeholder:text-stone-300"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const name = (e.target as HTMLInputElement).value.trim();
                if (name) {
                  setState(prev => ({ ...prev, name }));
                  setIsNaming(false);
                }
              }
            }}
          />
          <button 
            onClick={() => {
              const input = document.querySelector('input') as HTMLInputElement;
              const name = input.value.trim();
              if (name) {
                setState(prev => ({ ...prev, name }));
                setIsNaming(false);
              }
            }}
            className="w-full bg-stone-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 text-xl tracking-widest"
          >
            CONFIRM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pb-20 pt-10 px-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      {/* HUD: Stats 2026 Style */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-30 pointer-events-none">
        <div className="flex justify-between items-center gap-6 bg-white/80 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-2xl border border-white/50 pointer-events-auto">
          <div className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 to-orange-300 rounded-3xl flex items-center justify-center text-3xl shadow-lg group-hover:rotate-12 transition-transform">🪙</div>
            <div>
              <div className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">Bank Balance</div>
              <div className="text-2xl font-black text-stone-900 leading-none">{state.coins}</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end">
             <div className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               {isSyncing && <span className="animate-spin text-[8px]">⚙️</span>}
               Prestige Level {state.level}
             </div>
             <div className="w-full h-4 bg-stone-200/50 rounded-full overflow-hidden p-1 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  style={{ width: `${(state.exp / LEVEL_UP_EXP) * 100}%` }}
                ></div>
             </div>
          </div>
        </div>
      </div>

      {/* Auth Control & Account ID */}
      <div className="fixed top-8 right-8 z-40">
        {currentUser ? (
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md p-2 pl-4 rounded-full shadow-lg border border-white">
            <div className="text-right">
               <div className="text-[10px] font-black text-stone-400 uppercase leading-none">ID: {currentUser.uid.substring(0, 8)}</div>
               <div className="text-xs font-bold text-stone-800">{currentUser.displayName || 'Explorer'}</div>
            </div>
            <button onClick={logout} className="group relative">
               <div className="w-10 h-10 rounded-full border-2 border-stone-100 flex items-center justify-center bg-stone-200 overflow-hidden">
                 {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} className="w-full h-full object-cover" alt="profile" />
                 ) : (
                    <span className="text-stone-400 font-black">👤</span>
                 )}
               </div>
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/40 rounded-full text-white text-[8px] font-black">LOGOUT</div>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-3 bg-stone-900 hover:bg-black text-white font-black px-6 py-3 rounded-full shadow-xl transition-all active:scale-95 border border-stone-800"
          >
            <span>REGISTER / LOGIN</span>
          </button>
        )}
      </div>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center gap-16 mt-24 mb-12 w-full max-w-7xl lg:flex-row">
        
        {/* Left: Communication Hub */}
        <div className="flex-1 flex flex-col items-center lg:items-end gap-8 order-2 lg:order-1">
          <div className="relative bg-white/90 p-8 rounded-[2.5rem] shadow-2xl border-4 border-stone-100 max-w-sm transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="absolute -bottom-4 right-12 w-8 h-8 bg-white border-r-4 border-b-4 border-stone-100 rotate-45"></div>
            <p className="text-xl font-bold text-stone-800 leading-tight italic">
              "{wisdom}"
            </p>
          </div>
          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="group flex flex-col items-center justify-center bg-stone-900 text-white px-10 py-6 rounded-[2.5rem] font-black shadow-2xl hover:bg-black hover:-translate-y-1 transition-all active:scale-95 text-lg uppercase tracking-widest min-w-[240px]"
          >
            <div className="flex items-center gap-4 mb-1">
              <span>SUBMIT UPDATES</span>
              <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full group-hover:scale-125 transition-transform">
                💡
              </div>
            </div>
            <span className="text-[10px] text-stone-400 font-medium tracking-[0.2em]">EVOLVE YOUR ROCK</span>
          </button>
        </div>

        {/* Center: The Rock */}
        <div className="flex-[2] flex flex-col items-center justify-center order-1 lg:order-2 px-4">
          <Rock 
            name={state.name} 
            equippedIds={state.equippedIds} 
            onClick={handleRockClick} 
          />
        </div>

        {/* Right: Boutique */}
        <div className="flex-1 order-3 w-full flex justify-center lg:justify-start">
          <Shop 
            coins={state.coins}
            unlockedIds={state.unlockedIds}
            equippedIds={state.equippedIds}
            onBuy={handleBuy}
            onEquip={handleEquip}
            onUnequip={handleUnequip}
          />
        </div>
      </main>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {isFeedbackOpen && (
        <FeedbackModal 
          onClose={() => setIsFeedbackOpen(false)} 
          onSubmit={handleFeedbackSubmit} 
        />
      )}

      {/* Particles Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute text-yellow-500 font-black text-4xl drop-shadow-lg animate-float-up-premium"
            style={{ left: p.x, top: p.y }}
          >
            +{p.value}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float-up-premium {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { transform: translateY(-20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
        }
        .animate-float-up-premium {
          animation: float-up-premium 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Footer Cleanup */}
      <footer className="mt-auto py-10 flex flex-col items-center gap-2">
        <div className="h-1 w-20 bg-stone-300 rounded-full mb-4"></div>
        <div className="text-stone-400 text-[0.7rem] font-black tracking-[0.4em] uppercase">
          Neural Rock OS v6.0
        </div>
        <div className="text-stone-300 text-[0.6rem] font-bold">
          EST. 2024 • THE JOURNEY CONTINUES
        </div>
      </footer>
    </div>
  );
};

// Internal Auth Modal Component
const AuthModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await registerWithEmail(email, pass, name);
      } else {
        await loginWithEmail(email, pass);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-800">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-3xl font-black text-stone-900 mb-6 text-center">{isRegister ? 'New Account' : 'Welcome Back'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input 
              required
              type="text" 
              placeholder="Your Name" 
              className="w-full bg-stone-100 rounded-2xl p-4 font-bold border-2 border-transparent focus:border-sky-400 outline-none transition-all text-stone-900"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <input 
            required
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-stone-100 rounded-2xl p-4 font-bold border-2 border-transparent focus:border-sky-400 outline-none transition-all text-stone-900"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            required
            type="password" 
            placeholder="Secret Password" 
            className="w-full bg-stone-100 rounded-2xl p-4 font-bold border-2 border-transparent focus:border-sky-400 outline-none transition-all text-stone-900"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs font-bold px-2">{error}</p>}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : (isRegister ? 'REGISTER' : 'LOGIN')}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-stone-400 text-xs font-bold hover:text-sky-500 transition-colors"
          >
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
