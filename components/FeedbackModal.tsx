
import React, { useState } from 'react';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (idea: string) => Promise<boolean>;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit }) => {
  const [idea, setIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!idea.trim()) return;
    setIsSubmitting(true);
    const ok = await onSubmit(idea);
    if (ok) {
      setSuccess(true);
      setTimeout(onClose, 2000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {success ? (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-black text-stone-800">Idea Sent!</h2>
            <p className="text-stone-500">The Rock Oracle will consider it.</p>
          </div>
        ) : (
          <>
            <button onClick={onClose} className="absolute top-6 right-6 text-stone-300 hover:text-stone-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-3xl font-black text-stone-900 mb-2">Evolve the Rock</h2>
            <p className="text-stone-500 mb-6">What features should we add in 2027?</p>
            <textarea 
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example: Let us play football with the rock..."
              className="w-full h-32 bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 text-lg font-medium text-stone-900 focus:border-sky-400 outline-none transition-all resize-none mb-6 placeholder:text-stone-300"
            />
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !idea.trim()}
              className="w-full bg-stone-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Sending...' : 'SUBMIT IDEA 💡'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
