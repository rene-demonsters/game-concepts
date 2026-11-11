# Bloomline: route to a playable prototype

A plan for a small, playable prototype of [Bloomline](../README.md): a handful of levels, stand-in vector art, real touch and click-drag input, and a working hearts loop. The architecture leaves room for the store, boosters, near-miss continues and Steam, but none of those get built until the concept has proven itself.

## What the prototype has to prove

1. **Drawing feels exact.** On a phone and with a mouse, the path always goes where you meant. Nobody fails because a finger slipped.
2. **Watching the run is the reward.** Even with flat shapes, the bloom spread, the parade and the music building up feel good enough that you want to see it again.
3. **The rules read on screen.** Players understand gaze lines, countdowns and the "don't turn next to the sleeper" rule from the board alone.
4. **Hard can be fair.** One or two levels at "normal" and "tricky" difficulty give the "so close" feeling, not "impossible".
5. **Losing a heart feels fair.** Failing costs something, and players accept it because the fail was their plan's fault.

Anything that doesn't help answer these is out of scope.

## Scope

**In:**

- Grid, obstacles (blocked tiles), path drawing with the Warmth budget.
- Four temperaments: **Gloomy, Shy, Sleepy, Worrier**. That's enough to rebuild "Goose First" exactly and to make properly hard levels.
- Run playback on the beat: greetings, bloom spread, the parade, the gentle fail states.
- Stars (cleared, par, bloom %).
- Hearts: five max, lose one per failed run, refill over time. Out-of-hearts screen with a free prototype refill button.
- Level select (a plain list, not the world map), save, progress.
- A stand-in synth soundtrack where each greeting adds a layer.
- 8 levels, all solver-checked.
- Web (touch and mouse), Android and iOS via Capacitor.

**Stretch, if the core works early:** Prickly + Mittens, Big sad, Bouncy (the timing creature), Hush fog, the near-miss continue (free), level variants. Each comes with one or two extra levels.

**Out:** the store, coins, boosters, ads, friends, companions, wardrobe, world map, group photo, the Daily Round, the other level goals, parade helper abilities, Electron/Steam, real art.

## Tech stack

Versions are the current `latest` on npm as of 2026-11-11.

| Part | Choice | Notes |
|---|---|---|
| Engine | **Phaser 4** (4.2.x) | WebGL renderer. All Phaser code stays in `src/game/`, so the core never depends on it. |
| Build | **Vite 8** | Rolldown/Oxc. `base: './'` from day one so the same build works from `file://` in Capacitor and later Electron. |
| Language | **TypeScript 7** (7.0.x, the native compiler) | Only used to type-check (`tsc --noEmit`). Vite does the transpiling. Set options explicitly: `strict`, `module: esnext`, `moduleResolution: bundler`, `verbatimModuleSyntax`, `erasableSyntaxOnly` (no enums, namespaces or parameter properties, so Node can run the solver scripts directly). |
| Native | **Capacitor 8** (`@capacitor/android`, `@capacitor/ios`) | Plus `@capacitor/preferences`, `@capacitor/haptics`, `@capacitor/app` (back button, pause/resume), `@capacitor/status-bar`. |
| Tests | **Vitest 5** for the core and meta, **Playwright** for one browser smoke test with mouse and touch emulation. | |
| Package manager | **pnpm** | Pinned with the `packageManager` field in `package.json`, so everyone gets the same pnpm version. Run the Capacitor CLI as `pnpm exec cap ...`. pnpm doesn't run dependencies' install scripts unless they're allowed in `pnpm-workspace.yaml` (`onlyBuiltDependencies`). Nothing in the prototype should need one, but Electron will later. If the Android or iOS build can't find Capacitor plugins through pnpm's symlinked `node_modules`, switch to `node-linker=hoisted` in `.npmrc`. Check this in M0. |
| Lint | **oxlint** | TS 7 has no compiler JS API yet, so anything that relies on it (type-aware typescript-eslint rules, `vite-plugin-checker`) may not work. Check this in M0. |
| Later | Electron + steamworks.js | Not in the prototype. See "Ready for Steam". |

The project lives in `bloomline/playtest/`, like the other prototypes in this repo.

