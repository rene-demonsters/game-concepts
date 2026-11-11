# Bloomline (working title)

A path-drawing puzzle game about bringing colour back to a gray world. Each level is a small, drained-of-colour scene laid out on a grid of tiles and full of creatures who've gone gray and gloomy. You drag one path across the tiles with your finger. When you let go, your little traveller dashes along it and greets everyone on the way: a hug, a nose boop, a high five, a kiss on the forehead. Every creature you reach bursts back into colour, the colour spreads across the ground around them, and they fall in line behind you. By the end of the run, a silent gray clearing has become a bright, noisy parade.

It keeps the core of [Red Line](../red-line/README.md): plan the whole run, draw it once, watch it play out, retry instantly. Unlike Red Line, the path snaps to a grid, so every rule is exact and the challenge is purely in the planning. The violence is gone. In its place is the fantasy of walking through a sad place and having everything in it come back to life and follow you.

**Player promise:** draw one perfect path, and watch a whole world wake up behind you.

See the [storyboard](docs/storyboard.md) for a mock-up walkthrough of a first play session and one mock-up per world.

Title availability has not been checked. Alternatives: *First Coat*, *Wet Paint*, *Undercoat*.

## Pillars

- **Cozy all the way through.** Nobody gets hurt, not even on a failed run. Failing is gentle and funny: you trip into a leaf pile, or a puppy bowls you over and licks your face.
- **Colour and music return together.** The gray world is quiet. Every creature you cheer brings back a patch of colour **and** an instrument. A perfect run finishes as a full-colour scene with a full song.
- **The parade is the reward.** Creatures you reach follow you. The longer your run, the bigger and sillier the parade. That's the "everyone comes to her" feeling, earned by the player's planning.
- **Cute look, adult difficulty.** The audience is grown-up match-3 players, not children. After a short tutorial stretch, levels are properly hard: cheering everyone is required, the tile budget is tight, and creature temperaments clash with each other and with the obstacles. The challenge comes from planning, never from danger or reflexes.

## Premise

Something called **the Hush** drifted over the land and soaked up its colour, sound and cheer. Creatures stopped singing, flowers closed, villages went quiet and gray. You play a small traveller who still has a bit of warmth left (working name: **Ochre**, named after the oldest paint pigment there is: a round, rosy-cheeked wanderer in a big knitted scarf). Wherever Ochre goes, colour follows.

Ochre isn't a princess or a hero. Ochre is just very, very good at cheering people up.

## Core mechanics

### The grid

Every level is a small grid, usually 5×6 to 8×10 tiles. The grid isn't drawn as lines on a board. The tiles are part of the scene (moss patches, stepping stones, garden squares, floorboards), and grid lines only fade in while you're drawing.

On the grid, every rule is clear-cut. Players should only ever fail because of a bad plan, never because their finger slipped.

### Drawing the path

- Drag from Ochre's tile, and the path snaps from tile to tile (up, down, left, right, no diagonals).
- **Each tile can be used once.** The parade follows right behind Ochre, so stepping back onto a tile you've already used means walking into your own parade. The path won't let you draw it.
- Dragging back along the path undoes it, for free. You can plan, scrap and redraw as long as you like.
- Tapping the tile next to the path end also extends the path, for players who find dragging awkward.
- The path has a tile budget, the **Warmth** meter. The budget is set tight, so there's little room for detours.
- Lifting your finger (or pressing Go) starts the run.

### The run

- Ochre walks the path **one tile per beat** of the music. Creatures with timing rules also move on the beat, so everything stays predictable.
- Whenever Ochre steps onto a tile next to a creature (not diagonally), Ochre greets it, if its temperament allows.
- During planning, every rule is visible: gaze lines, soft sides, countdowns, tracks. The consequences only play out during the run, which keeps the "watch it unfold" moment.

### Clearing a level

