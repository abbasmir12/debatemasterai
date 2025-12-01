import { GoogleGenAI } from '@google/genai';
import { type ChatMessage, type DebateAnalysis, DebateStyle } from '../types';
import { INPUT_SAMPLE_RATE, OUTPUT_SAMPLE_RATE, decode, decodeAudioData } from '../utils/audioUtils';

/**
 * Callback function types for service events
 */
type TranscriptCallback = (text: string, isUser: boolean, isFinal: boolean) => void;
type StatusChangeCallback = (isConnected: boolean) => void;
type AudioLevelCallback = (level: number) => void;
type ErrorCallback = (error: Error) => void;

// Constants for Gemini Live API
const HOST = "generativelanguage.googleapis.com";
const API_VERSION = "v1alpha";
const MODEL = "models/gemini-2.0-flash-exp";

/**
 * GeminiLiveService class
 * 
 * Handles real-time audio streaming, transcription, and debate analysis
 * using Google's Gemini Live API via raw WebSockets.
 */
export class GeminiLiveService {
  private ai: GoogleGenAI;
  private ws: WebSocket | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private outputNode: GainNode | null = null;
  private outputAnalyser: AnalyserNode | null = null;
  private inputAnalyser: AnalyserNode | null = null;
  private nextStartTime: number = 0;
  private sources: Set<AudioBufferSourceNode> = new Set();

  // Track connection state internally
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private isDisconnecting: boolean = false;
  private apiKey: string;

  // Callback properties
  public onTranscript: TranscriptCallback;
  public onStatusChange: StatusChangeCallback;
  public onAudioLevel: AudioLevelCallback;
  public onError: ErrorCallback;

