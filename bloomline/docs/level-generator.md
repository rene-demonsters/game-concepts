# Scaling to 200 levels, and level generator tooling

Parked findings from the playtest, for later. Nothing here is built yet beyond what's in [`playtest/`](../playtest/README.md): the solver, `scripts/analyse.ts` and the random generator `scripts/generate.ts`.

## How hard is 200 levels?

Getting to 200 levels is less about the level count and more about how many mechanics it takes to keep them interesting. The tooling is the cheap part.

**Already cheap:**

- A level is about 25 lines of TypeScript, and the solver checks it in milliseconds.
- The solver, `analyse.ts` and the "every level is solvable with the right par" test scale to 200 levels without changes.
- The random generator finds raw layouts quickly on small boards: about 30 usable candidates from 2,000 tries on 6×8. On 7×9 it found only 2 from 800, so harder, bigger levels need smarter generation (see below).

With only the four current creature types (Gloomy, Shy, Sleepy, Worrier), 200 levels is doable in a few weeks, but they'd blur together by level 40.

**The real cost is mechanics.** The concept lists about 45: 7 creature types, 5 gifts, environment pieces, obstacles, about 23 area twists and several level goals. The playtest has 4. Each mechanic touches the rules (including where it sits in the order within a beat), the solver, the visuals, the tests and a couple of teaching levels. Rough guesses for one developer:

| Kind | Examples | Effort each |
|---|---|---|
| Simple | Gifts, obstacles, Prickly, Big sad | 1-3 days |
| Timing | Bouncy, gates, drifting fog, tide | about a week (they make the solver's search much bigger) |
| Board-changing | Rotation, mirrors, drifting platforms, two travellers | 1-3 weeks (some may need simulation changes) |

**Where the current code would need work:**

- **Structure:** creature rules are a `switch` in one class (`src/core/sim.ts`). Past about 10 mechanics, that should become one module per mechanic with an explicit order of phases within a beat.
- **Solver speed:** it searches every possible path. That's fine up to 7×9 with about 24 tiles of Warmth. On 8×10 with 30+ tiles and timing mechanics the number of paths explodes, especially when counting near-solutions. Options: caching repeated states, tighter pruning, or a faster solver compiled to WebAssembly.
- **Level format:** creatures are just a kind and a tile. Tracks, timers, switches and linked objects need a richer format, and at that point a visual level editor pays for itself.

**Level design time:** even with tools, assume 30-60 minutes per level for hand-shaping (board shape, a good wrong route, the difficulty curve), so 100-200 hours for 200 levels. The 3-5 variants per Tricky level add about 40-60 more checks. Tuning to the difficulty targets needs attempt data from real players; the playtest's analytics export already records it.

## Stretch the mechanics instead of adding more

Introducing mechanics slowly works. Match-3 games often go 15-30 levels between new elements, and most levels are new combinations of familiar pieces. Depth comes from pairs and triples of rules interacting, and those grow faster than the number of rules:

| Mechanics | Pairs | Triples |
|---|---|---|
| 4 (the playtest) | 6 | 4 |
| 8 | 28 | 56 |
| 12 | 66 | 220 |

At about 15 levels per mechanic (2-3 to teach it, then combinations with what came before), 200 levels needs roughly **12-15 mechanics instead of 25-30**. That roughly halves the development estimate. The cheap ones (Prickly, Big sad, gifts, fog, logs, brambles, puddles) cover much of it, so only a few expensive area twists are needed.

The risk is sameness, not difficulty: adult players notice when level 140 feels like level 40 with more rocks. Slow pacing works if something else changes between new mechanics:

- **Board shapes** (see the tooling below).
- **Level goals:** family line, deliveries and bloom targets reuse existing rules but change what you're solving for.
- **Difficulty rhythm:** the concept's sawtooth, with a breather after each hard level.
- **Variants** on Tricky levels.

**Rough total** for 200 levels with enough variety for adult players: 3-5 months of development for mechanics and tooling, 2-3 months of level design partly alongside it, and ongoing tuning. Art is a separate track (6 worlds × 4 areas of backdrops, plus creatures). These are estimates; the timing mechanics are the most uncertain.

## Generator tooling for more interesting levels

The current generator scatters obstacles at random, so levels look random and big boards rarely produce good ones. The plan below fixes that. Total: roughly 3-4 weeks.

### 1. Shape templates (about 3-5 days)

Functions that produce the walkable area first; creatures are placed in a second pass.

- **Islands:** clusters of tiles joined by 1-tile bridges over water. Each bridge is a commitment, since a tile can only be used once.
- **Spirals:** a corridor winding inward with side pockets. A pure spiral forces the path, so the pockets are where the choices are.
- **Rings and loops:** which way round?
- **Combs:** a spine with dead-end teeth. Which teeth can you afford?
- **Two rooms joined by a door**, crosses, symmetrical shapes.

Each template has parameters (size, island count, pocket count). Area themes pick templates, so The Division Lobbies gets narrow branching tunnels and The Public Gallery stays open.

### 2. Design goals as constraints (about 2-3 days)

Instead of "any solvable layout", ask for specific puzzle ideas:

- The Shy creature's gaze line runs along a bridge.
- The greedy "nearest creature first" route fails by exactly one creature (a built-in trap).
- The solution crosses each bridge once.
- Every special creature's rule changes the answer (`scripts/analyse.ts` already measures this).

### 3. Mutation instead of random tries (about 2-3 days)

Start from a template, then repeatedly nudge one thing (move a rock, swap two creatures, change a countdown) and keep the change when the solver score improves. This finds good levels far more often than starting from scratch each time, especially on big boards.

### 4. Better metrics

On top of solution count and near-solutions:

- How badly the obvious (greedy) route fails.
- How many reasonable first moves there are.
- How much of the board the solution uses.
- Which tiles near-solutions pass through: a heatmap of the tempting wrong routes.

### 5. A browser level editor with live solver feedback (about 1-2 weeks)

Paint tiles, drop creatures, and see solution count, par, near-solutions and the heatmap update while editing. Generate from a template, tweak by hand, save straight to `src/levels/`. This is where most of the time savings come from: a designer gets an answer in milliseconds instead of a playtest.

The tools won't make levels by themselves; a designer still picks and polishes. They change level design from "come up with a puzzle" to "pick the best of ten good candidates and adjust".

## Suggested first step

Before committing to 200 levels, answer the concept's own open question: build about 30 levels using only cheap mechanics (the current four plus Prickly, Big sad, one gift and fog). If those stay interesting, the 200-level plan is mostly a production problem.

For the tooling, start with step 1 (islands and spirals) in the existing `scripts/generate.ts`. That's a few days of work and quickly shows whether generated levels feel more designed.