**Every creature must be cheered.** If anyone is still gray when the path ends, the level isn't cleared, and you lose a heart. Failing stays gentle: the gray creatures sigh, Ochre shrugs, the run fades back to the planning view in a second.

### Greetings

The kind of greeting depends on the creature, which keeps the animations varied and funny. Rabbits get a nose boop, bears get a big hug, birds get a high-five with a wingtip, a grumpy old toad gets a kiss on the forehead and goes bright pink.

When a creature is greeted:

1. It **blooms**: colour returns to the creature, then splashes outward over the tiles around it.
2. It plays a short musical phrase, adding its instrument to the level's song.
3. It **joins the parade** behind Ochre.

### Creature temperaments (the puzzle rules)

Each temperament is easy on its own. Levels get hard when two of them pull in opposite directions.

| Creature | Rule | Red Line equivalent |
|---|---|---|
| **Gloomy** | Cheers up when greeted from any side. The basic creature. | Goon |
| **Shy** | Watches one straight line of tiles. It must **see you coming**: you can only greet it by walking toward it along that line. Step next to it from any other side first and it hides for the rest of the run. | Gunman |
| **Bouncy** | A puppy or lamb that runs back and forth along a track, one tile per beat. Greet it from beside the track. Step onto its track at the moment it arrives and you get bowled over (the run ends in a pile of licks). | Dog |
| **Big sad** | A big creature (a bear, a moose, a troll) that needs two greetings, with Ochre stepping away from it in between (walking along its side counts once), or bring a cookie basket. | Heavy |
| **Prickly** | A hedgehog or cactus creature with one soft side, marked with a fluffy patch. Greetings from other sides do nothing. Mittens let you greet it from anywhere. | Shield guy |
| **Worrier** | A goose with a countdown over its head. If it's still gray when the countdown hits zero, it honks, and every Shy creature in the level hides. | Panic button guy |
| **Sleepy** | Don't turn on any tile next to it: walking straight past is quiet, turning is noisy. Wake it noisily and it gets grumpy and refuses to be cheered. | (new) |

### Obstacles

Obstacles turn an open grid into a route puzzle.

- **Tree stumps, rocks, bushes:** blocked tiles. The simplest and most common obstacle.
- **Ponds and streams:** blocked, except for **stepping stones**, which can each be used once like any tile.
- **Fallen logs:** blocked until a Big sad creature is in the parade. When Ochre walks past the log, the bear rolls it away and the tiles open up.
- **Gray brambles:** blocked until a hedgehog is in the parade, which tunnels through when you pass.
- **Hush fog:** gray fog over some tiles. You can't walk into fog. Cheering a creature blooms the tiles around it and clears any fog there, so the order of your greetings opens and closes routes. In later worlds, the fog drifts one tile every few beats.
- **Gates:** open and close on a fixed beat pattern.

### Gifts (picked up along the path)

Gifts sit on tiles. Ochre picks them up by walking over them.

- **Flower:** thrown straight ahead to greet the first creature up to 3 tiles away. Lets you reach creatures behind obstacles. (The thrown pistol.)
- **Blanket:** Ochre's next greeting also reaches diagonal tiles. (The bat.)
- **Mittens:** greet Prickly creatures from any side.
- **Cookie basket:** counts as both greetings for one Big sad creature.
- **Flute:** plays a lullaby along the next 3 tiles ahead: calms a Worrier (stops its countdown) and lets you turn next to a Sleepy creature without waking it.

### Environment

- **Paint pods:** big gray seed pods. Walk next to one and it bursts, blooming a 3×3 area and clearing any fog in it. (Explosive barrels.)
- **Puddles:** Ochre slides one extra tile in the same direction. You plan for it, and the slide tile still counts as used. (Blood slicks.)
- **Wind seeds:** carry Ochre two tiles in a straight line, over an obstacle.

### The parade

Every creature you cheer falls in line behind Ochre and walks the path you drew. That's the in-world reason a tile can only be used once, and it's the main visual reward: a growing conga line of happy animals.

