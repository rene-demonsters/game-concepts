# Kill Grid (working title)

A block-placement puzzle game where the pieces are attacks. The 8×8 grid is a packed nightclub dancefloor seen from above, full of goons. Each turn you get three pieces, and each piece is the shape of an attack: an L-shaped bat swing, a shotgun cone, a straight chainsaw line, a 2×2 grenade blast. Place one and everyone under it dies.

It plays like the cozy block puzzles people play for years on the bus: drag a shape, drop it, clear lines, chase a high score, no timer. It just takes place on a dancefloor that slowly turns red.

**Player promise:** the familiar "will this piece fit?" tension, where every perfect fit ends in a burst of neon carnage.

Title availability has not been checked.

## Pillars

- **Cozy underneath.** Turn-based, no timer, one-thumb drag-and-drop. Endless mode can be played half asleep. Anyone who knows block puzzles is fluent immediately.
- **Ultra violence on top.** Every placement is a kill animation. Blood stays on the floor for the rest of the run. Big clears shake the screen and drop the music.
- **Instantly readable.** Attack shapes look like what they do. A shotgun piece is a cone; a chainsaw piece is a line. No manual needed.
- **Score chasing.** Combos and multipliers make the endless mode addictive and shareable.

## Core mechanics

### The grid

- An 8×8 dancefloor. Each cell is **clean floor** or **blood**. Goons stand on top of cells.
- Blood plays the role of the classic genre's filled cells: you can't place a piece on blood.
- At the start, the floor is clean and partly filled with dancing goons.
- After each placement, the crowd **shuffles one step** (a predictable pattern shown by small arrows) and new goons enter from one edge.
- **Game over** when none of your three pieces fits on clean floor, or when goons stand on every clean cell (the crowd rushes you).

### Pieces = attacks

Pieces have block shapes, but they're themed as attacks. A piece can go on any clean floor, with or without goons on it. Placing it kills every goon under it and leaves its shape behind as blood. Score comes mostly from kills, so you want each piece to hit as many goons as possible.

| Piece | Shape | Notes |
|---|---|---|
| **Bat Swing** | L / J | The bread-and-butter piece |
| **Chainsaw** | 1×3 to 1×5 line | Comes in lengths, like the classic line piece |
| **Shotgun** | Cone / triangle | Fires in the direction you rotate it to |
| **Grenade** | 2×2 or 3×3 square | Big clear, rare |
| **Knife** | Single cell | Precision filler |
| **Fire Axe** | T shape | |

### Massacres (line clears)

When a full row or column is covered in blood, it triggers a **MASSACRE**:

- A cinematic chain of kills runs along the line, killing every goon standing in it. The music drops and the score multiplier goes up.
- The blood in that line is mopped away, and it's clean floor again.
- Clearing several lines at once is a **Double/Triple/Quad Massacre** with escalating effects.
- Keeping massacres going on consecutive turns builds a **streak** that keeps the multiplier alive.

The tension comes from two directions: blood fills the floor (classic block pressure), while goons fill the clean floor that's left. Aim pieces at crowds to keep goon numbers down, and line them up to keep the blood in check.

### Special enemies

- **Bouncer:** occupies 2 cells and needs to be hit twice.
- **DJ:** while alive, the crowd shuffles twice per turn.
- **Bartender:** when killed, drops a free bonus piece.
- **Drunk:** wanders randomly instead of following the shuffle.
- **Bodyguard pair:** killing one makes the other enrage and push neighbours aside.

## Modes

- **Endless:** the main mode. Chase a high score as the club fills up.
- **Contracts:** short puzzle levels with a goal (kill the DJ, survive 30 turns, clear the VIP booth) and a fixed set of pieces. Hundreds of them on a level map, the cozy progression layer.
- **Daily Club:** the same seed for everyone, one attempt, global leaderboard.

## Progression

- **Clubs:** each set of contracts takes place in a different venue (a roller disco, a goth club, a wedding reception, an office party), with its own enemies and music.
- **Weapon skins** change the kill effects: ink, glitter, ketchup, confetti, gold, or "extra chunky".
- **Floor skins** change the dancefloor style and how blood looks on it.

## Monetisation

- **Continue = "Call for backup".** When no pieces fit, pay coins or watch an ad for a **Rocket Launcher** piece that clears a 4×4 area of your choice.
- **Lives** only in Contracts mode: **"Bullets"**, five max, refilling over time. Endless mode is always free to play, which is the hook.
- **Boosters:** Reroll (swap your three pieces), Hold (keep one piece for later), Smoke Bomb (stops the crowd shuffling for 3 turns).
- **Weapon and floor skin packs**, and a seasonal **"VIP Pass"** with skins and boosters.
- **Rewarded ads:** framed as the club's sponsor ads playing on the big screens.

## Art direction

- Top-down, neon-lit dancefloor. Strong colours on near-black, with tiles that pulse to the beat.
- Goons are small, chunky and readable at phone size, each type with a clear silhouette.
- Blood accumulates and never cleans up during a run. The final screen shows the floor as a piece of abstract art you can share.
- Massacres use freeze frames, slow motion and a big stamped "MASSACRE ×3".

## Audio

- Dark synthwave and club music. The track builds as the floor fills, adding tension without a timer.
- Every kill is a punchy impact on the beat. Massacres drop the music to a filter sweep, then slam back in.

## Tone and ratings

- 17+ / PEGI 18 by default, with a "confetti mode" that removes blood and replaces kills with goons being knocked out cartoon-style, for a possible lower rating.
- All clubs and enemies are fictional. Enemies are anonymous goons, never real groups.

## Open questions

- Is the double pressure (blood and crowd) readable at a glance, or does it make the game harder than the cozy genre should be? Needs a quick paper prototype.
- Does the crowd shuffle make the game feel less cozy than a static grid? Maybe Endless should have a calmer variant.
- How much gore can a dense 8×8 grid show before it becomes unreadable?
