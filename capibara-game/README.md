# Capibara Game — concept briefing

Working folder name. The game, characters, ship, and locations are unnamed.

## Premise

A children's point-and-click pirate adventure starring a female capybara captain and her shrimp first mate. They sail between a friendly home harbor and nearby islands, helping residents and solving mysteries through exploration, conversation, and object puzzles.

The central image is a large, calm capybara accompanied by a tiny, enthusiastic shrimp who takes his naval responsibilities extremely seriously. Their friendship drives the humor, and their different sizes create opportunities for cooperation.

The main reference is the Freddi Fish adventure format: an approachable mystery, a reassuring lead, an expressive companion, a world full of characters to help, and puzzle variations that make another playthrough worth exploring.

## Audience and experience

Initially aimed at children around ages 4–8, with the exact difficulty to be established through playtesting. Children should be able to explore independently, with spoken explanations and visual feedback supporting those who cannot yet read fluently.

The experience should feel curious, funny, and safe. Pirate adventures revolve around discoveries, missing objects, misunderstandings, festivals, and local mysteries. Spooky locations can be exciting, with reassuring resolutions. There is no combat or time pressure.

## The duo

### The capybara captain

Friendly, observant, resourceful, and unhurried. She listens to people, asks useful questions, and treats unfamiliar situations as problems they can work out together. Her calmness gives children confidence to investigate.

She takes her first mate seriously and appreciates his contributions. She also has room to be surprised, make an incorrect guess, and learn something from him.

Her physical strengths include moving larger objects, carrying equipment, turning stiff mechanisms, and holding things steady.

### The shrimp first mate

Enthusiastic, loyal, and intensely interested in exploration. He announces discoveries with great importance, sometimes before understanding what he has found. He can voice worries or questions that a child might share, giving the captain a natural reason to explain something.

He is a capable partner whose observations and ideas regularly move the adventure forward. Small details catch his attention, and he can crawl beneath doors, enter narrow pipes, and investigate spaces the captain cannot reach. Dark or unfamiliar passages sometimes require reassurance or a light.

### Their relationship

The captain provides steadiness; the first mate provides momentum. Both notice things the other misses. Humor comes from their perspectives and difference in scale, while each remains respected by the other.

For example, the shrimp proudly reports discovering a secret tunnel beneath a cupboard. The captain asks what he found. It turns out to contain their missing compass—and an alarming amount of dust.

The shrimp's movement should follow a consistent storybook rule: he can travel alongside the captain on land and investigate damp passages. Water can provide additional routes, but routine exploration should not require managing his survival.

## World and story structure

A familiar home harbor anchors a small archipelago. Recurring residents and locations give children something to recognize across adventures, while each story introduces a different island or corner of the world.

The ship is just big enough for the crew and acts as their shared home. Each adventure begins in the harbor with a rumor, a visitor, or something unusual washed ashore. A simple illustrated map supports travel once routes have been discovered.

Each adventure has a complete, satisfying ending. The same duo can carry different story genres without changing their core personalities.

## Adventure concepts

These are possible stories for the series. Titles are provisional; character, ship, and location names remain undecided.

Each linked treatment includes a complete story and ending, locations, a connected puzzle sequence, replay variations, hints, and rules that preserve a route to completion.

### The Lighthouse That Went Dark

[Read the expanded story, scenes, puzzles, variants, and asset briefs](the-lighthouse-that-went-dark/README.md).

On the night of the floating lantern festival, the lighthouse stops working. Strange lights appear near a shipwreck on a neighboring island, and everyone suspects a ghost ship. The captain and her first mate sail between the harbor, lighthouse, and wreck to discover what is happening.

Puzzle ideas:

- Repair a foghorn.
- Mix colored signal lights.
- Follow buoy patterns to navigate a route.
- Help a frightened creature out of the lighthouse machinery.

### The Treasure Nobody Wanted

[Read the story and puzzle treatment](adventures/02-treasure.md).

The duo discovers a chest full of apparently useless objects: a bent spoon, a cracked bell, and one enormous button. An old map suggests they belong to a legendary pirate's treasure, but every islander recognizes something different in the collection. Each returned object brings the crew closer to finding what the old captain actually treasured.

Puzzle ideas:

- Trace the objects' owners through conversations and visual clues.
- Repair keepsakes before returning them.
- Reveal hidden map markings.
- Connect the islanders' memories to reconstruct the old captain's travels.

### The Ghost of the Abandoned Fort

[Read the story and puzzle treatment](adventures/03-fort.md).

Someone—or something—is ringing an abandoned fort's bell and leaving glowing footprints on the beach. The harbor's bravest pirate refuses to investigate without his lucky slippers. The duo explores the fort to discover who needs help behind the spooky performance.

Puzzle ideas:

- Make a harmless glow mixture.
- Find a route through the fort.
- Reconstruct strange noises to understand their source.
- Find the pirate's lucky slippers so he will help with the investigation.

### The Great Backwards Boat Race

[Read the story and puzzle treatment](adventures/04-boat-race.md).

The harbor's annual race is about to begin, but boats keep turning in circles, course markers have drifted away, and the prize has been delivered to the wrong island. A boastful rival captain has a spectacularly impractical ship. The main adventure is about getting everyone ready; the race itself can be a short, forgiving finale.

Puzzle ideas:

- Assemble a sail.
- Balance cargo so a boat travels correctly.
- Interpret wind clues and recover course markers.
- Repair the starting mechanism and retrieve the misplaced prize.