In later worlds, parade members also help as they pass things: a bear rolls away logs, a hedgehog tunnels through brambles, a bird flies up to greet a creature on a ledge. That makes greeting order matter even more: cheer the bear before you need the log moved.

### Stars

1. **Cleared:** everyone cheered (required to pass).
2. **Short and sweet:** finish at or under the par path length.
3. **Bloom:** colour at least a set percentage of the level. Paint pods and the route you take affect it.

### Worked example: "Goose First"

An early level in the forest world, on a 5×6 grid. Columns are A-E from left to right, rows 1-6 from bottom to top.

```
       A        B        C        D        E
  6   Owl→      .        .        .     Goose(8)
  5    .        .       Rock      .        .
  4    .        .        .      Stump      .
  3    .        .     Bear(zZ)    .        .
  2    .      Stump      .        .        .
  1  Ochre      .        .        .        .
```

- **Owl (Shy)** at A6, watching to the right along row 6. To greet it, Ochre has to walk leftward along row 6 into B6.
- **Goose (Worrier)** at E6 with a countdown of 8 beats.
- **Bear (Sleepy)** at C3. No turning on B3, D3, C2 or C4.
- **Warmth:** 15 tiles.

**Tempting ideas that fail:**

- *"The owl is closest."* Walking straight up column A arrives next to the owl from below, outside its gaze line. It hides. Even if you got past that, the goose's countdown would run out long before you reached it.
- *"Cut through the middle to the goose."* Column C dead-ends at the bear, so you'd have to turn right next to it and wake it. Column D is cut off by the stump at D4, which forces the same noisy turn at D3.

**The solution:** go for the goose the long way round, along the bottom and up the right edge (B1, C1, D1, E1, then E2-E5). Ochre arrives next to the goose on beat 8, just in time. Then step D5, D6, and walk left along row 6 (C6, B6). That's exactly the approach the owl wants. Finally go down column B (B5, B4, B3) and walk straight into the tile beside the sleeping bear without turning. 15 tiles, everyone cheered.

A brute-force check of this layout confirms there's no shorter solution: every valid path is 15 tiles long, and the only differences are small (D1-D2-E2 instead of D1-E1-E2, or ending on C4 instead of B3). Every level should get this kind of automated check during level design.

The "aha" is that serving the most urgent creature first also lines Ochre up perfectly for the shy one.

## Audience and difficulty

**The art is cute, but the game is for adults.** The target player is the 25-55-year-old who plays a match-3 game every evening, likes being stuck on a level for a day, and will pay to get past a hard one. The look says cozy; the levels should say "this one took me three days."

"Goose First" above is a tutorial level (around level 8). It shows the rules, not the intended difficulty.

### Difficulty curve

- **Levels 1-15: teaching.** Small grids (5×6), 2-4 creatures, one new rule at a time. Most are cleared first try. This is the part a child could finish.
- **From level 15: normal levels.** 6×8 to 7×9 grids, 6-10 creatures, at least three temperaments, plus the area's twist. Target: 2-4 attempts on average.
- **Tricky levels:** roughly every fifth level, and the last level of every area. Marked on the map with a purple leaf. Target: 5-10 attempts.
- **Very Tricky levels:** boss levels and a few per world. Target: 10-20 attempts. These are the levels players talk about with friends.
- **Sawtooth pacing:** after a Tricky level come one or two easier breather levels, so a session can always start with a quick win.

Attempts per level and drop-off per level are tracked from the first soft launch, and tile budgets and countdowns are tuned per level to hit these targets.

### Where the difficulty comes from

Hard, but always fair: every level is solvable with the information on screen, and no reflexes are ever needed.

