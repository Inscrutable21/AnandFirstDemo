/**
 * Web Audio Pop Synthesizer
 * Generates dynamic physical "POP" sounds on button clicks,
 * candy collisions, and cart additions with zero external audio assets.
 */

class PopAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playPop(freq = 520, duration = 0.08, vol = 0.25) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.35), now + duration);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  playCelebration() {
    if (!this.enabled) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playPop(freq, 0.12, 0.2), idx * 60);
    });
  }
}

const popAudio = new PopAudioEngine();

// Play pop sound on button clicks & interactions
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button, .btn-buy-pill, .marquee-pill, .flavor-pill, .btn-stack-action");
    if (btn) {
      popAudio.playPop(550 + Math.random() * 150, 0.07, 0.18);
    }
  });
});

