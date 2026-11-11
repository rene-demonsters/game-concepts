// Hollow Town, Prototype 0 "perceived-gap": pure simulation core.
// No DOM, no Math.random, no Date. All randomness is a stateless hash of
// (noiseSeed, tick, agent, salt) so a run with bots and a bot-free "ghost" run
// share exactly the same random draws for everything the bots did not touch
// (common random numbers).

export const DAYS = 14;
export const WARMUP_DAYS = 3;
export const REACH_PER_DAY = 5;
export const PER_NEIGH = 20;
export const BOTS_PER_NEIGH = 4;
export const NEIGH = [
  { name: "Millbrook", bias: 0.1 },
  { name: "Harbor Row", bias: -0.2 },
  { name: "Old Quarter", bias: -0.05 },
];
export const TOOLS = {
  thread: { label: "Bot thread", cost: 2, posts: 6, authority: 0.8, reach: 0.5 },
  article: { label: "Fake article", cost: 3, posts: 3, authority: 2.0, reach: 0.6 },
};
export const TELLS = ["phrasing", "timing", "source"];
const HEAT_ADD = {
  thread: { phrasing: 0.12, timing: 0.08, source: 0 },
  article: { phrasing: 0, timing: 0, source: 0.15 },
};

// ---------- randomness ----------