## Architecture

Three layers, with dependencies pointing one way only:

```
 game/   Phaser scenes, views, input, audio, stand-in skin
   │
   ├──► meta/      hearts, progress, save, store/ads/analytics seams   (no Phaser)
   │      │
   └──────┴──► core/   grid, levels, path rules, simulation, solver    (no Phaser, no DOM)

 platform/   storage, haptics, lifecycle: web | capacitor | (electron later)
```

### Folder layout

```
bloomline/playtest/
  index.html  vite.config.ts  tsconfig.json  capacitor.config.ts  package.json
  src/
    main.ts                  boot: pick platform, load save, start Phaser
    config/flags.ts          feature flags, overridable with URL params in dev
    core/
      coords.ts              Tile type, "A1" notation (columns A.., rows 1.. from the bottom, as in the concept)
      level.ts               level schema and parser
      path.ts                draw-time validation: canExtend, truncate
      sim.ts                 simulate(level, path, modifiers) -> RunTimeline
      creatures/             one file per temperament: gloomy, shy, sleepy, worrier
      bloom.ts  stars.ts
    solver/solve.ts          exhaustive search over paths, uses sim.ts
    levels/                  01-*.ts ... 08-*.ts, index.ts
    meta/
      clock.ts  save.ts  hearts.ts  progress.ts
      inventory.ts  offers.ts  store.ts  ads.ts  analytics.ts
      session.ts             the one API the game layer talks to
    platform/
      types.ts  web.ts  capacitor.ts  index.ts
    game/
      scenes/                Boot, LevelSelect, Level, ResultOverlay, OutOfHeartsOverlay, DebugPanel
      input/PathInput.ts     pointer -> path intents
      input/KeyInput.ts
      view/                  BoardView, PathView, ParadeView, BloomView, Hud, layout.ts
      skin/                  skin.ts (interface) and vector-skin.ts (the stand-ins)
      audio/synth.ts
  scripts/solve-levels.ts    `pnpm solve`: report per level
  test/
  android/  ios/             generated by `cap add`
```

### Core: a pure, deterministic simulation

The core is the most important part of the architecture. Everything else (the renderer, the solver, tests, and later the Spoiler and Dress Rehearsal boosters and the near-miss continue) is a client of one function:

```ts
simulate(level: Level, path: Tile[], modifiers: RunModifiers): RunTimeline

type RunTimeline = {
  beats: BeatFrame[]          // full state per beat, for playback and scrubbing
  events: SimEvent[]          // step, greet, bloom, hide, grumpy, honk, end ...
  outcome: {
    cleared: boolean
    gray: CreatureId[]        // gray.length === 1 is a near miss
    length: number
    bloomPct: number
    stars: 0 | 1 | 2 | 3
  }
}
```

- No `Math.random`, no time, no Phaser. Same input, same output, in the browser and in Node.
- `RunModifiers` exists from day one, even though it's empty in the prototype. Boosters slot in here later: Extra Warmth is `+3` budget, Sturdy Boots is "ignore one bowl-over", the near-miss continue is "same path, +3 tiles, simulate again".
- The Spoiler booster is just "simulate the current plan and show `outcome.gray`". Dress Rehearsal is "play `beats[0..5]` faintly". Neither needs new rules code.