  constructor(
    apiKey: string,
    onTranscript: TranscriptCallback,
    onStatusChange: StatusChangeCallback,
    onAudioLevel: AudioLevelCallback,
    onError: ErrorCallback
  ) {
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey });
    this.onTranscript = onTranscript;
    this.onStatusChange = onStatusChange;
    this.onAudioLevel = onAudioLevel;
    this.onError = onError;
  }

  /**
   * Get the output analyser node for visualization
   */
  getOutputAnalyser(): AnalyserNode | null {
    return this.outputAnalyser;
  }

  /**
   * Get the input analyser node for visualization
   */
  getInputAnalyser(): AnalyserNode | null {
    return this.inputAnalyser;
  }

  async connect(topic: string, style: DebateStyle) {
    // Prevent multiple simultaneous connections
    if (this.isConnected || this.isConnecting || this.isDisconnecting) {
      console.log('⚠️ Connection already in progress or active, skipping...');
      return;
    }
    
    this.isConnecting = true;

    if (!navigator.mediaDevices?.getUserMedia) {
      this.isConnecting = false;
      throw new Error("Microphone access not supported");
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: INPUT_SAMPLE_RATE,
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
        }
      });

      // Initialize Audio Contexts
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });

      // Create analyser for output (AI) visualization
      this.outputAnalyser = this.outputAudioContext.createAnalyser();
      this.outputAnalyser.fftSize = 2048; // High resolution for liquid visualizer
      this.outputAnalyser.smoothingTimeConstant = 0.7; // Slightly more responsive
      console.log('🎛️ Created output analyser:', {
        fftSize: this.outputAnalyser.fftSize,
        frequencyBinCount: this.outputAnalyser.frequencyBinCount,
        smoothing: this.outputAnalyser.smoothingTimeConstant
      });

      // Create analyser for input (user) visualization
      this.inputAnalyser = this.inputAudioContext.createAnalyser();
      this.inputAnalyser.fftSize = 2048;
      this.inputAnalyser.smoothingTimeConstant = 0.7;
      console.log('🎛️ Created input analyser:', {
        fftSize: this.inputAnalyser.fftSize,
        frequencyBinCount: this.inputAnalyser.frequencyBinCount,
        smoothing: this.inputAnalyser.smoothingTimeConstant
      });

      // Create gain node and connect: source -> analyser -> gain -> destination
      this.outputNode = this.outputAudioContext.createGain();
      this.outputAnalyser.connect(this.outputNode);
      this.outputNode.connect(this.outputAudioContext.destination);
      console.log('🔗 Output audio chain connected: source -> analyser -> gain -> destination');

      // Construct WebSocket URI
      const uri = `wss://${HOST}/ws/google.ai.generativelanguage.${API_VERSION}.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;

      this.ws = new WebSocket(uri);

      this.ws.onopen = () => {
        // RACE CONDITION FIX: Check if we were disconnected while connecting
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN || this.isDisconnecting) {
          console.log("⚠️ Connection opened but service was disconnected/closed");
          return;
        }

        console.log("✅ Connected to Gemini");
        this.isConnected = true;
        this.isConnecting = false;
        this.onStatusChange(true);

        // Generate System Instruction
        const systemInstruction = this.generateSystemInstruction(topic, style);
        const voiceName = style === DebateStyle.AGGRESSIVE ? 'Fenrir' : 'Puck';

        // Send Setup Message with transcription enabled
        const setupMessage = {
          setup: {
            model: MODEL,
            generation_config: {
              response_modalities: ["AUDIO"],
              speech_config: {
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: voiceName
                  }
                }
              }
            },
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            // Enable transcription for both input and output
            input_audio_transcription: {},
            output_audio_transcription: {}
          }
        };

        this.ws?.send(JSON.stringify(setupMessage));
        if (this.mediaStream) {
          this.handleOpen(this.mediaStream);
        }
      };

      this.ws.onmessage = async (event) => {
        try {
          const response = JSON.parse(await event.data.text());
          this.handleMessage(response);
        } catch (e) {
          console.error("Error parsing message", e);
        }
      };

      this.ws.onclose = (event) => {
        console.log(`❌ Disconnected: ${event.code} - ${event.reason}`);
        this.handleClose();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        this.handleClose();
        this.onError(new Error("WebSocket connection failed"));
      };

    } catch (e) {
      console.error("Connection initialization failed", e);
      this.isConnecting = false;
      this.onError(e instanceof Error ? e : new Error("Failed to initialize connection"));
    }
  }

  private handleOpen = async (stream: MediaStream) => {
    // Setup Audio Input Processing
    if (!this.inputAudioContext) return;

    this.inputSource = this.inputAudioContext.createMediaStreamSource(stream);
    this.processor = this.inputAudioContext.createScriptProcessor(512, 1, 1);

    // Connect input audio chain: source -> analyser -> processor -> destination
    if (this.inputAnalyser) {
      this.inputSource.connect(this.inputAnalyser);
      this.inputAnalyser.connect(this.processor);
      console.log('🔗 Input audio chain: source -> analyser -> processor -> destination');
    } else {
      this.inputSource.connect(this.processor);
    }

    this.processor.onaudioprocess = (e) => {
      // Guard: Do not process or send if not connected or socket is not open
      if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);

      // Simple volume meter
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        const sample = inputData[i] ?? 0;
        sum += sample * sample;
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.onAudioLevel(rms * 50);

      // Convert Float32 (Browser) -> Int16 PCM (Gemini)
      const pcm16 = this.floatTo16BitPCM(inputData);

      // Convert to Base64
      const base64Data = this.arrayBufferToBase64(pcm16);

      // Send Realtime Input
      const msg = {
        realtime_input: {
          media_chunks: [{
            mime_type: "audio/pcm",
            data: base64Data
          }]
        }
      };

      this.ws?.send(JSON.stringify(msg));
    };

    // Connect processor to destination (source->analyser->processor is already connected above)
    this.processor.connect(this.inputAudioContext.destination);
  };

  private handleMessage = async (response: any) => {
    // Ignore messages if we're disconnected or disconnecting
    if (!this.isConnected || this.isDisconnecting) {
      console.log("⚠️ Ignoring message - already disconnected");
      return;
    }

    // 1. Handle Audio Output
    if (response.serverContent?.modelTurn?.parts) {
      const parts = response.serverContent.modelTurn.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith("audio/")) {
          const base64Audio = part.inlineData.data;
          this.playAudioChunk(base64Audio);
        }
      }
    }

    // 2. Handle Transcription - Output (Model speaking)
    if (response.serverContent?.outputTranscription?.text) {
      const text = response.serverContent.outputTranscription.text;
      console.log('🤖 Model transcription:', text);
      this.onTranscript(text, false, false); // isUser=false, isFinal=false
    }

    // 3. Handle Transcription - Input (User speaking)
    if (response.serverContent?.inputTranscription?.text) {
      const text = response.serverContent.inputTranscription.text;
      console.log('👤 User transcription:', text);
      this.onTranscript(text, true, false); // isUser=true, isFinal=false
    }

    // 4. Handle Interruption
    if (response.serverContent?.interrupted) {
      console.log("Model interrupted user");
      this.stopAllAudio();
    }

    // 5. Turn Complete
    if (response.serverContent?.turnComplete) {
      this.onTranscript("", false, true); // Signal turn complete
    }
  };

  private playAudioChunk = async (base64Audio: string) => {
    // Don't play audio if disconnected or disconnecting
    if (!this.isConnected || this.isDisconnecting || !this.outputAudioContext || !this.outputNode) return;

    try {
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        this.outputAudioContext,
        OUTPUT_SAMPLE_RATE,
        1
      );

      // RACE CONDITION FIX: Check if disconnected during decoding
      if (!this.isConnected || this.isDisconnecting || !this.outputAudioContext || !this.outputNode) return;

      this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);

      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Connect: source -> analyser -> gain -> destination
      if (this.outputAnalyser) {
        source.connect(this.outputAnalyser);
        // Analyser is already connected to outputNode in connect()
      } else {
        source.connect(this.outputNode);
      }

      source.addEventListener('ended', () => {
        this.sources.delete(source);
      });

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      this.sources.add(source);
    } catch (e) {
      console.error("Error playing audio chunk", e);
    }
  }

  private stopAllAudio() {
    // Stop all currently playing audio sources
    this.sources.forEach(source => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // Already stopped or disconnected
      }
    });
    this.sources.clear();
    this.nextStartTime = 0;
  }

  private handleClose = () => {
    this.isConnected = false;
    this.isConnecting = false;
    this.onStatusChange(false);

    // Stop audio processing
    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
    }
    if (this.inputSource) {
      this.inputSource.disconnect();
    }

    // Stop all audio playback
    this.stopAllAudio();

    // Don't close WebSocket here - it's already closing
    // Just clear the reference
    if (this.ws) {
      this.ws = null;
    }
  }

  // Helper functions
  private floatTo16BitPCM(input: Float32Array) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const sample = input[i] ?? 0;
      const s = Math.max(-1, Math.min(1, sample));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      const byte = bytes[i] ?? 0;
      binary += String.fromCharCode(byte);
    }
    return window.btoa(binary);
  }

  async analyzeDebate(transcript: ChatMessage[], topic: string): Promise<DebateAnalysis | null> {
    // Validate user participation (AC1, AC3, AC6)
    console.log('📊 Analyzing debate with transcript:', transcript);
    const userMessages = transcript.filter(m => m.role === 'user');
    console.log('👤 User messages found:', userMessages.length, userMessages);
    
    // Check if user spoke at all
    if (userMessages.length === 0) {
      console.log('⚠️ No user participation detected - no user messages');
      return null;
    }
    
    // Check if user spoke enough (minimum 5 words - reduced threshold)
    const totalWords = userMessages.reduce((count, msg) => {
      const words = msg.text.trim().split(/\s+/).filter(w => w.length > 0);
      return count + words.length;
    }, 0);
    
    console.log(`📝 Total user words: ${totalWords}`);
    
    if (totalWords < 5) {
      console.log(`⚠️ Insufficient user participation detected - only ${totalWords} words (minimum 5 required)`);
      return null;
    }

    const conversation = transcript
      .filter(m => m.role !== 'system')
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join('\n');

    const prompt = `You are a fair and constructive debate coach analyzing the following debate transcript on the topic "${topic}".

