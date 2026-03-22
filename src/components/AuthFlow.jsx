import React, { useState } from 'react';

const AuthFlow = ({ onLoginSuccess }) => {
  // VIEW STATE: 'landing', 'signin', 'signup'
  const [view, setView] = useState('landing');
  
  // FORM INPUT STATES
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // VALIDATION CHECKBOX STATES
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  
  // ANIMATION STATE
  const [isExiting, setIsExiting] = useState(false);

  // HANDLE FORM SUBMISSION (Simulating a real Database with localStorage)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Check validation boxes
    if (view === 'signin' && !isNotRobot) {
      alert("Please verify that you are not a robot! 🤖");
      return;
    }
    if (view === 'signup' && !isAgreed) {
      alert("You must agree to the Terms and Conditions! 📜");
      return;
    }

    // 2. Fetch existing users from local DB (or create empty array if none exist)
    const usersDB = JSON.parse(localStorage.getItem('ecosta_users_db')) || [];

    let loggedInUser = null;

    // 3. LOGIC FOR SIGN UP
    if (view === 'signup') {
      // Check if email already exists
      const emailExists = usersDB.find(u => u.email === email);
      if (emailExists) {
        alert("This email is already registered! Please sign in.");
        return;
      }
      
      // Create new user record and save to DB
      loggedInUser = { name, email, password };
      usersDB.push(loggedInUser);
      localStorage.setItem('ecosta_users_db', JSON.stringify(usersDB));
    } 
    
    // 4. LOGIC FOR SIGN IN
    else if (view === 'signin') {
      // Find user that matches both email and password
      const validUser = usersDB.find(u => u.email === email && u.password === password);
      if (!validUser) {
        alert("Invalid email or password! Please try again.");
        return;
      }
      loggedInUser = validUser;
    }

    // 5. SUCCESS: Trigger exit animation and pass user data to App.jsx
    setIsExiting(true);
    setTimeout(() => {
      onLoginSuccess(loggedInUser);
    }, 600);
  };

  // RENDER: LANDING PAGE
  if (view === 'landing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-200 font-sans relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="z-10 flex flex-col items-center animate-fade-in-up text-center">
          <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.4)]">
            <span className="text-white text-4xl">🏟️</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            ECOSTA
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-lg mb-12 font-medium">
            The next-generation platform for stadium ticketing and immersive 3D seat exploration.
          </p>
          <button 
            onClick={() => setView('signin')}
            className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-lg tracking-wide transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(8,145,178,0.5)]"
          >
            GET STARTED
          </button>
        </div>
        
        <style>{`
          @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
      </div>
    );
  }

  // RENDER: AUTHENTICATION FORMS (Sign In / Sign Up)
  return (
    <div className={`flex items-center justify-center min-h-screen bg-slate-950 text-slate-200 font-sans relative transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 scale-110 blur-sm pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl z-10 animate-fade-in">
        
        {/* Form Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2">{view === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-400 text-sm">{view === 'signin' ? 'Enter your details to access ECOSTA.' : 'Join ECOSTA to explore stadium seats.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name Field (Sign Up Only) */}
          {view === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" 
                placeholder="John Doe" 
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" 
              placeholder="homie@example.com" 
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              autoComplete={view === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" 
              placeholder="••••••••" 
            />
          </div>

          {/* Fake reCAPTCHA (Sign In Only) */}
          {view === 'signin' && (
            <div className="flex items-center justify-between bg-slate-950 border border-slate-700 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="robot" checked={isNotRobot} onChange={(e) => setIsNotRobot(e.target.checked)} className="w-6 h-6 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 bg-slate-800 cursor-pointer" />
                <label htmlFor="robot" className="text-sm font-medium text-slate-300 cursor-pointer">I'm not a robot</label>
              </div>
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <span className="text-[9px] text-slate-500 mt-0.5">reCAPTCHA</span>
              </div>
            </div>
          )}

          {/* Terms Checkbox (Sign Up Only) */}
          {view === 'signup' && (
            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" id="terms" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 bg-slate-800 cursor-pointer mt-0.5" />
              <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer leading-tight">
                I agree to all <span className="text-cyan-400 hover:underline">Terms and Conditions</span> and the <span className="text-cyan-400 hover:underline">Privacy Policy</span>.
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg mt-2 relative overflow-hidden group">
            <span className="relative z-10">{view === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>

        {/* Form Toggle (Sign In <-> Sign Up) */}
        <div className="mt-6 text-center text-sm text-slate-400">
          {view === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { 
              setView(view === 'signin' ? 'signup' : 'signin'); 
              // Reset checkboxes when switching views
              setIsNotRobot(false); 
              setIsAgreed(false); 
              // Clear passwords
              setPassword('');
            }} 
            className="text-cyan-400 font-bold hover:underline transition-all"
          >
            {view === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AuthFlow;