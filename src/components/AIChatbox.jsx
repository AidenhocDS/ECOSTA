import React, { useState, useRef, useEffect } from 'react';
import { processChatInput } from '../utils/nlpEngine';

const AIChatbox = ({ onRecommendSeat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: "Hello! What kind of tickets are you looking for? (e.g., 'I want cheap tickets with a full view' or 'Find me VIP seats close to the action')" 
    }
  ]);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Handle when user sends message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    
    // 1. Add user's message to UI
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    // 2. Call AI Engine to process (Create typing delay effect 600ms for naturalness)
    setTimeout(() => {
      const aiResponse = processChatInput(userText);
      
      const newAiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: aiResponse.reply,
        image: aiResponse.image,
        sectionName: aiResponse.sectionName,
        sectionId: aiResponse.sectionId
      };
      
      setMessages(prev => [...prev, newAiMsg]);
      
      // 3. Send signal to App.jsx so the map automatically focuses on that Section
      if (aiResponse.sectionId && onRecommendSeat) {
        onRecommendSeat(aiResponse.sectionId);
      }
      
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* CHAT FRAME */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <h3 className="text-white font-bold text-sm">ECOSTA Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-slate-900/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm shadow-md ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
                  {msg.text}
                </div>
                
                {/* If AI returns with image of Section */}
                {msg.image && (
                  <div 
                    onClick={() => {
                      if (msg.sectionId && onRecommendSeat) {
                        onRecommendSeat(msg.sectionId);
                      }
                    }}
                    className="mt-2 relative group overflow-hidden rounded-xl border border-slate-700 shadow-lg cursor-pointer active:scale-95 transition-all"
                  >
                    <img src={msg.image} alt="View" className="w-48 h-32 object-cover transition-transform duration-500 group-hover:scale-110" 
                         onError={(e) => { e.target.src = 'https://placehold.co/400x300/1e293b/38bdf8?text=View+Not+Available' }} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 to-transparent p-2">
                      <p className="text-xs font-bold text-white shadow-black drop-shadow-md">{msg.sectionName}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your request here..." 
              className="flex-1 bg-slate-900 text-sm text-white px-4 py-2 rounded-full border border-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-500"
            />
            <button type="submit" disabled={!inputValue.trim()} className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cyan-500/20">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </div>
      )}

      {/* OPEN CHATBOX BUTTON */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all animate-bounce"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};

export default AIChatbox;