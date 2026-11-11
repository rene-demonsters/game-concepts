# Bloomline (working title)

A one-stroke drawing puzzle game about bringing colour back to a gray world. Each level is a small, drained-of-colour scene full of creatures who've gone gray and gloomy. You draw one path with your finger. When you let go, your little traveller dashes along it and greets everyone on the way: a hug, a nose boop, a high five, a kiss on the forehead. Every creature you reach bursts back into colour, the colour spreads across the ground around them, and they fall in line behind you. By the end of the run, a silent gray clearing has become a bright, noisy parade.

It keeps the core of [Red Line](../red-line/README.md): plan the whole run in your head, draw it once, watch it play out, retry instantly. The violence is gone. In its place is the fantasy of walking through a sad place and having everything in it come back to life and follow you.

**Player promise:** draw one perfect path, and watch a whole world wake up behind you.

Title availability has not been checked. Alternatives: *Colour Me In*, *Warm Path*, *Hug Run*.

## Pillars

- **Cozy all the way through.** Nobody gets hurt, not even on a failed run. Failing is gentle and funny: you trip into a leaf pile, or a puppy bowls you over and licks your face.
- **Colour and music return together.** The gray world is quiet. Every creature you cheer brings back a patch of colour **and** an instrument. A perfect run finishes as a full-colour scene with a full song.
- **The parade is the reward.** Creatures you reach follow you. The longer your run, the bigger and sillier the parade. That's the "everyone comes to her" feeling, earned by the player's planning.
- **Still a real puzzle.** Creature temperaments are the rules. Swapping punches for hugs must not make the game shallow; the thinking is the same as Red Line's, only the mood changes.

## Premise

Something called **the Hush** drifted over the land and soaked up its colour, sound and cheer. Creatures stopped singing, flowers closed, villages went quiet and gray. You play a small traveller who still has a bit of warmth left (working name: **Ochre**, named after the oldest paint pigment there is: a round, rosy-cheeked wanderer in a big knitted scarf). Wherever Ochre goes, colour follows.

Ochre isn't a princess or a hero. Ochre is just very, very good at cheering people up.

## Core mechanics

### The stroke

- Draw one continuous path from Ochre's starting spot. Lifting your finger starts the run.
- The path has a length budget, the **Warmth** meter. Longer levels give you more.
- Ochre runs the path quickly (about 2-3 seconds, a little slower and bouncier than Red Line). Anyone within reach of the path gets greeted.
- Sharp turns make Ochre slow down to a skip, which matters around creatures with timing rules.

### Greetings

The kind of greeting depends on the creature, which keeps the animations varied and funny. Rabbits get a nose boop, bears get a big hug, birds get a high-five with a wingtip, a grumpy old toad gets a kiss on the forehead and goes bright pink.

When a creature is greeted:

1. It **blooms**: colour returns to the creature, then splashes outward over the ground, grass and objects around it.
2. It plays a short musical phrase, adding its instrument to the level's song.
3. It **joins the parade** behind Ochre.

### Creature temperaments (the puzzle rules)

| Creature | Rule | Red Line equivalent |
|---|---|---|
| **Gloomy** | Cheers up from any greeting. The basic creature. | Goon |
| **Shy** | Has a visible gaze cone. It must **see you coming**: approach through its gaze and it's delighted. Come from behind or the side and it gets startled and hides in its burrow for the rest of the run. | Gunman |
| **Bouncy** | A puppy or lamb that runs at you the moment the run starts. If it reaches you before you greet it, you get bowled over (run over). Time your route so you meet it on your terms. | Dog |
| **Big sad** | A big creature (a bear, a moose, a troll) who needs two greetings: pass by twice, or bring a gift. | Heavy |
| **Prickly** | A hedgehog or cactus creature that can only be hugged from its soft side, or with mittens. | Shield guy |
| **Worrier** | A goose that honks if it's still gray one second into the run. The honk startles every Shy creature into hiding. Calm it first. | Panic button guy |
| **Sleepy** | Only wakes up if you pass by quietly (no sharp turns nearby). Wakes up grumpy otherwise. | (new) |

### Gifts (picked up along the path)

