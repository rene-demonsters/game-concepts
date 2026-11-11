// Hollow Town, Prototype 0 "perceived-gap": canvas renderer + Read/Act/Watch UI.
// All game logic lives in sim.js; this file only draws and handles input.
import {
  DAYS, NEIGH, TOOLS, TELLS, PER_NEIGH, createTown, createState, stepDay, metrics,
  coverUp, credibility, townTrust, ghostRuns, simulate,
} from "./sim.js";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const TOWN_SEED = Number(params.get("town") ?? 11);
let noiseSeed = Number(params.get("seed") ?? 1);

// ---------- copy ----------
const ISSUE = "the Parking Structure referendum";
const BOT_LINES = ["Honestly, everybody agrees now.", "Wake up, this is obvious.", "Just asking questions here.", "Everyone I know is voting yes.", "Finally someone said it."];
const YES_LINES = ["Seems fine to me.", "More parking, fewer headaches.", "Bring it on."];
const NO_LINES = ["Where would it even go?", "Hm. Source anyone?", "Not convinced."];
const HERO_LINES = { Tom: "Rain again. Route 9 is flooded.", Priya: "These posts all say the same thing.", Dev: "Which side is right? Genuinely asking." };
const TELL_TEXT = { phrasing: "the repeated phrasing", timing: "the identical posting times", source: "that every source cites another source" };
const FATE_LAST = { Tom: "a photo of route 9 in the rain", Priya: "a correction nobody read", Dev: "\"Which side is right? Genuinely asking.\"" };

// ---------- state ----------
const town = createTown(TOWN_SEED);
const A = town.agents;
const G = {
  S: null, phase: "intro", queue: [], target: 0, xray: false, xr: 0, speed: 1,
  anim: null, sel: null, receipts: [], oOld: null, oShow: null, barA: null, barP: null,
  flash: new Float64Array(A.length).fill(-9), heroNoticed: new Set(), lastReach: new Set(), clock: 0,
};

function newGame() {
  G.S = createState(town, noiseSeed);
  G.queue = []; G.target = 0; G.anim = null; G.sel = null; G.receipts = []; G.heroNoticed = new Set(); G.lastReach = new Set();
  G.oShow = Float64Array.from(G.S.o);
  const m = metrics(G.S);
  G.barA = m.actual.slice(); G.barP = m.perceived.slice();
  G.phase = "read";
  hideOverlay(); renderAll();
}

// ---------- colors ----------
const BLUE = [33, 102, 172], NEUT = [207, 207, 207], ORANGE = [217, 95, 2];
function oc(o, desat = 0, alpha = 1) {
  const t = Math.max(-1, Math.min(1, o));
  const tgt = t < 0 ? BLUE : ORANGE;
  const k = Math.pow(Math.abs(t), 0.8);
  const c = NEUT.map((n, i) => n + (tgt[i] - n) * k);
  const g = c.map((v) => v + (130 - v) * desat);
  return `rgba(${g.map(Math.round).join(",")},${alpha})`;
}

// ---------- canvas setup ----------
const tc = $("town"), tctx = tc.getContext("2d");
const bc = $("bars"), bctx = bc.getContext("2d");
let TW = 0, TH = 0, scale = 1, ox = 0, oy = 0;
function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  for (const [c, ctx] of [[tc, tctx], [bc, bctx]]) {
    const w = c.clientWidth, h = c.clientHeight;
    c.width = Math.max(1, Math.round(w * dpr)); c.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  TW = tc.clientWidth; TH = tc.clientHeight;
  scale = Math.max(100, Math.min(TW, TH) - 24);
  ox = (TW - scale) / 2; oy = (TH - scale) / 2 + 4;
}
const px = (x) => ox + x * scale;
const py = (y) => oy + y * scale;
window.addEventListener("resize", resize);

const degR = (i) => { const d = town.adj[i].length; return scale * (d <= 6 ? 0.0145 : d <= 9 ? 0.018 : 0.0225); };

