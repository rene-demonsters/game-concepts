# Bloomline (working title)

A path-drawing puzzle game about bringing colour back to a gray world. Each level is a small, drained-of-colour scene laid out on a grid of tiles and full of creatures who've gone gray and gloomy. You drag one path across the tiles with your finger. When you let go, your little traveller dashes along it and greets everyone on the way: a hug, a nose boop, a high five, a kiss on the forehead. Every creature you reach bursts back into colour, the colour spreads across the ground around them, and they fall in line behind you. By the end of the run, a silent gray clearing has become a bright, noisy parade.

It keeps the core of [Red Line](../red-line/README.md): plan the whole run, draw it once, watch it play out, retry instantly. Unlike Red Line, the path snaps to a grid, so every rule is exact and the challenge is purely in the planning. The violence is gone. In its place is the fantasy of walking through a sad place and having everything in it come back to life and follow you.

**Player promise:** draw one perfect path, and watch a whole world wake up behind you.

Title availability has not been checked. Alternatives: *Colour Me In*, *Warm Path*, *Hug Run*.

## Pillars

- **Cozy all the way through.** Nobody gets hurt, not even on a failed run. Failing is gentle and funny: you trip into a leaf pile, or a puppy bowls you over and licks your face.
- **Colour and music return together.** The gray world is quiet. Every creature you cheer brings back a patch of colour **and** an instrument. A perfect run finishes as a full-colour scene with a full song.
- **The parade is the reward.** Creatures you reach follow you. The longer your run, the bigger and sillier the parade. That's the "everyone comes to her" feeling, earned by the player's planning.
- **Still a real puzzle.** Cheering everyone is required, the tile budget is tight, and creature temperaments clash with each other and with the obstacles. Swapping punches for hugs must not make the game shallow. The challenge comes from planning, never from danger or reflexes.

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
| **Big sad** | A big creature (a bear, a moose, a troll) that needs two greetings: be next to it at two separate moments in the path, or bring a cookie basket. | Heavy |
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
| **The Forest Edge** | Sparse birches and a meadow. Wide open, gentle. | The tutorial area. Gloomy and Shy creatures only. |
| **The Warren** | Underground rabbit tunnels lit by glowing roots. Narrow, branching layouts. | **Burrows:** run into one hole, pop out of another. |
| **The Mushroom Ring** | A clearing of giant mushrooms in a perfect circle. | **Bounce caps:** mushrooms launch Ochre over obstacles. Sleepy creatures debut. |
| **The Great Oak** | Inside an enormous hollow tree. Vertical, spiralling levels. | **Branches and ladders:** paths climb between floors. |
| **Boss: The Speaker** | The parliament clearing. | The old owl who chairs the parliament refuses to open the session. Cheer every member in the right order across three strokes. |

### Port Nobody (harbour village, accordion and strings)

A fishing village where no boats come in anymore. Seagulls, crabs, otters, cats and a lonely lighthouse keeper.

| Area | Setting | Local twist |
|---|---|---|
| **The Dunes** | Sand, beach grass and washed-up crates. | **Sideways crabs:** creatures that walk back and forth on a fixed track. |
| **The Fish Market** | Crowded stalls and awnings. Tight, maze-like. | **Gulls:** grab the first gift on your path unless you greet them first. |
| **The Pier** | Planks, gaps and moored boats. | **Rocking boats:** platforms that tilt between two positions as the run goes. |
| **The Tide Pools** | Rocks and pools at the water's edge. | **Tide:** water rises halfway through a run and covers part of the level. |
| **Boss: The Lighthouse** | A spiral staircase up the lighthouse. | Cheer the keeper's old animals floor by floor to relight the lamp. |

### The Long Winter (mountain village, bells)

A mountain village stuck in a winter that never ended. Hugs literally warm people up.

| Area | Setting | Local twist |
|---|---|---|
| **The Frozen Lake** | A big sheet of ice with fishing holes. | **Ice:** Ochre slides past corners, like a world full of puddles. |
| **The Village Square** | Snowed-in houses, a frozen fountain. | **Frozen creatures:** need a blanket first, then a hug. |
| **The Sledding Slopes** | Steep, long, downhill levels. | **Slopes:** Ochre speeds up going down and slows down going up. |
| **The Hot Springs** | Steaming pools with bathing animals. | **Steam:** hides gaze cones until you're close. |
| **Boss: The Bell Tower** | A frozen tower above the village. | A huge mountain goat holds the bell rope and won't let go. Thaw it with a parade big enough to warm the tower. |

### The Stalled Funfair (carnival, brass)

A carnival that stopped mid-ride. Sleepy animatronics, prize plushies and a candy-floss machine that has lost its colour.

| Area | Setting | Local twist |
|---|---|---|
| **The Midway** | Game stalls, prize shelves and string lights. | **Prize plushies:** come alive and join the parade when the stall next to them blooms. |
| **The Hall of Mirrors** | Mirror corridors. | **Mirrors:** a reflected Ochre runs a mirrored copy of your path and greets creatures on the other side. |
| **The Carousel** | One big rotating level. | **Rotation:** the level turns while you run, so creatures move into and out of your path. |
| **The Ghost Train** | A dark ride with painted spooks. | **Darkness:** only the glow of your path lights up creatures. |
| **Boss: The Big Wheel** | The giant Ferris wheel. | Cheer the riders car by car as the wheel slowly comes back to life. |

