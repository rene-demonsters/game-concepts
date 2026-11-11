/* Make Yourself at Home — browser glue: input, fixed-step loop, HUD, overlays, saving. */
(function () {
  'use strict';
  const M = window.MYAH, RND = window.MYAH_RENDER, AU = window.MYAH_AUDIO;
  const SAVE_KEY = 'myah-prototype-save-v1';
  const STEP = 1 / 60;
  const $ = (s) => document.querySelector(s);

  const canvas = $('#game'), ctx = canvas.getContext('2d');
  const stageEl = $('#stage');
  let g = null;
  let mode = 'title'; // title | play | pause | journal | end
  let scale = 1;

  // ------------------------------------------------------------ storage (guarded: file:// or private mode may refuse)
  const store = {
    get() { try { return localStorage.getItem(SAVE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(SAVE_KEY, v); } catch (e) { /* ignore */ } },
    clear() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } },
  };

  // ------------------------------------------------------------ layout
  function fit() {
    const W = RND.VIEW_W, H = RND.VIEW_H;
    scale = Math.min(window.innerWidth / W, window.innerHeight / H);
    stageEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
    const dpr = Math.min(window.devicePixelRatio || 1, 2), k = scale * dpr;
    canvas.width = Math.round(W * k); canvas.height = Math.round(H * k);
    ctx.setTransform(k, 0, 0, k, 0, 0);
  }
  window.addEventListener('resize', fit);

  // ------------------------------------------------------------ input
  const keys = new Set();
  let edges = { light: false, heavy: false, dodge: false, interact: false, aim: null };
  const MOVE = { KeyW: [0, -1], ArrowUp: [0, -1], KeyS: [0, 1], ArrowDown: [0, 1], KeyA: [-1, 0], ArrowLeft: [-1, 0], KeyD: [1, 0], ArrowRight: [1, 0] };

  function clearInput() { keys.clear(); edges = { light: false, heavy: false, dodge: false, interact: false, aim: null }; if (g) g.hold = null; }

  function buildInput() {
    const inp = M.emptyInput();
    for (const k of keys) { const v = MOVE[k]; if (v) { inp.mx += v[0]; inp.my += v[1]; } }
    inp.light = edges.light; inp.heavy = edges.heavy; inp.dodge = edges.dodge;
    inp.interactPressed = edges.interact; inp.interactDown = keys.has('KeyE');
    inp.aim = edges.aim;
    return inp;
  }
  function consumeEdges() { edges = { light: false, heavy: false, dodge: false, interact: false, aim: null }; }

  window.addEventListener('keydown', (ev) => {
    AU.resume();
    const c = ev.code;
    if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(c)) ev.preventDefault();
    if (mode === 'title') { if (c === 'Enter' || c === 'Space' || c === 'KeyE') startFromTitle(hasSave() ? 'continue' : 'new'); return; }
    if (mode === 'end') return;
    if (mode === 'journal') { if (c === 'Tab' || c === 'Escape') setMode('play'); return; }
    if (mode === 'pause') { if (c === 'Escape' || c === 'KeyP') setMode('play'); return; }
    // play mode
    if (g.dialogue) {
      if (ev.repeat) return;
      if (c === 'Escape') M.skipDialogue(g);
      else if (c === 'KeyE' || c === 'Space' || c === 'Enter') M.advanceDialogue(g);
      flushEvents(); return;
    }
    if (c === 'Escape' || c === 'KeyP') { setMode('pause'); return; }
    if (c === 'Tab') { setMode('journal'); return; }
    if (c === 'KeyM') { AU.setMuted(!AU.isMuted()); return; }
    if (ev.repeat) { keys.add(c); return; }
    keys.add(c);
    if (c === 'KeyJ') edges.light = true;
    if (c === 'KeyK') edges.heavy = true;
    if (c === 'Space' || c === 'ShiftLeft' || c === 'ShiftRight' || c === 'KeyL') edges.dodge = true;
    if (c === 'KeyE' || c === 'Enter') { edges.interact = true; if (c === 'Enter') keys.add('KeyE'); }
  });
  window.addEventListener('keyup', (ev) => { keys.delete(ev.code); if (ev.code === 'Enter') keys.delete('KeyE'); });

  function worldFromMouse(ev) {
    const r = canvas.getBoundingClientRect();
    const lx = (ev.clientX - r.left) / r.width * RND.VIEW_W, ly = (ev.clientY - r.top) / r.height * RND.VIEW_H;
    const cam = (g && g._cam) || { x: 0, y: 0 };
    return { x: lx / RND.Z + cam.x, y: ly / RND.Z + cam.y + 14 };
  }
  canvas.addEventListener('mousedown', (ev) => {
    AU.resume();
    if (mode !== 'play' || !g) return;
    if (g.dialogue) { M.advanceDialogue(g); flushEvents(); return; }
    if (ev.button === 0) { edges.light = true; edges.aim = worldFromMouse(ev); }
    if (ev.button === 2) { edges.heavy = true; edges.aim = worldFromMouse(ev); }
  });
  canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());
  $('#dialogue').addEventListener('mousedown', () => { if (g && g.dialogue) { M.advanceDialogue(g); flushEvents(); } });

  // Losing focus never leaves keys stuck or lets the fight run unattended.
  window.addEventListener('blur', () => { clearInput(); if (mode === 'play') setMode('pause'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearInput(); if (mode === 'play') setMode('pause'); } });

  // ------------------------------------------------------------ modes & overlays
  function show(id, on) { const el = $(id); if (el) el.hidden = !on; }
  function setMode(m) {
    mode = m;
    clearInput();
    show('#title', m === 'title'); show('#pause', m === 'pause'); show('#journal', m === 'journal'); show('#end', m === 'end');
    if (m === 'journal') renderJournal($('#journal .cols'));
    if (m === 'end') renderEnd();
    if (m === 'pause') { $('#btn-retry').hidden = !(g && g.p.stage === 'encounter'); AU.suspend(); }
    else AU.resume();
    if (m === 'play') canvas.focus();
  }

  function hasSave() { const s = store.get(); return !!(s && M.loadGame(s)); }
  function startFromTitle(how) {
    AU.resume();
    if (how === 'continue') { g = M.loadGame(store.get()) || M.createGame(); }
    else { store.clear(); g = M.createGame(); }
    window.__myah.game = g;
    setMode(g.p.stage === 'end' ? 'end' : 'play');
    store.set(M.serialize(g));
  }

  $('#btn-new').addEventListener('click', () => startFromTitle('new'));
  $('#btn-continue').addEventListener('click', () => startFromTitle('continue'));
  $('#btn-resume').addEventListener('click', () => setMode('play'));
  $('#btn-journal').addEventListener('click', () => setMode('journal'));
  $('#btn-journal-close').addEventListener('click', () => setMode('play'));
  $('#btn-retry').addEventListener('click', () => { M.retryEncounter(g); flushEvents(); setMode('play'); });
  $('#btn-reset').addEventListener('click', () => { if (confirm('Start the whole prototype over? Your outcome and journal will be cleared.')) { M.resetAll(g); flushEvents(); setMode('play'); } });
  $('#btn-other').addEventListener('click', () => { M.replayAssignment(g); flushEvents(); setMode('play'); });
  $('#btn-restart').addEventListener('click', () => { M.resetAll(g); flushEvents(); setMode('play'); });
  $('#btn-mute').addEventListener('click', () => { AU.setMuted(!AU.isMuted()); $('#btn-mute').textContent = AU.isMuted() ? 'Sound: off' : 'Sound: on'; });

  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function renderJournal(el) {
    const j = g ? g.p.journal : [];
    const did = j.filter((x) => x.kind === 'did'), told = j.filter((x) => x.kind === 'told');
    const list = (xs) => xs.length ? '<ul>' + xs.map((x) => `<li>${esc(x.text)}</li>`).join('') + '</ul>' : '<p class="empty">Nothing yet.</p>';
    el.innerHTML = `<section><h3>What I did and saw</h3>${list(did)}</section><section><h3>What I was told</h3>${list(told)}</section>`;
  }
  function renderEnd() {
    const p = g.p;
    const out = p.outcome === 'preserve'
      ? 'You let the recording play, defended it until the guests were out, and brought it home. It plays on the shelf in a voice Mara says is yours.'
      : 'You took the recording, carried it through the play centre and fed it to the crusher. A jar of warm shards sits on the shelf, and on your return visit the recording was whole again.';
    const prep = M.prepInfo(g);
    $('#end .summary').innerHTML = `<p>${esc(out)}</p>` +
      `<p><b>Preparation:</b> ${prep.length ? prep.map(esc).join('; ') : 'none, you went in cold'}.</p>` +
      `<p><b>Fight retries:</b> ${p.attempts}. ${p.attempts ? 'Each retry kept your choice and preparation.' : ''}</p>` +
      `<p class="other">${p.outcome === 'preserve' ? 'Try the other approach: take the recording and carry it to the crusher.' : 'Try the other approach: hold E at the sound desk and defend the song.'}</p>`;
    renderJournal($('#end .cols'));
  }

  // ------------------------------------------------------------ events
  let toastT = 0;
  function flushEvents() {
    if (!g) return;
    const evs = g.events.splice(0);
    for (const e of evs) {
      if (e.type === 'sfx') AU.play(e.name);
      else if (e.type === 'save') store.set(M.serialize(g));
      else if (e.type === 'journal') { toastT = 2.2; }
      else if (e.type === 'shift') AU.play('shift');
      else if (e.type === 'win') AU.play('win');
      else if (e.type === 'end') setMode('end');
      else if (e.type === 'reset' || e.type === 'scene') clearInput();
    }
  }

  // ------------------------------------------------------------ HUD sync (DOM, only on change)
  const cache = {};
  function setText(sel, v) { if (cache[sel] !== v) { cache[sel] = v; $(sel).textContent = v; } }
  function setHTML(sel, v) { if (cache[sel] !== v) { cache[sel] = v; $(sel).innerHTML = v; } }
  function setHidden(sel, v) { const k = sel + ':h'; if (cache[k] !== v) { cache[k] = v; $(sel).hidden = v; } }

  function syncHUD(dt) {
    const hudOn = mode !== 'title' && !!g;
    setHidden('#hud', !hudOn);
    if (!hudOn) return;
    const p = g.p, goal = M.goalInfo(g);
    setText('#goal .goal-main', goal.text);
    setHTML('#goal .goal-sub', goal.sub.map((s) => `<li>${esc(s)}</li>`).join(''));
    const prep = g.scene === 'home' ? [] : M.prepInfo(g);
    setHTML('#goal .prep', prep.length ? '<b>Prepared</b>' + prep.map((s) => `<div>✓ ${esc(s)}</div>`).join('') : '');
    setText('#room', g.scene === 'home' ? 'Home' : `${M.LOC.name} · ${M.roomName(M.LOC, M.roomAt(M.LOC, g.player.x, g.player.y))}`);
    const P = g.player;
    $('#hp .bar i').style.width = `${(P.hp / P.maxHp) * 100}%`;
    setHidden('#hp', g.scene === 'home');
    const enc = p.stage === 'encounter' && g.enc;
    setHidden('#encbar', !(enc && p.commit === 'preserve'));
    if (enc && p.commit === 'preserve') {
      $('#encbar .time').style.width = `${Math.min(1, g.enc.t / M.T.defendTime) * 100}%`;
      $('#encbar .ped i').style.width = `${g.ped.hp}%`;
      const guestsOut = g.guests.filter((k) => k.state === 'gone').length;
      setText('#encbar .label', `Guests out: ${guestsOut} / ${g.guests.length}`);
    }
    setHidden('#carry', p.recording !== 'carried');
    const c = g.caption;
    setHidden('#caption', !c);
    if (c) { setText('#caption b', c.who); setText('#caption span', c.text); setHidden('#caption b', !c.who); }
    const d = g.dialogue;
    setHidden('#dialogue', !d);
    if (d) { const l = d.lines[d.i]; setText('#dialogue .who', l.who || ''); setText('#dialogue .text', l.text); setText('#dialogue .count', `${d.i + 1}/${d.lines.length}`); }
    setHidden('#down', !g.down);
    if (g.down) setText('#down .reason', g.down.reason === 'pedestal' ? 'The cake bears smashed the song quiet.' : 'You\'re knocked flat in a puddle of frosting.');
    toastT = Math.max(0, toastT - dt);
    setHidden('#toast', toastT <= 0);
  }

  // ------------------------------------------------------------ loop
  let last = performance.now(), acc = 0;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (mode === 'play' && g) {
      acc += dt;
      let steps = 0;
      while (acc >= STEP && steps < 6) {
        M.update(g, buildInput(), STEP);
        consumeEdges(); flushEvents();
        acc -= STEP; steps++;
      }
      if (steps === 6) acc = 0;
    } else acc = 0;
    if (g) {
      const m = g.music;
      AU.setSong(mode === 'play' && m.on, g.voice, m.mode === 'faint' ? 0.22 : m.mode === 'home' ? 0.35 : 1);
      RND.draw(ctx, g);
    } else drawTitleBackdrop();
    syncHUD(dt);
    requestAnimationFrame(frame);
  }
  function drawTitleBackdrop() { ctx.fillStyle = '#4b3a50'; ctx.fillRect(0, 0, RND.VIEW_W, RND.VIEW_H); }

  // ------------------------------------------------------------ boot
  window.__myah = { M, get game() { return g; }, set game(v) { g = v; }, mode: () => mode, start: startFromTitle, setMode };
  if (/[?&]reset\b/.test(location.search)) store.clear();
  fit();
  $('#btn-continue').hidden = !hasSave();
  $('#title .hint').textContent = hasSave() ? 'Enter: continue · or pick below' : 'Press Enter to start';
  setMode('title');
  requestAnimationFrame(frame);
})();