TRANSCRIPT:
${conversation}

Generate a detailed JSON analysis of the USER'S performance.

EVALUATION GUIDELINES:
1. **Be Fair and Balanced**: Recognize effort and engagement while providing constructive feedback.

2. **Score Distribution**:
   - 0-20: Minimal participation or completely off-topic
   - 21-40: Basic participation but needs significant improvement
   - 41-60: Decent effort with clear room for growth
   - 61-80: Good performance with strong arguments and clarity
   - 81-100: Excellent debating skills, persuasive and articulate

3. **Baseline Scoring**: Anyone who participates and engages in the debate should receive AT MINIMUM:
   - Overall Score: 40-50 (for basic participation)
   - Individual metrics: 40-60 (for attempting to engage)

4. **Scoring Criteria**:
   - **Vocabulary**: 40-60 for basic conversation, 60-80 for good vocabulary, 80+ for advanced
   - **Clarity**: 50-70 for understandable speech, 70-85 for clear communication, 85+ for excellent
   - **Argument Strength**: 45-65 for basic arguments, 65-80 for solid reasoning, 80+ for exceptional
   - **Persuasion**: 45-65 for engaged participation, 65-80 for convincing delivery, 80+ for compelling
   - **Adaptability**: 45-65 for responsive dialogue, 65-80 for good adaptation, 80+ for excellent

