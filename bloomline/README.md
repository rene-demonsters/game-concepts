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

Each world is a gray place with its own reason for being sad, its own creatures and its own instrument family.

- **The Silent Parliament:** the first world, a forest where the owls stopped holding their nightly parliament. Rabbits, foxes, owls and a big sad bear. Woodwinds.
- **Port Nobody:** a fishing village where no boats come in anymore, with seagulls, crabs, otters and a lonely lighthouse keeper. Accordion and strings.
- **The Long Winter:** a mountain village stuck in one winter that never ended. Hugs literally warm people up; frozen creatures need a blanket. Bells.
- **The Stalled Funfair:** a carnival that stopped mid-ride, with sleepy animatronics, a sad carousel horse and a candy-floss machine that's lost its colour. Brass.
- **Mondayville:** a gray little town where it has been Monday for three years and people forgot how to smile. Commuters, a grumpy mail carrier, a cat on every windowsill. The first world with humans. Swing band.
- **Above the Hush:** a sky world over the gray cloud itself, with sheep-clouds and kites. Choir.

**Boss levels** end each world with a creature that's too big or sad for one run, solved across a sequence of strokes: a giant forest troll who just wants a friend, a whale stranded in a gray tide pool. The final level is the Hush itself, which turns out to be a very large, very lonely cloud. You give it a hug.

## Progression and meta

- **A long level map**, about 20 levels per world, with a new temperament, gift or environment piece every 3-5 levels.
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
