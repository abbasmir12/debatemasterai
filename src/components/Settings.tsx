/**
 * Settings component - Allows users to configure API key and model selection
 */

import { useState, useEffect } from 'react';

/**
 * Props for Settings component
 */
interface SettingsProps {
  onBack: () => void;
}

/**
 * Model configuration interface
 */
interface ModelConfig {
  id: string;
  name: string;
  description: string;
  supportsLiveAPI: boolean;
  category: 'latest' | 'stable' | 'experimental';
}

/**
 * Available Gemini models
 */
const AVAILABLE_MODELS: ModelConfig[] = [
  // Models with Live API support (for real-time debate)
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash (Experimental)',
    description: 'Latest experimental version with Live API support. Fast and efficient for real-time conversations.',
    supportsLiveAPI: true,
    category: 'experimental',
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Stable version with Live API support. Recommended for production use.',
    supportsLiveAPI: true,
    category: 'stable',
  },
  // Models for analysis only (no Live API)
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro (Preview)',
    description: 'Most advanced model for analysis. Best for detailed feedback and insights.',
    supportsLiveAPI: false,
    category: 'latest',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Advanced thinking model for complex analysis and reasoning.',
    supportsLiveAPI: false,
    category: 'stable',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Fast and intelligent model for quick analysis.',
    supportsLiveAPI: false,
    category: 'stable',
  },
];

/**
 * Settings component
 */
export default function Settings({ onBack }: SettingsProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [liveModel, setLiveModel] = useState<string>('gemini-2.0-flash-exp');
  const [analysisModel, setAnalysisModel] = useState<string>('gemini-2.5-flash');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load settings on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('debate_master_api_key') || '';
    const savedLiveModel = localStorage.getItem('debate_master_live_model') || 'gemini-2.0-flash-exp';
    const savedAnalysisModel = localStorage.getItem('debate_master_analysis_model') || 'gemini-2.5-flash';

    setApiKey(savedApiKey);
    setLiveModel(savedLiveModel);
    setAnalysisModel(savedAnalysisModel);
  }, []);

  // Handle save settings
  const handleSave = () => {
    setSaveStatus('saving');

    // Save to localStorage
    localStorage.setItem('debate_master_api_key', apiKey);
    localStorage.setItem('debate_master_live_model', liveModel);
    localStorage.setItem('debate_master_analysis_model', analysisModel);

    // Show saved status
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  // Get models by category
  const liveModels = AVAILABLE_MODELS.filter(m => m.supportsLiveAPI);
  const analysisModels = AVAILABLE_MODELS;

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 scrollbar-thin">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Configure your API key and model preferences</p>
        </div>

        {/* API Key Section */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8 mb-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 bg-lime-400/10 border border-lime-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-2">API Key</h2>
              <p className="text-slate-400 text-sm">
                Your Gemini API key is required to use the debate features. Get your key from{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-400 hover:text-lime-500 underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition font-mono text-sm"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
            >
              {showApiKey ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-4 p-4 bg-void/30 border border-white/5 rounded-xl">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-400 text-sm">
                Your API key is stored locally in your browser and is never sent to any server except Google's Gemini API.
              </p>
            </div>
          </div>
        </div>

        {/* Live Debate Model Section */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8 mb-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-400/10 border border-indigo-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-2">Live Debate Model</h2>
              <p className="text-slate-400 text-sm">
                Select the model for real-time voice debates. Only models with Live API support are available.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {liveModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setLiveModel(model.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition ${
                  liveModel === model.id
                    ? 'bg-indigo-500/10 border-indigo-500'
                    : 'bg-void/30 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{model.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        model.category === 'experimental' ? 'bg-amber-400/20 text-amber-400' :
                        model.category === 'latest' ? 'bg-lime-400/20 text-lime-400' :
                        'bg-emerald-400/20 text-emerald-400'
                      }`}>
                        {model.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{model.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    liveModel === model.id
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-slate-600'
                  }`}>
                    {liveModel === model.id && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Model Section */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8 mb-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-400/10 border border-emerald-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-2">Analysis Model</h2>
              <p className="text-slate-400 text-sm">
                Select the model for post-debate analysis and feedback generation.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {analysisModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setAnalysisModel(model.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition ${
                  analysisModel === model.id
                    ? 'bg-emerald-500/10 border-emerald-500'
                    : 'bg-void/30 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{model.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        model.category === 'experimental' ? 'bg-amber-400/20 text-amber-400' :
                        model.category === 'latest' ? 'bg-lime-400/20 text-lime-400' :
                        'bg-emerald-400/20 text-emerald-400'
                      }`}>
                        {model.category}
                      </span>
                      {!model.supportsLiveAPI && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600/20 text-slate-400">
                          Analysis only
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{model.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    analysisModel === model.id
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-slate-600'
                  }`}>
                    {analysisModel === model.id && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-void border border-white/10 text-white font-bold rounded-xl hover:border-white/30 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || saveStatus === 'saving'}
            className={`px-8 py-3 font-bold rounded-xl transition ${
              !apiKey.trim() || saveStatus === 'saving'
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : saveStatus === 'saved'
                ? 'bg-emerald-500 text-white'
                : 'bg-lime-400 text-void hover:bg-lime-500'
            }`}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