// ---------- bars (perceived vs actual) ----------
function drawBars(m) {
  const w = bc.clientWidth, h = bc.clientHeight, ctx = bctx;
  ctx.clearRect(0, 0, w, h);
  const left = 44, right = w - 52, bw = right - left, rowH = 16;
  const rows = [["Actual", G.barA, m.actualYes, 4], ["Seen", G.barP, m.seenYes, 30]];
  ctx.font = "11px system-ui, sans-serif"; ctx.textBaseline = "middle";
  for (const [label, hist, yes, y] of rows) {
    ctx.fillStyle = "#9aa0ae"; ctx.textAlign = "left"; ctx.fillText(label, 2, y + rowH / 2);
    let x = left;
    hist.forEach((share, b) => {
      ctx.fillStyle = oc(((b + 0.5) / hist.length) * 2 - 1);
      const ww = share * bw; ctx.fillRect(x, y, Math.max(0, ww - 1), rowH); x += ww;
    });
    ctx.fillStyle = "#e6e8ee"; ctx.textAlign = "right"; ctx.fillText(`${Math.round(yes * 100)}% yes`, w - 2, y + rowH / 2);
  }
  ctx.strokeStyle = "#e6e8ee"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(left + bw / 2, 0); ctx.lineTo(left + bw / 2, 50); ctx.stroke(); // 50% line
}

