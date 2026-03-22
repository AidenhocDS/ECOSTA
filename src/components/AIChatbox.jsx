import React, { useState, useRef, useEffect } from 'react';

// =========================================
// AI RECOMMENDATION LOGIC ENGINE
// =========================================
const getRecommendation = (prefs) => {
  const { budget, tier, view } = prefs;
  
  // 1. PREMIUM BUDGET (> $1000 AUD) -> Strictly VIP Sections
  if (budget === 'high') {
    if (view === 'Courtside VIP') {
      return { id: 'sec-17', name: 'VIP Section 17', msg: 'Ultimate Courtside VIP! You are literally steps away from the players. Best seats in the house.' };
    }
    return { id: 'sec-10', name: 'VIP Section 10', msg: 'Premium Baseline VIP! The perfect angle to watch the tactical rallies unfold right in front of you.' };
  }
  
  // 2. LOW BUDGET (< $500 AUD) -> Strictly Sidecourt & Corner (Mix of Lower/Higher)
  if (budget === 'low') {
    if (view === 'Lower Corner') {
      return { id: 'sec-6', name: 'Lower Section 6', msg: 'Great value! You get lower-tier proximity at a corner angle without breaking the bank.' };
    }
    if (view === 'Higher Sidecourt') {
      return { id: 'sec-50', name: 'Higher Section 50', msg: 'Best of both worlds: highly affordable with a sweeping panoramic view of the sidecourt.' };
    }
    return { id: 'sec-30', name: 'Higher Section 30', msg: 'Super affordable corner view! You can soak in the whole stadium atmosphere from here.' };
  }
  
  // 3. MEDIUM BUDGET ($500 - $1000 AUD) -> Dynamic Filtering (Lower vs Higher)
  if (budget === 'mid') {
    if (tier === 'Lower Section') {
       if (view === 'Sidecourt') return { id: 'sec-14', name: 'Lower Section 14', msg: 'Fantastic choice! Lower sidecourt gives you a TV-broadcast perspective right in the action.' };
       return { id: 'sec-12', name: 'Lower Section 12', msg: 'Lower Corner offers a dynamic angle of the court and a great feel for the ball speed!' };
    } else {
       if (view === 'Sidecourt') return { id: 'sec-47', name: 'Higher Section 47', msg: 'Higher Sidecourt gives you the perfect eagle-eye tactical view for a reasonable price.' };
       return { id: 'sec-42', name: 'Higher Section 42', msg: 'Higher Corner is excellent for seeing the overall court geometry and player positioning.' };
    }
  }
  
  // Fallback
  return { id: 'sec-101', name: 'General Section', msg: 'Here is a great section that balances proximity and viewing angle!' };
};