### Mondayville (town, swing band)

A gray little town where it has been Monday for three years and people forgot how to smile. The first world with humans.

| Area | Setting | Local twist |
|---|---|---|
| **The Station** | Platforms, ticket barriers and commuters. | **Trains:** pass through on a timer and block tracks while they're in. |
| **The Office** | Cubicles, coffee machines and plants. | **Lifts:** move Ochre between floors. Coffee gives a short speed boost. |
| **The Laundrette** | Washing machines and sleepy cats. | **Spinning drums:** fling Ochre out in a new direction. |
| **The Rooftops** | Gardens, pigeons and washing lines. | **Washing lines:** zip lines between buildings. |
| **Boss: The Town Clock** | The clock tower stuck on Monday morning. | Cheer the clockkeeper and the gears start turning again. It's finally Tuesday. |

### Above the Hush (sky, choir)

A sky world over the gray cloud itself, with sheep-clouds and kites.

| Area | Setting | Local twist |
|---|---|---|
| **The Kite Fields** | Grassy floating islands full of tangled kites. | **Updrafts:** carry Ochre between islands. |
| **The Flock** | A herd of drifting sheep-clouds. | **Drifting platforms:** the level moves slowly while you plan. |
| **The Weather Works** | A machine that makes the weather. | **Switches:** greetings flip rain, sun and wind, which changes the level mid-run. |
| **The Edge of the Hush** | Where colour runs out. | Everything learned so far, mixed. |
| **Final boss: The Hush** | Inside the gray cloud. | The Hush turns out to be a very large, very lonely cloud. The final level is one long stroke with the entire parade behind you. You give it a hug. |

## Progression and meta

- **A long level map**, organised as worlds and areas (see Worlds). A new temperament, gift or area twist arrives every 3-5 levels.
- **Companions:** one cheered creature per world can be invited to join permanently. Before a level, pick one companion to start the run in your parade. Each has a small ability (the owl shows Shy gaze cones from the start, the rabbit adds a little path length). Companions are earned, never sold.
- **Ochre's wardrobe:** scarves, hats, backpacks and greeting styles, unlocked with stars. Purely cosmetic.
- **Daily Picnic:** one hand-made level a day, with a leaderboard for path length and Bloom.

## Monetisation

Standard cozy free-to-play.

- **Lives = Hearts.** Five max, one lost per failed run, refilling over time. Out of hearts? Buy a refill, or wait.
- **Asking friends for lives:** friends send you a heart in a little envelope with a sticker.
- **Unlimited lives:** **"Warm Cocoa: 1 hour"**.
- **Boosters:**
  - **Do-over Daisy:** undo the last part of a committed path once.
  - **Daydream:** shows a faint preview of the first second of the run.
  - **Sturdy Boots:** survive one bowl-over from a Bouncy creature.
- **Continue:** "Catch your breath" for +20% path length.
- **Season pass:** **"Picnic Pass"**, with outfits, photo frames, parade hats and boosters on free and premium tracks.
- **Rewarded ads:** a travelling puppet show in the village square, where the real ad plays on the puppet stage.

## Art direction

**Clay toy diorama.** See [`art/05-grid-clay.png`](art/05-grid-clay.png) for the reference image. It was picked over the painted storybook, cut-paper and flat vector tests because it feels warm and touchable, and it works for every world: forest, harbour, snow, funfair, town and sky are all easy to imagine as little clay sets.

- **Materials:** soft matte clay with visible fingerprints and slightly uneven edges, so it feels handmade. Chunky, rounded shapes everywhere. No hard edges, no glossy plastic.
- **Each level is a toy set** sitting on a table: a slab of clay tiles with the scene built on top, seen from a slightly tilted top-down camera with gentle tilt-shift blur at the edges. Readability comes first: the blur never touches the playing area.
- **Characters** are small clay figures with big heads and simple faces, so they read well at phone size. Ochre is the only coloured figure at the start of every level.
- **The gray state is unpainted clay:** soft, pale gray clay, still pretty and tactile, just quiet. Creatures droop a little.
- **Colour comes back like paint soaking into the clay:** fast at the creature, softening at the edges, with flowers and grass popping up out of the tiles. The spread should be the most satisfying effect in the game.
- **Grid readability:** each tile is a separate, slightly raised clay square with a thin gap between tiles, so the grid reads without drawn lines. Grid lines only fade in while drawing. Obstacles (stumps, rocks, bushes) sit clearly on one tile each.
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
- Do parade abilities add enough depth to carry 100+ levels, or does the game need another layer (weather, day and night)?
- The colour-spread effect is the selling point. It needs an early technical art test to make sure it looks this good on mid-range phones.
- Name and protagonist design: Ochre needs to be original, gender-neutral and instantly lovable.
