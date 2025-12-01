/**
 * NoParticipation Component
 * 
 * Displayed when a debate session ends with no user participation detected.
 * Provides helpful feedback and troubleshooting suggestions.
 * 
 * Requirements: AC2, AC4
 */

interface NoParticipationProps {
  onBack: () => void;
}

export default function NoParticipation({ onBack }: NoParticipationProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-void text-white px-6">
      <div className="max-w-2xl w-full">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-amber-400/10 border-2 border-amber-400/30 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Main message */}
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          No Participation Detected
        </h1>

        <p className="text-slate-300 text-center text-lg mb-8">
          We didn't detect any speech from you during this debate session.
        </p>

        {/* Troubleshooting suggestions card */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <svg
              className="w-6 h-6 text-lime-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Troubleshooting Tips
          </h2>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-lime-400/10 border border-lime-400/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lime-400 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Check Microphone Permissions</p>
                <p className="text-slate-400 text-sm">
                  Ensure your browser has permission to access your microphone. Look for a microphone icon in your browser's address bar.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-lime-400/10 border border-lime-400/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lime-400 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Test Your Microphone</p>
                <p className="text-slate-400 text-sm">
                  Make sure your microphone is properly connected and selected as the default input device in your system settings.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-lime-400/10 border border-lime-400/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lime-400 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Speak Clearly and Loudly</p>
                <p className="text-slate-400 text-sm">
                  Position yourself closer to the microphone and speak at a normal volume. Avoid background noise if possible.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-lime-400/10 border border-lime-400/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lime-400 font-bold text-sm">4</span>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Wait for Connection</p>
                <p className="text-slate-400 text-sm">
                  Make sure the "Connected" indicator appears before you start speaking. The system needs a moment to initialize.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-lime-400 text-void font-bold rounded-xl hover:bg-lime-500 transition shadow-lg shadow-lime-400/10"
          >
            Try Again
          </button>
        </div>

        {/* Additional note */}
        <p className="text-slate-500 text-sm text-center mt-8">
          This session was not saved to your history.
        </p>
      </div>
    </div>
  );
}
