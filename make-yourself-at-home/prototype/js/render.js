/* Make Yourself at Home — canvas renderer. Placeholder art drawn with Canvas 2D:
 * pastel rooms, teal-cardigan hero, rabbit silhouette, toy security, candy gore. */
(function (root) {
  'use strict';
  const M = root.MYAH;
  const VIEW_W = 960, VIEW_H = 600;
  const Z = 0.86; // world zoom: shows a whole room plus margin for the HUD
  const VW = VIEW_W / Z, VH = VIEW_H / Z;
  const TAU = Math.PI * 2;

  const ROOM_STYLE = {
    lobby: { floor: '#cdeedf', alt: '#bfe5d2', paper: '#8fcfb8', stripe: '#a7dcc8' },
    party: { floor: '#fcdde6', alt: '#f8ced9', paper: '#f3aec3', stripe: '#f7c4d3' },
    disposal: { floor: '#f5eecb', alt: '#ebe2b3', paper: '#dccb8a', stripe: '#e6d9a3' },
    service: { floor: '#dfd8eb', alt: '#d2c9e3', paper: '#ad9fd3', stripe: '#bdb1dc' },
    home: { floor: '#f1d4a9', alt: '#e8c697', paper: '#f2b98f', stripe: '#f6caa5' },
  };
  const GAPS = [[550, 170, 20, 100], [620, 540, 80, 40], [380, 440, 80, 40], [550, 600, 20, 80]];

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function circle(ctx, x, y, r, fill, stroke, lw) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 2; ctx.stroke(); }
  }
  function ellipse(ctx, x, y, rx, ry, fill) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fillStyle = fill; ctx.fill(); }
  function shadow(ctx, x, y, r) { ellipse(ctx, x, y + 2, r * 1.05, r * 0.45, 'rgba(70,40,60,0.18)'); }
  function text(ctx, s, x, y, size, color, align, weight) {
    ctx.font = `${weight || 700} ${size}px "Trebuchet MS", "Avenir Next", system-ui, sans-serif`;
    ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y);
  }
  function seeded(s) { let t = s * 9301 + 49297; return () => { t = (t * 9301 + 49297) % 233280; return t / 233280; }; }

  // ------------------------------------------------------------------ camera
  function camera(g) {
    const P = g.player, map = g.map;
    // Player sits a little below centre and the camera may show a strip above the top wall,
    // so north-wall details (banner, party exit, kitchen hatch) are not hidden under the HUD.
    let x = P.x - VW / 2, y = P.y - VH * 0.58;
    x = Math.max(0, Math.min(map.w - VW, x)); y = Math.max(-80, Math.min(map.h - VH + 90, y));
    if (map.w <= VW) x = (map.w - VW) / 2;
    if (map.h <= VH) y = (map.h - VH) / 2 - 30;
    const s = g.shake;
    if (s > 0.3) { x += Math.sin(g.time * 91) * s; y += Math.cos(g.time * 77) * s; }
    return { x, y };
  }

  // ------------------------------------------------------------------ main draw
  function draw(ctx, g) {
    const cam = camera(g);
    g._cam = cam;
    ctx.save();
    ctx.fillStyle = '#4b3a50'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.scale(Z, Z);
    ctx.translate(-Math.round(cam.x), -Math.round(cam.y));
    drawFloors(ctx, g);
    if (g.scene === 'location') drawLocationFloorDecor(ctx, g); else drawHomeFloorDecor(ctx, g);
    drawDecals(ctx, g);
    drawWalls(ctx, g);
    if (g.scene === 'location') drawLocationWallDecor(ctx, g); else drawHomeWallDecor(ctx, g);
    drawTells(ctx, g);
    drawSorted(ctx, g);
    drawShots(ctx, g);
    drawParticles(ctx, g);
    drawPoofs(ctx, g);
    drawWorldUI(ctx, g);
    ctx.restore();
    drawScreenUI(ctx, g, cam);
  }

  function drawFloors(ctx, g) {
    const map = g.map;
    for (const r of map.rooms) {
      const st = ROOM_STYLE[r.id];
      ctx.fillStyle = st.floor; ctx.fillRect(r.x, r.y, r.w, r.h);
      const ts = r.id === 'home' ? 0 : 40;
      if (ts) {
        ctx.fillStyle = st.alt;
        for (let y = r.y; y < r.y + r.h; y += ts) for (let x = r.x; x < r.x + r.w; x += ts)
          if (((x / ts) + (y / ts)) % 2 === 0) ctx.fillRect(x, y, ts, ts);
      } else {
        ctx.fillStyle = st.alt;
        for (let y = r.y; y < r.y + r.h; y += 28) ctx.fillRect(r.x, y, r.w, 2);
      }
    }
    if (g.scene === 'location') { ctx.fillStyle = '#e8dccf'; for (const q of GAPS) ctx.fillRect(q[0], q[1], q[2], q[3]); }
  }

  function drawDecals(ctx, g) {
    if (g.scene !== 'location') return;
    for (const d of g.p.decals) {
      const rnd = seeded(d.s || 1);
      ctx.globalAlpha = 0.88; ctx.fillStyle = d.c;
      ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r, d.r * 0.72, 0, 0, TAU); ctx.fill();
      for (let i = 0; i < 5; i++) {
        const a = rnd() * TAU, k = d.r * (0.8 + rnd() * 0.7);
        ctx.beginPath(); ctx.arc(d.x + Math.cos(a) * k, d.y + Math.sin(a) * k * 0.7, d.r * (0.15 + rnd() * 0.25), 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 0.35; ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(d.x - d.r * 0.3, d.y - d.r * 0.25, d.r * 0.3, d.r * 0.16, -0.4, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function wallRoom(g, w) {
    if (g.scene !== 'location') return 'home';
    const below = M.roomAt(g.map, w.x + w.w / 2, w.y + w.h + 6);
    return below;
  }
  function drawWalls(ctx, g) {
    const map = g.map;
    for (const w of map.walls) {
      const horizontal = w.w > w.h;
      if (g.scene === 'location' && w.y >= 700 && w.x >= 560) { // void under service
        ctx.fillStyle = '#4b3a50'; ctx.fillRect(w.x, w.y + 8, w.w, w.h);
        ctx.fillStyle = ROOM_STYLE.service.paper; ctx.fillRect(w.x, w.y, w.w, 26);
        ctx.fillStyle = '#e9d3c0'; ctx.fillRect(w.x, w.y + 26, w.w, 6);
        continue;
      }
      ctx.fillStyle = '#e9d3c0'; ctx.fillRect(w.x, w.y, w.w, w.h);
      if (horizontal && w.h >= 30) {
        const st = ROOM_STYLE[wallRoom(g, w)] || ROOM_STYLE.home;
        const fh = Math.min(w.h - 8, 40), fy = w.y + w.h - fh;
        ctx.fillStyle = st.paper; ctx.fillRect(w.x, fy, w.w, fh);
        ctx.fillStyle = st.stripe;
        for (let x = w.x + 6; x < w.x + w.w; x += 18) ctx.fillRect(x, fy, 7, fh);
        ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(w.x, fy + fh - 6, w.w, 6);
        ctx.fillStyle = 'rgba(80,40,60,0.15)'; ctx.fillRect(w.x, fy, w.w, 2);
      }
      ctx.strokeStyle = 'rgba(90,60,70,0.25)'; ctx.lineWidth = 1; ctx.strokeRect(w.x + 0.5, w.y + 0.5, w.w - 1, w.h - 1);
    }
  }

  // ------------------------------------------------------------------ location decor
  function bannerName(g) {
    const p = g.p;
    if (p.stage === 'encounter') return g.enc && g.enc.shifted ? 'WREN' : 'PIP';
    return p.shiftSeen && p.stage !== 'explore' ? 'WREN' : 'PIP';
  }

  function drawLocationFloorDecor(ctx, g) {
    const L = M.LOC, p = g.p;
    // lobby rug + sign
    ellipse(ctx, 300, 300, 150, 70, '#b3e0cd');
    ellipse(ctx, 300, 300, 120, 52, '#c6ead9');
    text(ctx, 'JELLYBEAN JUNCTION', 300, 300, 15, '#5aa58c');
    // stage
    const s = L.stage;
    ctx.fillStyle = '#d99a6c'; rr(ctx, s.x, s.y + 8, s.w, s.h, 10); ctx.fill();
    ctx.fillStyle = '#efb98a'; rr(ctx, s.x, s.y, s.w, s.h, 10); ctx.fill();
    ctx.fillStyle = '#f6c99e'; for (let y = s.y + 14; y < s.y + s.h; y += 22) ctx.fillRect(s.x + 6, y, s.w - 12, 3);
    for (let i = 0; i < 5; i++) star(ctx, s.x + 18 + i * 36, s.y + s.h - 12, 6, '#ffe08a');
    // dock
    const d = L.dock, cutDock = p.prep.cut === 'dock';
    ctx.fillStyle = '#bfb3d9'; rr(ctx, d.x, d.y, d.w, d.h, 12); ctx.fill();
    ctx.fillStyle = '#d4cbea'; rr(ctx, d.x + 6, d.y + 6, d.w - 12, d.h - 12, 9); ctx.fill();
    for (let i = 0; i < 3; i++) circle(ctx, d.x + 30 + i * 60, d.y + d.h - 8, 4, cutDock ? '#8a8496' : (Math.sin(g.time * 4 + i) > 0 ? '#7ee0a0' : '#4fbf7a'));
    text(ctx, cutDock ? 'DOCK: NO POWER' : 'CAKE BEAR DOCK', d.x + d.w / 2, d.y + d.h + 10, 10, '#7c6aa6');
    // service route clutter
    ctx.fillStyle = '#c3b8d9'; ctx.fillRect(570, 584, 810, 8);
    ctx.fillStyle = '#9e92bd'; for (let x = 600; x < 1380; x += 90) ctx.fillRect(x, 584, 6, 14);
    circle(ctx, 1320, 660, 14, '#8fb7d9'); circle(ctx, 1320, 656, 10, '#b5d3ea'); ctx.fillStyle = '#7a6a5a'; ctx.fillRect(1318, 630, 3, 26);
    // disposal hazard stripes in front of crusher
    for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? '#3d3a4a' : '#ffd166'; ctx.fillRect(46 + i * 19, 742, 19, 10); }
    text(ctx, 'DISPOSAL', 300, 520, 14, '#b9a660');
  }

  function drawLocationWallDecor(ctx, g) {
    const L = M.LOC, p = g.p;
    // banner
    const b = L.banner, name = bannerName(g);
    ctx.strokeStyle = '#a0738a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(b.x, b.y + 4); ctx.quadraticCurveTo(b.x + b.w / 2, b.y + 14, b.x + b.w, b.y + 4); ctx.stroke();
    const cols = ['#ff8fab', '#ffd166', '#8fd3ff', '#b8f2a8', '#c9b2f2'];
    for (let i = 0; i < 14; i++) { const x = b.x + 10 + i * 19.5; ctx.fillStyle = cols[i % 5]; ctx.beginPath(); ctx.moveTo(x - 7, b.y + 6); ctx.lineTo(x + 7, b.y + 6); ctx.lineTo(x, b.y + 18); ctx.fill(); }
    ctx.fillStyle = '#fff8ef'; rr(ctx, b.x + 30, b.y + 18, b.w - 60, 20, 6); ctx.fill();
    text(ctx, `HAPPY BIRTHDAY, ${name}`, b.x + b.w / 2, b.y + 28, 12, name === 'WREN' ? '#2a8f86' : '#d0587e');
    // guest exit door (north wall of party room) — opens while the song plays
    const ge = L.guestExit, open = g.music.on && g.music.mode !== 'faint';
    ctx.fillStyle = open ? '#fff3b8' : '#c98a6b'; rr(ctx, ge.x - 30, 14, 60, 42, 4); ctx.fill();
    if (open) { ctx.fillStyle = 'rgba(255,240,170,0.35)'; ctx.beginPath(); ctx.moveTo(ge.x - 30, 56); ctx.lineTo(ge.x + 30, 56); ctx.lineTo(ge.x + 50, 120); ctx.lineTo(ge.x - 50, 120); ctx.fill(); }
    else { ctx.fillStyle = '#b07457'; ctx.fillRect(ge.x - 1, 16, 2, 40); circle(ctx, ge.x + 8, 36, 2, '#ffd166'); }
    text(ctx, open ? 'EXIT OPEN' : 'PARTY EXIT', ge.x, 8, 9, '#7a4e5a');
    // lobby: way out door on west wall
    ctx.fillStyle = '#6fbf8f'; rr(ctx, 4, 300, 16, 80, 3); ctx.fill();
    text(ctx, 'WAY', 42, 290, 9, '#3f8a64'); text(ctx, 'OUT', 42, 300, 9, '#3f8a64');
    // lobby-disposal staff door sign
    text(ctx, 'STAFF', 420, 432, 9, '#7a6a5a');
    // curtain (service gap)
    const c = L.curtain;
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#c94a5b' : '#d95c6c'; ctx.fillRect(c.x + i * (c.w / 6), c.y - 6, c.w / 6 + 1, c.h + 4); }
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(c.x, c.y - 6, c.w, 5);
    text(ctx, 'STAFF', c.x + c.w / 2, c.y + 14, 9, '#ffe6ea');
    // fuse panel on the service route's south wall
    {
      const pd = L.panel;
      ctx.fillStyle = '#8e86a3'; rr(ctx, pd.dock.x - 30, 700, 140, 26, 4); ctx.fill();
      fuse(ctx, pd.dock.x, 712, p.prep.cut === 'dock', 'DOCK');
      fuse(ctx, pd.dance.x, 712, p.prep.cut === 'dance', 'DANCE');
    }
    // hatch (impossible kitchen)
    if (g.hatch) drawHatch(ctx, g, L.hatches[g.hatch.room]);
  }

  function fuse(ctx, x, y, pulled, label) {
    ctx.fillStyle = '#5b5470'; ctx.fillRect(x - 12, y - 8, 24, 16);
    if (!pulled) { ctx.fillStyle = '#ffd166'; ctx.fillRect(x - 5, y - 6, 10, 12); }
    text(ctx, label, x + 0, y + 0, 7, pulled ? '#ff8fab' : '#3a3550');
    circle(ctx, x + 16, y - 4, 3, pulled ? '#ff5d73' : '#7ee0a0');
  }

  function star(ctx, x, y, r, c) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * k, y + Math.sin(a) * k); }
    ctx.closePath(); ctx.fillStyle = c; ctx.fill();
  }

  function drawHatch(ctx, g, h) {
    if (!h) return;
    const open = Math.min(1, g.hatch.t / 0.6);
    const w = h.w * open;
    const x = h.x + (h.w - w) / 2;
    ctx.save();
    ctx.fillStyle = '#ffe9a8'; ctx.fillRect(x, h.y, w, h.h);
    ctx.beginPath(); ctx.rect(x, h.y, w, h.h); ctx.clip();
    ctx.fillStyle = '#f6d27a'; for (let i = h.x; i < h.x + h.w; i += 14) ctx.fillRect(i, h.y, 6, h.h);
    // kitchen table & cake with candles
    ctx.fillStyle = '#c98a5b'; ctx.fillRect(h.x, h.y + h.h - 10, h.w, 10);
    ctx.fillStyle = '#fff3f6'; ctx.fillRect(h.x + h.w - 46, h.y + h.h - 20, 30, 10);
    for (let i = 0; i < 4; i++) { ctx.fillStyle = '#8fd3ff'; ctx.fillRect(h.x + h.w - 43 + i * 7, h.y + h.h - 27, 2, 7); circle(ctx, h.x + h.w - 42 + i * 7, h.y + h.h - 29, 1.8, '#ffb347'); }
    // Mara in the kitchen
    const mx = h.x + 34, my = h.y + h.h - 4;
    ellipse(ctx, mx, my, 16, 14, '#e0a93a');
    circle(ctx, mx, my - 18, 9, '#f2c9a0');
    circle(ctx, mx, my - 30, 6, '#7a5a48'); ctx.fillStyle = '#7a5a48'; ctx.fillRect(mx - 9, my - 26, 18, 5);
    circle(ctx, mx - 3, my - 18, 1.3, '#3a2a2a'); circle(ctx, mx + 3, my - 18, 1.3, '#3a2a2a');
    ctx.restore();
    ctx.strokeStyle = '#8a5a3a'; ctx.lineWidth = 4; ctx.strokeRect(h.x - 2, h.y - 2, h.w + 4, h.h + 4);
    ctx.fillStyle = '#8a5a3a'; ctx.fillRect(h.x - 6, h.y + h.h, h.w + 12, 5);
  }

  // ------------------------------------------------------------------ home decor
  function drawHomeFloorDecor(ctx, g) {
    // kitchen tiles
    ctx.fillStyle = '#f7ead2'; ctx.fillRect(20, 64, 400, 220);
    ctx.fillStyle = '#efdcbc';
    for (let y = 64; y < 284; y += 30) for (let x = 20; x < 420; x += 30) if (((x - 20) / 30 + (y - 64) / 30) % 2 === 0) ctx.fillRect(x, y, 30, 30);
    // rug under sofa area
    ellipse(ctx, 670, 380, 170, 90, '#d98f8f'); ellipse(ctx, 670, 380, 150, 76, '#e8a9a0');
    for (let i = 0; i < 6; i++) ellipse(ctx, 560 + i * 44, 380, 8, 8, '#f4c9b5');
    // plant
    circle(ctx, 880, 520, 16, '#a8744f'); circle(ctx, 872, 500, 14, '#7cb77a'); circle(ctx, 890, 496, 12, '#8fca88'); circle(ctx, 880, 486, 10, '#7cb77a');
  }

  function drawHomeWallDecor(ctx, g) {
    const p = g.p;
    // window
    ctx.fillStyle = '#bfe6f5'; rr(ctx, 120, 10, 120, 44, 4); ctx.fill();
    ctx.strokeStyle = '#fff8ef'; ctx.lineWidth = 4; ctx.strokeRect(120, 10, 120, 44); ctx.beginPath(); ctx.moveTo(180, 10); ctx.lineTo(180, 54); ctx.stroke();
    // photos
    ctx.fillStyle = '#fff8ef'; ctx.fillRect(690, 16, 34, 28); ctx.fillStyle = '#9fd8c3'; ctx.fillRect(694, 20, 26, 20);
    circle(ctx, 702, 32, 4, '#2fa59a'); circle(ctx, 713, 32, 4, '#e0a93a');
    ctx.fillStyle = '#fff8ef'; ctx.fillRect(740, 20, 26, 24); ctx.fillStyle = '#f5b8c9'; ctx.fillRect(744, 24, 18, 16); circle(ctx, 753, 32, 4, '#2fa59a');
    // shelf
    const s = M.HOME.shelf;
    ctx.fillStyle = '#a8744f'; ctx.fillRect(s.x - 60, 46, 120, 8);
    ctx.fillStyle = '#d4a373'; ctx.fillRect(s.x - 50, 30, 14, 16); ctx.fillStyle = '#8fb7d9'; ctx.fillRect(s.x + 34, 26, 12, 20);
    if (p.recording === 'shelf') { recordingSprite(ctx, s.x, 40, 1, g.time); notes(ctx, s.x + 10, 26, g.time, 'you'); }
    else if (p.recording === 'shards') {
      ctx.fillStyle = 'rgba(200,230,255,0.7)'; rr(ctx, s.x - 11, 22, 22, 24, 5); ctx.fill();
      for (let i = 0; i < 7; i++) { ctx.fillStyle = ['#c9b2f2', '#8fd3ff', '#fff', '#ffd166'][i % 4]; ctx.fillRect(s.x - 8 + (i * 5) % 16, 30 + (i * 7) % 14, 4, 3); }
      if (Math.sin(g.time * 3) > 0.6) star(ctx, s.x + 8, 28, 3, '#fff');
    } else { ctx.strokeStyle = 'rgba(120,90,70,0.4)'; ctx.setLineDash([3, 3]); ctx.strokeRect(s.x - 14, 28, 28, 18); ctx.setLineDash([]); }
    // front door on right wall
    ctx.fillStyle = '#5fa8a0'; rr(ctx, 940, 260, 20, 80, 3); ctx.fill(); circle(ctx, 944, 300, 2.5, '#ffd166');
    text(ctx, 'OUT', 915, 250, 9, '#3f8a84');
    // stove + kettle on counter
    ctx.fillStyle = '#e8e2d8'; ctx.fillRect(60, 64, 60, 34); circle(ctx, 76, 80, 8, '#5b5470'); circle(ctx, 104, 80, 8, '#5b5470');
    circle(ctx, 104, 76, 7, '#e07a5f');
    if (Math.sin(g.time * 2) > 0) { ctx.fillStyle = 'rgba(255,255,255,0.6)'; circle(ctx, 108, 62 - (g.time * 20) % 14, 3, 'rgba(255,255,255,0.6)'); }
  }

  // ------------------------------------------------------------------ y-sorted scene
  function drawSorted(ctx, g) {
    const list = [];
    for (const s of g.map.solids) list.push({ y: s.y + s.h, f: () => drawSolid(ctx, g, s) });
    for (const pr of g.props) list.push({ y: pr.y + (pr.kind === 'cake' ? 0 : 6), f: () => drawProp(ctx, g, pr) });
    for (const n of g.npcs) list.push({ y: n.y, f: () => drawNpc(ctx, g, n) });
    for (const k of g.guests) if (k.state !== 'gone') list.push({ y: k.y, f: () => drawGuest(ctx, g, k) });
    for (const e of g.enemies) list.push({ y: e.y, f: () => drawEnemy(ctx, g, e) });
    if (g.ped) list.push({ y: g.ped.y, f: () => drawPedestal(ctx, g) });
    if (g.scene === 'location' && g.p.stage === 'revisit' && g.p.outcome === 'destroy') list.push({ y: 250, f: () => drawCostume(ctx, 1290, 250) });
    list.push({ y: g.player.y, f: () => drawPlayer(ctx, g) });
    list.sort((a, b) => a.y - b.y);
    for (const it of list) it.f();
  }

  function drawSolid(ctx, g, s) {
    switch (s.kind) {
      case 'desk':
        ctx.fillStyle = '#b5835a'; rr(ctx, s.x, s.y, s.w, s.h + 6, 6); ctx.fill();
        ctx.fillStyle = '#d4a373'; rr(ctx, s.x, s.y - 6, s.w, s.h, 6); ctx.fill();
        circle(ctx, s.x + 20, s.y + 4, 6, '#ffd166'); circle(ctx, s.x + 20, s.y + 1, 2, '#fff3b8');
        ctx.fillStyle = '#fff8ef'; ctx.fillRect(s.x + 60, s.y, 40, 14); text(ctx, 'SIGN IN', s.x + 80, s.y + 7, 7, '#a0738a');
        break;
      case 'coats': {
        const cols = ['#e07a5f', '#81b29a', '#f2cc8f', '#3d405b', '#c9b2f2', '#8fd3ff', '#f7a8c4'];
        ctx.fillStyle = '#7a5a48'; ctx.fillRect(s.x + 18, s.y - 10, 5, s.h + 8);
        for (let i = 0; i < 14; i++) ellipse(ctx, s.x + 8 + (i * 13) % 26, s.y + 6 + i * 5.5, 13, 9, cols[i % cols.length]);
        break;
      }
      case 'table':
        ctx.fillStyle = '#f2c1cf'; rr(ctx, s.x - 2, s.y + 6, s.w + 4, s.h + 4, 8); ctx.fill();
        ctx.fillStyle = '#fffaf5'; rr(ctx, s.x, s.y - 4, s.w, s.h, 8); ctx.fill();
        for (let x = s.x + 6; x < s.x + s.w; x += 12) circle(ctx, x, s.y + s.h - 4, 5, '#ffdbe5');
        break;
      case 'sounddesk': {
        const on = g.music.on && g.music.mode !== 'faint';
        ctx.fillStyle = '#5b4e78'; rr(ctx, s.x, s.y, s.w, s.h + 6, 6); ctx.fill();
        ctx.fillStyle = '#7b6aa0'; rr(ctx, s.x, s.y - 6, s.w, s.h, 6); ctx.fill();
        for (let i = 0; i < 5; i++) { ctx.fillStyle = '#d4cbea'; ctx.fillRect(s.x + 10 + i * 13, s.y, 3, 20); ctx.fillStyle = '#ffd166'; ctx.fillRect(s.x + 7 + i * 13, s.y + 4 + ((i * 7 + (on ? g.time * 30 : 0)) % 14), 9, 4); }
        circle(ctx, s.x + s.w - 8, s.y + 2, 5, on ? '#7ee0a0' : '#3a3550');
        text(ctx, 'SOUND', s.x + s.w / 2, s.y + s.h + 12, 8, '#7b6aa0');
        break;
      }
      case 'crusher': {
        ctx.fillStyle = '#7f8ca0'; rr(ctx, s.x, s.y, s.w, s.h, 8); ctx.fill();
        ctx.fillStyle = '#a3b0c4'; rr(ctx, s.x + 6, s.y - 14, s.w - 12, s.h - 10, 8); ctx.fill();
        ctx.fillStyle = '#4b3a50'; ctx.fillRect(s.x + 22, s.y - 4, s.w - 44, 18);
        for (let i = 0; i < 6; i++) { const t = g.time * 6 + i; ctx.fillStyle = '#ff8fab'; ctx.fillRect(s.x + 26 + i * 17, s.y - 2 + Math.sin(t) * 3, 9, 6); }
        ctx.fillStyle = '#fff8ef'; rr(ctx, s.x + 20, s.y + 30, s.w - 40, 18, 4); ctx.fill();
        text(ctx, 'CAKE CRUSHER', s.x + s.w / 2, s.y + 39, 10, '#d0587e');
        if (g.p.outcome === 'destroy') { ctx.strokeStyle = '#5b5470'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(s.x + 110, s.y + 56); ctx.lineTo(s.x + 124, s.y + 66); ctx.lineTo(s.x + 116, s.y + 78); ctx.stroke(); }
        break;
      }
      case 'bins':
        for (let i = 0; i < 2; i++) { ctx.fillStyle = i ? '#9fd8c3' : '#f5b8c9'; rr(ctx, s.x + i * 33, s.y, 30, s.h, 6); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(s.x + i * 33, s.y, 30, 8); }
        break;
      case 'counter':
        ctx.fillStyle = '#d4a373'; ctx.fillRect(s.x, s.y, s.w, s.h + 6); ctx.fillStyle = '#efe6d8'; ctx.fillRect(s.x, s.y, s.w, s.h - 4);
        break;
      case 'dinner': {
        ctx.fillStyle = '#b5835a'; rr(ctx, s.x, s.y + 6, s.w, s.h, 10); ctx.fill();
        ctx.fillStyle = '#fff3f6'; rr(ctx, s.x, s.y - 4, s.w, s.h, 10); ctx.fill();
        // cake with candles
        ellipse(ctx, s.x + s.w / 2, s.y + 26, 22, 14, '#f7a8c4'); ellipse(ctx, s.x + s.w / 2, s.y + 22, 22, 12, '#fcd5e1');
        for (let i = 0; i < 7; i++) { const cx = s.x + s.w / 2 - 15 + i * 5; ctx.fillStyle = '#8fd3ff'; ctx.fillRect(cx, s.y + 10, 2, 8); if (g.p.stage === 'home_final') circle(ctx, cx + 1, s.y + 8, 1.8, '#ffb347'); }
        for (let i = 0; i < (g.p.stage === 'home_final' ? 4 : 3); i++) circle(ctx, s.x + 16 + i * 40, s.y + 50, 8, '#fffaf5', '#e8d5c4', 2);
        break;
      }
      case 'sofa':
        ctx.fillStyle = '#7d8db0'; rr(ctx, s.x, s.y - 10, s.w, s.h + 10, 12); ctx.fill();
        ctx.fillStyle = '#95a4c6'; rr(ctx, s.x + 10, s.y, s.w - 20, s.h - 14, 8); ctx.fill();
        circle(ctx, s.x + 40, s.y + 6, 10, '#ffd166'); circle(ctx, s.x + s.w - 40, s.y + 6, 10, '#f7a8c4');
        break;
    }
  }

  function drawProp(ctx, g, pr) {
    if (pr.kind === 'balloon') {
      const bob = Math.sin(g.time * 2 + pr.x) * 3;
      ctx.strokeStyle = 'rgba(120,90,110,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pr.x, pr.y + 6); ctx.quadraticCurveTo(pr.x + 4, pr.y - 6, pr.x, pr.y - 14 + bob); ctx.stroke();
      shadow(ctx, pr.x, pr.y + 4, 5);
      ellipse(ctx, pr.x, pr.y - 26 + bob, 11, 13, pr.c);
      ellipse(ctx, pr.x - 4, pr.y - 31 + bob, 3, 4, 'rgba(255,255,255,0.7)');
    } else {
      ellipse(ctx, pr.x, pr.y + 2, 14, 9, '#e7a37c');
      ellipse(ctx, pr.x, pr.y - 4, 14, 9, pr.c);
      for (let i = 0; i < 5; i++) circle(ctx, pr.x - 10 + i * 5, pr.y - 5 + (i % 2) * 3, 1.5, ['#ff5d73', '#8fd3ff', '#ffd166'][i % 3]);
      ctx.fillStyle = '#8fd3ff'; ctx.fillRect(pr.x - 1, pr.y - 16, 2, 8); circle(ctx, pr.x, pr.y - 18, 2, '#ffb347');
    }
  }

  function recordingSprite(ctx, x, y, k, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = '#fff3e6'; rr(ctx, -11, -8, 22, 15, 3); ctx.fill();
    ctx.strokeStyle = '#a0738a'; ctx.lineWidth = 1.2; ctx.stroke();
    circle(ctx, -5, -1, 3.2, '#5b4e78'); circle(ctx, 5, -1, 3.2, '#5b4e78');
    ctx.fillStyle = '#ff8fab'; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(-6, -13); ctx.lineTo(-6, -6); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(6, -13); ctx.lineTo(6, -6); ctx.fill();
    ctx.restore();
  }
  function notes(ctx, x, y, t, voice) {
    for (let i = 0; i < 3; i++) {
      const k = (t * 0.8 + i / 3) % 1;
      ctx.globalAlpha = 1 - k;
      text(ctx, i % 2 ? '♪' : '♫', x + Math.sin((t + i) * 3) * 8 + i * 6, y - k * 30, 13, voice === 'you' ? '#2a8f86' : '#d0587e');
    }
    ctx.globalAlpha = 1;
  }

  function drawPedestal(ctx, g) {
    const ped = g.ped, p = g.p;
    shadow(ctx, ped.x, ped.y + 4, ped.r + 2);
    ctx.fillStyle = '#b39ddb'; rr(ctx, ped.x - 16, ped.y - 30, 32, 34, 4); ctx.fill();
    ctx.fillStyle = '#c9b2f2'; rr(ctx, ped.x - 13, ped.y - 30, 6, 34, 3); ctx.fill();
    ellipse(ctx, ped.x, ped.y - 32, 22, 8, '#e3d6fb');
    if (ped.hp < 100 && p.stage === 'encounter') {
      ctx.strokeStyle = '#5b4e78'; ctx.lineWidth = 1.5; ctx.beginPath();
      const cracks = Math.ceil((100 - ped.hp) / 25);
      for (let i = 0; i < cracks; i++) { ctx.moveTo(ped.x - 10 + i * 7, ped.y - 28); ctx.lineTo(ped.x - 6 + i * 7, ped.y - 18); ctx.lineTo(ped.x - 11 + i * 7, ped.y - 8); }
      ctx.stroke();
    }
    if (p.encSnap && p.stage !== 'encounter' && p.stage !== 'explore') { ctx.strokeStyle = 'rgba(91,78,120,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ped.x + 6, ped.y - 28); ctx.lineTo(ped.x + 2, ped.y - 16); ctx.lineTo(ped.x + 8, ped.y - 6); ctx.stroke(); }
    const onPed = p.recording === 'pedestal' && (p.stage === 'explore' || p.stage === 'encounter' || p.stage === 'aftermath') || (p.stage === 'revisit' && p.outcome === 'destroy');
    if (onPed) recordingSprite(ctx, ped.x, ped.y - 40, 1.3, g.time);
    if (g.music.on && (g.music.mode !== 'home')) notes(ctx, ped.x + 8, ped.y - 52, g.time, g.voice);
    if (onPed && p.stage !== 'revisit') { ctx.fillStyle = '#fff8ef'; rr(ctx, ped.x - 14, ped.y - 16, 28, 11, 3); ctx.fill(); text(ctx, p.stage === 'revisit' ? 'WREN' : 'PIP', ped.x, ped.y - 10, 8, '#a0738a'); }
  }

  function drawCostume(ctx, x, y) {
    shadow(ctx, x, y + 6, 18);
    ellipse(ctx, x, y + 2, 20, 9, '#efe6f7');
    ellipse(ctx, x - 12, y - 2, 9, 4, '#efe6f7'); ellipse(ctx, x + 14, y - 1, 10, 4, '#efe6f7');
    ellipse(ctx, x - 12, y - 2, 6, 2, '#f7b9d7'); ellipse(ctx, x + 14, y - 1, 7, 2, '#f7b9d7');
    ctx.fillStyle = '#d0587e'; ctx.fillRect(x - 5, y - 2, 10, 4);
  }

  // ------------------------------------------------------------------ characters
  function body(ctx, x, y, w, h, color, dark) {
    ctx.fillStyle = dark; rr(ctx, x - w / 2, y - h, w, h, w / 2.2); ctx.fill();
    ctx.fillStyle = color; rr(ctx, x - w / 2 + 1.5, y - h, w - 3, h - 2.5, w / 2.4); ctx.fill();
  }
  function eyes(ctx, x, y, f, color, spread) {
    const ox = f.x * 3, oy = f.y * 1.5, s = spread || 3.4;
    if (f.y < -0.6) return;
    circle(ctx, x - s + ox, y + oy, 1.6, color); circle(ctx, x + s + ox, y + oy, 1.6, color);
  }

  function drawPlayer(ctx, g) {
    const P = g.player, p = g.p;
    const x = P.x, y = P.y;
    if (P.hp <= 0) { shadow(ctx, x, y, 14); ellipse(ctx, x, y - 4, 16, 9, '#2fa59a'); circle(ctx, x + 14, y - 6, 7, '#f2c9a0'); return; }
    if (P.state === 'dodge') { ctx.globalAlpha = 0.25; body(ctx, x - P.dx * 14, y - P.dy * 14, 22, 26, '#7fd6cc', '#2fa59a'); ctx.globalAlpha = 0.5; body(ctx, x - P.dx * 7, y - P.dy * 7, 22, 26, '#7fd6cc', '#2fa59a'); ctx.globalAlpha = 1; }
    if (P.inv > 0 && Math.floor(P.inv * 20) % 2 === 0) ctx.globalAlpha = 0.45;
    shadow(ctx, x, y, 13);
    const bob = P.state === 'free' && (Math.abs(P.vx) + Math.abs(P.vy) > 1) ? Math.abs(Math.sin(P.walkT)) * 2 : 0;
    const squash = P.state === 'attack' && P.kind === 'heavy' && P.phase === 'startup' ? 3 : 0;
    // heavy charge glow
    if (P.state === 'attack' && P.kind === 'heavy' && P.phase === 'startup') { ctx.globalAlpha = 0.5; circle(ctx, x, y - 12, 22 + P.t * 30, null, '#ffd166', 3); ctx.globalAlpha = 1; }
    const by = y - bob;
    // legs
    ctx.fillStyle = '#4a5a7a'; ctx.fillRect(x - 6, by - 6, 4, 6); ctx.fillRect(x + 2, by - 6, 4, 6);
    // cardigan body
    body(ctx, x, by - 4 + squash, 24, 24 - squash, '#2fa59a', '#1f7d75');
    ctx.fillStyle = '#7fd6cc'; ctx.fillRect(x - 1, by - 26 + squash, 2, 20); // placket
    circle(ctx, x + 3.5, by - 20 + squash, 1.2, '#fff3d6'); circle(ctx, x + 3.5, by - 14 + squash, 1.2, '#fff3d6');
    // head
    circle(ctx, x, by - 34 + squash, 10, '#f2c9a0');
    ctx.fillStyle = '#4a3328'; ctx.beginPath(); ctx.arc(x, by - 36 + squash, 10.5, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
    if (P.face.y < -0.6) { ctx.beginPath(); ctx.arc(x, by - 34 + squash, 10, 0, TAU); ctx.fill(); }
    else eyes(ctx, x, by - 33 + squash, P.face, '#3a2a2a', 3.4);
    // weapon: frosting spatula held in facing direction
    const fa = Math.atan2(P.face.y, P.face.x);
    let wa = fa;
    if (P.state === 'attack') {
      const A = P.kind === 'light' ? M.T.light : M.T.heavy;
      const prog = Math.min(1, Math.max(0, (P.t - A.startup) / A.active));
      const side = P.kind === 'light' ? (P.combo % 2 ? 1 : -1) : 1;
      if (P.phase === 'startup') wa = fa - side * A.arc / 2;
      else wa = fa - side * A.arc / 2 + side * A.arc * prog;
    }
    const hx = x + Math.cos(wa) * 14, hy = by - 14 + Math.sin(wa) * 10;
    ctx.strokeStyle = '#c9b2c9'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + Math.cos(wa) * 20, hy + Math.sin(wa) * 20); ctx.stroke(); ctx.lineCap = 'butt';
    circle(ctx, hx, hy, 4, '#f2c9a0');
    // swing arc
    if (P.state === 'attack' && P.phase === 'active') {
      const A = P.kind === 'light' ? M.T.light : M.T.heavy;
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = P.kind === 'heavy' ? '#ffe08a' : (P.combo === 3 ? '#ffd1dc' : '#ffffff');
      ctx.beginPath(); ctx.arc(x, y - 10, A.range, fa - A.arc / 2, fa + A.arc / 2); ctx.arc(x, y - 10, A.range * 0.55, fa + A.arc / 2, fa - A.arc / 2, true); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // carried recording
    if (p.recording === 'carried' || p.recording === 'held') { recordingSprite(ctx, x - P.face.x * 4, by - 52 + Math.sin(g.time * 6) * 1.5, 1.1, g.time); }
    ctx.globalAlpha = 1;
  }

  function drawNpc(ctx, g, n) {
    const x = n.x, y = n.y, t = g.time;
    shadow(ctx, x, y, n.r);
    const P = g.player, f = { x: Math.sign(P.x - x) * 0.8, y: 0.4 };
    switch (n.kind) {
      case 'mara': {
        body(ctx, x, y, 24, 34, '#e0a93a', '#b8822a');
        ctx.fillStyle = '#fff8ef'; rr(ctx, x - 7, y - 26, 14, 20, 4); ctx.fill();
        circle(ctx, x, y - 44, 10, '#f2c9a0');
        circle(ctx, x, y - 58, 7, '#8a6a58'); ctx.fillStyle = '#8a6a58'; ctx.beginPath(); ctx.arc(x, y - 46, 10.5, Math.PI, TAU); ctx.fill();
        eyes(ctx, x, y - 43, f, '#3a2a2a', 3.4);
        break;
      }
      case 'tobi': {
        body(ctx, x, y, 30, 22, '#7bb37a', '#5a8f5a');
        circle(ctx, x, y - 30, 11, '#e0b48c');
        ctx.fillStyle = '#4f8f5a'; ctx.beginPath(); ctx.arc(x, y - 32, 11.5, Math.PI, TAU); ctx.fill(); ctx.fillRect(x - 12, y - 33, 24, 4);
        circle(ctx, x, y - 45, 4, '#fff3d6');
        eyes(ctx, x, y - 29, f, '#3a2a2a', 3.6);
        break;
      }
      case 'parent': {
        body(ctx, x, y, 22, 30, '#7d8db0', '#5d6a8a');
        ctx.fillStyle = '#a0522d'; rr(ctx, x + 8, y - 16, 10, 9, 2); ctx.fill();
        circle(ctx, x, y - 40, 9.5, '#d9a77c');
        ctx.fillStyle = '#5a4030'; ctx.beginPath(); ctx.arc(x, y - 42, 10, Math.PI * 0.9, Math.PI * 2.1); ctx.fill();
        eyes(ctx, x, y - 39, f, '#3a2a2a', 3.2);
        ctx.strokeStyle = '#3a2a2a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 3 + f.x * 3, y - 34); ctx.lineTo(x + 3 + f.x * 3, y - 34); ctx.stroke();
        break;
      }
      case 'rabbit': {
        const sway = Math.sin(t * 2) * 2;
        body(ctx, x, y, 28, 34, '#efe6f7', '#c9b8de');
        circle(ctx, x, y - 44, 13, '#f6f0fb');
        // ears: the silhouette
        ctx.save(); ctx.translate(x - 6, y - 56); ctx.rotate(-0.18 + sway * 0.02); ellipse(ctx, 0, -14, 5.5, 17, '#f6f0fb'); ellipse(ctx, 0, -14, 3, 13, '#f7b9d7'); ctx.restore();
        ctx.save(); ctx.translate(x + 6, y - 56); ctx.rotate(0.22 + sway * 0.02); ellipse(ctx, 0, -14, 5.5, 17, '#f6f0fb'); ellipse(ctx, 0, -14, 3, 13, '#f7b9d7'); ctx.restore();
        circle(ctx, x - 5, y - 45, 3, '#3a2a3a'); circle(ctx, x + 5, y - 45, 3, '#3a2a3a'); circle(ctx, x - 4, y - 46, 1, '#fff'); circle(ctx, x + 6, y - 46, 1, '#fff');
        circle(ctx, x, y - 39, 2, '#f7a8c4');
        ctx.fillStyle = '#d0587e'; ctx.beginPath(); ctx.moveTo(x, y - 30); ctx.lineTo(x - 8, y - 34); ctx.lineTo(x - 8, y - 26); ctx.fill(); ctx.beginPath(); ctx.moveTo(x, y - 30); ctx.lineTo(x + 8, y - 34); ctx.lineTo(x + 8, y - 26); ctx.fill();
        break;
      }
      case 'kid': {
        body(ctx, x, y, 16, 14, '#ffd166', '#d9a83c');
        circle(ctx, x, y - 20, 7, '#e8b48c');
        ctx.fillStyle = '#8fd3ff'; ctx.beginPath(); ctx.moveTo(x - 6, y - 25); ctx.lineTo(x + 6, y - 25); ctx.lineTo(x, y - 38); ctx.fill();
        eyes(ctx, x, y - 20, f, '#3a2a2a', 2.5);
        break;
      }
    }
  }

  function drawGuest(ctx, g, k) {
    const b = Math.sin(k.bob * 3) * 1.5;
    shadow(ctx, k.x, k.y, 7);
    body(ctx, k.x, k.y - b, 14, 12, k.c, 'rgba(0,0,0,0.15)');
    circle(ctx, k.x, k.y - 18 - b, 6.5, '#ecc29b');
    ctx.fillStyle = k.hat; ctx.beginPath(); ctx.moveTo(k.x - 5, k.y - 22 - b); ctx.lineTo(k.x + 5, k.y - 22 - b); ctx.lineTo(k.x, k.y - 34 - b); ctx.fill();
    circle(ctx, k.x - 2, k.y - 18 - b, 1, '#3a2a2a'); circle(ctx, k.x + 2, k.y - 18 - b, 1, '#3a2a2a');
  }

  function drawEnemy(ctx, g, e) {
    const x = e.x, y = e.y, t = g.time;
    shadow(ctx, x, y, e.r);
    ctx.save();
    if (e.flash > 0) ctx.filter = 'brightness(2.2)';
    if (e.type === 'dancer') drawDancer(ctx, g, e, x, y, t);
    else if (e.type === 'bear') drawBear(ctx, g, e, x, y, t);
    else drawPopper(ctx, g, e, x, y, t);
    ctx.restore();
    if (e.hp < e.maxHp && g.p.stage === 'encounter') {
      ctx.fillStyle = 'rgba(60,40,60,0.5)'; ctx.fillRect(x - 14, y + 8, 28, 4);
      ctx.fillStyle = '#ff5d73'; ctx.fillRect(x - 14, y + 8, 28 * Math.max(0, e.hp / e.maxHp), 4);
    }
    if ((e.state === 'alert' || e.state === 'wake') && g.p.stage === 'encounter') text(ctx, '!', x, y - 62 + Math.sin(t * 12) * 2, 18, '#ff5d73', 'center', 900);
  }

  function drawDancer(ctx, g, e, x, y, t) {
    let tilt = 0, sq = 0;
    const dark = e.state === 'dark';
    if (e.state === 'dance') tilt = Math.sin(e.t * 6 + x) * 0.25;
    if (e.state === 'windup') sq = Math.min(1, e.t / 0.55) * 5;
    if (e.state === 'spin') tilt = e.t * 40;
    ctx.translate(x, y); ctx.rotate(e.state === 'spin' ? 0 : tilt);
    const col = dark ? '#8a8496' : '#3d4f8f', dk = dark ? '#6c667a' : '#283566';
    ctx.fillStyle = '#26315e'; ctx.fillRect(-6, -6, 4, 6); ctx.fillRect(2, -6, 4, 6);
    body(ctx, 0, -4 + sq * 0.3, 24, 26 - sq, col, dk);
    star(ctx, -5, -18 + sq, 4, dark ? '#bbb' : '#ffd166');
    // arms / white gloves
    const arm = e.state === 'spin' ? Math.sin(e.t * 60) : e.state === 'dance' ? Math.sin(e.t * 6) : e.state === 'windup' ? -1 : 0.2;
    circle(ctx, -15, -16 + arm * 6 + sq, 4.5, dark ? '#ccc' : '#ffffff'); circle(ctx, 15, -16 - arm * 6 + sq, 4.5, dark ? '#ccc' : '#ffffff');
    // head: smiling mask under peaked cap
    circle(ctx, 0, -36 + sq, 10, dark ? '#d8d4dd' : '#fff8ef');
    ctx.fillStyle = dark ? '#6c667a' : '#26315e'; rr(ctx, -11, -50 + sq, 22, 9, 3); ctx.fill(); ctx.fillRect(-13, -42 + sq, 26, 3);
    star(ctx, 0, -46 + sq, 3, dark ? '#bbb' : '#ffd166');
    const hostile = ['chase', 'windup', 'spin', 'recover', 'stagger'].includes(e.state);
    if (dark) { ctx.strokeStyle = '#8a8496'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-5, -36 + sq); ctx.lineTo(-1, -36 + sq); ctx.moveTo(1, -36 + sq); ctx.lineTo(5, -36 + sq); ctx.stroke(); }
    else if (hostile) { ctx.fillStyle = '#ff5d73'; ctx.fillRect(-7, -38 + sq, 14, 3); }
    else { circle(ctx, -3.5, -37 + sq, 1.5, '#26315e'); circle(ctx, 3.5, -37 + sq, 1.5, '#26315e'); }
    ctx.strokeStyle = dark ? '#8a8496' : '#d0587e'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, -33 + sq, 4, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.rotate(-(e.state === 'spin' ? 0 : tilt)); ctx.translate(-x, -y);
    if (e.state === 'dance') notes(ctx, x + 10, y - 56, e.t + x, 'pip');
    if (e.state === 'spin') { ctx.globalAlpha = 0.5; circle(ctx, x, y - 14, ED().dancer.spinR - 6, null, '#ffffff', 4); ctx.globalAlpha = 1; }
  }

  function drawBear(ctx, g, e, x, y, t) {
    const active = ['seek', 'aim', 'charge', 'recover', 'stagger', 'wake', 'stir'].includes(e.state);
    const dim = e.state === 'dark' || e.state === 'spent';
    let ox = 0;
    if (e.state === 'aim') ox = Math.sin(t * 60) * 2;
    if (e.state === 'wake') ox = Math.sin(t * 30) * 1;
    const cx = x + ox;
    const col = dim ? '#d9bcc6' : '#f7a8c4', dk = dim ? '#b9a0aa' : '#d9809f';
    const slump = e.state === 'spent' || e.state === 'dark' ? 6 : (e.state === 'dock' ? 3 : 0);
    // legs
    circle(ctx, cx - 8, y - 2, 5, dk); circle(ctx, cx + 8, y - 2, 5, dk);
    body(ctx, cx, y - 2, 30, 28 - slump, col, dk);
    // frosting drips
    ctx.fillStyle = '#fff3f6'; ctx.beginPath(); ctx.ellipse(cx, y - 26 + slump, 14, 5, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 4; i++) ellipse(ctx, cx - 10 + i * 7, y - 22 + slump + (i % 2) * 3, 2.5, 4, '#fff3f6');
    // head + ears
    circle(ctx, cx - 10, y - 46 + slump, 5.5, dk); circle(ctx, cx + 10, y - 46 + slump, 5.5, dk);
    circle(ctx, cx, y - 38 + slump, 12, col);
    ellipse(ctx, cx, y - 33 + slump, 6, 4, '#fff3f6'); circle(ctx, cx, y - 34 + slump, 1.8, '#5b3a4a');
    // candle on head
    ctx.fillStyle = '#8fd3ff'; ctx.fillRect(cx - 2, y - 60 + slump, 4, 10);
    if (active && !dim) { const fl = 3 + Math.sin(t * 20) * 0.8; ellipse(ctx, cx, y - 64 + slump, 2.5, fl + 1, '#ffb347'); ellipse(ctx, cx, y - 63 + slump, 1.3, fl - 1, '#fff3b8'); }
    // eyes: dark when dormant, glowing when awake
    if (active && !dim) { circle(ctx, cx - 4.5, y - 40 + slump, 2.4, e.state === 'aim' || e.state === 'charge' ? '#ff5d73' : '#ffd166'); circle(ctx, cx + 4.5, y - 40 + slump, 2.4, e.state === 'aim' || e.state === 'charge' ? '#ff5d73' : '#ffd166'); }
    else { ctx.strokeStyle = '#5b3a4a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - 7, y - 40 + slump); ctx.lineTo(cx - 2, y - 40 + slump); ctx.moveTo(cx + 2, y - 40 + slump); ctx.lineTo(cx + 7, y - 40 + slump); ctx.stroke(); }
    if (e.state === 'charge') { ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(x - e.dx * 20 + e.dy * i * 9, y - 16 - e.dx * i * 9 - e.dy * 20); ctx.lineTo(x - e.dx * 42 + e.dy * i * 9, y - 16 - e.dx * i * 9 - e.dy * 42); ctx.stroke(); } }
  }

  function drawPopper(ctx, g, e, x, y, t) {
    const rec = e.state === 'recoil' ? Math.max(0, 1 - e.t / 0.35) : 0;
    const cdT = e.state === 'move' && e.cd < 0.6 ? Math.sin(t * 40) * 1.5 : 0;
    ctx.fillStyle = '#d9a83c'; ctx.fillRect(x - 6, y - 5, 4, 5); ctx.fillRect(x + 2, y - 5, 4, 5);
    ctx.save(); ctx.translate(x + cdT, y - 4 + rec * 3);
    ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.lineTo(4, -34); ctx.lineTo(-4, -34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff8fab'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-11 + i * 2.5, -4 - i * 10); ctx.lineTo(11 - i * 2.5, -8 - i * 10); ctx.lineTo(10 - i * 2.5, -12 - i * 10); ctx.lineTo(-10 + i * 2.5, -8 - i * 10); ctx.fill(); }
    ellipse(ctx, 0, -35, 6, 3, '#3d3a4a');
    circle(ctx, -4, -16, 2, '#3a2a2a'); circle(ctx, 4, -16, 2, '#3a2a2a');
    if (e.state === 'move' && e.cd < 0.6) { circle(ctx, 0, -40, 4, '#ffffff'); }
    ctx.restore();
  }

  function ED() { return M.ED; }

  // ------------------------------------------------------------------ telegraphs
  function drawTells(ctx, g) {
    for (const e of g.enemies) {
      if (e.type === 'dancer' && e.state === 'windup') {
        const D = M.ED.dancer, k = Math.min(1, e.t / (e.slow ? D.slowWindup : D.windup));
        ctx.fillStyle = `rgba(255,140,90,${0.12 + k * 0.18})`; circle(ctx, e.x, e.y, D.spinR, ctx.fillStyle);
        ctx.strokeStyle = 'rgba(255,110,80,0.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(e.x, e.y, D.spinR, 0, TAU); ctx.stroke();
        ctx.fillStyle = 'rgba(255,110,80,0.35)'; ctx.beginPath(); ctx.arc(e.x, e.y, D.spinR * k, 0, TAU); ctx.fill();
      }
      if (e.type === 'bear' && e.state === 'aim') {
        const D = M.ED.bear, sp = e.slow ? D.slowChargeSpeed : D.chargeSpeed, len = sp * D.chargeT + 20;
        const k = Math.min(1, e.t / (e.slow ? D.slowAim : D.aim));
        ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(Math.atan2(e.dy, e.dx));
        ctx.fillStyle = `rgba(255,93,115,${0.12 + 0.2 * k})`; rr(ctx, 0, -e.r, len, e.r * 2, e.r); ctx.fill();
        ctx.fillStyle = 'rgba(255,93,115,0.4)'; rr(ctx, 0, -e.r, len * k, e.r * 2, e.r); ctx.fill();
        ctx.restore();
      }
    }
  }
  function drawShots(ctx, g) {
    for (const s of g.shots) {
      const k = s.t / s.dur;
      ctx.strokeStyle = 'rgba(255,93,115,0.85)'; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
      ctx.beginPath(); ctx.arc(s.tx, s.ty, s.r, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = `rgba(255,93,115,${0.1 + k * 0.25})`; ctx.beginPath(); ctx.arc(s.tx, s.ty, s.r * k, 0, TAU); ctx.fill();
      const x = s.x0 + (s.tx - s.x0) * k, y = s.y0 + (s.ty - s.y0) * k - Math.sin(k * Math.PI) * 90;
      shadow(ctx, s.x0 + (s.tx - s.x0) * k, s.y0 + (s.ty - s.y0) * k + 10, 5);
      circle(ctx, x, y, 7, '#fff6e0', '#ff8fab', 2);
    }
  }
  function drawParticles(ctx, g) {
    for (const q of g.particles) {
      const a = 1 - q.t / q.life;
      ctx.globalAlpha = Math.min(1, a * 1.6);
      ctx.fillStyle = q.c;
      if (q.sq) { ctx.save(); ctx.translate(q.x, q.y - q.z); ctx.rotate(q.rot); ctx.fillRect(-q.s, -q.s / 2.5, q.s * 2, q.s / 1.25); ctx.restore(); }
      else { ctx.beginPath(); ctx.arc(q.x, q.y - q.z, q.s, 0, TAU); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }
  function drawPoofs(ctx, g) {
    for (const q of g.poofs) { ctx.globalAlpha = 1 - q.t / 0.6; circle(ctx, q.x, q.y - 14, 10 + q.t * 50, null, '#ffffff', 4); }
    ctx.globalAlpha = 1;
  }

  // ------------------------------------------------------------------ prompts & markers
  function drawWorldUI(ctx, g) {
    const goal = M.goalInfo(g);
    const it = g.focus;
    // goal marker above target (if on-screen and not already focused)
    if (goal.target && !(it && Math.hypot(it.x - goal.target.x, it.y - goal.target.y) < 30)) {
      const b = Math.sin(g.time * 5) * 4;
      const tx = goal.target.x, ty = goal.target.y - 78 + b;
      ctx.fillStyle = '#ffb347'; ctx.strokeStyle = '#7a4e2a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(tx - 9, ty - 8); ctx.lineTo(tx + 9, ty - 8); ctx.lineTo(tx, ty + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    if (it && !g.down) drawPrompt(ctx, g, it);
  }

  function drawPrompt(ctx, g, it) {
    const lines = [];
    if (it.tap && it.label) lines.push({ key: 'E', label: it.label });
    if (it.hold) lines.push({ key: 'Hold E', label: it.holdLabel, hold: true });
    if (!lines.length) return;
    ctx.font = '700 13px "Trebuchet MS", system-ui, sans-serif';
    let w = 0;
    for (const l of lines) w = Math.max(w, ctx.measureText(l.label).width + (l.key.length > 1 ? 66 : 38));
    const h = lines.length * 24 + 8;
    let x = it.x - w / 2, y = it.y - 84 - h;
    const cam = g._cam || { x: 0, y: 0 };
    x = Math.max(cam.x + 6, Math.min(cam.x + VW - w - 6, x));
    if ((y - cam.y) * Z < 150) y = it.y + 22; // flip below the object rather than under the HUD
    ctx.fillStyle = 'rgba(58,40,66,0.9)'; rr(ctx, x, y, w, h, 9); ctx.fill();
    lines.forEach((l, i) => {
      const ly = y + 16 + i * 24;
      const kw = l.key.length > 1 ? 52 : 22;
      ctx.fillStyle = l.hold ? '#ffd166' : '#fff8ef'; rr(ctx, x + 8, ly - 9, kw, 18, 5); ctx.fill();
      text(ctx, l.key, x + 8 + kw / 2, ly, 11, '#3a2842');
      text(ctx, l.label, x + 16 + kw, ly, 13, '#fff8ef', 'left');
      if (l.hold && g.hold && g.hold.id === it.id) {
        ctx.fillStyle = 'rgba(255,209,102,0.35)'; rr(ctx, x + 8, ly - 9, kw * g.hold.p, 18, 5); ctx.fill();
        ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(it.x, it.y - 20, 22, -Math.PI / 2, -Math.PI / 2 + TAU * g.hold.p); ctx.stroke();
      }
    });
  }

  function drawScreenUI(ctx, g, cam) {
    const goal = M.goalInfo(g);
    if (goal.target) {
      const sx = (goal.target.x - cam.x) * Z, sy = (goal.target.y - cam.y - 30) * Z;
      const m = 34;
      if (sx < m || sx > VIEW_W - m || sy < m || sy > VIEW_H - m) {
        const cx = VIEW_W / 2, cy = VIEW_H / 2, a = Math.atan2(sy - cy, sx - cx);
        const k = Math.min((VIEW_W / 2 - m) / Math.abs(Math.cos(a) || 1e-6), (VIEW_H / 2 - m) / Math.abs(Math.sin(a) || 1e-6));
        const ax = cx + Math.cos(a) * k, ay = cy + Math.sin(a) * k;
        ctx.save(); ctx.translate(ax, ay); ctx.rotate(a);
        ctx.fillStyle = '#ffb347'; ctx.strokeStyle = '#7a4e2a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-8, -11); ctx.lineTo(-3, 0); ctx.lineTo(-8, 11); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }
    const P = g.player;
    if (P.hp > 0 && P.hp < 35) {
      const grd = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, 200, VIEW_W / 2, VIEW_H / 2, 560);
      grd.addColorStop(0, 'rgba(255,93,115,0)'); grd.addColorStop(1, `rgba(255,93,115,${0.25 + Math.sin(g.time * 6) * 0.08})`);
      ctx.fillStyle = grd; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }
  }

  root.MYAH_RENDER = { draw, VIEW_W, VIEW_H, Z, camera };
})(typeof window !== 'undefined' ? window : globalThis);
