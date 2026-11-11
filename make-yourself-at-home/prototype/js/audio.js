/* Make Yourself at Home — tiny WebAudio synth. No audio files.
 * Sound effects are short synthesized blips; the "recording" is an original
 * music-box melody whose timbre changes when the recording takes on your voice. */
(function (root) {
  'use strict';
  let ac = null, master = null, sfxBus = null, musicBus = null, noiseBuf = null;
  let muted = false;
  const song = { playing: false, voice: 'pip', level: 1, next: 0, idx: 0, timer: null };
  // Original melody: [midi, beats]. A lilting 3/4 music-box tune.
  const MELODY = [
    [72, 1], [76, 1], [79, 1], [77, 2], [76, 1], [74, 1], [72, 1], [74, 1], [76, 3],
    [76, 1], [79, 1], [81, 1], [79, 2], [77, 1], [76, 1], [74, 1], [71, 1], [72, 3],
  ];
  const BEAT = 0.28;

  function ensure() {
    if (ac) return ac;
    const Ctx = root.AudioContext || root.webkitAudioContext;
    if (!Ctx) return null;
    ac = new Ctx();
    master = ac.createGain(); master.gain.value = 0.55; master.connect(ac.destination);
    sfxBus = ac.createGain(); sfxBus.gain.value = 0.7; sfxBus.connect(master);
    musicBus = ac.createGain(); musicBus.gain.value = 0.0; musicBus.connect(master);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.6, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ac;
  }
  function resume() { if (ensure() && ac.state === 'suspended') ac.resume(); }
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function tone(freq, dur, type, vol, slide, when, bus) {
    if (!ac) return;
    const t = when || ac.currentTime;
    const o = ac.createOscillator(), gn = ac.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
    gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.008);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(gn); gn.connect(bus || sfxBus); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol, freq, q, type) {
    if (!ac) return;
    const t = ac.currentTime, s = ac.createBufferSource(), f = ac.createBiquadFilter(), gn = ac.createGain();
    s.buffer = noiseBuf; f.type = type || 'bandpass'; f.frequency.value = freq || 1200; f.Q.value = q || 1;
    gn.gain.setValueAtTime(vol || 0.2, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(gn); gn.connect(sfxBus); s.start(t); s.stop(t + dur + 0.02);
  }

  const SFX = {
    swing: () => noise(0.09, 0.18, 2400, 0.8, 'highpass'),
    swingHeavy: () => { noise(0.16, 0.25, 900, 0.7); tone(140, 0.12, 'triangle', 0.12, 0.6); },
    charge: () => tone(300, 0.25, 'triangle', 0.08, 1.8),
    hit: () => { tone(180, 0.08, 'sine', 0.35, 0.5); noise(0.06, 0.2, 1800, 1.5); },
    hitHeavy: () => { tone(110, 0.16, 'sine', 0.5, 0.45); noise(0.12, 0.3, 700, 1); },
    pop: () => { tone(520, 0.12, 'square', 0.08, 2.2); noise(0.22, 0.25, 1400, 0.6); tone(90, 0.2, 'sine', 0.3, 0.5); },
    balloon: () => { noise(0.08, 0.35, 3000, 0.5, 'highpass'); tone(900, 0.05, 'square', 0.05, 0.5); },
    splat: () => { noise(0.16, 0.25, 500, 0.8, 'lowpass'); tone(160, 0.1, 'sine', 0.15, 0.6); },
    hurt: () => { tone(420, 0.22, 'sawtooth', 0.12, 0.45); noise(0.1, 0.2, 900, 1); },
    down: () => { tone(330, 0.6, 'triangle', 0.18, 0.3); },
    dodge: () => noise(0.12, 0.12, 1200, 0.5, 'highpass'),
    tell: () => tone(660, 0.1, 'square', 0.05, 1.5),
    spin: () => noise(0.22, 0.14, 2000, 2),
    clank: () => { tone(820, 0.18, 'square', 0.07, 0.7); tone(1230, 0.12, 'triangle', 0.06); },
    blip: () => tone(880, 0.05, 'triangle', 0.08, 1.3),
    click: () => tone(1200, 0.04, 'square', 0.06),
    commit: () => { tone(523, 0.12, 'triangle', 0.12); tone(784, 0.2, 'triangle', 0.1, 1, ac && ac.currentTime + 0.08); },
    fuse: () => { tone(90, 0.25, 'sawtooth', 0.15, 0.5); noise(0.1, 0.2, 3000, 1); },
    pickup: () => { tone(660, 0.08, 'triangle', 0.1); tone(990, 0.12, 'triangle', 0.1, 1, ac && ac.currentTime + 0.07); },
    crush: () => { noise(0.6, 0.4, 400, 0.6, 'lowpass'); tone(70, 0.5, 'sawtooth', 0.2, 0.5); },
    spawn: () => tone(240, 0.2, 'triangle', 0.08, 2),
    popperFire: () => { tone(300, 0.08, 'square', 0.06, 2.5); noise(0.08, 0.15, 2500, 1); },
    whiff: () => noise(0.06, 0.08, 3000, 1, 'highpass'),
    shift: () => { tone(220, 1.2, 'sine', 0.12, 1.01); tone(277, 1.2, 'sine', 0.08, 0.99); },
    win: () => { [72, 76, 79, 84].forEach((m, i) => tone(mtof(m), 0.3, 'triangle', 0.12, 1, ac && ac.currentTime + i * 0.1)); },
  };

  function play(name) { if (!ac || muted) return; const f = SFX[name]; if (f) f(); }

  function scheduleSong() {
    if (!ac || !song.playing) return;
    while (song.next < ac.currentTime + 0.25) {
      const [m, beats] = MELODY[song.idx % MELODY.length];
      const dur = beats * BEAT;
      if (song.voice === 'you') {
        // the same song, but sung: an octave lower, a breathy formant voice
        const o = ac.createOscillator(), f = ac.createBiquadFilter(), gn = ac.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(mtof(m - 12), song.next);
        o.frequency.linearRampToValueAtTime(mtof(m - 12) * 1.006, song.next + dur * 0.5);
        f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 3;
        gn.gain.setValueAtTime(0.0001, song.next); gn.gain.exponentialRampToValueAtTime(0.18, song.next + 0.06);
        gn.gain.exponentialRampToValueAtTime(0.0001, song.next + dur * 0.95);
        o.connect(f); f.connect(gn); gn.connect(musicBus); o.start(song.next); o.stop(song.next + dur);
        tone(mtof(m), dur * 0.8, 'sine', 0.05, 1, song.next, musicBus);
      } else {
        tone(mtof(m), Math.min(0.9, dur * 1.2), 'triangle', 0.22, 1, song.next, musicBus);
        tone(mtof(m + 12), 0.25, 'sine', 0.06, 1, song.next, musicBus);
      }
      if (song.idx % 3 === 0) tone(mtof(m - 24), dur * 0.9, 'sine', 0.08, 1, song.next, musicBus);
      song.next += dur; song.idx++;
    }
  }

  function setSong(on, voice, level) {
    if (!ac) return;
    const lv = muted ? 0 : (level == null ? 1 : level);
    if (voice) song.voice = voice;
    if (on && !song.playing) {
      song.playing = true; song.idx = 0; song.next = ac.currentTime + 0.05;
      song.timer = setInterval(scheduleSong, 60); scheduleSong();
    } else if (!on && song.playing) {
      song.playing = false; clearInterval(song.timer); song.timer = null;
    }
    if (song.level !== lv || on) {
      song.level = lv;
      musicBus.gain.cancelScheduledValues(ac.currentTime);
      musicBus.gain.setTargetAtTime(on ? 0.6 * lv : 0, ac.currentTime, 0.05);
    }
  }
  function setMuted(m) { muted = m; if (master && ac) master.gain.setTargetAtTime(m ? 0 : 0.55, ac.currentTime, 0.02); }
  function suspend() { if (ac && ac.state === 'running') ac.suspend(); }

  root.MYAH_AUDIO = { resume, play, setSong, setMuted, suspend, isMuted: () => muted };
})(typeof window !== 'undefined' ? window : globalThis);