// ---------- drawing the town ----------
function drawTown() {
  const ctx = tctx; ctx.clearRect(0, 0, TW, TH);
  const S = G.S; if (!S) return;
  const xr = G.xr;
  // neighborhood blobs
  NEIGH.forEach((n, k) => {
    const c = A[k * PER_NEIGH];
    const cx = px(avg(k, "x")), cy = py(avg(k, "y"));
    ctx.fillStyle = G.target === k && G.phase === "read" ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.035)";
    ctx.beginPath(); ctx.arc(cx, cy, scale * 0.19, 0, 7); ctx.fill();
    ctx.fillStyle = "#6c7282"; ctx.font = `${Math.max(10, scale * 0.032)}px system-ui, sans-serif`; ctx.textAlign = "center";
    ctx.fillText(n.name, cx, cy + scale * 0.215);
  });
  // X-ray: bot-to-citizen lines from last day
  if (xr > 0.01 && G.anim === null) {
    ctx.strokeStyle = `rgba(179,107,255,${0.25 * xr})`; ctx.lineWidth = 1;
    for (const key of G.lastReach) {
      const [b, i] = key.split(":").map(Number);
      ctx.beginPath(); ctx.moveTo(px(town.bots[b].x), py(town.bots[b].y)); ctx.lineTo(px(A[i].x), py(A[i].y)); ctx.stroke();
    }
  }
  // citizens
  for (let i = 0; i < A.length; i++) {
    const a = A[i], x = px(a.x), y = py(a.y);
    const quiet = S.will[i] < 0.3;
    let r = degR(i) * (quiet ? 0.78 : 1);
    const dim = 1 - 0.65 * xr;
    ctx.globalAlpha = dim;
    ctx.fillStyle = oc(G.oShow[i], quiet ? 0.7 : 0);
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    // redundant sign mark so color is not the only channel
    if (Math.abs(G.oShow[i]) > 0.25 && r > 5) {
      ctx.strokeStyle = "rgba(0,0,0,.55)"; ctx.lineWidth = 1.4; ctx.beginPath();
      ctx.moveTo(x - r * 0.45, y); ctx.lineTo(x + r * 0.45, y);
      if (G.oShow[i] > 0) { ctx.moveTo(x, y - r * 0.45); ctx.lineTo(x, y + r * 0.45); }
      ctx.stroke();
    }
    const age = G.clock - G.flash[i];
    if (age >= 0 && age < 0.5) { ctx.strokeStyle = `rgba(255,255,255,${1 - age * 2})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r + 2 + age * 8, 0, 7); ctx.stroke(); }
    if (a.hero) {
      ctx.strokeStyle = "#e6e8ee"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, r + 2.5, 0, 7); ctx.stroke();
      ctx.fillStyle = "#e6e8ee"; ctx.font = `${Math.max(10, scale * 0.03)}px system-ui, sans-serif`; ctx.textAlign = "center";
      ctx.fillText(a.hero, x, y - r - 6);
    }
    if (G.sel === i) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r + 5, 0, 7); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  // bots: circles that look like citizens, triangles under X-ray
  for (const b of town.bots) {
    const x = px(b.x), y = py(b.y), r = scale * 0.0165;
    ctx.fillStyle = oc(0.8, 0, 1 - xr); ctx.globalAlpha = 1 - xr;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    if (xr > 0.01) {
      ctx.globalAlpha = xr; ctx.fillStyle = "#b36bff"; ctx.strokeStyle = "#e9d5ff"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, y - r * 1.25); ctx.lineTo(x + r * 1.15, y + r * 0.9); ctx.lineTo(x - r * 1.15, y + r * 0.9); ctx.closePath();
      ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
    }
  }
  // animation layers
  const an = G.anim;
  if (an) {
    for (const p of an.pulses) {
      const u = (G.clock - p.t0) / p.dur; if (u < 0 || u > 1) continue;
      const x0 = px(p.a.x), y0 = py(p.a.y), x1 = px(p.b.x), y1 = py(p.b.y);
      ctx.strokeStyle = p.bot && xr > 0.2 ? `rgba(179,107,255,${0.5 * (1 - u)})` : `rgba(255,255,255,${0.22 * (1 - u)})`;
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.fillStyle = p.bot && xr > 0.2 ? "#b36bff" : p.color;
      ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, 2.4, 0, 7); ctx.fill();
    }
    for (const r of an.rings) {
      const u = (G.clock - r.t0) / r.dur; if (u < 0 || u > 1) continue;
      ctx.strokeStyle = `rgba(150,156,170,${0.7 * (1 - u)})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px(r.x), py(r.y), 6 + u * scale * 0.09, 0, 7); ctx.stroke();
    }
    for (const b of an.bubbles) {
      const u = (G.clock - b.t0) / b.life; if (u < 0 || u > 1) continue;
      drawBubble(b, u);
    }
  }
}
const avg = (k, f) => { let s = 0; for (let i = 0; i < PER_NEIGH; i++) s += A[k * PER_NEIGH + i][f]; return s / PER_NEIGH; };