**Draw-time validation is static.** While drawing, the path only checks things that never change during a run: in bounds, orthogonal step, not blocked, not used yet, within the Warmth budget. Everything that depends on timing or order (a hidden owl, a grumpy bear, fog that hasn't cleared yet) only shows during the run. That keeps the "watch it unfold" moment, and it means drawing never leaks the answer.

### Rule timing

The concept leaves a few timing details open. These defaults were checked with a quick brute-force solver: under these rules, "Goose First" has exactly the four 15-tile solutions the concept describes and nothing shorter (including the D1-D2-E2 and the end-on-C4 variants). That check becomes the first golden test.

Each beat, in this order:

1. **Ochre leaves the previous tile.** If that tile is next to a gray Sleepy creature: going straight cheers it, turning makes it grumpy for good. *(Sleepy resolves when Ochre leaves the tile, not on arrival. With arrival-greeting, routes through C2 and D3 cheer the bear before the turn and give 12-tile solutions.)*
2. **Ochre arrives on the new tile.** Every gray creature next to it reacts at the same time:
   - Gloomy: cheered.
   - Shy: cheered only if Ochre is on the tile right in front of it and moving toward it. Any other approach: it hides for good.
   - Worrier: cheered.
   - Sleepy: nothing yet (see 1).
3. *(Stretch)* Bouncy creatures move. Same tile, or swapping tiles with Ochre, means a bowl-over and the run ends.
4. **Countdowns tick.** A Worrier still gray at the end of beat N (its countdown) honks, and every gray Shy creature hides. Greeting it on beat N is in time.
5. **Path end.** A Sleepy creature next to the last tile is cheered (stopping is quiet).

There's no greeting on beat 0: starting next to a creature does nothing.

One tile can touch several creatures, and then all of them react on the same beat. So one step can cheer two creatures at once. **Big sad** (stretch) needs two greetings, and Ochre has to step away from it in between: the first arrival next to it is greeting one, then at least one step on a tile that doesn't touch it, then the next arrival next to it is greeting two. Staying next to it (walking along the side of a 2×1 or 2×2 creature) counts once. For a creature on one tile this happens automatically, because no two tiles in a row can both touch the same single tile. The rule is written per creature, so it holds whatever size Big sad ends up being.

### Bloom

Colour comes back in three ways, all counted in the Bloom %:

- **The start tile is already coloured.** Before the first move, Ochre stands on the only coloured patch in a gray board. That shows the premise ("colour follows Ochre") without a word of tutorial.
- **Every tile Ochre walks on** blooms as Ochre steps on it.
- **Every greeting** blooms the area around the creature, 3×3 by default.

All of it is tunable, with defaults in one config and overrides per level:

```ts
bloom: {
  startTile: true,     // radius 0: just the tile; 1 would be a 3×3 patch
  startRadius: 0,
  pathRadius: 0,       // 0 = only the tiles walked on
  greetRadius: 1,      // 1 = 3×3 around the creature
  shape: 'square',     // or 'diamond' (orthogonal distance)
}
```

Blocked tiles (rocks, stumps, water) can bloom too, but only walkable tiles count toward the percentage, so obstacles never make the target harder or easier by accident. `bloomTarget` in the level file sets the threshold for the third star.

### Rendering with stand-in vectors

All visuals go through a `Skin` interface keyed by meaning, not by look: `tile.walkable`, `obstacle.rock`, `creature.shy`, `marker.gaze`, `marker.countdown`, `ochre`, `path`, `bloom.flower`. The prototype skin, `vector-skin.ts`, draws everything with Phaser Graphics and bakes it into textures once at boot. The clay art replaces it later by writing a second skin, without touching views or rules.

Stand-in look (readability first):

- **Tiles:** raised rounded squares with a thin gap, pale gray. Ochre's start tile is already in colour. Blooming tweens each tile to the area colour, with a delay based on distance from the creature, plus a few small flower dots popping up.
- **Obstacles:** darker, chunkier shapes that clearly fill one tile (rock blob, stump octagon).
- **Creatures:** one silhouette shape per temperament, so the rule reads from the shape: Gloomy is a droopy circle, Shy has a big eye and a row of gaze dots along its line, Sleepy a zZ, Worrier a triangle with a countdown number. Gray when sad, coloured and bouncing when cheered.
- **Ochre:** the only warm-coloured thing at the start, a circle with a scarf stripe.
- **Path:** a thick, warm, rounded line between tile centres, with a ring on the head tile. Grid lines fade in only while drawing.
- **Parade:** cheered creatures follow Ochre one tile behind each other, along the drawn path.

Layout is computed on every resize (Phaser `Scale.RESIZE`) for both portrait phones and landscape desktop, so Steam needs no new layout work. Respect safe areas (notches, home indicator) and render at device pixel ratio so the vectors stay crisp. Minimum tile size is about 44 pt, which caps a portrait phone at 8 columns.

### Input: touch and click-drag

`PathInput` turns pointer events into path intents (`extend`, `pop`, `truncateTo`, `clear`, `commit`) and never edits the path itself. The same code handles mouse and touch through Phaser's pointer events.

- **Start a drag** on Ochre or on the path head to continue. Starting on any other path tile cuts the path back to there, so you can pick up a long path from the middle.
- **Snapping with a dead zone.** The head only moves to a neighbouring tile once the pointer is inside the inner ~70% of it. That stops jitter along tile edges.
- **Fast swipes.** If the pointer jumps several tiles in one frame, fill in the 4-connected steps in between, and stop at the last valid one.
- **Backtrack.** Dragging onto the second-to-last tile undoes one step, for free.
- **Invalid moves** (blocked, used, out of Warmth): the head gives a small bump toward the tile, and on native a haptic tap. No path change.
- **Tap to extend:** tapping a tile next to the head adds it.
- **Commit:** a **Go** button by default. The concept's lift-to-go is behind a flag (`commitOnRelease`) to test on real players. Accidental lifts on a phone are a real risk with a hearts system.
- **Finger occlusion:** the head ring is drawn larger than the tile while dragging, and the Warmth meter sits at the top of the screen, away from the finger.
- **One pointer only.** A second finger is ignored.
- **Keyboard and mouse extras** (cheap now, needed for Steam): arrow keys extend, Backspace undoes, Enter commits, R retries, right-click clears.
- **No browser gestures:** `touch-action: none`, no text selection or long-press callout, no pinch or double-tap zoom, no overscroll bounce in the WebView.

### Meta: hearts now, the store later

The game layer only talks to one object, `Session`, so a store can be added later without touching gameplay code:

```ts
session.canStartRun(levelId)          // false when out of hearts
session.beginRun(levelId)             // writes a pending-run marker
session.reportRun(levelId, outcome)   // settles hearts, stars, attempts, analytics
session.hearts(now) / timeToNextHeart(now)
session.offers()                      // what the out-of-hearts sheet can show
session.redeem(offerId)               // prototype: free grant; later: real purchase
```

Behind it:

- **`HeartsService`:** five max, regen based on stored timestamps and an injected `Clock`, so tests can fast-forward. Handles the clock going backwards. Has an `unlimitedUntil` field ready for "Bottomless Mug".
- **The pending-run rule:** pressing Go writes a marker before the run plays. A failed run costs a heart. If the app is killed mid-run, the marker is found on the next boot and counted as a fail, so closing the app can't dodge the cost. **Drawing and planning are always free**, even with zero hearts. Only Go is blocked.
- **`InventoryService`** (coins, boosters) exists but is empty.
- **`offers.ts`** is a data catalogue: `hearts.refill`, `mug.1h`, `continue.3tiles`, booster packs. Each offer lists what it grants.
- **`StoreService`** and **`AdService`** are interfaces. The prototype ships `PrototypeStore`, which grants offers for free behind a "prototype" label, and `NullAds`. Later: RevenueCat or the native IAP plugins on mobile, Steam microtransactions on desktop. Real receipts need server-side validation, which is another reason gameplay must never touch currency directly.
- **`Analytics`:** a local sink that records attempts per level, fail reasons (hidden, grumpy, honk, gray left), path length and time to clear. The debug panel can export it as JSON after a playtest. This is the data the concept's difficulty targets (2-4 attempts, 5-10 on Tricky) need.
- **Save:** one versioned JSON document (`{ version, hearts, progress, inventory, pendingRun, analytics }`) with a migration function, stored through the platform's `Storage`.

### Platform layer

```ts
interface Platform {
  id: 'web' | 'android' | 'ios' | 'electron'
  storage: Storage          // web: localStorage, native: @capacitor/preferences
  haptics: Haptics          // web: no-op (or navigator.vibrate on Android web)
  lifecycle: Lifecycle      // pause/resume, back button
}
```

Picked once at boot. Capacitor imports live only in `platform/capacitor.ts`. On pause, the beat clock and audio stop. On resume, hearts are recomputed.

### Levels

Levels are TypeScript files, so Vite hot-reloads them while you're designing:

```ts
export default defineLevel({
  id: 'goose-first',
  name: 'Goose First',
  warmth: 15, par: 15, bloomTarget: 0.6,
  start: 'A1',
  map: [            // row 6 at the top, as in the concept
    '. . . . .',
    '. . R . .',
    '. . . S .',
    '. . . . .',
    '. S . . .',
    '. . . . .',
  ],
  creatures: [
    { kind: 'shy',     at: 'A6', facing: 'E' },
    { kind: 'worrier', at: 'E6', countdown: 8 },
    { kind: 'sleepy',  at: 'C3' },
  ],
  variants: [],     // schema field now, used for Tricky levels later
})
```

`pnpm solve` runs the solver on every level and prints: solvable or not, number of solutions, shortest length (should equal `par`), and the number of **near-solutions** (paths that cheer everyone but one). `pnpm test` fails if a level is unsolvable or its par is wrong.

### Ready for Steam

Nothing for Electron gets built now, but the prototype avoids blocking it: relative asset paths (`base: './'`), no routing or service worker, no Capacitor imports outside `platform/`, a landscape layout, full keyboard and mouse support, and storage behind an interface. Electron then means a `platform/electron.ts`, a preload bridge, and steamworks.js for achievements and purchases.

## The levels

Eight levels: six teaching, then one at the concept's "normal" difficulty and one "tricky", to test the adult-difficulty pillar early. Names to follow, in the concept's dry tone.

| # | Grid | Teaches | Creatures |
|---|---|---|---|
| 1 | 5×6 | Drag, run, the parade | 2 Gloomy, open board |
| 2 | 5×6 | The Warmth budget and order | 4 Gloomy, rocks, 1 spare tile |
| 3 | 5×6 | Gaze lines | 1 Shy, 2 Gloomy |
| 4 | 5×6 | Don't turn next to a sleeper | 1 Sleepy, 2 Gloomy |
| 5 | 5×6 | Countdowns | 1 Worrier, 3 Gloomy |
| 6 | 5×6 | Combining them | "Goose First" from the concept |
| 7 | 6×8 | Normal: 2-4 attempts | 6-7 creatures, all four temperaments, 1-2 spare tiles |
| 8 | 7×9 | Tricky: 5-10 attempts | 8-9 creatures, no spare tiles, many near-solutions |

Levels 7 and 8 are designed with the solver: aim for very few real solutions and lots of near-solutions.

## Milestones

Sizes are rough, for one developer.

### M0: Skeleton on every device (1-2 days)

- `bloomline/playtest/` as a pnpm project with Vite 8, Phaser 4, TS 7, oxlint, Vitest.
- `cap add android` and `cap add ios`. Portrait lock on phones, status bar hidden, WebView bounce and zoom off, Android back button handled.
- A test scene: a grid of tappable vector tiles that light up under the finger.
- Live reload on a real Android phone and a real iPhone.
- Check the risky bits: native Android and iOS builds with pnpm's `node_modules` layout, Phaser 4's Graphics-to-texture and tint APIs, crisp rendering at device pixel ratio, `tsc --noEmit` with TS 7, oxlint.

**Done when** the test grid runs crisp and responsive on web, Android and iOS, with no scrolling, zooming or text selection.

### M1: Core rules and solver (2-3 days)

- Coordinates, level parser, static path validation.
- `simulate()` with obstacles, Gloomy, Shy, Sleepy, Worrier, bloom, stars.
- Solver and `pnpm solve`.
- Tests per rule, plus the golden test: "Goose First" has exactly four solutions, all 15 tiles.

**Done when** `pnpm test` is green and the solver reproduces the concept's "Goose First" analysis.

### M2: Drawing (2-3 days). The make-or-break milestone

- `PathInput` with everything in the Input section.
- `BoardView`, `PathView`, Warmth meter, Go / undo / clear buttons, grid lines fading in while drawing.
- Haptic ticks on native.

**Done when** a 10-minute hands-on check passes on a phone and with a mouse: fast diagonal swipes, slow edge-hugging drags, backtracking, picking up from the middle, tapping, and an 8×10 board on the smallest target phone, all without one wrong tile.

### M3: The run (3-4 days)

- A beat clock (start at ~150 BPM, tunable) drives playback of the `RunTimeline`.
- Ochre walks, greetings squash and bounce, the bloom spreads, the parade follows.
- Fail states: the owl hides, the bear goes grumpy, the goose honks, gray creatures sigh at the end. Back to planning within about a second, **with the old path still drawn** so it can be tweaked.
- Tap to fast-forward during a run.
- Result overlay with stars.
- Stand-in synth: a soft drone in the gray state, and each greeting adds a phrase on the beat. Audio unlocks on the first touch.

**Done when** all six teaching levels can be played start to finish, with every fail type shown.

### M4: Hearts, progress and save (2 days)

- Save, `Session`, `HeartsService` with the pending-run rule, progress and unlocks.
- Level select list with stars and hearts.
- Out-of-hearts overlay: timer and a "Refill (prototype)" button through `session.redeem('hearts.refill')`.
- Debug panel (dev builds or `?debug`): unlock all, set hearts, fast-forward the clock, export analytics.
- Null `StoreService`, `AdService`, empty inventory.

**Done when** hearts drop and refill correctly across app restarts, killing the app mid-run costs a heart, and planning works with zero hearts.

### M5: Levels and tuning (2-3 days)

- Author levels 1-8 with the solver.
- Playtest with 3-5 people who play match-3 games, on their own phones. Watch for: misread rules, input mistakes, attempts on levels 7 and 8.
- Tune Warmth, countdowns and beat speed.

**Done when** levels 1-6 mostly clear on the first try, and levels 7-8 land roughly on their attempt targets.

### M6: Test builds (1 day)

- An Android build for testers (APK or an internal testing track) and an iOS TestFlight build.
- Optionally a hosted web build for quick sharing.

### Stretch, in this order

1. **Near-miss continue**, free in the prototype: does it feel good, or like a cheat? The `RunModifiers` design makes it cheap.
2. **Bouncy**, the second timing mechanic, with step 3 of the rule order.
3. **Prickly + Mittens**, the first gift.
4. **Big sad.**
5. **Hush fog**, with a run-time bump if Ochre walks into fog that hasn't cleared.

Total for M0-M6: about 2.5-3.5 weeks.

## Decisions to confirm

Each has a default, so none of them block the start.

1. **Commit:** decided: a Go button. Lift-to-go stays behind a flag for an A/B test, but isn't the default.
2. **Sleepy timing:** resolves when Ochre leaves the tile. This is the only reading that matches the "Goose First" analysis.
3. **Big sad:** decided: two greetings with a step away in between (see Rule timing). Still open: one tile or bigger (2×1, 2×2). A tile that touches two creatures greets both. (Stretch only.)
4. **Bloom %:** decided as a starting point: the start tile is coloured, walked tiles bloom, greetings bloom 3×3. All tunable (see Bloom).
5. **Fail playback:** the run always plays to the end of the path, so the player sees every consequence, but it can be fast-forwarded. A bowl-over ends it immediately.
6. **Hearts in playtests:** on by default, with the free refill button, so the cost of failing is part of the test.

## Risks

- **Phaser 4 is still young.** Most examples and plugins are written for Phaser 3, and some APIs changed (filters instead of FX, tint handling). M0 checks the parts we need, and all Phaser code stays in `game/`.
- **TypeScript 7 tooling.** Tools that use the TS compiler API may not support 7 yet. Type-checking runs as a separate `tsc --noEmit` step, and lint uses oxlint.
- **Small tiles on phones.** An 8-column board on a narrow phone is close to the finger-size limit. The concept's question gets answered in M2, on real devices.
- **Solver run time.** Exhaustive search is fine for prototype-sized boards (up to 7×9 with a budget around 24) with simple pruning. Bigger levels may need a smarter solver later.
- **The colour spread is the selling point, but stand-in tints won't sell it.** This prototype tests the puzzle and the loop. The concept's technical art test (clay shader and spread effect on mid-range phones) stays a separate track.

## After the prototype

If the five questions at the top come back positive: the level-design sprint of 30 levels from the concept's open questions, the technical art test, then the store, boosters and near-miss continue through the seams described above, and finally Electron and Steam.
