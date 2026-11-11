# Prototype 0: UX, art and engineering plan

Question Prototype 0 must answer: **is watching perceived consensus diverge from reality compelling, with modest, honest effect sizes?**

## Legibility

60-80 nodes reads fine; the risk is 4x speed, where the eye tracks about 3 simultaneous events. Design for "one thing at a time".

- **Layout:** three neighborhoods as soft-tinted clusters, force-laid-out once with a fixed seed, then frozen. Hero citizens sit at cluster edges with a name label. About 60px gutters so cross-neighborhood links are visible.
- **Links:** invisible at rest. A traveling post is a bright dot moving along a thin line over about 250ms; the link fades over about 600ms.
- **Animation cap at 4x:** about 6 simultaneous pulses and 4 bubbles. The sim logs everything; the renderer merges the rest into one aggregate "flurry" ring around the cluster.
- **Bubbles:** max 6 words, 1.2s life at 1x. At 4x only hero citizens and bubbles tied to player actions get text; everyone else gets a tiny glyph (…, !, ?).
- **Opinion color:** a diverging scale that doesn't rely on red/green: blue (#2166ac) to near-neutral to orange (#d95f02), safe for deuteranopia and protanopia. Add a redundant channel (a thin inner arc or tick showing sign and magnitude). Define two palettes (light/dark) as CSS variables, with at least 3:1 luminance contrast against the background.
- **Size:** influence as radius in 3 buckets, not continuous.
- **Bots:** a circle with a very slight triangular bias, invisible in normal view. Under X-ray, morph over 300ms into a true triangle with a magenta/purple ring, and dim non-bots to 35%. No color for bot status in normal view.
- **Content shapes:** about 14px minimum, always the same silhouette. Article = rectangle with 3 lines, video = rectangle with a play triangle, review = star cluster. Prototype 0 has only articles and bot posts.
- **Perceived vs. actual bars:** one panel at the top with two stacked histograms across 7 opinion buckets. Actual above, perceived below, with a shaded gap between medians and a labeled **"Illusion gap: +23 pts"** with a delta arrow. A tick marks the referendum threshold at 50%. Tween at about 400ms.
- **Silence ripple:** when willingness drops below a threshold, the node desaturates and shrinks 20%, a dark concentric ring expands and shortens nearby bubbles' lifetimes, and a "muted" glyph flashes once. Each neighbor who goes quiet triggers a smaller ring so the cascade has a readable chain. Show a running "voices lost" counter.

## Watch-phase juice (shapes only)

- Camera: slow auto-pan and zoom to the highest-impact event of the day, at most one move per 2 seconds. Free pan locked during Watch.
- Screen shake only for exposure and bar-flip moments (6px or less). Hit-stop of 80ms when the referendum crosses 50%.
- Sound: WebAudio synth only, no assets. Soft tick per post, a low thump for silence rings, a rising two-note stinger when the gap widens, a quiet "hollow" tone when a hero goes silent. Audio is out of scope for P0, but build an `sfx(event)` hook now.
- End of day: a 1-second recap flash of the day's three biggest changes as text chips.
- Glitch tells for fake video (later milestone): edge jitter of +/-1.5px at 12Hz, a misaligned mouth line offset 3px, scanline slices, a "recycled" tag when footage is reused. Gate glitch intensity by the viewer's literacy so the tell is visible only to those noticing.

## UI structure

- **Layout:** town canvas about 65% width. Right rail: bars panel on top, day budget and resources, context panel. Bottom: phase strip (Read, Act, Watch) with a day dial.
- **Read:** hover shows an inspect card, click pins it. Lens toggles re-skin the same nodes for Opinion, Loudness, Isolation, Wavering.
- **Act:** a tray with 2 tools (bot discussion, fake article) and 2-3 slots. Drag a tool onto a neighborhood or hero. A preview shows predicted audience (a range, not exact) and Heat deltas by tell type. Button: "Run the day."
- **Watch:** input limited to pause, 1x/4x, skip. A scrolling log of cause-and-effect chips ("receipts") at the bottom. Add one or two interrupt moments per day (a hero starts asking questions, a tell trends) where the player spends a small reserve to cover up, deny or sacrifice an account.
- **Inspect card:** opinion vs. perceived norm as two markers on one line, willingness meter, trust, literacy, "what they saw today" as 3-5 post thumbnails with source and a tell chip when noticed, and a **"why did they change?"** row listing the top 3 inputs to the last opinion change with signed weights. This is the exposed-sim promise.
- **X-ray:** one persistent toggle (key X). Reveals bot triangles, bot-to-bot links as faint lines, and post provenance in inspect cards. Free in Read, allowed in Watch, removed in the stealth epilogue.

## Tech architecture

