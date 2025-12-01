/**
 * DebateLive Component
 * 
 * The active debate interface where real-time voice interaction occurs.
 * Manages connection to Gemini Live API, displays transcriptions,
 * shows audio visualization, and handles session timing.
 * 
 * Requirements: 3.1, 3.2, 4.1, 5.1, 7.1
 */

import { useState, useRef, useEffect } from 'react';
import { GeminiLiveService } from '../services/geminiLiveService';
import { type ChatMessage, type DebateAnalysis, DebateStyle } from '../types';
import VoiceVisualizerSimple from './VoiceVisualizerSimple';
import TranscriptDisplay from './TranscriptDisplay';

// Global singleton to prevent multiple connections across all instances
let globalConnectionLock = false;
let globalService: GeminiLiveService | null = null;

/**
 * Props for DebateLive component
 */
interface DebateLiveProps {
  topic: string;
  style: DebateStyle;
  durationMinutes: number;
  onAnalysisComplete: (analysis: DebateAnalysis) => void;
  onBack: () => void;
}

/**
 * DebateLive Component
 * 
 * Handles the live debate session with real-time audio streaming,
 * transcription display, and session management.
 */
export default function DebateLive({
  topic,
  style,
  durationMinutes,
  onAnalysisComplete, // Will be used in task 21
  onBack,
}: DebateLiveProps) {
  // Component state (Requirement 3.1, 3.2, 4.1, 5.1, 7.1)
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [outputAnalyser, setOutputAnalyser] = useState<AnalyserNode | null>(null);
  
  // Transcript state
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'model' | null>(null);
  const fullTranscriptRef = useRef<string>("");

  // Refs for service and messages array
  const serviceRef = useRef<GeminiLiveService | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const hasConnectedRef = useRef<boolean>(false);

  // Keep messages ref in sync with state for closure access
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /**
   * Format time in MM:SS format
   * Requirement 7.3: Timer format follows MM:SS pattern
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Handle session stop - disconnect and trigger analysis
   * Requirements 7.4, 8.1, 8.2, 8.3, 8.4, 8.5
   */
  const handleStop = async () => {
    console.log('🛑 Stopping debate session...');
    
    // Clear timer interval (Requirement 8.2)
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Store service reference before disconnecting
    const currentService = serviceRef.current;
    const currentMessages = messagesRef.current;

    // Disconnect service FIRST (Requirements 8.2, 8.3, 8.4)
    if (currentService) {
      await currentService.disconnect();
    }
    
    // Clear global locks
    globalConnectionLock = false;
    globalService = null;

    // Trigger analysis generation AFTER disconnection (Requirement 8.5)
    if (currentService && currentMessages.length > 0) {
      try {
        setIsAnalyzing(true);
        const analysis = await currentService.analyzeDebate(currentMessages, topic);
        
        // Check if analysis is null (no participation detected) - AC2, AC5
        if (analysis === null) {
          setIsAnalyzing(false);
          // Don't save to history (AC5) - just show error and return
          setErrorMsg('No participation detected. We didn\'t hear you speak during this session. Please check your microphone and try again.');
          
          // Auto-return to dashboard after 5 seconds
          setTimeout(() => {
            onBack();
          }, 5000);
          return;
        }
        
        onAnalysisComplete(analysis);
      } catch (error) {
        console.error('Failed to generate analysis:', error);
        setIsAnalyzing(false);
        setErrorMsg('Failed to generate analysis. Please try again.');
        setTimeout(() => {
          onBack();
        }, 3000);
      }
    } else {
      // No messages to analyze, just go back
      onBack();
    }
  };

  // Initialize GeminiLiveService and connect on mount (Requirements 3.1, 3.2, 3.3, 11.1, 11.2)
  useEffect(() => {
    // GLOBAL singleton check - absolutely prevent double connections
    if (globalConnectionLock || globalService) {
      console.log('🚫 BLOCKED: Another connection is already active globally');
      return;
    }
    
    // Prevent double connection in React Strict Mode or multiple renders
    if (hasConnectedRef.current || serviceRef.current) {
      console.log('⚠️ Connection already initiated, skipping...');
      return;
    }
    
    // Lock globally
    globalConnectionLock = true;
    hasConnectedRef.current = true;

    // Get API key from localStorage (Settings) first, then fallback to env
    const storedApiKey = localStorage.getItem('debate_master_api_key') || '';
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const apiKey = storedApiKey || envApiKey;

    if (!apiKey || apiKey === 'your_api_key_here') {
      setErrorMsg('API key not configured. Please go to Settings to add your Gemini API key.');
      return;
    }

    // Initialize GeminiLiveService with callbacks
    const service = new GeminiLiveService(
      apiKey,
      // onTranscript callback - update messages state AND transcript display
      (text: string, isUser: boolean, isFinal: boolean) => {
        const role = isUser ? 'user' : 'model';
        
        // Update messages for analysis
        setMessages((prevMessages) => {
          const currentMessages = [...prevMessages];

          const lastMessageIndex = currentMessages.findIndex(
            (msg, idx) =>
              msg.role === role &&
              !msg.isFinal &&
              idx === currentMessages.length - 1
          );

          if (lastMessageIndex !== -1 && !isFinal) {
            const existingMessage = currentMessages[lastMessageIndex];
            if (existingMessage) {
              currentMessages[lastMessageIndex] = {
                ...existingMessage,
                text,
                isFinal,
              };
            }
          } else {
            const newMessage: ChatMessage = {
              id: `${Date.now()}-${Math.random()}`,
              role,
              text,
              timestamp: Date.now(),
              isFinal,
            };
            currentMessages.push(newMessage);
          }

          return currentMessages;
        });

        // Update transcript display (Lumina-style)
        setCurrentSpeaker(prev => {
          if (prev !== role) {
            fullTranscriptRef.current = "";
            setTranscriptLines([]);
            return role;
          }
          return prev;
        });

        fullTranscriptRef.current += text;

        // Variable length word wrapping
        const LINE_LIMITS = [45, 30, 15];
        const words = fullTranscriptRef.current.split(' ');
        const allLines: string[] = [];
        let currentLine = "";
        let currentLineIndex = 0;

        words.forEach(word => {
          const limitIndex = currentLineIndex % 3;
          const currentLimit = LINE_LIMITS[limitIndex] ?? 15;

          if ((currentLine + word).length > currentLimit) {
            allLines.push(currentLine.trim());
            currentLine = word + " ";
            currentLineIndex++;
          } else {
            currentLine += word + " ";
          }
        });
        if (currentLine.trim()) {
          allLines.push(currentLine.trim());
        }

        const totalLines = allLines.length;
        const currentCycle = Math.floor((totalLines - 1) / 3);
        const startIndex = currentCycle * 3;
        const visibleLines = allLines.slice(startIndex, startIndex + 3);

        setTranscriptLines(visibleLines);
      },
      // onStatusChange callback - update connection indicator (Requirement 3.3)
      (isConnected: boolean) => {
        setIsConnected(isConnected);
      },
      // onAudioLevel callback - not used in new UI
      (_level: number) => {
        // Audio level not displayed in immersive UI
      },
      // onError callback - display error messages (Requirement 11.2, 11.3)
      (error: Error) => {
        console.error('Gemini Live Service Error:', error);
        setErrorMsg(error.message);
      }
    );

    serviceRef.current = service;
    globalService = service; // Store globally

    // Connect to Gemini Live API (Requirement 3.2)
    const initConnection = async () => {
      try {
        await service.connect(topic, style);

        // Get output analyser for visualization
        const analyser = service.getOutputAnalyser();
        console.log('📊 Got analyser from service:', analyser);
        setOutputAnalyser(analyser);

        // Add system message to indicate session start
        setMessages([{
          id: `system-${Date.now()}`,
          role: 'system',
          text: `Debate session started: ${topic}`,
          timestamp: Date.now(),
          isFinal: true,
        }]);
      } catch (error) {
        console.error('Failed to connect:', error);
        setErrorMsg(
          error instanceof Error
            ? error.message
            : 'Failed to connect to Gemini Live API'
        );
      }
    };

    void initConnection();

    // Cleanup on unmount (Requirement 8.2, 8.3, 8.4)
    return () => {
      console.log('🧹 Cleaning up DebateLive component...');
      
      // Clear timer interval
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      // Disconnect service
      if (serviceRef.current) {
        void serviceRef.current.disconnect();
        serviceRef.current = null;
      }
      
      // Reset ALL locks
      globalConnectionLock = false;
      globalService = null;
      hasConnectedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  /**
   * Timer effect - increment elapsed seconds and auto-stop when duration reached
   * Requirements 7.1, 7.2, 7.3, 7.4
   */
  useEffect(() => {
    // Only start timer when connected
    if (!isConnected) {
      return;
    }

    // Set up interval timer (Requirement 7.1)
    timerIntervalRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const newElapsed = prev + 1;

        // Check if duration reached (Requirement 7.4)
        const durationSeconds = durationMinutes * 60;
        if (newElapsed >= durationSeconds) {
          // Auto-stop session
          void handleStop();
        }

        return newElapsed;
      });
    }, 1000); // Increment every second (Requirement 7.2)

    // Clear interval on cleanup
    return () => {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isConnected, durationMinutes]); // Re-run if connection state or duration changes



  // Calculate remaining time for display (Requirement 7.3)
  const remainingSeconds = Math.max(0, durationMinutes * 60 - elapsedSeconds);

  // Calculate remaining time for display (Requirement 7.3)

  // Loading screen for analysis generation (Requirements 15.1, 15.2, 15.3, 15.4)
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-void text-white">
        {/* Spinning icon (Requirement 15.2) */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-lime-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        {/* "Generating Report" message (Requirement 15.3) */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Generating Report
        </h2>

        {/* Descriptive subtitle (Requirement 15.4) */}
        <p className="text-slate-400 text-center max-w-md">
          Analyzing your debate performance and preparing detailed feedback...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-purple-500/30">
      
      {/* Voice Visualizer - Full screen background */}
      <VoiceVisualizerSimple
        analyser={outputAnalyser}
        isActive={isConnected}
      />

      {/* Hero Text - Fades out when connected */}
      <div 
        className={`absolute top-1/4 text-center z-10 transition-all duration-1000 pointer-events-none ${
          isConnected ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'
        }`}
      >
        <h1 className="text-5xl md:text-8xl font-thin text-white tracking-wider mix-blend-screen" style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
          DEBATE
        </h1>
        <p className="mt-4 text-lime-400/60 text-sm md:text-lg uppercase tracking-[0.5em] font-light">
          {topic}
        </p>
      </div>

      {/* Timer - Centered in orb */}
      {isConnected && (
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none">
          <p className="text-4xl md:text-5xl font-mono font-bold text-white/90 tracking-wider" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            {formatTime(remainingSeconds)}
          </p>
        </div>
      )}

      {/* Transcript Display - Lumina style */}
      {isConnected && (
        <TranscriptDisplay
          lines={transcriptLines}
          speaker={currentSpeaker}
        />
      )}

      {/* Status text - Bottom Center (only before connection) */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 ${
        isConnected ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <p className="text-xs text-slate-400 uppercase tracking-wider">
          Ready to Connect
        </p>
      </div>

      {/* Hover-activated Exit Button - Top */}
      {isConnected && (
        <div 
          className="absolute top-0 left-0 right-0 h-20 z-30 group"
        >
          <button
            onClick={handleStop}
            className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 hover:border-red-500/50 hover:bg-red-900/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-20"
            aria-label="End debate"
          >
            <svg
              className="w-6 h-6 text-slate-400 hover:text-red-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Hover-activated Exit Button - Bottom */}
      {isConnected && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-20 z-30 group"
        >
          <button
            onClick={handleStop}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 hover:border-red-500/50 hover:bg-red-900/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-20"
            aria-label="End debate"
          >
            <svg
              className="w-6 h-6 text-slate-400 hover:text-red-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Error display - Floating */}
      {errorMsg && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 max-w-md px-6 py-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-red-400 font-semibold text-sm">Error</p>
              <p className="text-red-300 text-sm mt-1">{errorMsg}</p>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-red-300 transition"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Background Grain */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
}
