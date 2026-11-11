import type { Species } from '../../core/level.ts';

/**
 * Stand-in music with WebAudio, no files. The gray world hums one quiet drone; every greeting
 * plays a short phrase in that creature's voice and adds a sustained note, so the song builds
 * with the parade. A clear resolves into a full chord.
 */
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const ROOT = 220; // A3

const VOICE: Record<Species, { wave: OscillatorType; base: number }> = {
  rabbit: { wave: 'triangle', base: 4 },
  owl: { wave: 'sine', base: 2 },
  goose: { wave: 'square', base: 3 },
  bear: { wave: 'sine', base: 0 },
  fox: { wave: 'triangle', base: 5 },
  hedgehog: { wave: 'triangle', base: 1 },
  toad: { wave: 'sawtooth', base: 0 },
  mole: { wave: 'sine', base: 3 },
};

const freq = (step: number) => ROOT * Math.pow(2, (PENTA[step % PENTA.length]! + 12 * Math.floor(step / PENTA.length)) / 12);

export class Synth {
  private ac: AudioContext | null = null;
  private master: GainNode | null = null;
  private layers: { osc: OscillatorNode; gain: GainNode }[] = [];
  private drone: { osc: OscillatorNode; gain: GainNode } | null = null;
  muted = false;

  /** Browsers only allow audio after a user gesture; call this from the first tap. */
  unlock(): void {
    if (this.ac) {
      if (this.ac.state === 'suspended') void this.ac.resume();
      return;
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    this.ac = new Ctor();
    this.master = this.ac.createGain();
    this.master.gain.value = this.muted ? 0 : 0.5;
    this.master.connect(this.ac.destination);
  }

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.master && this.ac) this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ac.currentTime, 0.05);
  }

  suspend(): void {
    void this.ac?.suspend();
  }

  resume(): void {
    void this.ac?.resume();
  }

  private tone(f: number, start: number, dur: number, wave: OscillatorType, vol: number): void {
    if (!this.ac || !this.master) return;
    const osc = this.ac.createOscillator();
    const g = this.ac.createGain();
    osc.type = wave;
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g).connect(this.master);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  /** The gray state: one soft low note. */
  startDrone(): void {
    if (!this.ac || !this.master || this.drone) return;
    const osc = this.ac.createOscillator();
    const gain = this.ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = ROOT / 2;
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(0.05, this.ac.currentTime, 0.6);
    osc.connect(gain).connect(this.master);
    osc.start();
    this.drone = { osc, gain };
  }

  stopAll(): void {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    for (const l of [...this.layers, ...(this.drone ? [this.drone] : [])]) {
      l.gain.gain.setTargetAtTime(0, t, 0.15);
      l.osc.stop(t + 0.8);
    }
    this.layers = [];
    this.drone = null;
  }

  step(): void {
    if (!this.ac) return;
    this.tone(ROOT * 4, this.ac.currentTime, 0.05, 'sine', 0.03);
  }

  tick(): void {
    if (!this.ac) return;
    this.tone(ROOT * 3, this.ac.currentTime, 0.04, 'triangle', 0.035);
  }

  bump(): void {
    if (!this.ac) return;
    this.tone(ROOT / 2, this.ac.currentTime, 0.12, 'sine', 0.12);
  }

  greet(species: Species, order: number): void {
    if (!this.ac || !this.master) return;
    const v = VOICE[species];
    const t = this.ac.currentTime;
    const base = v.base + (order % 3);
    [0, 2, 4].forEach((k, i) => this.tone(freq(base + k), t + i * 0.09, 0.35, v.wave, v.wave === 'square' || v.wave === 'sawtooth' ? 0.05 : 0.12));
    // Sustained layer: the song gets fuller with every member of the parade.
    const osc = this.ac.createOscillator();
    const gain = this.ac.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq((order * 2) % 8) / 2;
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(0.03, t, 0.3);
    osc.connect(gain).connect(this.master);
    osc.start();
    this.layers.push({ osc, gain });
  }

  honk(): void {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    this.tone(ROOT * 0.75, t, 0.25, 'square', 0.08);
    this.tone(ROOT * 0.7, t + 0.22, 0.3, 'square', 0.08);
  }

  sigh(): void {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    this.tone(freq(4), t, 0.4, 'sine', 0.1);
    this.tone(freq(2), t + 0.25, 0.6, 'sine', 0.1);
  }

  clear(): void {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    [0, 2, 4, 5, 7].forEach((k, i) => this.tone(freq(k + 2), t + i * 0.08, 1.2, 'triangle', 0.1));
  }
}