5. **Important**: If the user is clearly trying to debate and responding to the AI, they should score 35-55 range minimum. Only give scores below 35 if there's truly minimal participation or completely off-topic responses. Like overall U have to check the User speaking level as well as U have to check If a user can deliver its point successfully to opponent.

6. **Archetype**: Create an encouraging yet accurate archetype name based on their style
7. **Wildcard Insight**: Find something specific and interesting about their approach
8. **Strengths**: List 2-3 genuine strengths they demonstrated
9. **Weaknesses**: Identify 2-3 areas for improvement in a constructive way
10. **Suggestions**: Provide 4-6 specific, actionable tips for improvement

CRITICAL INSTRUCTION: Be generous with scoring. If someone is participating and trying to debate, they deserve 50-70 range. Reserve low scores (below 40) ONLY for cases of no participation or completely incoherent responses. Recognize effort and engagement with appropriate scores.`;

    try {
      const result = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              score: { type: 'number', description: "Overall score 0-100" },
              confidenceLevel: { type: 'string', enum: ["Low", "Medium", "High", "Unstoppable"] },
              englishProficiency: { type: 'string', enum: ["Beginner", "Intermediate", "Advanced", "Native"] },
              vocabularyScore: { type: 'number', description: "0-100" },
              clarityScore: { type: 'number', description: "0-100" },
              argumentStrength: { type: 'number', description: "0-100" },
              persuasionScore: { type: 'number', description: "0-100" },
              strategicAdaptability: { type: 'number', description: "0-100" },
              archetype: { type: 'string', description: "Creative label for the user" },
              wildcardInsight: { type: 'string', description: "Unique observation" },
              emotionalState: { type: 'string', description: "e.g. Calm, Agitated" },
              strengths: { type: 'array', items: { type: 'string' } },
              weaknesses: { type: 'array', items: { type: 'string' } },
              suggestions: { type: 'array', items: { type: 'string' } }
            },
            required: ["score", "confidenceLevel", "englishProficiency", "vocabularyScore", "clarityScore", "argumentStrength", "persuasionScore", "strategicAdaptability", "archetype", "wildcardInsight", "emotionalState", "strengths", "weaknesses", "suggestions"]
          }
        }
      });

      const text = result.text;
      if (!text) throw new Error("No analysis generated");
      return JSON.parse(text) as DebateAnalysis;
    } catch (e) {
      console.error("Analysis failed", e);
      return {
        score: 0,
        confidenceLevel: 'Low',
        englishProficiency: 'Beginner',
        vocabularyScore: 0,
        clarityScore: 0,
        argumentStrength: 0,
        persuasionScore: 0,
        strategicAdaptability: 0,
        archetype: 'The Unknown',
        wildcardInsight: 'Data unavailable due to error.',
        emotionalState: 'Unknown',
        strengths: ['Analysis failed'],
        weaknesses: ['Could not process transcript'],
        suggestions: ['Try again']
      };
    }
  }

  async disconnect() {
    // Prevent multiple simultaneous disconnections
    if (this.isDisconnecting) {
      console.log("⚠️ Already disconnecting...");
      return;
    }

    console.log("🔌 Disconnecting...");
    this.isDisconnecting = true;

    // Immediately mark as disconnected to stop audio processing
    this.isConnected = false;
    this.isConnecting = false;

    // Stop audio processing FIRST (this prevents new audio from being sent/received)
    if (this.processor) {
      try {
        this.processor.disconnect();
        this.processor.onaudioprocess = null;
      } catch (e) {
        console.error("Error disconnecting processor:", e);
      }
      this.processor = null;
    }

    if (this.inputSource) {
      try {
        this.inputSource.disconnect();
      } catch (e) {
        console.error("Error disconnecting input source:", e);
      }
      this.inputSource = null;
    }

    // Stop all playing audio immediately
    this.stopAllAudio();

    // Close WebSocket connection
    if (this.ws) {
      const currentWs = this.ws;
      this.ws = null; // Clear reference immediately to prevent reuse

      // Remove event handlers to prevent any more messages
      currentWs.onmessage = null;
      currentWs.onerror = null;
      currentWs.onclose = null;

      if (currentWs.readyState === WebSocket.OPEN || currentWs.readyState === WebSocket.CONNECTING) {
        try {
          currentWs.close(1000, 'User ended session');
        } catch (e) {
          console.error("Error closing WebSocket:", e);
        }
      }
    }

    // Stop all media tracks to release microphone
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.error("Error stopping media track:", e);
        }
      });
      this.mediaStream = null;
    }

    // Close audio contexts
    if (this.inputAudioContext && this.inputAudioContext.state !== 'closed') {
      try {
        await this.inputAudioContext.close();
      } catch (e) {
        console.error("Error closing input audio context:", e);
      }
      this.inputAudioContext = null;
    }
    
    if (this.outputAudioContext && this.outputAudioContext.state !== 'closed') {
      try {
        await this.outputAudioContext.close();
      } catch (e) {
        console.error("Error closing output audio context:", e);
      }
      this.outputAudioContext = null;
    }

    if (this.outputNode) {
      this.outputNode = null;
    }

    this.onStatusChange(false);
    this.isDisconnecting = false;
    console.log("✅ Disconnected successfully");
  }

  private generateSystemInstruction(topic: string, style: DebateStyle): string {
    const baseInstruction = `You are participating in a debate about: "${topic}".`;

    if (style === DebateStyle.COACH) {
      return `${baseInstruction}

You are a supportive debate coach helping the user improve their argumentation skills. 
Your role is to:
- Provide constructive counter-arguments that challenge their thinking
- Point out logical fallacies or weak points in a helpful manner
- Encourage critical thinking and deeper analysis
- Maintain a respectful and educational tone
- Help them develop stronger debate techniques

Use the "Puck" voice configuration for a friendly, approachable tone.`;
    } else {
      return `${baseInstruction}

You are an aggressive debate opponent who challenges the user fiercely.
Your role is to:
- Present strong counter-arguments with conviction
- Use forceful language and rhetorical techniques
- Interrupt when you detect weak reasoning
- Push back hard on their positions
- Create a high-pressure debate environment
- Be relentless in exposing flaws in their arguments

Use the "Fenrir" voice configuration for a powerful, assertive tone.
Feel free to use strong language and interrupt frequently to maintain pressure.`;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