function drawBubble(b, u) {
  const ctx = tctx; ctx.font = `${Math.max(10, scale * 0.03)}px system-ui, sans-serif`;
  const tw = ctx.measureText(b.text).width, padX = 6, h = scale * 0.05;
  let x = Math.max(4 + tw / 2 + padX, Math.min(TW - 4 - tw / 2 - padX, px(b.x)));
  const y = py(b.y) - scale * 0.05 - u * 10;
  ctx.globalAlpha = Math.min(1, (1 - u) * 2.2);
  ctx.fillStyle = "#f2f3f7";
  const bx = x - tw / 2 - padX, bw = tw + padX * 2, r = h / 2;
  ctx.beginPath(); ctx.roundRect(bx, y - h / 2, bw, h, r); ctx.fill();
  if (b.bot && G.xr > 0.2) { ctx.strokeStyle = "#b36bff"; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.fillStyle = "#14161b"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(b.text, x, y + 0.5);
  ctx.globalAlpha = 1; ctx.textBaseline = "alphabetic";
}

// ---------- the Watch phase: replay the day's events as shapes and bubbles ----------
const pick = (arr, k) => arr[Math.abs(k) % arr.length];

function startWatch(ev, actions) {
  const D = 3.2;
  const an = { D, pulses: [], bubbles: [], rings: [], timeline: [], ev, actions, next: 0, silentSeen: 0 };
  const add = (at, fn) => an.timeline.push({ at, fn });
  const node = (o) => ({ x: o.x, y: o.y });
  const pulse = (a, b, color, bot) => an.pulses.push({ a, b, color, bot, t0: G.clock, dur: 0.7 });
  const bubble = (n, text, bot) => an.bubbles.push({ x: n.x, y: n.y, text, bot, t0: G.clock, life: 1.5 });
  // bot posts first
  ev.botPosts.forEach((bp, idx) => {
    const at = (idx / Math.max(1, ev.botPosts.length)) * D * 0.5;
    add(at, () => {
      const bot = town.bots[bp.bot];
      bp.targets.slice(0, 3).forEach((i) => pulse(node(bot), node(A[i]), "#f0a060", true));
      if (idx % 3 === 0) bubble(bot, pick(BOT_LINES, idx + G.S.day), true);
    });
  });
  // citizen posts: heroes always, plus a capped sample (renderer budget at 4x)
  const posts = ev.citizenPosts.filter((p) => A[p.from].hero).concat(ev.citizenPosts.filter((p) => !A[p.from].hero).filter((_, k) => k % 3 === 0)).slice(0, 14);
  posts.forEach((p, k) => {
    const at = D * 0.1 + (k / Math.max(1, posts.length)) * D * 0.6;
    add(at, () => {
      const a = A[p.from];
      G.flash[p.from] = G.clock;
      p.seenBy.slice(0, 2).forEach((j) => pulse(node(a), node(A[j]), p.stance > 0 ? "#f0a060" : "#6fa8dc", false));
      if (a.hero) bubble(a, HERO_LINES[a.hero] ?? "…", false);
      else if (k % 4 === 0) bubble(a, p.stance > 0 ? pick(YES_LINES, k + p.from) : pick(NO_LINES, k + p.from), false);
    });
  });
  ev.newSilent.slice(0, 6).forEach((i, k) => add(D * 0.65 + k * 0.1, () => { an.rings.push({ x: A[i].x, y: A[i].y, t0: G.clock, dur: 1.1 }); bubble(A[i], "…", false); }));
  ev.noticed.slice(0, 3).forEach((nt, k) => add(D * 0.45 + k * 0.15, () => bubble(A[nt.i], "?", false)));
  an.timeline.sort((x, y) => x.at - y.at);
  G.anim = an; G.clock = 0;
}

function updateAnim(dt) {
  const an = G.anim; if (!an) return;
  G.clock += dt * G.speed;
  while (an.next < an.timeline.length && an.timeline[an.next].at <= G.clock) an.timeline[an.next++].fn();
  const u = Math.min(1, G.clock / an.D);
  for (let i = 0; i < A.length; i++) G.oShow[i] = G.oOld[i] + (G.S.o[i] - G.oOld[i]) * u;
  if (G.clock >= an.D + 0.8) finishDay();
}

// ---------- day flow ----------
function runDay() {
  if (G.phase !== "read") return;
  const S = G.S, Nold = Float64Array.from(S.N);
  G.oOld = Float64Array.from(S.o);
  const actions = G.queue.slice(); G.queue = []; G.sel = null; $("inspect").hidden = true;
  const ev = stepDay(S, actions);
  G.lastReach = new Set(); ev.botPosts.forEach((bp) => bp.targets.forEach((i) => G.lastReach.add(`${bp.bot}:${i}`)));
  ev.noticed.forEach((n) => { if (A[n.i].hero) G.heroNoticed.add(A[n.i].hero); });
  G.phase = "watch"; G.pending = { ev, Nold, actions };
  startWatch(ev, actions);
  renderSheet();
}

function finishDay() {
  const { ev, Nold, actions } = G.pending;
  const S = G.S; G.anim = null; G.oShow = Float64Array.from(S.o);
  addReceipts(ev, Nold, actions);
  G.phase = "read";
  // Interrupt: someone noticed a tell and is asking in the feed.
  const hero = ev.noticed.find((n) => A[n.i].hero);
  if (hero || ev.noticed.length >= 3) {
    const who = hero ? A[hero.i].hero : `${ev.noticed.length} citizens`;
    const tell = (hero ?? ev.noticed[0]).tell;
    G.phase = "interrupt";
    showOverlay(`<h2>Interrupt</h2><h1>${who} noticed ${TELL_TEXT[tell]}</h1>
      <p>It is in the feed now, with a question mark.</p>
      <div class="opts">
        <button class="opt" data-ov="cover:${tell}">Cover it up<br><small class="dim">cuts that tell's heat by 40%, costs 2 reach tomorrow</small></button>
        <button class="opt" data-ov="ride">Let it ride<br><small class="dim">free, and the tell keeps its heat</small></button>
      </div>`);
    return;
  }
  afterDay();
}

function afterDay() {
  if (G.S.day >= DAYS) return showEnd();
  G.phase = "read"; renderAll();
}

function addReceipts(ev, Nold, actions) {
  const S = G.S, lines = [];
  for (const a of ev.actions) {
    lines.push(`${TOOLS[a.type].label} reached ${a.reached.length} of ${PER_NEIGH} in ${NEIGH[a.neigh].name}.`);
    if (a.layered) lines.push("The article cited the bot thread. Citations are citations.");
  }
  if (!ev.actions.length) lines.push("A quiet day. The town mostly talked to itself.");
  const hit = new Set(ev.actions.map((a) => a.neigh));
  for (const a of A) if (a.hero && hit.has(a.neigh)) {
    const d = S.N[a.id] - Nold[a.id];
    lines.push(`${a.hero} now thinks the town is ${Math.round(Math.abs(S.N[a.id]) * 100)}% ${S.N[a.id] >= 0 ? "pro" : "anti"}-structure (${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(2)} today).`);
  }
  const heroSilent = ev.newSilent.filter((i) => A[i].hero);
  heroSilent.forEach((i) => lines.push(`${A[i].hero} stopped posting. Nobody noticed.`));
  const others = ev.newSilent.length - heroSilent.length;
  if (others > 0) lines.push(`${others} other ${others === 1 ? "citizen" : "citizens"} stopped posting.`);
  if (ev.noticed.length) lines.push(`${ev.noticed.length} noticed ${TELL_TEXT[ev.noticed[0].tell]}. Trust in the feed is down.`);
  const m = metrics(S);
  const snark = m.gap > 0.12 ? `Perceived consensus: ${Math.round(m.seenYes * 100)}% yes. Actual: ${Math.round(m.actualYes * 100)}%. Nobody has noticed. Congratulations.` : null;
  G.receipts.unshift({ day: S.day, lines, snark });
  G.receipts = G.receipts.slice(0, 6);
}

// ---------- sheet UI ----------
function meter(v, cls = "") { return `<div class="meter ${cls}"><i style="width:${Math.round(Math.max(0, Math.min(1, v)) * 100)}%"></i></div>`; }

function renderSheet() {
  const S = G.S; if (!S) return;
  const used = G.queue.reduce((c, q) => c + TOOLS[q.type].cost, 0), left = S.reach - used;
  $("stats").innerHTML =
    `<span>Town trust</span>${meter(townTrust(S), townTrust(S) < 0.5 ? "danger" : "")}` +
    TELLS.map((t) => `<span>Heat: ${t}</span>${meter(S.heat[t], "heat")}`).join("") +
    `<span>Credibility</span>${meter(credibility(S))}`;
  const canAct = G.phase === "read";
  const tools = Object.entries(TOOLS).map(([k, t]) =>
    `<button class="tool" data-tool="${k}" ${canAct && t.cost <= left ? "" : "disabled"}>${t.label} · ${t.cost}<small>${k === "thread" ? "tells: phrasing, timing" : "tells: sourcing"}</small></button>`).join("");
  const targets = NEIGH.map((n, k) => `<button class="chip target ${G.target === k ? "on" : ""}" data-target="${k}">${n.name}</button>`).join("");
  const q = G.queue.map((x, i) => `<span class="q">${TOOLS[x.type].label} → ${NEIGH[x.neigh].name} <a href="#" data-unq="${i}" style="color:var(--dim)">✕</a></span>`).join("") || `<span class="dim">Nothing queued. Reach left: ${left} of ${S.reach}.</span>`;
  $("act").innerHTML = `<div class="row-btns">${targets}</div><div class="row-btns">${tools}</div><div class="queue">${q}</div>
    <div class="row-btns"><button class="go" data-run ${canAct ? "" : "disabled"}>${S.day >= DAYS ? "Election" : `Run day ${S.day + 1}`}</button></div>`;
  $("receipts").innerHTML = G.receipts.map((r) =>
    `<h4>Day ${r.day}</h4>${r.lines.map((l) => `<p>${l}</p>`).join("")}${r.snark ? `<p class="snark">${r.snark}</p>` : ""}`).join("");
}

function renderTop() {
  const S = G.S, m = metrics(S);
  $("dayLabel").textContent = `Day ${Math.min(S.day + (G.phase === "read" ? 1 : 0), DAYS)}/${DAYS}`;
  const gap = Math.round(m.gap * 100);
  $("gapLabel").textContent = `Illusion gap ${gap >= 0 ? "+" : ""}${gap} pts`;
  $("gapLabel").classList.toggle("hot", Math.abs(gap) >= 10);
  return m;
}
function renderAll() { renderTop(); renderSheet(); }

// ---------- inspect ----------
function inspect(i) {
  const S = G.S, a = A[i], w = S.why[i];
  G.sel = i;
  const f = (v) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2);
  const stance = (v) => (v > 0.08 ? "leans YES" : v < -0.08 ? "leans NO" : "undecided");
  $("inspect").hidden = false;
  $("inspect").innerHTML = `<button class="close" data-close>×</button>
    <h3>${a.hero ?? "Citizen " + (i + 1)} <span class="dim">· ${NEIGH[a.neigh].name}${a.hero ? " · " + a.blurb : ""}</span></h3>
    <div class="row"><span>Opinion</span><b>${f(S.o[i])} (${stance(S.o[i])})</b></div>
    <div class="row"><span>Thinks the town is</span><b>${f(S.N[i])} (${stance(S.N[i])})</b></div>
    <div class="row"><span>Willing to speak</span><b>${Math.round(S.will[i] * 100)}%</b></div>
    <div class="row"><span>Trust in the feed</span><b>${Math.round(S.trust[i] * 100)}%</b></div>
    <div class="row"><span>Notices tells</span><b>${Math.round(a.lit * 100)}%</b></div>
    <div class="why">Why they changed today: peer pressure ${f(w.conf)}, persuasion ${f(w.pers)}, own mind ${f(w.anch)}. ${Math.round(w.botShare * 100)}% of what they saw came from bots${G.xray ? "" : " (switch on X-ray to see who)"}.</div>`;
}