const AIChatbox = ({ onRecommendSeat }) => {
  // UI & Chat States
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi homie! 👋 I am CourtSight AI. What kind of budget are you working with today?' }
  ]);
  const [step, setStep] = useState(0); 
  const [preferences, setPreferences] = useState({ budget: null, tier: null, view: null });
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle User Choices & AI Responses
  const handleOptionClick = (type, value) => {
    const newPrefs = { ...preferences, [type]: value };
    setPreferences(newPrefs);

    // Format user message for display
    let userMsg = value; 
    if (type === 'budget') {
      userMsg = value === 'low' ? '< AU$500' : value === 'mid' ? 'AU$500 - $1000' : '> AU$1000';
    }
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);

    // AI Response Delay Simulation (800ms)
    setTimeout(() => {
      // STEP 0 -> STEP 1: Process Budget
      if (step === 0) {
        if (value === 'high') {
          setMessages(prev => [...prev, { sender: 'ai', text: 'Premium choice! ✨ Since you are looking at VIP, do you prefer a Courtside side view or a Baseline view?' }]);
          setStep(1);
        } else if (value === 'mid') {
          setMessages(prev => [...prev, { sender: 'ai', text: 'Solid budget! 🎟️ Do you prefer being closer to the action (Lower Section) or having a broad overview (Higher Section)?' }]);
          setStep(1);
        } else {
          setMessages(prev => [...prev, { sender: 'ai', text: 'Smart choice! 💡 For under AU$500, we have great spots in the corners and upper tiers. Which angle fits your vibe?' }]);
          setStep(1);
        }
      }
      
      // STEP 1 -> STEP 2 (or Final): Process Tier / View
      else if (step === 1) {
        if (newPrefs.budget === 'mid') {
           // Mid budget requires an extra step to choose the specific angle after choosing Lower/Higher
           setMessages(prev => [...prev, { sender: 'ai', text: `${value} it is! Now, do you prefer a Sidecourt angle or a Corner/Baseline angle?` }]);
           setStep(2);
        } else {
           // High/Low budgets can jump straight to recommendation
           const rec = getRecommendation(newPrefs);
           setMessages(prev => [...prev,
             { sender: 'ai', text: rec.msg },
             { sender: 'ai', text: `Click here to view ${rec.name}`, isLink: true, sectionId: rec.id }
           ]);
           setStep(3); // End of flow
        }
      }
      
      // STEP 2 -> Final: Process View for Mid Budget
      else if (step === 2) {
         const rec = getRecommendation(newPrefs);
         setMessages(prev => [...prev,
           { sender: 'ai', text: rec.msg },
           { sender: 'ai', text: `Click here to view ${rec.name}`, isLink: true, sectionId: rec.id }
         ]);
         setStep(3); // End of flow
      }
    }, 800);
  };

  // Reset Chat Flow
  const resetChat = () => {
    setMessages([{ sender: 'ai', text: 'Hi again! 👋 Ready to find another perfect seat?' }]);
    setStep(0);
    setPreferences({ budget: null, tier: null, view: null });
  };

  return (
    // Fixed container at the bottom right corner
    <div className="absolute bottom-6 right-6 z-[60] flex flex-col items-end font-sans">
      
      {/* FLOATING ACTION BUTTON (Closed State) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-slate-900/80 backdrop-blur-sm border border-cyan-500 rounded-full text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-lg">🤖</span>
          <span className="font-bold tracking-wide text-sm">AI CHAT</span>
        </button>
      )}

      {/* CHAT WINDOW (Open State) */}
      {isOpen && (
        <div className="w-80 h-[420px] mb-3 bg-slate-900/70 border border-slate-600 rounded-2xl shadow-2xl backdrop-blur-lg flex flex-col overflow-hidden animate-fade-in-up origin-bottom-right">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-600/50 bg-slate-800/80 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <h3 className="text-base font-bold text-slate-100 tracking-wider">Seat Finder AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.isLink ? (
                  // Recommendation Button Link
                  <button onClick={() => onRecommendSeat(msg.sectionId)} className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-2 rounded-xl font-bold tracking-wide shadow-lg transition-all active:scale-95 animate-pulse-fast">
                    {msg.text}
                  </button>
                ) : (
                  // Standard Message Bubble
                  <div className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-2xl rounded-br-sm' : 'bg-slate-800/80 text-slate-200 rounded-2xl rounded-bl-sm border border-slate-600/50'}`}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* OPTIONS MENU (Footer) */}
          <div className="p-4 border-t border-slate-600/50 bg-slate-800/80 space-y-2.5">
            
            {/* Step 0: Budget Selection */}
            {step === 0 && (
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => handleOptionClick('budget', 'low')} className="opt-btn-sm">&lt; AU$500</button>
                <button onClick={() => handleOptionClick('budget', 'mid')} className="opt-btn-sm">AU$500 - $1000</button>
                <button onClick={() => handleOptionClick('budget', 'high')} className="opt-btn-sm">&gt; AU$1000</button>
              </div>
            )}
            
            {/* Step 1: Tier or View based on Budget */}
            {step === 1 && preferences.budget === 'high' && (
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => handleOptionClick('view', 'Courtside VIP')} className="opt-btn-sm">Courtside VIP</button>
                <button onClick={() => handleOptionClick('view', 'Baseline VIP')} className="opt-btn-sm">Baseline VIP</button>
              </div>
            )}
            {step === 1 && preferences.budget === 'mid' && (
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => handleOptionClick('tier', 'Lower Section')} className="opt-btn-sm">Lower Section</button>
                <button onClick={() => handleOptionClick('tier', 'Higher Section')} className="opt-btn-sm">Higher Section</button>
              </div>
            )}
            {step === 1 && preferences.budget === 'low' && (
              <div className="grid grid-cols-1 gap-1.5">
                <button onClick={() => handleOptionClick('view', 'Lower Corner')} className="opt-btn-sm">Lower Corner</button>
                <button onClick={() => handleOptionClick('view', 'Higher Sidecourt')} className="opt-btn-sm">Higher Sidecourt</button>
                <button onClick={() => handleOptionClick('view', 'Higher Corner')} className="opt-btn-sm">Higher Corner</button>
              </div>
            )}

            {/* Step 2: Final View adjustment for Medium Budget */}
            {step === 2 && preferences.budget === 'mid' && (
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => handleOptionClick('view', 'Sidecourt')} className="opt-btn-sm">Sidecourt</button>
                <button onClick={() => handleOptionClick('view', 'Corner/Baseline')} className="opt-btn-sm">Corner / Baseline</button>
              </div>
            )}

            {/* Step 3: Restart Chat */}
            {step === 3 && (
              <button onClick={resetChat} className="w-full text-center text-[11px] text-slate-400 hover:text-cyan-400 p-1 font-medium transition-colors">Start over</button>
            )}

          </div>
        </div>
      )}

      {/* INLINE CSS */}
      <style>{`
        @keyframes fade-in-up { 
          from { opacity: 0; transform: translateY(15px) scale(0.95); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        .animate-fade-in-up { animation: fade-in-up 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .opt-btn-sm { @apply bg-slate-900/60 hover:bg-cyan-900/80 border border-slate-500 hover:border-cyan-400 text-slate-200 text-[10px] font-bold py-2 rounded-lg transition-all active:scale-95 shadow-inner; }
      `}</style>
    </div>
  );
};

export default AIChatbox;