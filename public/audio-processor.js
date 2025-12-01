class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bytesWritten = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input.length) return true;

    const channel0 = input[0];
    
    // Fill buffer
    for (let i = 0; i < channel0.length; i++) {
      this.buffer[this.bytesWritten++] = channel0[i];

      // When buffer is full, flush it
      if (this.bytesWritten >= this.bufferSize) {
        this.flush();
      }
    }

    return true;
  }

  flush() {
    // Send copy of buffer to main thread
    this.port.postMessage({
      audioData: this.buffer.slice(0, this.bytesWritten)
    });
    
    // Reset buffer
    this.bytesWritten = 0;
  }
}

registerProcessor('audio-processor', AudioProcessor);
