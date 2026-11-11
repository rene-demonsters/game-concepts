# Prototype 0: perceived-gap

Question this prototype exists to answer: **is watching perceived consensus diverge from reality compelling, with modest, honest effect sizes?**

A fictional town of 60 people votes on the Parking Structure referendum. You are the villain with a small bot network, 14 days, and 5 reach per day. Bots rarely change minds directly: they change what citizens think everyone else thinks, and people who feel outnumbered go quiet. The two bars at the top (actual vs. seen) and the "Illusion gap" are the game.

## Run it

```sh
npm start          # python3 -m http.server 8080, then open http://localhost:8080
npm test           # sim tests (node --test)
npm run balance    # headless balance sweep (paired seeds, 3 towns)
```

No install step and no dependencies. `main.js` is an ES module, so it must be served over HTTP (opening `index.html` from disk will not work). On a phone, serve it on your LAN and open `http://<your-computer-ip>:8080`; the layout is portrait-first.

URL params: `?town=11&seed=1` picks the town layout and the "weather" (random draws).

## What is in

- **Sim core (`sim.js`)**: pure and deterministic, no DOM, no `Math.random`. Opinions anchored to a prior (Friedkin-Johnsen style), bounded-confidence persuasion, perceived norm built from the feed (loud posters overrepresented), a spiral of silence with a hardcore floor, per-tell heat, fatigue, layering, social spread of detection, and trust erosion.
- **Common random numbers**: every random draw is a stateless hash of (weather seed, tick, agent, salt), so a bot-free run shares all the randomness the bots did not touch. That makes the ghost comparison paired.
- **Read / Act / Watch loop**: queue operations on a neighborhood, run the day, watch posts travel as pulses and bubbles at 1x or 4x, read the receipts.
- **Two tools**: bot thread (tells: phrasing, timing) and fake article (tell: sourcing). An article posted alongside a thread in the same neighborhood cites it and gets a layering bonus.
- **Three hero citizens**: Tom (talkative, easily silenced), Priya (notices tells), Dev (undecided).
- **Interrupts**: when a hero, or three or more citizens, notice a tell, you choose to cover it up (cuts that heat by 40%, costs 2 reach tomorrow) or let it ride.
- **X-ray**: bots are circles that look like citizens until you toggle X-ray (or press X), when they become triangles and their reach lines appear.
- **End screen**: referendum result, town damage first, hero fates, and a ghost distribution of 200 bot-free runs of the same town with the paired effect size, how much luck alone moves the result, "what still worked", and a short "how to spot it" list.

## What is out (on purpose)

Video and fake video, review bombing, pile-ons, astroturf groups, real-world movement, the exposure phase, the defender epilogue, the Field Guide detective mode, audio, campaigns 2-5. See `../../README.md`.

## Deviations from the plan in `docs/prototype-0.md`

- Plain JavaScript with no build step instead of TypeScript + Vite + Vitest, to keep this "quick". The sim module has no DOM dependency, so it ports to TypeScript directly.
- Ghost runs are computed on the main thread (200 runs take well under a second at this size), not in a web worker.
- 60 citizens and 12 bot accounts, all drawn. No statistical background crowd yet.

## Balance (default town, 100 paired seeds)

Numbers from `npm run balance`. The model is lightly tuned, not tuned well.

| | bot-free YES | sd (luck) | effect of bots | final trust |
|---|---|---|---|---|
| threads only | 46.9% | 1.8 pts | +5.9 pts | 0.24 |
| articles only | 46.9% | 1.8 pts | +5.9 pts | 0.80 |
| thread + article | 46.9% | 1.8 pts | +7.2 pts | 0.56 |
| spam one neighborhood | 46.9% | 1.8 pts | about +4 pts | 0.69 |

The other two towns (7 and 23) give effects of about +3 to +8 pts. Baseline races are close (bot-free YES 44-48%), and no single tool dominates, though thread + article beats either alone.

## Known issues and open questions

- **Not yet played in a real browser.** The UI was exercised end to end against a stubbed DOM (a full 14-day game through the real click handlers, no runtime errors), but layout, touch feel, animation readability at 4x and colors have not been looked at on a screen. Expect to adjust sizes.
- **Silence is town-dependent.** In town 11 (default) the spiral of silence engages clearly (about 5 extra silent citizens under a campaign); in town 7 it barely does. The silence parameters need a proper sweep.
- **Effect size is a little above the 3-6 pt target** for the best strategy (about 7 pts). The perceived-vs-actual gap is large (20-40 pts) in some towns, which reads well but may exaggerate.
- **Heavy bot use collapses trust** (threads only ends near the floor), which is the intended cost but currently makes one strategy clearly worse; not yet checked against a smarter player.
- No save/replay format and no state hash yet.