1. **Many creatures, one tight budget.** With 8-10 creatures, the order is a real combinatorial problem. Normal levels leave 1-2 spare tiles; Tricky levels leave none.
2. **Interlocking rules.** Hard levels stack three or four rules on the same few tiles. Example: the owl's gaze line runs right past the sleeping bear, so the only approach the owl accepts needs a turn next to the bear, unless you pick up the flute first, which is on the other side of the pond.
3. **Timing.** Countdowns, Bouncy creatures, gates and drifting fog all run on the beat. A route that's right on the map can still be wrong in time.
4. **Order dependencies.** Some creatures can only be reached after others: the bear has to be in the parade before the log can move, and the creature next to the fog has to bloom before the tiles behind it open up.
5. **Decoys.** A gift that looks useful but costs two tiles too many. An obvious route that ends one tile short.
6. **Mixed goals** (see Level goals).

Every level runs through a solver during design. It checks that the level can be solved, counts the solutions and finds the shortest path. It also counts **near-solutions**: plausible routes that cheer everyone but one creature. Hard levels have lots of near-solutions and very few real ones. That's what makes a fail feel like "so close" instead of "impossible."

### Level goals

Like match-3 games, levels mix goals to stay fresh:

- **Cheer everyone:** the default.
- **Family line:** a mother duck and her ducklings must join the parade in order, mother first. Part of the route order is fixed.
- **Deliveries:** pick up gifts and bring each one to a specific creature, such as a letter to the owl who's waiting for post.
- **Bloom target:** colour a set percentage of the level, which needs efficient use of paint pods.
- **Hush tide:** the fog spreads one tile every few beats. Finish before it swallows the creatures.
- **Two travellers** (late game): Ochre and a friend each draw a path. Both run at the same time, and they can't cross each other.

### Keeping lives meaningful

The risk with a puzzle that has fixed solutions: once you know the answer, you never fail again, and answers can be looked up online. In match-3 games, luck keeps lives and boosters valuable. Bloomline needs other ways to do that.

- **Planning isn't knowing.** The rules are visible, but timing consequences only show during the run. Most fails come from a plan that looked right.
- **Variants on hard levels.** Each Tricky and Very Tricky level has 3-5 hand-checked variants: different countdowns, a moved stump, a creature facing another way. The idea of the level stays the same. The variant stays fixed while you keep retrying, and changes when you leave the level or run out of hearts. That makes copying a solution from a video unreliable without ever changing the puzzle mid-attempt.
- **Near-miss continues.** When a run fails with just one creature left gray, the game offers a continue: keep your path and get 3 extra tiles to finish it. This is Bloomline's version of "+5 moves", the biggest earner in match-3 games.

## The world gets brighter as you play

Colour comes back on three scales:

- **In a level:** every greeting splashes colour across the scene. The finished level is a little clay diorama of your route.
- **On the map:** each finished level restores colour to its spot on the world map. Finishing a world turns the whole region from unpainted clay to full colour, with a short celebration.
- **In the music:** the menu theme starts as a single quiet piano. Each finished world adds an instrument, until the title screen plays the full song.