### The Island That Disappeared

[Read the story and puzzle treatment](adventures/05-island.md).

A baker asks the crew to deliver a birthday cake to an island that seems to have vanished. Its residents have left clues around the surrounding waters, but the old charts disagree about where it should be. The investigation reveals a passage accessible at low tide.

Puzzle ideas:

- Compare landmarks with the old charts.
- Consult tide charts.
- Deliver messages between islands to piece together a route.
- Discover and use the passage revealed at low tide.

The player controls when the tide changes through an explicit travel or wait action. There is no real-time waiting, deadline, or risk of missing the passage.

### Replayability across stories

Each story can vary which route needs repairing, what a character requests, or where a clue is found while keeping its central mystery intact. A child can remember the characters and story without remembering every solution. All variations follow the solvability rules below.

## Core gameplay

1. Enter a location and explore its characters, objects, and visual clues.
2. Learn about a problem through a short conversation or visible event.
3. Collect useful objects and discover connections between requests.
4. Use an object, help a character, or have the duo cooperate to solve an obstacle.
5. Open a route or uncover a clue that advances the central mystery.

Use one shared inventory. The child selects a destination, object, or interaction, and the appropriate character takes the lead. Contextual cooperation keeps both characters useful without requiring a separate character-switching system.

All titles use the same [series UI](shared-ui/README.md): a persistent bubble-style inventory near the bottom of the screen, with consistent map, hint, menu, and speech controls. Shared inventory here means both heroes use one inventory within a story; the UI is reused across titles, while each adventure keeps its own items and progress. Title-specific assets supply item pictures, maps, and clues inside the shared interface.

Trying an incorrect object produces a brief, friendly response. Important information can be heard again, and a contextual hint system can move from reminding the player of the goal toward a more explicit suggestion.

### Example cooperative puzzle

A lighthouse door will not open. The shrimp enters through a drainage channel and finds a fallen broom wedged against it. He can reach the obstruction but cannot move it.

After he describes the problem, the player finds a suitable thin object. The captain slides it beneath the door while the shrimp guides its position. Together they dislodge the broom and enter.

The sequence demonstrates both characters' abilities and gives the player a clear reason to find and use an object.

## Puzzle variations and guaranteed completion

New games select from authored puzzle variants and compatible item placements. For example, a character may request a different signal color, or an ingredient may appear in a different accessible location.

- Select variations at the start and keep them stable throughout that playthrough.
- Keep objectives, visual clues, dialogue, and voice lines consistent with the selected variant.
- Ensure every required item is reachable before the obstacle that needs it.
- Prevent circular dependencies between locked areas and their required items.
- Make essential consumables renewable or protect the amount needed to finish.
- Allow incorrect mixtures and similar experiments to be reset and retried.
- Preserve a route to completion after every allowed action, including after loading a save.

Keep puzzle rules separate from presentation so automated checks can validate allowed configurations and reachable states. Use child playtesting to check whether solvable puzzles are also understandable and enjoyable.

## Presentation and audio

Illustrated 2D locations, distinct character silhouettes, readable interactive objects, and a consistent visual style. Generated backgrounds, character poses, and object assets can support production, with review and adjustment for continuity, scale, and clarity.

Keep animation modest: static expressive poses, short movements, blinking, simple effects, and transitions. Strong sound design and responsive interactions should give exploration a sense of life. Optional environmental jokes can reward clicking without becoming required puzzle steps.

Spoken dialogue and explanations are a core part of the intended experience. Support subtitles, replayable lines, and separate music, effects, and voice controls. Store text and audio references by language and puzzle variant so additional languages can be added consistently. Prototype in one language first.

## Concept art

The preferred art direction is **flat cutout animation**, using [the flat lighthouse illustration](art/04-flat-cutout.png) as the reference. It simplifies character shapes and separates moving parts to make blinking, talking, walking, and pointing economical to animate. Character proportions and production assets still need development.

The [concept art comparison](art/README.md) also records comic book without violence, soft colored clay, gouache storybook, and a textured cutout experiment. Exact [generation prompts](art/prompts.md) are included.

![Comic-book concept art](art/01-comic-book.png)

![Soft colored clay concept art](art/02-soft-clay.png)

![Gouache storybook concept art](art/03-gouache-storybook.png)

![Flat cutout animation concept art](art/04-flat-cutout.png)

The [textured cutout experiment](art/README.md#4b-textured-cutout-variation) is retained for comparison. The flat version was preferred.

## Technical direction

Build in Phaser, with reusable systems for locations, hotspots, dialogue, inventory, contextual cooperation, travel, and saves. Describe adventure content as data where practical so later stories can reuse the same foundation.

Codex can assist with implementation, content tooling, and puzzle-state validation. Asset generation supports the art workflow; final selection, puzzle design, dialogue review, and playtesting remain deliberate production work.

Support mouse and touch from the beginning, with large targets and a select-item-then-select-target interaction that does not depend on precise dragging. Save progress automatically, including the selected puzzle variants.

## First playable scope

A roughly ten-minute lighthouse adventure with three connected locations, the central duo, one supporting character, and a short ending.

Include one complete inventory puzzle chain, the cooperative door puzzle, and one mixing or signal puzzle with two authored variants. Use a small set of generated illustrations and character poses, simple effects, and enough spoken feedback to evaluate whether a child understands what to do.

The first playable should establish whether the duo is enjoyable, their cooperation is intuitive, and the puzzle variations remain understandable and solvable. Expand the world and language coverage after those fundamentals work.