// ---------- overlays ----------
function showOverlay(html) { $("overlay").innerHTML = html; $("overlay").hidden = false; }
function hideOverlay() { $("overlay").hidden = true; }

function showIntro() {
  showOverlay(`<h1>Hollow Town</h1><p class="dim">Prototype 0 · the perceived gap</p>
    <p>You are the villain. A fictional town of 60 people is voting on ${ISSUE}. You run a small network of bot accounts and you want it to <b>pass</b>.</p>
    <p>You have 14 days. Bots rarely change minds directly. They change what people <i>think everyone else thinks</i>, and people who feel outnumbered go quiet.</p>
    <p>Watch the two bars at the top. The gap between them is the game.</p>
    <p class="dim">You are playing the antagonist so you can recognize the playbook. Everything here is fictional.</p>
    <div class="opts"><button class="opt" data-ov="start">Start</button></div>`);
}

function showEnd() {
  G.phase = "end";
  const S = G.S, m = metrics(S);
  const ghost = ghostRuns(town, 200, 1);
  const paired = simulate(town, noiseSeed, null);
  const mean = ghost.reduce((a, b) => a + b, 0) / ghost.length;
  const sd = Math.sqrt(ghost.reduce((a, b) => a + (b - mean) ** 2, 0) / ghost.length);
  const passed = m.voteYes > 0.5, pPass = ghost.filter((x) => x > 0.5).length / ghost.length;
  const effect = m.voteYes - paired.m.voteYes;
  const lo = 0.38, step = 0.02, nb = 12, bins = new Array(nb).fill(0);
  const bi = (x) => Math.max(0, Math.min(nb - 1, Math.floor((x - lo) / step)));
  ghost.forEach((x) => bins[bi(x)]++);
  const maxb = Math.max(...bins), you = bi(m.voteYes);
  const hist = bins.map((c, k) => `<i class="${k === you ? "you" : ""} ${k === 6 ? "half" : ""}" style="height:${Math.max(3, (c / maxb) * 100)}%"></i>`).join("");
  const fates = A.filter((a) => a.hero).map((a) => {
    const i = a.id, quiet = S.will[i] < 0.3, views = 12 + ((S.postCount[i] * 7) % 40);
    let t;
    if (a.hero === "Tom") t = quiet ? `Tom stopped posting on day ${S.lastPost[i] + 1}. Last post: ${FATE_LAST.Tom}. ${views} views.` : "Tom is still posting, mostly about the weather. Not everyone breaks.";
    else if (a.hero === "Priya") t = G.heroNoticed.has("Priya") ? "Priya spotted the pattern and said so. Half the town called it paranoia." : "Priya never noticed. The one person who might have was not shown the right thing.";
    else t = S.o[i] > 0.1 ? "Dev picked the majority and never knew it was staged." : "Dev is still undecided. Lucky, or just quiet.";
    return `<div class="fate"><b>${a.hero}</b> <span class="dim">(${a.blurb})</span><br>${t}</div>`;
  }).join("");
  const noticed = S.noticedTotal;
  const worked = noticed > 0 ? `${noticed} ${noticed === 1 ? "person" : "people"} noticed and said so. Checking who posted, and when, was enough.` : "Nothing yet. Nobody checked. That is the problem.";
  showOverlay(`<h2>Referendum result</h2>
    <div class="big ${passed ? "pass" : "fail"}">${passed ? "PASSED" : "FAILED"} · ${(m.voteYes * 100).toFixed(1)}% yes</div>
    <p class="dim">${passed ? "You won. The town got smaller." : "You lost. The town got smaller anyway."}</p>
    <h2>Town damage</h2>
    <p>Trust in the feed: ${Math.round(m.trust * 100)}% (was 100%)<br>Citizens who stopped posting: ${m.silent} (${paired.m.silent} without you)<br>Tells noticed: ${noticed}</p>
    ${fates}
    <h2>Without you</h2>
    <p>Same town, same weather, no bots: ${(paired.m.voteYes * 100).toFixed(1)}% yes. Your campaign moved the result by <b>${effect >= 0 ? "+" : "−"}${Math.abs(effect * 100).toFixed(1)} pts</b>.</p>
    <div class="hist">${hist}</div><div class="histlabels"><span>38%</span><span>50% ┃ yes share of 200 bot-free versions</span><span>62%</span></div>
    <p>The referendum passed in <b>${Math.round(pPass * 200)} of 200</b> bot-free versions of this town. Luck alone moves the result by about ±${(2 * sd * 100).toFixed(1)} pts, so ${Math.abs(effect) < 2 * sd ? "this effect is hard to tell apart from luck." : "this effect is larger than luck."}</p>
    <p class="dim">The bars also showed it: at the end, ${Math.round(m.seenYes * 100)}% of citizens believed the town leaned yes, while ${Math.round(m.actualYes * 100)}% actually did.</p>
    <h2>What still worked</h2><p>${worked}</p>
    <h2>How to spot it</h2>
    <p>Phrasing reused across accounts. Posts landing at identical times. Sources that only cite each other. Check who posted before you check what they said.</p>
    <div class="opts"><button class="opt" data-ov="again">Play again (new weather)</button><button class="opt" data-ov="xray">Show the bot accounts</button></div>`);
}

