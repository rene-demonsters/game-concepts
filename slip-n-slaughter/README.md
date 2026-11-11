# Slip 'n' Slaughter (working title)

A sliding puzzle game where blood is the ice. Swipe, and your character slides in that direction until something stops them. Anyone in the way gets wiped out. The catch: **every kill leaves a slick of blood, and you can only slide on blood.** On a dry floor, you move one tile and stop. So the order of your kills paints the routes you'll be able to take later.

It plays like the cozy sliding puzzles people solve on the couch: grid levels, swipe controls, an undo-friendly pace, three stars, a long level map. The violence isn't decoration here. It literally rewrites the level as you play.

**Player promise:** every kill is a move in a puzzle. Get the order right and the whole room falls in one glorious, slippery chain.

Title availability has not been checked.

## Pillars

- **Cozy underneath.** Turn-based. Nothing moves until you swipe. Levels take 1-3 minutes. There's no pressure except your own move count.
- **Ultra violence on top.** Every slide is a high-speed collision. Bodies fly, blood sprays across the floor, and the room is a mess by the end.
- **The gore is the mechanic.** This is the core idea and it must never be cosmetic. Where blood lands, how far it spreads, and what cleans it up are all puzzle rules.
- **Absurd settings.** The locations are as slippery and silly as possible.

## Core mechanics

### Movement

- Swipe in one of four directions.
- **On a slick tile** (blood, or later other fluids), you keep sliding until you hit a wall, an obstacle, or a dry tile, which stops you on it.
- **On a dry tile**, you move exactly one tile.
- Every enemy you slide into dies. You keep sliding through them.

### Blood

- Each kill sprays blood in the direction of the hit: usually the tile the enemy was on plus 1-2 tiles beyond it.
- Different enemies spray differently. A **Heavy** sprays a wide fan. A **Skinny guy** barely leaves a trail. A **Bloater** coats a 3×3 area.
- So the puzzle is: which enemy do you kill first, from which direction, so that his blood carries you to the next one?

### Enemies

| Enemy | Rule |
|---|---|
| **Goon** | Dies on contact, normal spray |
| **Heavy** | Stops your slide when he dies, wide spray |
| **Gunman** | Shoots along his row or column. Never end a move in his line |
| **Janitor** | Walks one tile per turn and **mops up blood** as he goes. Kill him early or lose your routes |
| **Fire extinguisher guy** | Dies in a cloud of foam that turns tiles **sticky**: you stop instantly on foam |
| **Bloater** | Huge spray, but slow to reach |

### Fluids (one new fluid per world)

Each world adds another fluid with its own physics:

- **Oil** (garage): slick, and catches fire if a gunman shoots across it.
- **Syrup** (pancake diner): you slide exactly two tiles, then stop.
- **Aquarium water** (seafood restaurant): slick, but drains away after three turns.
- **Frozen yogurt** (froyo factory): freezes over the next turn, becoming permanent ice.
- **Bubble foam** (car wash): pushes you one extra tile sideways.

### Stars

1. Kill everyone.
2. Under par moves.
3. A style goal, like "kill four in one slide" or "never touch a dry tile".

## Absurd worlds

- **Froyo Inc.:** a frozen-yogurt factory front for a gang.
- **Cartel on Ice:** an ice-skating rink run by drug-dealing clowns.
- **Splash Mountain Gang War:** a waterpark where two gangs fight over the lazy river.
- **Bowl-A-Rama:** a bowling alley where the lanes are already waxed. You are the ball.
- **The Gala:** a fancy charity dinner where every tile is a polished marble floor and the janitors are everywhere.

## Progression

- A long level map of 20-30 levels per world, a new rule every few levels, a boss level per world.
- **Character cosmetics:** outfits, masks and sliding poses (belly slide, knee slide, on a tea tray). No stats.
- **Blood cosmetics:** blood colour and splatter style, from classic red to neon to glitter.

## Monetisation

- **Lives = Sneakers.** Five pairs max, one pair worn out per failed level, refilling over time.
- **Unlimited lives:** **"Rubber Soles: 2 hours"**.
- **Boosters:**
  - **Grip Socks:** undo one slide.
  - **Bucket of Blood:** paint one extra slick tile anywhere before you start.
  - **Mop Ban:** janitors stand still for the level.
- **Continue:** +5 moves for coins or an ad.
- **Season pass:** **"Slippery Season"**, with outfits, blood styles and boosters.
- **Rewarded ads:** a security monitor in the corner of the room plays the "commercial".

## Art direction

- Top-down, clean grid that stays readable even when soaked. Slick tiles must be instantly obvious: glossy, reflective, with a sheen.
- Neon and high contrast. The floor starts clean and shiny; by the end it's a map of everything you did.
- Slides have speed lines, motion blur and a big impact freeze on every kill.
- The level-complete screen shows the final floor as a "crime scene photo".

## Audio

- Synthwave and funk. Every slide has a long screech; every kill is a heavy wet impact on the beat.
- Multi-kill slides build a rising pitch, so a perfect slide sounds like a bowling strike.

## Tone and ratings

- 17+ / PEGI 18 with full gore. An optional **"Paint mode"** swaps blood for coloured paint, which keeps every mechanic intact and could support a lower-rated version.
- All gangs and locations are fictional and silly. The violence is fast slapstick, never cruel or lingering.

## Open questions

- Can blood spray be deterministic enough to plan, while still looking chaotic? The spray pattern has to be predictable from the enemy type and hit direction.
- How many fluids can coexist in one level before the rules get confusing?
- Is "Paint mode" good enough that it should be the default for the store page and featuring?
- This is the most original mechanic of the punk concepts, and the riskiest. It needs a paper prototype or grid prototype first to prove the "blood as path" puzzle space is deep enough for hundreds of levels.
