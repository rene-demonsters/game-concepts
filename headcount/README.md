# Headcount (working title)

A ball-bouncing shooter where the ammo is heads. Rows of thugs march down the screen, each with a hit-point number. You aim and fire a stream of severed heads that bounce off walls and enemies. When a thug drops to zero, he bursts, and **his head joins your ammo**. The body count is the ammo count, so every kill makes the next volley bigger.

It plays like the cozy aim-and-bounce games people play for years: one swipe to aim, watch the volley ricochet, one row closer each turn, try to beat your high score. It just looks like a neon bloodbath.

**Player promise:** a snowball power fantasy you control with one thumb, where a single good angle sends two hundred heads screaming around the room.

Title availability has not been checked.

## Pillars

- **Cozy underneath.** Turn-based. Aim as long as you like. One swipe per turn. A session can last 2 minutes or 40.
- **Ultra violence on top.** Thugs explode on the last hit. Heads leave blood trails as they bounce. The screen gets messier the better you play.
- **The snowball is the fantasy.** More kills means more ammo means more kills. The game should regularly make the player feel unstoppable.
- **Absurd.** Heads have personalities. They scream, wear hats and come in special types. Nothing is played straight.

## Core mechanics

### Turns

1. Drag to aim. A dotted line shows the first bounce.
2. Release. Your whole stack of heads fires in a stream from the bottom of the screen.
3. Heads bounce off walls and enemies, losing nothing, until they fall back to the bottom.
4. All enemies move down one row. A new row appears at the top.
5. **Game over** when an enemy reaches the bottom line.

### Enemies

Each enemy has a number. Every head that hits it takes one point off. At zero, it bursts and drops its head into your stack (shown with a satisfying "+1" flying down).

- **Thug:** basic block, number scales with the turn count.
- **Heavy:** large 2×2 enemy with a big number. Drops a **Big Head**.
- **Riot shield:** only takes damage from the sides or back.
- **Medic:** heals enemies around him by 1 each turn.
- **Grenadier:** explodes on death, damaging neighbours.
- **Mirror guy:** sends heads back the way they came.

### Special heads

Some enemies drop special heads that replace a normal head in your stack:

| Head | Effect |
|---|---|
| **Helmet head** | Bounces harder, deals 2 damage per hit |
| **Bomber head** | Explodes on first impact |
| **Spike head** | Passes through the first enemy it hits |
| **Boss head** | Huge, deals heavy damage, single use |
| **Screamer** | Stuns every enemy in its row for one turn |

Special heads let a skilled player shape their stack, which gives the endless mode some depth.

## Modes

- **Endless:** the main mode. Survive as long as possible, high score is turns survived.
- **Hits:** hand-made levels with a goal (kill the boss in 10 turns, clear the board, free the hostage) on a level map. The cozy progression layer.
- **Daily Hit:** same layout for everyone, global leaderboard.

## Progression

- **Venues** for Hits mode: a car wash, a bowling alley, a cruise ship buffet, a television studio, a funeral home. Each adds a new enemy type.
- **Launchers:** the cannon your heads come out of is cosmetic (a sewer pipe, a gumball machine, a bazooka, a trombone).
- **Head skins:** hats, sunglasses, clown makeup, gold teeth. Pure cosmetics.

## Monetisation

- **"Head Start":** buy a pack of 50 heads at the start of a run. The core paid accelerator.
- **Continue:** "Get back up" for coins or an ad: the bottom three rows of enemies get blown away.
- **Lives** only in Hits mode: **"Heartbeats"**, five max, refilling over time.
- **Boosters:** Laser Sight (shows two bounces instead of one), Earthquake (all enemies lose 5 health), Extra Row Push (enemies move up one row).
- **Daily reward:** **"Head of the Day"**, a free cosmetic head skin or special head.
- **Season pass:** **"Body Bag Pass"**, with cosmetics and boosters.
- **Rewarded ads:** framed as the TV in a waiting room your character sits in between rounds.

## Art direction

- Top-down neon arena: dark floor, glowing walls, enemies in bold shapes.
- Heads are small, round and cartoonish, with simple faces and expressions that change mid-flight (bored, panicking, screaming).
- Blood trails follow each head, so a big volley paints the arena in seconds.
- Big volleys get slow motion on the final kills and a big "×243" counter.

## Audio

- Driving synthwave, louder as the volley grows.
- Each head hit is a short percussive pop, pitched so a big volley sounds like a drum roll. Bursts are wetter and deeper.
- Heads scream softly as they fly. Mutable, for obvious reasons.

## Tone and ratings

- 17+ / PEGI 18. Strong stylised cartoon gore, no realistic injuries, no lingering.
- A "pumpkin mode" replaces heads with pumpkins and blood with seeds, for players who want the puzzle without the gore and as a possible lower-rated version.
- All enemies are anonymous, fictional thugs.

## Open questions

- Does the stack grow too fast? Balancing kill-to-ammo ratio against enemy health is the whole game. Needs a spreadsheet and a prototype.
- Severed heads as ammo will be the first thing anyone writes about this game. Is that the marketing, or a risk with platform reviews?
- Can special heads stay readable when hundreds of heads are on screen?