// ---------- input ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-tool],[data-target],[data-unq],[data-run],[data-close],[data-ov]");
  if (!t) return;
  e.preventDefault();
  const S = G.S;
  if (t.dataset.ov) {
    const v = t.dataset.ov;
    if (v === "start") newGame();
    else if (v === "again") { noiseSeed++; newGame(); }
    else if (v === "xray") { hideOverlay(); setXray(true); }
    else if (v === "ride") { hideOverlay(); afterDay(); }
    else if (v.startsWith("cover:")) { coverUp(S, v.slice(6)); hideOverlay(); afterDay(); }
    return;
  }
  if (G.phase !== "read") return;
  if (t.dataset.tool) G.queue.push({ type: t.dataset.tool, neigh: G.target });
  else if (t.dataset.target) G.target = Number(t.dataset.target);
  else if (t.dataset.unq) G.queue.splice(Number(t.dataset.unq), 1);
  else if (t.hasAttribute("data-run")) return runDay();
  else if (t.hasAttribute("data-close")) { G.sel = null; $("inspect").hidden = true; }
  renderSheet();
});

tc.addEventListener("pointerdown", (e) => {
  if (!G.S || G.phase === "intro") return;
  const r = tc.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  let best = -1, bd = 26;
  for (let i = 0; i < A.length; i++) { const d = Math.hypot(px(A[i].x) - x, py(A[i].y) - y); if (d < bd) { bd = d; best = i; } }
  if (best >= 0) { inspect(best); return; }
  for (let k = 0; k < NEIGH.length; k++) if (Math.hypot(px(avg(k, "x")) - x, py(avg(k, "y")) - y) < scale * 0.19 && G.phase === "read") { G.target = k; renderSheet(); }
});

