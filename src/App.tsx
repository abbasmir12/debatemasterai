import { useState, lazy, Suspense } from 'react';
import { AppView, DebateStyle, DebateAnalysis } from './types';
import Dashboard from './components/Dashboard';
import DebateLive from './components/DebateLive';
import SessionSummary from './components/SessionSummary';
import Settings from './components/Settings';
import Activity from './components/Activity';
import { saveSession } from './services/storageService';

// Lazy load PersonaShowcase for better performance
const PersonaShowcase = lazy(() => import('./components/PersonaShowcase'));

function App() {
  // Global state management
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [currentStyle, setCurrentStyle] = useState<DebateStyle>(DebateStyle.COACH);
  const [currentDuration, setCurrentDuration] = useState<number>(5);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [lastAnalysis, setLastAnalysis] = useState<DebateAnalysis | null>(null);
  const [profileImage, setProfileImage] = useState<string>(
    localStorage.getItem('debate_master_profile_image') || ''
  );
  const [userName, setUserName] = useState<string>(
    localStorage.getItem('debate_master_user_name') || 'User One'
  );
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  // API key validation - check localStorage first, then env
  const storedApiKey = localStorage.getItem('debate_master_api_key') || '';
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const apiKey = storedApiKey || envApiKey;
  const apiKeyMissing = !apiKey || apiKey === 'your_api_key_here';

  /**
   * Transition to Live Arena view
   * Requirement 12.1: Navigate to Live Arena when user starts debate
   */
  const startDebate = (topic: string, style: DebateStyle, duration: number) => {
    setCurrentTopic(topic);
    setCurrentStyle(style);
    setCurrentDuration(duration);
    setSessionStartTime(Date.now());
    setCurrentView(AppView.DEBATE_LIVE);
  };

  /**
   * Store analysis and show Summary view
   * Requirement 12.2: Navigate to Summary after analysis completes
   */
  const handleAnalysisComplete = (analysis: DebateAnalysis) => {
    // Calculate actual session duration
    const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    
    // Save session with analysis data
    saveSession(currentTopic, durationSeconds, analysis);
    
    setLastAnalysis(analysis);
    setCurrentView(AppView.SUMMARY);
  };

  /**
   * Reset state and return to Dashboard
   * Requirement 12.3: Navigate back to Dashboard from other views
   */
  const goBackToDashboard = () => {
    setCurrentView(AppView.DASHBOARD);
    setCurrentTopic('');
    setLastAnalysis(null);
  };

  /**
   * Navigate to Settings view
   */
  const goToSettings = () => {
    setCurrentView(AppView.SETTINGS);
  };

  /**
   * Navigate to Activity view
   * Requirement 1.1: Navigate to Activity when user clicks Activity button
   */
  const goToActivity = () => {
    setCurrentView(AppView.ACTIVITY);
  };

  /**
   * Navigate to Persona view
   * Requirement 1.1: Navigate to Persona when user clicks Persona button
   */
  const goToPersona = () => {
    setCurrentView(AppView.PERSONA);
  };

  /**
   * Handle profile image upload
   */
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        localStorage.setItem('debate_master_profile_image', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Error screen for missing API key
  if (apiKeyMissing) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-card border border-white/5 rounded-[2rem] p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            API Key Required
          </h1>
          
          <p className="text-slate-400 mb-6 text-lg">
            DebateMaster AI requires a Google Gemini API key to function.
          </p>
          
          <div className="bg-void/50 border border-white/10 rounded-xl p-6 text-left mb-6">
            <h2 className="text-white font-semibold mb-3">Quick Setup:</h2>
            <ol className="text-slate-300 space-y-3 list-decimal list-inside">
              <li>
                Get your API key from{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-400 hover:text-lime-500 underline"
                >
                  Google AI Studio
                </a>
              </li>
              <li>
                Click the button below to open Settings
              </li>
              <li>
                Paste your API key and save
              </li>
            </ol>
          </div>
          
          <button
            onClick={goToSettings}
            className="w-full px-6 py-4 bg-lime-400 text-void font-bold rounded-xl hover:bg-lime-500 transition shadow-lg shadow-lime-400/20 mb-6"
          >
            Open Settings
          </button>
          
          <p className="text-slate-500 text-sm">
            Your API key is stored locally and never sent to any server except Google's Gemini API.
          </p>
        </div>
      </div>
    );
  }

  /**
   * Get header title based on current view
   * Requirement 12.4: Header title matches current view
   */
  const getHeaderTitle = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return 'Statistics';
      case AppView.DEBATE_LIVE:
        return 'Live Session';
      case AppView.SUMMARY:
        return 'Analysis';
      case AppView.SETTINGS:
        return 'Settings';
      case AppView.ACTIVITY:
        return 'Activity';
      case AppView.PERSONA:
        return 'Persona';
      default:
        return 'DebateMaster AI';
    }
  };

  /**
   * Render appropriate view based on currentView state
   * Requirements: 12.1, 12.2, 12.3, 12.5, 13.4
   */
  return (
    <div className="min-h-screen bg-void flex">
      {/* Sidebar - Hidden during live debate for immersive experience */}
      {currentView !== AppView.DEBATE_LIVE && (
        <aside className="hidden md:flex w-64 bg-card flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3" style={{marginLeft: "28px"}}>
            <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-void"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">DebateAI</span>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center">
            <label htmlFor="profile-upload" className="cursor-pointer group">
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-lime-400/20 group-hover:border-lime-400/40 transition"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-lime-400 to-emerald-400 flex items-center justify-center border-4 border-lime-400/20 group-hover:border-lime-400/40 transition">
                    <svg
                      className="w-10 h-10 text-void"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </label>
            {isEditingName ? (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={() => {
                  setIsEditingName(false);
                  localStorage.setItem('debate_master_user_name', userName);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingName(false);
                    localStorage.setItem('debate_master_user_name', userName);
                  }
                }}
                autoFocus
                className="text-white font-semibold text-base mt-3 bg-transparent border-b-2 border-lime-400 outline-none text-center px-2"
              />
            ) : (
              <div className="text-white font-semibold text-base mt-3">{userName}</div>
            )}
            <button 
              onClick={() => setIsEditingName(true)}
              className="text-slate-400 text-xs mt-1 hover:text-lime-400 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Navigation - Requirement 12.1: Dashboard navigation button */}
        <nav className="flex-1 px-4">
          <button
            onClick={goBackToDashboard}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              currentView === AppView.DASHBOARD
                ? 'bg-lime-400 text-void'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={goToActivity}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition mt-2 ${
              currentView === AppView.ACTIVITY
                ? 'bg-lime-400 text-void'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="font-medium">Activity</span>
          </button>

          <button
            onClick={goToPersona}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition mt-2 ${
              currentView === AppView.PERSONA
                ? 'bg-lime-400 text-void'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Persona</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition mt-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">Schedule</span>
          </button>

          <button
            onClick={goToSettings}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition mt-2 ${
              currentView === AppView.SETTINGS
                ? 'bg-lime-400 text-void'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        {/* Dark Mode Toggle at Bottom */}
        <div className="p-4">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-slate-400 text-sm">Light</span>
            <button className="relative w-12 h-6 bg-lime-400 rounded-full transition">
              <div className="absolute right-1 top-1 w-4 h-4 bg-void rounded-full transition"></div>
            </button>
            <span className="text-white text-sm font-medium">Dark</span>
          </div>
        </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Hidden during live debate for immersive experience */}
        {currentView !== AppView.DEBATE_LIVE && (
          <header className="bg-card border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Header Title */}
            <h1 className="text-2xl font-bold text-white">{getHeaderTitle()}</h1>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Search - Hidden on mobile */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-void/50 border border-white/10 rounded-xl px-4 py-2 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition w-64"
                />
                <svg
                  className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Activity Button */}
              <button 
                onClick={goToActivity}
                className="bg-lime-400 text-void px-4 py-2 rounded-xl font-bold text-sm hover:bg-lime-500 transition flex items-center gap-2"
              >
                Activity
              </button>

              {/* Notifications */}
              <button className="w-10 h-10 rounded-xl border border-slate-700 flex items-center justify-center hover:border-slate-500 transition relative">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Dark Mode Toggle (visual only) */}
              <button className="w-10 h-10 rounded-xl border border-slate-700 flex items-center justify-center hover:border-slate-500 transition">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </button>
            </div>
          </div>
          </header>
        )}

        {/* View Content */}
        <main className={`flex-1 overflow-auto ${currentView === AppView.DEBATE_LIVE ? 'h-screen' : ''}`}>
          {currentView === AppView.DASHBOARD && (
            <div className="animate-fadeIn">
              <Dashboard onStartDebate={startDebate} onNavigateToPersona={goToPersona} />
            </div>
          )}

          {currentView === AppView.DEBATE_LIVE && (
            <div className="animate-fadeIn">
              <DebateLive
                topic={currentTopic}
                style={currentStyle}
                durationMinutes={currentDuration}
                onAnalysisComplete={handleAnalysisComplete}
                onBack={goBackToDashboard}
              />
            </div>
          )}

          {currentView === AppView.SUMMARY && lastAnalysis && (
            <div className="animate-fadeIn">
              <SessionSummary
                analysis={lastAnalysis}
                onBack={goBackToDashboard}
              />
            </div>
          )}

          {currentView === AppView.SETTINGS && (
            <div className="animate-fadeIn">
              <Settings onBack={goBackToDashboard} />
            </div>
          )}

          {currentView === AppView.ACTIVITY && (
            <div className="animate-fadeIn">
              <Activity onBack={goBackToDashboard} />
            </div>
          )}

          {currentView === AppView.PERSONA && (
            <div className="animate-fadeIn">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400"></div>
                  </div>
                }
              >
                <PersonaShowcase onBack={goBackToDashboard} />
              </Suspense>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
