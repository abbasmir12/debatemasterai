/**
 * Audio utility functions for PCM encoding/decoding and audio processing
 * Used for real-time audio streaming with Gemini Live API
 */

// Audio sample rate constants as per requirements 3.4 and 3.6
export const INPUT_SAMPLE_RATE = 24000;  // 24kHz for microphone input (Gemini preferred)
export const OUTPUT_SAMPLE_RATE = 24000; // 24kHz for Gemini audio output

/**
 * Converts Float32Array PCM audio data to Int16 PCM blob for streaming
 * Requirement 3.7: PCM encoding for audio transmission
 * 
 * @param pcmData - Float32Array containing audio samples in range [-1, 1]
 * @returns Blob containing Int16 PCM data
 */
export function createBlob(pcmData: Float32Array): Blob {
  // Convert Float32 samples to Int16 PCM
  const int16Data = new Int16Array(pcmData.length);

  for (let i = 0; i < pcmData.length; i++) {
    // Clamp to [-1, 1] range and convert to Int16 range [-32768, 32767]
    const sample = Math.max(-1, Math.min(1, pcmData[i] ?? 0));
    int16Data[i] = sample < 0 ? sample * 32768 : sample * 32767;
  }

  return new Blob([int16Data.buffer], { type: 'audio/pcm' });
}

/**
 * Decodes base64 string to ArrayBuffer
 * Requirement 3.7: Base64 audio decoding from API responses
 * 
 * @param base64 - Base64 encoded string
 * @returns ArrayBuffer containing decoded binary data
 */
export function decode(base64: string): ArrayBuffer {
  // Decode base64 string to binary string
  const binaryString = atob(base64);

  // Convert binary string to ArrayBuffer
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

/**
 * Decodes raw PCM ArrayBuffer to AudioBuffer for playback
 * Requirement 3.6, 3.7: Audio buffer creation for playback at correct sample rate
 * 
 * @param buffer - ArrayBuffer containing raw PCM data
 * @param context - AudioContext for creating the AudioBuffer
 * @param sampleRate - Sample rate of the audio data
 * @param channels - Number of audio channels (typically 1 for mono)
 * @returns Promise resolving to AudioBuffer ready for playback
 */
export async function decodeAudioData(
  buffer: ArrayBuffer,
  context: AudioContext,
  sampleRate: number,
  channels: number
): Promise<AudioBuffer> {
  // Convert ArrayBuffer to Int16Array
  const int16Data = new Int16Array(buffer);

  // Create AudioBuffer with specified parameters
  const audioBuffer = context.createBuffer(
    channels,
    int16Data.length,
    sampleRate
  );

  // Get the channel data (Float32Array)
  const channelData = audioBuffer.getChannelData(0);

  // Convert Int16 PCM to Float32 in range [-1, 1]
  for (let i = 0; i < int16Data.length; i++) {
    const sample = int16Data[i] ?? 0;
    channelData[i] = sample / (sample < 0 ? 32768 : 32767);
  }

  return audioBuffer;
}
