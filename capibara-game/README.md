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

The ship connects locations and acts as a shared home. A simple illustrated map supports travel once routes have been discovered.

Possible adventures include:

- **The lighthouse mystery:** the lighthouse goes dark before a lantern festival, and strange lights appear near a wreck.
- **The ghost ship:** mysterious sounds and moving objects frighten the harbor; investigating reveals someone who needs help.
- **The disappearing island:** conflicting charts and changing tides complicate a delivery to an apparently missing island.
- **The mixed-up treasure:** a chest of ordinary objects leads to a mystery about their owners and a former captain's travels.
- **The boat race:** misplaced equipment and damaged course markers threaten the annual race; helping everyone prepare forms the main adventure.

Each adventure has a complete, satisfying ending. The same duo can carry different story genres without changing their core personalities.

## Core gameplay

1. Enter a location and explore its characters, objects, and visual clues.
2. Learn about a problem through a short conversation or visible event.
3. Collect useful objects and discover connections between requests.
4. Use an object, help a character, or have the duo cooperate to solve an obstacle.
5. Open a route or uncover a clue that advances the central mystery.

Use one shared inventory. The child selects a destination, object, or interaction, and the appropriate character takes the lead. Contextual cooperation keeps both characters useful without requiring a separate character-switching system.

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

## Technical direction

Build in Phaser, with reusable systems for locations, hotspots, dialogue, inventory, contextual cooperation, travel, and saves. Describe adventure content as data where practical so later stories can reuse the same foundation.

Codex can assist with implementation, content tooling, and puzzle-state validation. Asset generation supports the art workflow; final selection, puzzle design, dialogue review, and playtesting remain deliberate production work.

Support mouse and touch from the beginning, with large targets and a select-item-then-select-target interaction that does not depend on precise dragging. Save progress automatically, including the selected puzzle variants.

## First playable scope

A roughly ten-minute lighthouse adventure with three connected locations, the central duo, one supporting character, and a short ending.

Include one complete inventory puzzle chain, the cooperative door puzzle, and one mixing or signal puzzle with two authored variants. Use a small set of generated illustrations and character poses, simple effects, and enough spoken feedback to evaluate whether a child understands what to do.

The first playable should establish whether the duo is enjoyable, their cooperation is intuitive, and the puzzle variations remain understandable and solvable. Expand the world and language coverage after those fundamentals work.
