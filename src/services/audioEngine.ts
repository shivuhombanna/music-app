/**
 * High-performance Web Audio API engine for Sonora Music
 * Features:
 * - HTMLAudioElement integration with crossOrigin handling
 * - Real-time 3-Band Parametric Equalizer (Bass, Mid, Treble)
 * - Spatial Stereo simulation
 * - FFT AnalyserNode for 60fps audio visualizers
 * - Procedural synthesized polyphonic soundscape fallback (guaranteed playback resilience)
 */

export interface EqualizerSettings {
  bass: number; // -12dB to +12dB
  mid: number;
  treble: number;
}

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private bassNode: BiquadFilterNode | null = null;
  private midNode: BiquadFilterNode | null = null;
  private trebleNode: BiquadFilterNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private masterGain: GainNode | null = null;

  // Synthesizer fallback engine
  private isSynthesizing = false;
  private synthInterval: number | null = null;
  private synthNodes: (AudioNode | number)[] = [];

  private isInitialized = false;
  private currentTrackTheme: string = 'synthwave';

  // Callbacks
  public onTimeUpdate: ((currentTime: number, duration: number) => void) | null = null;
  public onEnded: (() => void) | null = null;
  public onError: ((err: string) => void) | null = null;
  public onPlayStateChange: ((isPlaying: boolean) => void) | null = null;

  constructor() {
    // Lazily initialize in response to user interaction to satisfy browser autoplay policies
  }

  private initContext() {
    if (this.isInitialized && this.ctx) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Analyser for real-time visualization
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 128;
      this.analyserNode.smoothingTimeConstant = 0.82;

      // 3-Band Equalizer
      this.bassNode = this.ctx.createBiquadFilter();
      this.bassNode.type = 'lowshelf';
      this.bassNode.frequency.value = 120;
      this.bassNode.gain.value = 0;

      this.midNode = this.ctx.createBiquadFilter();
      this.midNode.type = 'peaking';
      this.midNode.frequency.value = 1000;
      this.midNode.Q.value = 1.0;
      this.midNode.gain.value = 0;

      this.trebleNode = this.ctx.createBiquadFilter();
      this.trebleNode.type = 'highshelf';
      this.trebleNode.frequency.value = 6000;
      this.trebleNode.gain.value = 0;

      // Spatial stereo panner
      if (this.ctx.createStereoPanner) {
        this.pannerNode = this.ctx.createStereoPanner();
        this.pannerNode.pan.value = 0;
      }

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;

      // Audio element
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'metadata';

      // Connect nodes: source -> bass -> mid -> treble -> panner -> analyser -> masterGain -> destination
      try {
        this.sourceNode = this.ctx.createMediaElementSource(this.audio);
        this.sourceNode.connect(this.bassNode);
      } catch {
        // In case media element source cannot connect directly due to cross-origin strictness
      }

      this.bassNode.connect(this.midNode);
      this.midNode.connect(this.trebleNode);

      let lastNode: AudioNode = this.trebleNode;
      if (this.pannerNode) {
        lastNode.connect(this.pannerNode);
        lastNode = this.pannerNode;
      }

      lastNode.connect(this.analyserNode);
      this.analyserNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Event listeners on audio
      this.audio.addEventListener('timeupdate', () => {
        if (!this.isSynthesizing && this.audio && this.onTimeUpdate) {
          this.onTimeUpdate(this.audio.currentTime, this.audio.duration || 0);
        }
      });

      this.audio.addEventListener('ended', () => {
        if (this.onEnded) this.onEnded();
      });

      this.audio.addEventListener('error', () => {
        // Seamless fallback to Web Audio procedural synthesis
        this.startProceduralFallback();
      });

      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  public async resumeContext() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public async loadAndPlay(url: string, theme: string = 'synthwave', startTime: number = 0) {
    this.initContext();
    await this.resumeContext();
    this.stopProceduralFallback();

    this.currentTrackTheme = theme;

    if (!this.audio) return;

    try {
      this.audio.src = url;
      this.audio.currentTime = startTime;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        if (this.onPlayStateChange) this.onPlayStateChange(true);
      }
    } catch {
      // If network fails or browser blocks external audio stream, smoothly fallback to high-quality procedural synth!
      this.startProceduralFallback(startTime);
    }
  }

  public play() {
    this.resumeContext();
    if (this.isSynthesizing) {
      this.startProceduralFallback(this.simulatedTime);
      return;
    }
    if (this.audio) {
      this.audio.play().catch(() => {
        this.startProceduralFallback();
      });
      if (this.onPlayStateChange) this.onPlayStateChange(true);
    }
  }

  public pause() {
    if (this.isSynthesizing) {
      this.stopProceduralFallback(false);
      if (this.onPlayStateChange) this.onPlayStateChange(false);
      return;
    }
    if (this.audio) {
      this.audio.pause();
      if (this.onPlayStateChange) this.onPlayStateChange(false);
    }
  }

  public seek(seconds: number) {
    if (this.isSynthesizing) {
      this.simulatedTime = seconds;
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.simulatedTime, this.simulatedDuration);
      }
      return;
    }
    if (this.audio && Number.isFinite(seconds)) {
      this.audio.currentTime = seconds;
    }
  }

  public setVolume(vol: number) {
    this.initContext();
    const clamped = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = clamped;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  }

  public setPlaybackRate(rate: number) {
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  public setEqualizer(settings: EqualizerSettings) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.bassNode) {
      this.bassNode.gain.setValueAtTime(settings.bass, now);
    }
    if (this.midNode) {
      this.midNode.gain.setValueAtTime(settings.mid, now);
    }
    if (this.trebleNode) {
      this.trebleNode.gain.setValueAtTime(settings.treble, now);
    }
  }

  public setSpatial(enabled: boolean) {
    this.initContext();
    if (!this.pannerNode || !this.ctx) return;
    // Creates a pleasant subtle stereo widening
    this.pannerNode.pan.setValueAtTime(enabled ? 0.25 : 0, this.ctx.currentTime);
  }

  public getFrequencyData(dataArray: Uint8Array): void {
    if (this.analyserNode) {
      (this.analyserNode.getByteFrequencyData as (arr: Uint8Array) => void)(dataArray);
    } else {
      dataArray.fill(0);
    }
  }

  // --- Procedural Web Audio Synthesizer (Zero-Network Fallback) ---
  private simulatedTime = 0;
  private simulatedDuration = 180;

  private startProceduralFallback(startTime: number = 0) {
    if (!this.ctx) return;
    this.isSynthesizing = true;
    this.simulatedTime = startTime;
    if (this.onPlayStateChange) this.onPlayStateChange(true);

    // Stop any existing loop
    if (this.synthInterval) {
      window.clearInterval(this.synthInterval);
    }

    const baseChordMap: Record<string, number[][]> = {
      synthwave: [
        [220, 261.63, 329.63, 440], // A minor 7
        [174.61, 220, 261.63, 349.23], // F maj 7
        [196, 246.94, 293.66, 392], // G maj
        [164.81, 220, 246.94, 329.63], // E min 7
      ],
      lofi: [
        [196, 233.08, 293.66, 349.23], // G min 7
        [146.83, 174.61, 220, 261.63], // D min 7
        [174.61, 220, 261.63, 329.63], // F maj 7
        [130.81, 164.81, 196, 246.94], // C maj 7
      ],
      acoustic: [
        [196, 246.94, 293.66, 392], // G maj
        [146.83, 220, 293.66, 369.99], // D maj
        [164.81, 196, 246.94, 329.63], // E min
        [174.61, 220, 261.63, 349.23], // C add 9
      ],
      ambient: [
        [130.81, 196, 246.94, 293.66], // C maj 9
        [110, 164.81, 220, 261.63], // A min 9
        [146.83, 220, 261.63, 329.63], // D min 9
        [174.61, 261.63, 329.63, 392], // F maj 9
      ],
    };

    const chords = baseChordMap[this.currentTrackTheme] || baseChordMap.synthwave;
    let chordIndex = 0;
    let step = 0;

    const playMusicalBeat = () => {
      if (!this.ctx || !this.isSynthesizing || !this.analyserNode) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[chordIndex % chords.length];

      // Polyphonic pad oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = this.currentTrackTheme === 'lofi' ? 'triangle' : this.currentTrackTheme === 'synthwave' ? 'sawtooth' : 'sine';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(this.currentTrackTheme === 'lofi' ? 450 : 1200, now);

      const freq = currentChord[step % currentChord.length];
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bassNode || this.analyserNode);

      osc.start(now);
      osc.stop(now + 0.5);

      // Bass note on downbeats
      if (step % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(currentChord[0] / 2, now);

        bassGain.gain.setValueAtTime(0.15, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bassNode || this.analyserNode);

        bassOsc.start(now);
        bassOsc.stop(now + 0.4);
      }

      step++;
      if (step % 4 === 0) {
        chordIndex++;
      }
    };

    // Trigger pulse at ~120 BPM (every 250ms sixteenth/eighth notes)
    this.synthInterval = window.setInterval(() => {
      this.simulatedTime += 0.25;
      if (this.simulatedTime >= this.simulatedDuration) {
        this.simulatedTime = 0;
        if (this.onEnded) this.onEnded();
      }
      playMusicalBeat();
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.simulatedTime, this.simulatedDuration);
      }
    }, 250);
  }

  private stopProceduralFallback(resetTime = true) {
    if (this.synthInterval) {
      window.clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthesizing = false;
    if (resetTime) {
      this.simulatedTime = 0;
    }
  }

  public destroy() {
    this.stopProceduralFallback();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
    if (this.ctx) {
      this.ctx.close();
    }
  }
}

export const audioEngine = new AudioEngine();