Gifts replace weapons. Ochre collects them automatically by passing over them.

- **Flower:** thrown to cheer one creature at a distance. (The thrown pistol.)
- **Blanket:** makes Ochre's next greeting a group hug with a wider reach. (The bat.)
- **Mittens:** lets Ochre hug Prickly creatures from any side.
- **Cookie basket:** counts as a gift for one Big sad creature, so it only needs one pass.
- **Flute:** plays a lullaby forward in a cone, calming Worriers and waking Sleepy creatures gently.

### Environment

- **Paint pods:** big gray seed pods that burst into colour when Ochre runs past, splashing a wide area. (Explosive barrels.)
- **Gates, curtains, hedges:** swing open as Ochre runs through; a creature behind a gate gets greeted on the way. (Doors.)
- **Puddles:** splash colour along the path, but make Ochre slide a little further than drawn. Later levels use this on purpose. (Blood slicks.)
- **Wind seeds and leaf piles:** carry Ochre a short distance or soften a fall.
- **Gray brambles:** block the path until a hedgehog in the parade clears them (see Companions).

### The parade

Every creature you cheer falls in line behind Ochre. During the run this is purely joyful: a growing conga line of happy animals.

In later worlds the parade becomes a mechanic too. Some parade members act on their own as they pass things: a rabbit dives into a burrow to reach a Shy creature underground, a bird lifts off to greet a creature on a ledge, a bear rolls a log out of the way. Getting the order right ("cheer the bird before the cliff") adds a second layer to the planning.

### Stars

1. **Everyone:** cheer every creature in the level.
2. **Short and sweet:** finish under the par path length.
3. **Bloom:** colour at least a set percentage of the level (shown as a meter). Paint pods, puddles and greeting order all affect it.

## The world gets brighter as you play

Colour comes back on three scales:

- **In a level:** every greeting splashes colour across the scene. The finished level is a hand-painted picture of your route.
- **On the map:** each finished level restores colour to its spot on the world map. Finishing a world turns the whole region from graphite to full colour, with a short celebration.
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

- **Painted storybook**, see [`art-styles/painted-storybook.md`](../art-styles/painted-storybook.md). Textured gouache, soft shapes and warm light.
- The gray state isn't flat gray. It's soft graphite and pencil wash on paper, still pretty, but quiet and a little sad. Creatures are sketched and droopy.
- Colour returns like **watercolour blooming into wet paper**: fast at the creature, softening at the edges. The spread should be the most satisfying effect in the game.
- Camera: a slightly tilted top-down "diorama" view, so creatures and their faces read clearly while the path is still easy to draw.
- The drawn path glows like warm light and leaves a trail of small flowers behind Ochre.

## Audio

- Gray levels open almost silent: wind, a soft single-note drone.
- Each greeting adds an instrument phrase on the beat, so the order of a run decides how the song is built. A perfect run ends on a full, happy arrangement.
- Greetings get small character sounds: giggles, purrs, honks, happy squeaks.

## Tone and ratings

- Aiming for a 4+ / PEGI 3 rating. No violence, no peril beyond comic tumbles.
- Affection is friendly and family-appropriate: hugs, boops, high-fives, forehead and cheek kisses.
- Sadness is gentle and specific ("the bear's friend moved away"), never heavy. Every creature ends up happy.

## Relation to Red Line

Bloomline is the same puzzle engine with a different meaning. Most Red Line rules map one-to-one (see the table above), so a single prototype of the drawing and run system could test both themes. Bloomline adds two things Red Line doesn't have: the colour spread (Bloom star) and the parade.

## Open questions

- Is "Shy creatures must see you coming" readable to players who've never seen a gaze cone? The visual language needs testing with non-gamers.
- How long can the parade get before it clutters a small phone screen? Maybe followers shrink or only the last 10 are shown.
- Do parade abilities add enough depth to carry 100+ levels, or does the game need another layer (weather, day and night)?
- The colour-spread effect is the selling point. It needs an early technical art test to make sure it looks this good on mid-range phones.
- Name and protagonist design: Ochre needs to be original, gender-neutral and instantly lovable.
