import { useCallback, useRef } from 'react';

type SoundType = 'addProcess' | 'removeProcess' | 'importProcesses' | 'runGantt' | 'reset' | 'click' | 'success';

// Audio context singleton
let audioContext: AudioContext | null = null;

// Extend Window interface for webkitAudioContext compatibility
interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const getAudioContext = () => {
  if (!audioContext) {
    const windowWithWebkit = window as WebkitWindow;
    audioContext = new (window.AudioContext || windowWithWebkit.webkitAudioContext!)();
  }
  return audioContext;
};

// Sound configurations
const soundConfigs: Record<SoundType, { frequency: number | number[]; duration: number; type: OscillatorType; gain: number; }> = {
  addProcess: {
    frequency: [523.25, 659.25, 783.99], // C5, E5, G5 - rising arpeggio
    duration: 0.15,
    type: 'sine',
    gain: 0.15,
  },
  removeProcess: {
    frequency: [392, 349.23, 293.66], // G4, F4, D4 - falling
    duration: 0.12,
    type: 'triangle',
    gain: 0.12,
  },
  importProcesses: {
    frequency: [523.25, 587.33, 659.25, 783.99, 880], // C5 to A5 - success jingle
    duration: 0.1,
    type: 'sine',
    gain: 0.12,
  },
  runGantt: {
    frequency: [220, 329.63, 440, 523.25, 659.25], // A3 to E5 - power up
    duration: 0.08,
    type: 'sawtooth',
    gain: 0.08,
  },
  reset: {
    frequency: [440, 415.30, 392, 349.23], // A4 descending - whoosh down
    duration: 0.08,
    type: 'sine',
    gain: 0.1,
  },
  click: {
    frequency: 800,
    duration: 0.05,
    type: 'sine',
    gain: 0.08,
  },
  success: {
    frequency: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6 - fanfare
    duration: 0.12,
    type: 'sine',
    gain: 0.12,
  },
};

export const useSoundEffects = () => {
  const isEnabledRef = useRef(true);
  const lastPlayedRef = useRef<Record<SoundType, number>>({} as Record<SoundType, number>);

  // Minimum cooldown between same sound type (prevents spam at high animation speeds)
  const SOUND_COOLDOWN_MS = 180;

  const playSound = useCallback((type: SoundType) => {
    if (!isEnabledRef.current) return;

    // Throttle: skip if same sound was played too recently
    const now = Date.now();
    const lastPlayed = lastPlayedRef.current[type] || 0;
    if (now - lastPlayed < SOUND_COOLDOWN_MS) {
      return; // Skip this sound to prevent spam
    }
    lastPlayedRef.current[type] = now;

    try {
      const ctx = getAudioContext();
      const config = soundConfigs[type];
      const frequencies = Array.isArray(config.frequency) ? config.frequency : [config.frequency];

      // Reduce gain slightly for rapid sounds (softer at high speeds)
      const timeSinceLastAny = Math.min(
        ...Object.values(lastPlayedRef.current).map(t => now - t).filter(t => t > 0)
      ) || 1000;
      const gainMultiplier = timeSinceLastAny < 300 ? 0.6 : 1.0;

      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * config.duration);

        const adjustedGain = config.gain * gainMultiplier;
        gainNode.gain.setValueAtTime(0, ctx.currentTime + index * config.duration);
        gainNode.gain.linearRampToValueAtTime(adjustedGain, ctx.currentTime + index * config.duration + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * config.duration + config.duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime + index * config.duration);
        oscillator.stop(ctx.currentTime + index * config.duration + config.duration + 0.05);
      });
    } catch (e) {
      console.warn('Sound effect failed:', e);
    }
  }, []);

  const toggleSound = useCallback(() => {
    isEnabledRef.current = !isEnabledRef.current;
    return isEnabledRef.current;
  }, []);

  const isSoundEnabled = useCallback(() => isEnabledRef.current, []);

  return { playSound, toggleSound, isSoundEnabled };
};