function setXray(on) { G.xray = on; $("xray").setAttribute("aria-pressed", String(on)); }
$("xray").addEventListener("click", () => setXray(!G.xray));
$("speed").addEventListener("click", () => { G.speed = G.speed === 1 ? 4 : 1; $("speed").textContent = G.speed + "x"; $("speed").classList.toggle("on", G.speed === 4); });
window.addEventListener("keydown", (e) => { if (e.key === "x") setXray(!G.xray); });

// ---------- main loop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  G.xr += ((G.xray ? 1 : 0) - G.xr) * Math.min(1, dt * 10);
  if (G.S) {
    updateAnim(dt);
    if (G.phase !== "watch") for (let i = 0; i < A.length; i++) G.oShow[i] = G.S.o[i];
    const m = metrics(G.S);
    // ease the bars so changes read as motion, not a flip
    for (let b = 0; b < G.barA.length; b++) { G.barA[b] += (m.actual[b] - G.barA[b]) * Math.min(1, dt * 6); G.barP[b] += (m.perceived[b] - G.barP[b]) * Math.min(1, dt * 6); }
    drawBars(m);
    if (G.phase === "watch") renderTop();
    drawTown();
  }
  requestAnimationFrame(frame);
}

resize();
G.S = createState(town, noiseSeed); G.oShow = Float64Array.from(G.S.o);
{ const m = metrics(G.S); G.barA = m.actual.slice(); G.barP = m.perceived.slice(); }
renderAll(); showIntro();
requestAnimationFrame(frame);
