# Make Yourself at Home: playable prototype

A small, complete slice of the [concept](../README.md): one home scene, the birthday-recording assignment in a four-room play centre, two complete outcomes, a return home, and a revisit. It takes about 5–10 minutes per run. The point is to feel the loop (get a request, learn the place, commit through an action, fight, bring the consequence home), not to judge art or final combat.

## Run it

```sh
cd make-yourself-at-home/prototype
node serve.mjs            # or: npm start
```

It prints the URL, normally **http://localhost:8081/prototype/** (if 8081 is taken it tries 8082 and up). You only need Node; there's no install step and no dependencies.

You can also open `index.html` straight from disk. The scripts are classic, not ES modules, so `file://` works. Only the title-screen background image needs the parent `art/` folder next to it.

Add `?reset` to the URL to wipe the save. The pause menu (Esc) can also restart the fight or the whole prototype.

## Controls

| Action | Keys |
|---|---|
| Move | WASD / arrow keys |
| Light attack (3-hit combo) | J or left-click (aims at the cursor) |
| Heavy attack (wind-up, big knockback) | K or right-click |
| Dodge (short invulnerability) | Space, Shift or L |
| Interact / talk / next line | E (or Enter). Some objects say **Hold E** |
| Skip a conversation | Esc while talking |
| Journal (what you saw vs what you were told) | Tab |
| Pause | Esc or P (the game also pauses when the window loses focus) |
| Mute | M |

## What you can do

1. **Home.** Mara asks you to fetch a birthday recording. Tobi has cleared a space on the shelf "for the recording, or for the pieces". Leave by the front door.
2. **Jellybean Junction** (lobby, party room, service route, disposal room). Dana, a parent in the lobby, wants the recording destroyed in the cake crusher. The rabbit on the stage wants it kept playing until the guests are out. A guest hints at what's behind the stage curtain.
3. **Learn and prepare** (optional, but it pays off):
   - **Tap E at the sound desk** to play a few seconds of the song. The security dancers stop and sway, the cake bears wake up on their dock, and the party exit opens. This rule holds for the whole game.
   - **Behind the stage curtain** is the service route: a shortcut to disposal that skips the guarded lobby. It also holds a fuse panel with one fuse puller. Pull the *dock* fuse (cake bears are slow and get no reinforcements) or the *dance-floor* fuse (dancers are slow and the lobby guards stay offline).
4. **Commit in the world**, not through a menu:
   - **Hold E at the sound desk** to leave the song playing. You then **defend** the pedestal from charging cake bears for 42 seconds while the guests file out. Afterwards, tap E at the pedestal to take the recording home. Picking it up doesn't change your outcome or restart anything.
   - **Hold E at the pedestal** to take the recording. The music stops and the security dancers chase you. While carrying it you move slower and can't use the heavy attack. **Hold E at the crusher** to destroy it, then leave.
5. **A reality shift during the fight.** The banner's name changes, the recording takes on your voice, and a hatch opens in the wall onto your own kitchen with Mara in it. The rules you learned (song vs dancers, controls, hitboxes) stay exactly the same.
6. **Home again.** The recording plays on the shelf, or a jar of warm shards sits there. Mara and Tobi react differently depending on what you did, and each offers a memory that contradicts what you were told.
7. **Revisit.** Your fight damage is still there: splats, popped balloons, missing enemies, cracks. Each outcome has one new contradiction to find. Then sit down to dinner for the end summary, which offers **Try the other approach** and **Start over**.

If you're knocked out, or the bears smash the pedestal, **E retries the fight**. Your choice, your preparation and the pre-fight state of the room are kept.

## What's in the code

- `js/game.js`: the whole simulation (rooms, story state, combat, enemies, dialogue, saving). It has no DOM and no `Math.random`, and runs in Node for tests.
- `js/render.js`: Canvas 2D placeholder art.
- `js/audio.js`: WebAudio synth effects and an original music-box melody. No audio files.
- `js/main.js`: input, a fixed 60 Hz step, HUD and overlays, and `localStorage` saves.
- `serve.mjs`: a tiny static server. It serves the parent folder so `../art` resolves.

Enemies:

- **Security dancers** show an orange ring before they spin. The song disables them.
- **Cake bears** shake and draw a red lane before they charge. The song activates them, and they go for the pedestal.
- **Party poppers** mark a dashed target circle before their frosting lands.

## Tests

```sh
npm test                 # node --test: branching state, retries, saves, combat basics, bot playthroughs
node test/bot.js         # naive-bot playthroughs of both branches for every fuse choice
PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core npm run test:browser
```

The browser smoke test is optional because this folder deliberately has no dependencies. Point it at any existing `playwright-core` install with a matching Chromium. It drives the real keyboard through the intro and checks dialogue pausing, the journal, pause-on-blur without stuck keys, the commit hold, retry, saving, the later beats and opening from `file://`. It writes screenshots to `.smoke/`, which is git-ignored.

## Limitations (on purpose, or not yet done)

- All art is placeholder canvas drawing. No art style has been chosen; the concept art appears only behind the title screen.
- Desktop keyboard and mouse only. There's no gamepad or touch support, and the 960×600 view scales to fit the window.
- The "fights" are short and forgiving. Enemy navigation goes doorway to doorway, so crowds can bunch up in doorways.
- Sound is synthesized blips plus one melody. When the recording takes on "your voice", that's a timbre change, not singing.
- The dialogue is short and fixed. There's no refusal or compromise route, and leaving without the recording isn't supported.
- There's one save slot in `localStorage`. Some browsers block storage for `file://`; the game still runs but won't remember progress.
- Difficulty was checked only with a scripted bot and a no-dodge bot, not with players.
