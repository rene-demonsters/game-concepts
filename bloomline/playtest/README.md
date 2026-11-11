# Bloomline: playtest

A playable prototype of the [Bloomline concept](../README.md), built from the [prototype plan](../docs/prototype-plan.md). Eight solver-checked levels, stand-in vector art, touch and mouse drawing, the run on the beat with bloom and parade, and a working hearts loop. There's no store: the out-of-hearts screen offers free refills marked "playtest".

## Run it

```sh
cd bloomline/playtest
pnpm install
pnpm dev            # http://localhost:5173, also on your LAN for phones
```

Open the LAN URL Vite prints on a phone to test touch without a native build.

### URL flags

| Flag | Effect |
|---|---|
| `?debug=1` | Debug buttons on the level list (unlock all, set hearts, export analytics, reset save) and a Solution button in levels. On by default in `pnpm dev`. Runs played from a shown solution are flagged and left out of the analytics summary. |
| `?level=goose-first` | Jump straight into a level. |
| `?reset=1` | Start with a fresh save. |
| `?unlockAll=1` | Every level open. |
| `?hearts=0` | No hearts (failing costs nothing). |
| `?commitOnRelease=1` | The concept's lift-to-go, instead of the Go button. |
| `?beatMs=380` | Run speed, in milliseconds per beat. |

## Controls

| | Touch / mouse | Keyboard |
|---|---|---|
| Draw | Drag from Ochre (or the end of the path) | Arrow keys or WASD |
| Undo a step | Drag back onto the previous tile | Backspace or Z |
| Cut back to a tile | Start a drag on any tile of the path | |
| Extend by one | Tap the tile next to the end | |
| Clear | Clear button or right-click | Esc or C |
| Run | Go | Enter or Space |
| Speed up a run | Tap the board, or Faster | Space or F |
| Show a solution (debug) | Solution button: each tap shows the next shortest one | H |

## Native builds

```sh
pnpm android        # build, sync, open Android Studio
pnpm ios            # build, sync, open Xcode
```

Both projects are generated (`android/`, `ios/`) and compile as-is. The bundle id `nl.demonsters.bloomline.playtest` in `capacitor.config.ts` is a placeholder. Phones are locked to portrait; iPad allows every orientation.

## Checks

```sh
pnpm test           # rules, Goose First golden test, every level solvable with the right par, hearts
pnpm test:e2e       # Playwright: draws and runs levels with mouse (desktop) and touch (Pixel 7)
pnpm typecheck      # TypeScript 7
pnpm lint           # oxlint
pnpm solve          # solver report for every level
```

## Level design tools

- `pnpm solve [level-id]`: solvable or not, solution count, shortest path, spare Warmth, and near-solutions (paths that cheer everyone but one).
- `node scripts/analyse.ts <level-id>`: relaxes each special creature into a plain Gloomy one at a time, to show whether its rule actually changes the answer.
- `node scripts/generate.ts --w 6 --h 8 --kinds gloomy,shy,sleepy,worrier ...`: random layouts scored by the solver. Levels 7 and 8 started this way. See the top of the file for options.

## Layout

- `src/core/`: rules and the deterministic simulation. No Phaser, no DOM, runs in Node.
- `src/solver/`: exhaustive search used by tests and the level tools.
- `src/levels/`: one file per level, in the concept's notation (A1 is bottom-left, map rows top first).
- `src/meta/`: save, hearts, progress, offers, store and ads seams, analytics. `Session` is the only thing the game talks to.
- `src/platform/`: web and Capacitor (storage, haptics, back button, pause/resume). Electron goes here later.
- `src/game/`: Phaser scenes, views, input, synth, and the stand-in skin (`skin/vector-skin.ts`), which the clay art replaces later.

## Rules as built

The rule order is documented in `src/core/sim.ts` and in the plan's "Rule timing" section. Two details the plan left implicit:

- A Worrier that honks stays gray for good.
- Leaving the start tile never wakes or cheers a Sleepy creature (consistent with "no greeting on beat 0").
