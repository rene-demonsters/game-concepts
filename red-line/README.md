# Red Line (working title)

A draw-to-solve puzzle game about planning the perfect massacre in a single stroke. Each level is a top-down room full of goons. You drag one line through it with your finger. When you let go, your masked killer runs that line at full speed in about a second and a half, and everything on it dies. Then the game replays the run in slow motion so you can admire every hit.

It plays like the cozy one-touch puzzle games people dip into for years: tiny levels, three stars per stage, a long map, instant retries, lives and boosters. The violence is fast, top-down, neon-lit and over the top. One hit kills anyone, including you.

**Player promise:** stare at a room, picture the whole bloodbath in your head, draw it once, and watch it go exactly right (or hilariously wrong).

Title availability has not been checked.

## Pillars

- **Cozy underneath.** No real-time reflexes. You plan with as much time as you want, and the run itself is automatic. A level takes 10-60 seconds including the retry. The only skill is thinking.
- **Ultra violence on top.** One-hit kills, blood sprays that stay on the walls, bodies sent through glass, a screen shake on every kill. The tone is brutal, loud and gleefully excessive.
- **Absurd, never grim.** The enemies are ridiculous crime families with terrible gimmicks. Nobody is sympathetic, nothing is realistic, and the slow-motion replay is played for laughs.
- **Instant restart.** Failing is part of the fun. You see exactly where it went wrong and you're redrawing within a second.

## Why this works

Top-down action games with one-hit kills are already puzzle games in disguise. Players die, restart instantly and slowly work out the solution for each room. Red Line removes the reflexes and keeps the puzzle. The player solves the room on paper (well, glass) and the game acts it out.

## Core mechanics

### The stroke

- You draw one continuous line from the start point. Lifting your finger commits the run.
- The line has a length budget (the "adrenaline" meter). Longer levels give you more.
- The killer follows the line at a fixed, very high speed. Anything within reach of the line gets hit. Turning sharply makes the killer slow down briefly, which matters near gunmen.
- Weapons lying on the floor are picked up automatically when the line passes over them and change what "hit" means: a bat has a wider reach, a pistol shoots the first enemy in its facing direction, a thrown weapon kills at range once.

### Enemy types

| Enemy | Rule |
|---|---|
| **Goon** | Dies to anything. The basic unit. |
| **Gunman** | Has a visible sight cone. If your line passes through the cone before you reach him, you die. |
| **Dog** | Charges toward the line's nearest point when the run starts. Time it or route around it. |
| **Heavy** | Survives one hit. Needs a weapon or a second pass. |
| **Shield guy** | Can only be killed from behind or the side. |
| **Panic button guy** | If he's alive one second into the run, every door locks and reinforcements spawn. |

### Environment

- **Doors:** passing through a closed door slams it into whoever stands behind it. A classic.
- **Glass:** windows can be run through, sending you and the enemy behind it flying.
- **Explosive barrels, fryers, ceiling fans, pool tables:** environmental kills that score bonus style points.
- **Blood slicks:** running through fresh blood makes you slide a little past the line. Later levels use this on purpose.

### Stars

1. **Clean:** kill everyone.
2. **Fast:** finish under the par line length.
3. **Style:** a level-specific challenge, such as "three kills with one thrown pistol" or "nobody dies to a weapon".

## Absurd crime families (world themes)

Each world is a chapter about one crime family, with its own enemy skins, rooms and boss.

- **The Kringles:** a gang of sunburned mall Santas running a toy-store protection racket. Boss: the Head Elf, who is enormous.
- **La Silencio:** a mime cartel. Every enemy dies in total silence; the music drops out during the slow-motion replay.
- **The Floss Boys:** a yacht full of dentists who launder money through a whitening clinic.
- **Mothers Against:** a book club that runs the city's underground fight rings.
- **The Influencers:** a mansion full of livestreamers who keep filming. The boss is killed live in front of a million fake viewers.

Each family ends with a boss level that breaks the usual rules, such as a boss who reacts to your line while you draw it.

## Progression

- A long level map, organised by family. Around 20 levels per family, with new mechanics introduced every 3-5 levels.
- **Killer cosmetics:** masks, jackets and blood colours unlocked through stars. No stats, so difficulty stays tunable.
- **Daily Contract:** one hand-made level per day with a global leaderboard for line length.

## Monetisation

Standard cozy free-to-play, themed.

- **Lives = Bandages.** Five max, one lost per failed run, refilled over time. Out of bandages? Buy a **"Back-Alley Surgeon"** bundle for a full refill.
- **Unlimited lives:** **"Adrenaline Drip: 1 hour"**.
- **Boosters:**
  - **Rewind Pill:** undo the last part of a committed line once.
  - **Ghost Run:** shows a faint preview of how the first second plays out.
  - **Body Armour:** survive one bullet.
- **Rewarded ads:** framed as late-night infomercials for a suspiciously strong painkiller, shown on a TV in your safehouse.
- **Season pass:** **"Hit List"**, with masks, kill effects and boosters on free and premium tracks.

## Art direction

- Top-down pixel art or crisp low-poly, lit in neon: hot pink, cyan and sodium orange on near-black floors.
- Blood stays where it lands. A finished level is a painting of the run, and the level-complete screen shows it as a "crime scene photo" you can share.
- The drawn line glows like a fuse. During the run it burns away behind the killer.
- Slow-motion replay uses film grain, chromatic aberration and freeze frames on the best kills.

## Audio

- Pounding synthwave and dark electro. The music cuts to a single heartbeat while drawing, then slams back in when the run starts.
- Every kill has a short, meaty impact sound layered over the beat. Multi-kills build into a stinger.

## Tone and ratings

- 17+ / PEGI 18. Strong stylised violence, no sexual content, no real-world groups, no torture. Fast and cartoonish, never lingering.
- All crime families and locations are fictional and absurd.
- A "Splatter level" setting (full, reduced, confetti) keeps the game playable for people who want the puzzle without the gore.

## Open questions

- Is one stroke per level too restrictive in late levels? An optional "two stroke" level type could add variety.
- How readable are sight cones and enemy rules on a small phone screen in dense rooms?
- Does the slow-motion replay become tedious after hundreds of levels? Needs a skip button and probably a shorter default.
- The 17+ rating limits app-store featuring and some ad networks. Is that acceptable, or should the default splatter level aim for a lower rating?
