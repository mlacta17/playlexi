class PlaylexiCaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const channels = inputs[0];
    if (!channels || channels.length === 0) return true;

    const frameCount = channels[0]?.length ?? 0;
    if (frameCount === 0) return true;

    const interleaved = new Float32Array(frameCount * channels.length);
    for (let frame = 0; frame < frameCount; frame += 1) {
      for (let channel = 0; channel < channels.length; channel += 1) {
        interleaved[frame * channels.length + channel] = channels[channel][frame] ?? 0;
      }
    }

    this.port.postMessage(
      { data: interleaved.buffer, channels: channels.length, timestamp: currentTime },
      [interleaved.buffer],
    );
    return true;
  }
}

registerProcessor('playlexi-capture-processor', PlaylexiCaptureProcessor);
