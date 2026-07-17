// Web Audio API Retro Arcade Synthesizer for high-energy interactive feedback
let isMuted = false;

// Lazily initialized shared AudioContext — avoid creating one per sound call
let _audioCtx = null;
const getCtx = () => {
  if (!_audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    _audioCtx = new AudioContextClass();
  }
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
  return _audioCtx;
};

export const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};

export const getMuteState = () => {
  return isMuted;
};

export const playSound = (type) => {
  if (isMuted) return;

  try {
    const ctx = getCtx();
    if (!ctx) return;

    if (type === 'hover') {
      // Soft high-frequency retro beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } 
    else if (type === 'click') {
      // Retro laser beam shoot sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } 
    else if (type === 'collapse') {
      // Rumble explosion sound for gravity collapse
      const osc = ctx.createOscillator();
      const noiseGain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.6);
      
      noiseGain.gain.setValueAtTime(0.12, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
      
      // Second high-pitch glitch layer on top
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(300, ctx.currentTime);
      osc2.frequency.setValueAtTime(50, ctx.currentTime + 0.1);
      osc2.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
      osc2.frequency.setValueAtTime(100, ctx.currentTime + 0.3);
      
      gain2.gain.setValueAtTime(0.03, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc2.start();
      osc2.stop(ctx.currentTime + 0.4);
    } 
    else if (type === 'restore') {
      // Super power-up ascending chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      
      // Harmony note using the same shared context
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(350, ctx.currentTime + 0.08);
      osc3.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.38);
      
      gain3.gain.setValueAtTime(0, ctx.currentTime);
      gain3.gain.setValueAtTime(0.04, ctx.currentTime + 0.08);
      gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
      
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      
      osc3.start(ctx.currentTime + 0.08);
      osc3.stop(ctx.currentTime + 0.4);
    }
    else if (type === 'domain') {
      // Deep sub-bass sweep + rising pitch distortion + resonant metal ring
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(25, ctx.currentTime + 0.5);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 1.2);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
      
      // Resonant high-freq bell ring
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.35);
      osc2.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.2);
      
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.setValueAtTime(0.07, ctx.currentTime + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 1.2);
    }
  } catch (e) {
    console.warn("Web Audio API is not permitted or supported in this browser state:", e);
  }
};