function mix(h) {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

export function rnd(seed, a, b, c) {
  let h = mix((seed ^ 0x9e3779b9) | 0);
  h = mix(h ^ Math.imul(a + 1, 0x85ebca6b));
  h = mix(h ^ Math.imul(b + 1, 0xc2b2ae35));
  h = mix(h ^ Math.imul(c + 1, 0x27d4eb2f));
  return h / 4294967296;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

// ---------- town ----------

const CENTERS = [
  [0.5, 0.26],
  [0.25, 0.68],
  [0.75, 0.68],
];

export function createTown(townSeed = 7) {
  const r = mulberry32(townSeed);
  const g = () => {
    const u = Math.max(1e-9, r());
    const v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const agents = [];
  for (let n = 0; n < NEIGH.length; n++) {
    for (let k = 0; k < PER_NEIGH; k++) {
      const ang = k * 2.39996 + n;
      const rad = 0.13 * Math.sqrt((k + 0.5) / PER_NEIGH) + (r() - 0.5) * 0.02;
      agents.push({
        id: agents.length,
        neigh: n,
        o0: clamp(NEIGH[n].bias + g() * 0.5, -1, 1),
        conf: 0.15 + 0.7 * r(),
        lit: 0.1 + 0.6 * r(),
        act: 0.35 + 0.55 * r(),
        hard: r() < 0.1,
        hero: null,
        x: CENTERS[n][0] + Math.cos(ang) * rad,
        y: CENTERS[n][1] + Math.sin(ang) * rad,
      });
    }
  }
  // Shift the whole town so ~46% start on YES: a close race, which is where bots matter.
  const sorted = agents.map((a) => a.o0).sort((a, b) => a - b);
  const shift = -sorted[Math.round(agents.length * 0.54)];
  for (const a of agents) a.o0 = clamp(a.o0 + shift, -1, 1);
  // Hero citizens (named, hand-tuned).
  const heroes = [
    { idx: 3, name: "Tom", blurb: "retired bus driver, posts weather and route trivia", o0: -0.3, conf: 0.25, lit: 0.2, act: 0.9, hard: false },
    { idx: PER_NEIGH + 5, name: "Priya", blurb: "one-person local paper, reads the sources", o0: -0.1, conf: 0.85, lit: 0.9, act: 0.6, hard: false },
    { idx: 2 * PER_NEIGH + 8, name: "Dev", blurb: "new in town, undecided, reads everything", o0: 0.02, conf: 0.2, lit: 0.35, act: 0.5, hard: false },
  ];
  for (const h of heroes) {
    Object.assign(agents[h.idx], { o0: h.o0, conf: h.conf, lit: h.lit, act: h.act, hard: h.hard, hero: h.name, blurb: h.blurb });
  }
  // Social graph: 4 same-neighborhood links each, ~25% chance of one cross link.
  const adj = agents.map(() => new Set());
  const link = (a, b) => {
    if (a !== b) {
      adj[a].add(b);
      adj[b].add(a);
    }
  };
  for (const a of agents) {
    for (let k = 0; k < 4; k++) link(a.id, a.neigh * PER_NEIGH + Math.floor(r() * PER_NEIGH));
    if (r() < 0.25) {
      const on = (a.neigh + 1 + Math.floor(r() * 2)) % NEIGH.length;
      link(a.id, on * PER_NEIGH + Math.floor(r() * PER_NEIGH));
    }
  }
  // Bot accounts sit outside each cluster, drawn as ordinary circles until X-ray.
  const bots = [];
  for (let n = 0; n < NEIGH.length; n++) {
    const dx = CENTERS[n][0] - 0.5;
    const dy = CENTERS[n][1] - 0.5;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    for (let k = 0; k < BOTS_PER_NEIGH; k++) {
      const off = (k - (BOTS_PER_NEIGH - 1) / 2) * 0.05;
      bots.push({
        id: bots.length,
        neigh: n,
        x: CENTERS[n][0] + ux * 0.2 - uy * off,
        y: CENTERS[n][1] + uy * 0.2 + ux * off,
      });
    }
  }
  return { townSeed, agents, adj: adj.map((s) => [...s]), bots };
}

// ---------- state ----------

export function createState(town, noiseSeed = 1) {
  const n = town.agents.length;
  const S = {
    town,
    seed: noiseSeed,
    t: 0,
    day: 0,
    reach: REACH_PER_DAY,
    nextPenalty: 0,
    o: Float64Array.from(town.agents, (a) => a.o0),
    N: new Float64Array(n),
    will: new Float64Array(n).fill(0.9),
    trust: new Float64Array(n).fill(1),
    lastPost: new Int16Array(n).fill(-1),
    postCount: new Int16Array(n),
    why: town.agents.map(() => ({ conf: 0, pers: 0, anch: 0, botShare: 0 })),
    heat: { phrasing: 0, timing: 0, source: 0 },
    useLog: [],
    noticedTotal: 0,
    peakSilent: 0,
  };
  for (let w = 0; w < WARMUP_DAYS; w++) stepDay(S, [], { warm: true });
  S.peakSilent = silentCount(S);
  return S;
}

export const credibility = (S) => 1 - 0.5 * Math.max(S.heat.phrasing, S.heat.timing, S.heat.source);
export const silentCount = (S) => S.will.reduce((c, w) => c + (w < 0.3 ? 1 : 0), 0);
export const townTrust = (S) => S.trust.reduce((a, b) => a + b, 0) / S.trust.length;

function recentUses(S, type) {
  return S.useLog.filter((u) => u.type === type && S.day - u.day < 3 && u.day !== S.day).length;
}

// Interrupt response: cool one tell down, at the price of tomorrow's reach.
export function coverUp(S, tell) {
  S.heat[tell] *= 0.6;
  S.reach = Math.max(1, S.reach - 2);
}

// ---------- one day ----------

export function stepDay(S, actions = [], opts = {}) {
  const T = S.town;
  const A = T.agents;
  const n = A.length;
  const t = S.t++;
  const ev = { botPosts: [], citizenPosts: [], newSilent: [], noticed: [], actions: [] };

  // 1. Player actions -> bot posts injected into feeds of one neighborhood.
  const botItems = A.map(() => []);
  let reachLeft = S.reach;
  const accepted = [];
  for (const a of actions) {
    const cost = TOOLS[a.type].cost;
    if (cost <= reachLeft) {
      reachLeft -= cost;
      accepted.push(a);
    }
  }
  const cred = credibility(S);
  let postIdx = 0;
  for (const a of accepted) {
    const tool = TOOLS[a.type];
    const fatigue = Math.max(0.4, 1 - 0.2 * recentUses(S, a.type));
    const layered = a.type === "article" && accepted.some((b) => b.type === "thread" && b.neigh === a.neigh);
    const weight = tool.authority * (layered ? 1.4 : 1) * fatigue * cred;
    const members = [];
    for (let i = 0; i < n; i++) if (A[i].neigh === a.neigh) members.push(i);
    const reached = new Set();
    for (let k = 0; k < tool.posts; k++) {
      const bot = T.bots[a.neigh * BOTS_PER_NEIGH + (k % BOTS_PER_NEIGH)];
      const stance = 0.7 + 0.25 * rnd(S.seed, t, bot.id + 500, k);
      const targets = [];
      for (const i of members) {
        if (rnd(S.seed, t, i, 50000 + postIdx) < tool.reach) {
          botItems[i].push({ w: weight, s: stance, bot: true });
          reached.add(i);
          targets.push(i);
        }
      }
      ev.botPosts.push({ bot: bot.id, kind: a.type, neigh: a.neigh, targets });
      postIdx++;
    }
    for (const tell of TELLS) S.heat[tell] = Math.min(1, S.heat[tell] + HEAT_ADD[a.type][tell]);
    S.useLog.push({ day: S.day, type: a.type });
    ev.actions.push({ type: a.type, neigh: a.neigh, reached: [...reached], layered, weight });
  }

  // 2. Citizen posts (visibility bias: loud, confident-in-voice people post more).
  const feeds = A.map(() => []);
  for (let i = 0; i < n; i++) {
    const p = S.will[i] * A[i].act * (0.5 + 0.5 * Math.abs(S.o[i]));
    if (rnd(S.seed, t, i, 1) < p) {
      const stance = clamp(S.o[i] + (rnd(S.seed, t, i, 2) - 0.5) * 0.4, -1, 1);
      const seenBy = [];
      for (const j of T.adj[i]) {
        if (rnd(S.seed, t, i, 1000 + j) < 0.7) {
          feeds[j].push({ w: 1, s: stance, bot: false });
          seenBy.push(j);
        }
      }
      if (!opts.warm) S.lastPost[i] = S.day;
      S.postCount[i]++;
      ev.citizenPosts.push({ from: i, stance, seenBy });
    }
  }

  // 3. Update every citizen from what they saw.
  const newO = new Float64Array(n);
  const newN = new Float64Array(n);
  const newWill = new Float64Array(n);
  const noticers = [];
  for (let i = 0; i < n; i++) {
    const a = A[i];
    const tr2 = S.trust[i] * S.trust[i];
    let W = 0;
    let ws = 0;
    let Wb = 0;
    const items = feeds[i].concat(botItems[i]);
    for (const it of items) {
      const w = it.bot ? it.w * tr2 : it.w;
      W += w;
      ws += w * it.s;
      if (it.bot) Wb += w;
    }
    const nPrev = S.N[i];
    const nNew = W > 0 ? ws / W : nPrev * 0.9;
    const Ni = 0.5 * nPrev + 0.5 * nNew;
    const o = S.o[i];
    const sus = 1 - a.conf;
    const dConf = 0.09 * sus * Math.min(1, W / 4) * (Ni - o);
    // Bounded confidence: only posts within epsilon of my own view persuade me.
    let Wp = 0;
    let wsp = 0;
    for (const it of items) {
      if (Math.abs(it.s - o) < 0.6) {
        const w = it.bot ? it.w * tr2 : it.w;
        Wp += w;
        wsp += w * it.s;
      }
    }
    const dPers = Wp > 0 ? 0.06 * sus * Math.min(1, Wp / 4) * (wsp / Wp - o) : 0;
    const dAnch = 0.1 * (a.o0 - o);
    newO[i] = clamp(o + dConf + dPers + dAnch, -1, 1);
    newN[i] = Ni;
    S.why[i] = { conf: dConf, pers: dPers, anch: dAnch, botShare: W > 0 ? Wb / W : 0 };
    // Spiral of silence, with a hardcore floor.
    const discord = 2 * Math.max(0, Math.abs(newO[i] - Ni) - 0.3);
    const sig = 1 / (1 + Math.exp(-6 * (a.conf + 0.2 - discord)));
    const target = a.hard ? Math.max(0.5, sig) : sig;
    newWill[i] = 0.5 * S.will[i] + 0.5 * target;
    // Noticing tells: only people who saw bot posts can notice.
    if (botItems[i].length > 0) {
      for (let k = 0; k < TELLS.length; k++) {
        const p = a.lit * S.heat[TELLS[k]] * 0.3;
        if (rnd(S.seed, t, i, 70000 + k) < p) {
          noticers.push({ i, tell: TELLS[k] });
          break;
        }
      }
    }
  }
  for (let i = 0; i < n; i++) {
    if (newWill[i] < 0.3 && S.will[i] >= 0.3) ev.newSilent.push(i);
    S.o[i] = newO[i];
    S.N[i] = newN[i];
    S.will[i] = newWill[i];
  }
  // Noticing spreads socially: you lose trust, and so do your neighbors a little.
  for (const { i, tell } of noticers) {
    S.trust[i] = Math.max(0.1, S.trust[i] - 0.2);
    for (const j of T.adj[i]) S.trust[j] = Math.max(0.1, S.trust[j] - 0.05);
    S.noticedTotal++;
    ev.noticed.push({ i, tell });
  }

  // 4. End of day.
  for (const tell of TELLS) S.heat[tell] *= 0.88;
  S.peakSilent = Math.max(S.peakSilent, silentCount(S));
  if (!opts.warm) {
    S.day++;
    S.reach = Math.max(1, REACH_PER_DAY - S.nextPenalty);
    S.nextPenalty = 0;
  }
  return ev;
}

// ---------- metrics ----------

const BUCKETS = 6;
const bucket = (x) => Math.min(BUCKETS - 1, Math.floor(((x + 1) / 2) * BUCKETS));

export function metrics(S) {
  const n = S.o.length;
  const actual = new Array(BUCKETS).fill(0);
  const perceived = new Array(BUCKETS).fill(0);
  let yes = 0;
  let seenYes = 0;
  let votersYes = 0;
  let voters = 0;
  for (let i = 0; i < n; i++) {
    actual[bucket(S.o[i])]++;
    perceived[bucket(S.N[i])]++;
    if (S.o[i] > 0) yes++;
    if (S.N[i] > 0) seenYes++;
    const pv = 0.6 + 0.3 * S.will[i];
    voters += pv;
    if (S.o[i] > 0) votersYes += pv;
  }
  const norm = (h) => h.map((c) => c / n);
  return {
    actual: norm(actual),
    perceived: norm(perceived),
    actualYes: yes / n,
    seenYes: seenYes / n,
    gap: seenYes / n - yes / n,
    voteYes: votersYes / voters, // turnout-weighted expected YES share
    silent: silentCount(S),
    trust: townTrust(S),
  };
}

// ---------- whole runs ----------

// plan: (S, day) => actions[]  |  null for a bot-free run.
export function simulate(town, noiseSeed, plan) {
  const S = createState(town, noiseSeed);
  for (let d = 0; d < DAYS; d++) stepDay(S, plan ? plan(S, d) : []);
  return { S, m: metrics(S) };
}

// Bot-free "what the town would have been" runs, same town, different weather.
export function ghostRuns(town, count = 200, firstSeed = 1) {
  const out = [];
  for (let k = 0; k < count; k++) out.push(simulate(town, firstSeed + k, null).m.voteYes);
  return out;
}