The level-complete screen shows a **group photo**: Ochre and the whole parade posing in the now-colourful scene. Players can save or share it. (This replaces Red Line's "crime scene photo.")

## Worlds

Each world is a themed place with its own reason for being sad, its own creatures and its own instrument family. To keep 100+ levels from blurring together, every world is split into **areas**: distinct parts of that place, each with its own backdrop, level shape and one local twist.

### Structure

- **6 worlds at launch**, each with **4 areas of 5 levels**, plus a **boss level** at the end of the world. That's about 126 levels, with new worlds added in live updates.
- Each area changes four things:
  - **Backdrop and palette:** what colour the area blooms into is different per area, so finished areas look clearly different on the map.
  - **Level shape:** open clearings, narrow tunnels, vertical climbs, islands, loops. Different shapes ask for different kinds of paths.
  - **One local twist:** a mechanic that only exists in that area, or debuts there. The core rules stay the same; the twist adds flavour without needing a tutorial.
  - **Music variation:** the world's instrument family plays a different arrangement per area.
- On the world map, each area is its own island of gray that brightens as its five levels are finished. When all four areas are done, the boss level unlocks and the whole world blooms at once.

### The Silent Parliament (forest, woodwinds)

A forest where the owls stopped holding their nightly parliament. Rabbits, foxes, owls, hedgehogs and a big sad bear.

| Area | Setting | Local twist |
|---|---|---|
| **The Public Gallery** | Sparse birches and a meadow. Wide open, gentle. | The tutorial area. Gloomy and Shy creatures only. |
| **The Division Lobbies** | Underground rabbit tunnels lit by glowing roots. Narrow, branching layouts. | **Burrows:** run into one hole, pop out of another. |
| **The Recess** | A clearing of giant mushrooms in a perfect circle. | **Bounce caps:** mushrooms launch Ochre over obstacles. Sleepy creatures debut. |
| **The Upper House** | Inside an enormous hollow tree. Vertical, spiralling levels. | **Branches and ladders:** paths climb between floors. |
| **Boss: The Speaker** | The parliament clearing. | The old owl who chairs the parliament refuses to open the session. Cheer every member in the right order across three strokes. |

### Port Nobody (harbour village, accordion and strings)

A fishing village where no boats come in anymore. Seagulls, crabs, otters, cats and a lonely lighthouse keeper.

| Area | Setting | Local twist |
|---|---|---|
| **Unclaimed Freight** | Sand, beach grass and washed-up crates. | **Sideways crabs:** creatures that walk back and forth on a fixed track. |
| **Yesterday's Catch** | Crowded stalls and awnings. Tight, maze-like. | **Gulls:** grab the first gift on your path unless you greet them first. |
| **The Empty Berths** | Planks, gaps and moored boats. | **Rocking boats:** platforms that tilt between two positions as the run goes. |
| **Half Tide** | Rocks and pools at the water's edge. | **Tide:** water rises halfway through a run and covers part of the level. |
| **Boss: Nobody's Light** | A spiral staircase up the lighthouse. | Cheer the keeper's old animals floor by floor to relight the lamp. |

### Thaw Pending (mountain village, bells)

A mountain village stuck in a winter that never ended. Hugs literally warm people up.

| Area | Setting | Local twist |
|---|---|---|
| **Unsupervised Ice** | A big sheet of ice with fishing holes. | **Ice:** Ochre slides past corners, like a world full of puddles. |
| **Closed Until Spring** | Snowed-in houses, a frozen fountain. | **Frozen creatures:** need a blanket first, then a hug. |
| **The Run-Out** | Steep, long, downhill levels. | **Slopes:** Ochre speeds up going down and slows down going up. |
| **No Diving** | Steaming pools with bathing animals. | **Steam:** hides gaze cones until you're close. |
| **Boss: The Goat Has the Rope** | A frozen tower above the village. | A huge mountain goat holds the bell rope and won't let go. Thaw it with a parade big enough to warm the tower. |

### The Stalled Funfair (carnival, brass)

A carnival that stopped mid-ride. Sleepy animatronics, prize plushies and a candy-floss machine that has lost its colour.

| Area | Setting | Local twist |
|---|---|---|
| **Every Player Wins** | Game stalls, prize shelves and string lights. | **Prize plushies:** come alive and join the parade when the stall next to them blooms. |
| **You, Twice** | Mirror corridors. | **Mirrors:** a reflected Ochre runs a mirrored copy of your path and greets creatures on the other side. |
| **The Gallopers** | One big rotating level. | **Rotation:** the level turns while you run, so creatures move into and out of your path. |
| **Mildly Haunted** | A dark ride with painted spooks. | **Darkness:** only the glow of your path lights up creatures. |
| **Boss: Stuck at the Top** | The giant Ferris wheel. | Cheer the riders car by car as the wheel slowly comes back to life. |

### Monday, Ongoing (town, swing band)

A gray little town where it has been Monday for three years and people forgot how to smile. The first world with humans.

| Area | Setting | Local twist |
|---|---|---|
| **Delays Expected** | Platforms, ticket barriers and commuters. | **Trains:** pass through on a timer and block tracks while they're in. |
| **Per My Last Email** | Cubicles, coffee machines and plants. | **Lifts:** move Ochre between floors. Coffee gives a short speed boost. |
| **Delicates** | Washing machines and sleepy cats. | **Spinning drums:** fling Ochre out in a new direction. |
| **Strictly No Roof Access** | Gardens, pigeons and washing lines. | **Washing lines:** zip lines between buildings. |
| **Boss: Five to Nine** | The clock tower stuck on Monday morning. | Cheer the clockkeeper and the gears start turning again. It's finally Tuesday. |

### Above the Hush (sky, choir)

A sky world over the gray cloud itself, with sheep-clouds and kites.

| Area | Setting | Local twist |
|---|---|---|
| **Where Kites Go** | Grassy floating islands full of tangled kites. | **Updrafts:** carry Ochre between islands. |
| **Grazing Rights** | A herd of drifting sheep-clouds. | **Drifting platforms:** the level moves slowly while you plan. |
| **Manual Override** | A machine that makes the weather. | **Switches:** greetings flip rain, sun and wind, which changes the level mid-run. |
| **Last Known Colour** | Where colour runs out. | Everything learned so far, mixed. |
| **Final boss: The Hush** | Inside the gray cloud. | The Hush turns out to be a very large, very lonely cloud. The final level is one long stroke with the entire parade behind you. You give it a hug. |

## Progression and meta

- **A long level map**, organised as worlds and areas (see Worlds). A new temperament, gift or area twist arrives every 3-5 levels.
- **Companions:** one cheered creature per world can be invited to join permanently. Before a level, pick one companion to start the run in your parade. Each has a small ability (the owl shows Shy gaze cones from the start, the rabbit adds a little path length). Companions are earned, never sold.
- **Ochre's wardrobe:** scarves, hats, backpacks and greeting styles, unlocked with stars. Purely cosmetic.
- **The Daily Round:** one hand-made level a day, with a leaderboard for path length and Bloom.

## Monetisation

Standard cozy free-to-play.

- **Lives = Hearts.** Five max, one lost per failed run, refilling over time. Out of hearts? Buy a refill, or wait.
- **Asking friends for lives:** friends send you a heart in a little envelope with a sticker.
- **Unlimited lives:** **"Bottomless Mug: 1 hour"**.
- **Boosters:**
  - **Second Draft:** undo the last part of a committed path once.
  - **Dress Rehearsal:** plays a faint preview of the first five beats of the run, including timing.
  - **Spoiler:** before you commit, shows which creature your current plan would miss. The strongest booster, priced accordingly.
  - **Extra Warmth:** start the level with 3 extra tiles.
  - **Sturdy Boots:** survive one bowl-over from a Bouncy creature.
- **Near-miss continue:** "Catch your breath." When a run fails with one creature left gray, keep your path and get 3 extra tiles to finish it, for coins or an ad.
- **Season pass:** **"Parade Permit"**, with outfits, photo frames, parade hats and boosters on free and premium tracks.
- **Rewarded ads:** a travelling puppet show in the village square, where the real ad plays on the puppet stage.

## Art direction

**Clay toy diorama.** See [`art/05-grid-clay.png`](art/05-grid-clay.png) for the reference image. It was picked over the painted storybook, cut-paper and flat vector tests because it feels warm and touchable, and it works for every world: forest, harbour, snow, funfair, town and sky are all easy to imagine as little clay sets.

- **Materials:** soft matte clay with visible fingerprints and slightly uneven edges, so it feels handmade. Chunky, rounded shapes everywhere. No hard edges, no glossy plastic.
- **Each level is a toy set** sitting on a table: a slab of clay tiles with the scene built on top, seen from a slightly tilted top-down camera with gentle tilt-shift blur at the edges. Readability comes first: the blur never touches the playing area.
- **Characters** are small clay figures with big heads and simple faces, so they read well at phone size. Ochre is the only coloured figure at the start of every level, standing on the only coloured tile, so the premise ("colour follows Ochre") reads before the first move.
- **The gray state is unpainted clay:** soft, pale gray clay, still pretty and tactile, just quiet. Creatures droop a little.
- **Colour comes back like paint soaking into the clay:** fast at the creature, softening at the edges, with flowers and grass popping up out of the tiles. The spread should be the most satisfying effect in the game.
- **Grid readability:** each tile is a separate, slightly raised clay square with a thin gap between tiles, so the grid reads without drawn lines. Grid lines only fade in while drawing. Obstacles (stumps, rocks, bushes) sit clearly on one tile each. Walkable tiles stay plain (smooth clay, maybe a tiny texture), and raised decoration is reserved for obstacles, creatures and gifts. In dense levels, decorated walkable tiles make it hard to see at a glance where you can walk (see `art/storyboard/18-tricky-forest-planning.png`).
- **Rule markers** are clay props too: the owl's gaze line is a row of small clay dots, the goose's countdown is a little clay sign, the bear's zZ floats above it, the hedgehog's soft side is a fluffy patch.
- **The drawn path** is a glowing warm line that snaps between tile centres and leaves a trail of small clay flowers behind Ochre.
- **Pastel palette** in colour, with each area blooming into its own dominant colour (see Worlds), so finished areas look clearly different on the map.
- **Production:** the look suits real-time 3D with a stylised clay shader, or pre-rendered sprites. A quick technical art test should decide which, together with the colour-spread effect.

## Audio

- Gray levels open almost silent: wind, a soft single-note drone.
- Each greeting adds an instrument phrase on the beat, so the order of a run decides how the song is built. A perfect run ends on a full, happy arrangement.
- Greetings get small character sounds: giggles, purrs, honks, happy squeaks.

## Tone and ratings

- Aiming for a 4+ / PEGI 3 rating. No violence, no peril beyond comic tumbles.
- The rating is for everyone, but the writing is for adults: level names, creature notes and UI copy should be dry and witty, like a good picture book that's secretly written for the parents.
- Affection is friendly and family-appropriate: hugs, boops, high-fives, forehead and cheek kisses.
- Sadness is gentle and specific ("the bear's friend moved away"), never heavy. Every creature ends up happy.

## Relation to Red Line

Bloomline started as Red Line with a different meaning, and most creature rules still map to a Red Line enemy (see the temperament table). The big difference is the grid: Red Line's freehand line suits fast action, while Bloomline's snapped path makes every rule exact so levels can be designed as precise puzzles. Bloomline also adds the colour spread, Hush fog and the parade.

## Open questions

- Is "Shy creatures must see you coming" readable to players who've never seen a gaze line? The visual language needs testing with non-gamers.
- Should the parade work like Snake, where tiles free up again once the end of the parade has passed? That's more true to the theme and adds depth, but it's much harder to read than "each tile once". Start with the simple rule and test the Snake variant later.
- How big can the grid get on a phone before tiles are too small to drag accurately? Probably 8 tiles wide at most in portrait.
- The grid can't feel like a spreadsheet. The art test has to prove that tiles can read clearly while still looking like a natural scene.
- How long can the parade get before it clutters a small phone screen? Maybe followers shrink or only the last 10 are shown.
- Do parade abilities and level goals add enough depth to carry 100+ levels at adult difficulty? A level-design sprint of 30 levels with the solver should answer this before anything else is built.
- Do level variants feel fair, or do players feel cheated when a hard level changes after they leave it? Needs playtesting.
- Are deterministic puzzles too easy to beat with online walkthroughs to support a lives-based business model? Compare retention and spending against a match-3 benchmark in soft launch.
- The colour-spread effect is the selling point. It needs an early technical art test to make sure it looks this good on mid-range phones.
- Name and protagonist design: Ochre needs to be original, gender-neutral and instantly lovable.