- **Sim core:** pure TypeScript package with zero DOM and zero Node-only imports. Fixed timestep; a `step(state, actions, rng) -> events[]` shape; structure-of-arrays typed arrays (Float32Array) for speed and cheap snapshots. Integer ticks; never `Date.now` or `Math.random`.
- **RNG:** seeded PRNG (sfc32 or mulberry32, about 10 lines). Split streams per subsystem (`rng.fork("feed")`) so adding a feature doesn't reshuffle the run. Ghost runs reuse the same town seed with the player's bot actions removed.
- **Ghost runs:** Web Worker pool (`navigator.hardwareConcurrency - 1`, cap 4). Estimate: 200 runs x 14 days, about 14s single-threaded and about 4s with 4 workers if one run costs about 5ms/day. Target under 3s with results streamed so the histogram fills in progressively. Use a statistical background for the unseen crowd. Raw `postMessage` is enough for 3 message types.
- **Canvas 2D, not PixiJS**, for P0. 80 circles, a few lines and a few dozen bubbles are trivial. Pixi pays off past about 1000 sprites or with shader filters (glitch, later). Keep the renderer interface thin (`draw(snapshot, fx)`). Pre-render bubbles and glyphs to offscreen canvases, handle devicePixelRatio, use layered canvases.
- **Build:** Vite, TypeScript strict, Vitest, ESLint with `no-restricted-globals` for DOM in the `sim` package.
- **Testing:** Vitest in a node environment on `sim`. Golden-seed tests (same seed gives a byte-identical event hash), property tests with fast-check (opinions stay in [-1, 1], the gap is 0 with no bots), and a **balance harness CLI** that runs 1000 seeds and prints outcome distributions. The harness is the main design tool.
- **Save/replay:** store `{version, seed, townConfig, actions: [{day, tool, target, params}]}`. Determinism gives replays and ghost comparison for free. Add a per-day state hash for desync detection and a `simVersion` that invalidates old replays. Avoid cross-engine float hazards (`Math.sin` etc. in sim logic) or accept same-engine determinism. Autosave to localStorage at the end of each Act phase; optional share-by-URL.
- **Performance budget:** 60fps at 4x on a mid phone. Sim step under 2ms per tick at 80 agents, draw under 6ms, no allocations in the hot loop (pooled pulses and bubbles), bundle under 300KB gzipped, cold start under 2s.
- **Mobile/touch:** Pointer Events only, 44px minimum hit targets (snap-to-nearest-node tap with a magnifier ring), tap-to-pin inspect, landscape-first with the right rail as a bottom sheet in portrait.
- **Distribution (playtests and demos only; the release is a paid full game):** itch.io HTML5 upload (`base: './'`) plus the same build on Cloudflare Pages or GitHub Pages. No SharedArrayBuffer (itch doesn't provide COOP/COEP headers), so use message passing.

## Build plan (about 4-5 weeks for one person)

1. Sim core skeleton: seeded RNG, agents, graph, opinion / perceived-norm update (3-4 days). Includes the harness.
2. Silence model and bots (2-3 days). Tuning is the real cost.
3. Balance harness and golden tests (1-2 days). Find out here whether the divergence is big enough before drawing anything.
4. Canvas renderer: nodes, clusters, pulses, bubbles (3-4 days).
5. Bars, silence ripple, X-ray (3 days).
6. Day-loop UI: Read, Act, Watch, inspect card (4-5 days).
7. Ghost worker and end screen (2-3 days).
8. Juice pass, camera, sfx hook, mobile layout, itch build (3 days).

Do the headless harness (step 3) and a fake-event renderer spike in parallel in week 1. Those two tell you whether the idea works.

**Riskiest unknowns:**

1. Does the divergence feel dramatic with modest effect sizes? Check with the harness before building the renderer. The perceived bar may move more than the actual one by design.
2. Tuning the silence spiral, which can collapse into a tipping-point cliff.
3. Ghost-run honesty: noisy runs can make headline percentages misleading. Report confidence and run count.
4. Legibility at 4x. Prototype early with fake events in the renderer.
5. Cross-engine determinism, only if replays are shared across browsers.

## Suggested repo layout

```
hollow-town/
  package.json            # pnpm workspace
  packages/
    sim/                  # no DOM, no deps
      src/{rng,state,graph,opinion,silence,bots,tools,step,snapshot,hash}.ts
      test/               # vitest, fast-check, golden seeds
    content/              # phrase banks, hero citizens, town config
  apps/
    web/
      src/{main,renderer/,ui/,audio/,workers/ghost.worker.ts,save/}
      index.html, vite.config.ts
  tools/
    balance.ts            # headless 1000-seed sweep
  docs/                   # design notes (this folder)
```
