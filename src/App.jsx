import React, { useState } from 'react';
import InteractiveMap from './components/InteractiveMap';
import ViewPanel from './components/ViewPanel';
import AIChatbox from './components/AIChatbox';
import AuthFlow from './components/AuthFlow';

const App = () => {
  // STATE: Store current user object instead of just a boolean
  // Initialize by checking if an active session exists in localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem('ecosta_active_session');
    return savedSession ? JSON.parse(savedSession) : null;
  });
  
  // STATE: Map and ViewPanel interactions
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [stadium, setStadium] = useState('Rod Laver Arena (AUS)');
  
  // STATE: Account dropdown menu visibility
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // HANDLER: Toggle section selection on the map
  const handleSectionClick = (id) => {
    if (selectedSection === id) {
      setSelectedSection(null);
      setActiveRoute(null);
    } else {
      setSelectedSection(id);
      setActiveRoute(null); 
    }
  };

  // HANDLER: Triggered when AuthFlow successfully validates a user
  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    // Persist session to survive page refreshes
    localStorage.setItem('ecosta_active_session', JSON.stringify(userObj));
  };

  // HANDLER: User logout process
  const handleLogout = () => {
    setIsAccountOpen(false);
    setCurrentUser(null); 
    // Clear active session, but keep the users database intact
    localStorage.removeItem('ecosta_active_session');
    
    // Reset map states
    setSelectedSection(null);
    setActiveRoute(null);
  };

  // Render AuthFlow (Landing/Login) if no user is currently logged in
  if (!currentUser) {
    return <AuthFlow onLoginSuccess={handleLoginSuccess} />;
  }

  // Main Application Render (Protected Route)
  return (
    <div className="h-screen w-full flex flex-col font-sans bg-slate-950 text-slate-200 overflow-hidden relative animate-app-enter">
      
      {/* HEADER: Increased z-index to 40 to prevent dropdown from being clipped by ViewPanel (z-20) */}
      <header className="flex flex-shrink-0 items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shadow-md z-40">
        
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <span className="text-white text-xl">🏟️</span>
          </div>
          <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            ECOSTA
          </h1>
        </div>
        
        {/* Right Header Controls: Stadium Selector & Account Menu */}
        <div className="flex items-center gap-4">
          
          {/* Stadium Selector Dropdown */}
          <div className="relative group">
            <select 
              value={stadium}
              onChange={(e) => setStadium(e.target.value)}
              className="appearance-none text-sm font-bold text-slate-200 bg-slate-800 pl-5 pr-10 py-2 rounded-full border border-slate-700 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer transition-all shadow-inner"
            >
              <option>Rod Laver Arena (AUS)</option>
              <option>Arthur Ashe Stadium (USA)</option>
              <option>Centre Court (UK)</option>
              <option>Court Philippe-Chatrier (FRA)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-cyan-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* Account Avatar & Dropdown Menu */}
          <div className="relative">
            {/* Avatar Button: Displays the first letter of user's name dynamically */}
            <button 
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="w-10 h-10 rounded-full bg-cyan-900 border-2 border-slate-700 hover:border-cyan-400 flex items-center justify-center overflow-hidden transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-inner"
            >
              <span className="text-cyan-100 font-bold text-lg uppercase">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </span>
            </button>

            {/* Dropdown Content */}
            {isAccountOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in origin-top-right z-50">
                {/* Dynamically display registered user information */}
                <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/50">
                  <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-xs text-cyan-400 truncate">{currentUser.email}</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Area: Interactive Map */}
        <div className="w-full md:w-2/3 h-1/2 md:h-full p-4 md:p-6 bg-slate-950 flex flex-shrink-0 items-center justify-center relative">
          <div className="absolute inset-4 bg-slate-900/50 rounded-2xl blur-xl -z-10"></div>
           <InteractiveMap 
             onSectionClick={handleSectionClick} 
             activeRoute={activeRoute} 
             selectedSection={selectedSection} 
           />
        </div>

        {/* Right Area: Information Panel */}
        <div className="w-full md:w-1/3 h-1/2 md:h-full flex-shrink-0 bg-slate-900 border-l border-slate-800 shadow-2xl z-20">
           <ViewPanel 
             sectionId={selectedSection} 
             onShowRoute={() => setActiveRoute(selectedSection)} 
             onClose={() => { setSelectedSection(null); setActiveRoute(null); }}
             onImageClick={setModalImage}
           />
        </div>
      </div>

      {/* FLOATING AI CHATBOX (Bottom Right) */}
      <AIChatbox onRecommendSeat={handleSectionClick} />

      {/* FULL SCREEN IMAGE MODAL */}
      {modalImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-fade-in custom-scrollbar overflow-auto">
          <button onClick={() => setModalImage(null)} className="absolute top-6 right-6 p-3 bg-slate-800/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-all hover:rotate-90 hover:scale-110">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-[90%] p-2 bg-slate-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-700 transform scale-100 transition-transform flex items-center justify-center">
            <img src={modalImage} alt="Full screen seat view" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      {/* GLOBAL KEYFRAME ANIMATIONS */}
      <style>{`
        @keyframes fade-in { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        
        @keyframes app-enter { 
          from { opacity: 0; transform: scale(0.95); filter: blur(4px); } 
          to { opacity: 1; transform: scale(1); filter: blur(0); } 
        }
        .animate-app-enter { animation: app-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;