# The Lighthouse That Went Dark

Expanded design for the first Capibara Game title. This folder is the source of truth for this title's story, scenes, puzzles, variants, and future asset briefs. It expands the [earlier short treatment](../adventures/01-lighthouse.md). Names remain role names until the series has a naming guide. This is a design specification; assets and gameplay are not implemented.

## Documents

- [Scenes and hubs](scenes.md): geography, screen compositions, characters, hotspots, state changes, and optional jokes.
- [Puzzles and variants](puzzles.md): dependencies, item locations, authored alternatives, hints, and completion rules.
- [Asset generation manifest](assets.md): shared visual contract, asset IDs, prompt subjects, state requirements, and independent work packages.

## Adventure promise

A female capybara captain and her tiny shrimp first mate investigate a dark lighthouse on the evening of a floating lantern festival. Explore a friendly harbor and a lighthouse island, carry useful objects between scenes, and discover that the supposed ghost ship is a helpful neighbor. The mystery resolves through observation and kindness. No villain, combat, danger timer, reading requirement, or penalty for experimenting.

Target audience: ages 4–8, with spoken dialogue and large touch targets. The expanded adventure is intended to support several short sessions; duration and difficulty need playtesting. The original roughly ten-minute playable is a separate production slice below.

## Story and ending

### Arrival: one light goes missing

At the home jetty, the captain hangs a paper lantern from her little ship. The shrimp measures its height with an absurdly tiny ruler: “Regulation festive!” Across the bay, the lighthouse beam shudders and stops. A pale light flashes at the old wreck. “Ghost ship, Captain. Very irregular parking.”

The festival coordinator, a pelican, postpones the floating lantern launch until the lighthouse is working. Everyone keeps decorating, so the world stays warm and active. The turtle lighthouse keeper is visiting the harbor to repair the festival foghorn. She explains that her lighthouse was working before she left. She saw a small, nervous visitor near her laundry basket but did not get a proper look.

The keeper's chart shows the safe approach through the shoals. A gust blew it into a gull's nest above the market. Meanwhile, the foghorn's hose is loose. The gull offers the chart back if the crew can find something soft to replace its nest lining. Exploring the harbor supplies both a cloth offcut and a hose clamp. After the crew returns the chart and repairs the horn, the keeper makes a reassuring foghorn call across the bay and joins them aboard. The chart, rather than the horn's sound, supplies the navigation solution.

### Investigation: a broom and some bunting

At the lighthouse landing, the door opens only a crack. The shrimp crawls through a damp drain and reports that a broom has fallen behind it. The captain needs a thin batten; a patient crab boatbuilder on the island lends one once the crew returns a misplaced sail patch. Together the heroes slide the broom aside. The keeper enters with them.

Upstairs, festival bunting trails into the stopped turning mechanism. The keeper disconnects the drive before anyone investigates. A young octopus is holding the fabric tightly from behind the wheel. It won't come out when called. The shrimp hears a worried squeak and recognizes a frightened visitor, not a naughty saboteur.

A window gives a clear view of the wreck. Its flashes match the salvage worker's landing-signal card. The worker has recovered a basket of lighthouse equipment, but is waiting for the correct colored shore signal before rowing to the landing. A craft stall back in the harbor has washable dyes and a screen. The crew makes the requested orange or green screen, signals, and meets the worker at the landing.

### Resolution: a small safe place

The salvage worker, a seal, laughs at the ghost rumor: he has been polishing an old reflector, producing the strange glints. He lends an inspection lamp. In the machine room its light reveals a shell-shaped comfort toy, lost behind a service slot. The captain holds the light while the shrimp crawls in and retrieves it.

The octopus reaches toward the toy, then retreats from the open room. The keeper remembers the visitor sheltering in her laundry basket: it needs a cozy place, not a louder invitation. The crew brings a bucket from the landing and a towel from the keeper's nook, makes a den away from the machinery, and puts the toy inside. The octopus climbs out, releases the bunting, and settles down. A small pantomime explains the accident: it caught its toy in the bunting, tried to retrieve it, and tangled the wheel. Nothing was broken.

The captain gathers the fabric, turns the test crank, and lets the keeper check the clear mechanism. They restart the lighthouse together. At the harbor, the lantern launch begins only when the player chooses “Ready.” The octopus watches from its bucket beside the keeper. The salvaged reflector casts sparkling light across the decorations. The shrimp closes his notebook: “Ghost ship promoted to ordinary boat. Crew: extremely cuddly.” The captain replies: “A good crew to have nearby.”

## World and travel

Two walkable hubs connect smaller scenes. The ship and illustrated map connect the hubs; sailing is a short, skippable transition after the initial navigation puzzle.

```text
S01 Home jetty — S02 Harbor square [HUB] — S03 Repair shed
                         |
                    S04 Craft quay
                         |
                map / S05 Buoy channel
                         |
                S06 Lighthouse landing [HUB] — S07 Boatbuilder cove
                         |
                   P04 door gate
                         |
                   S08 Keeper's nook
                         |
                   S09 Machine room — S10 Signal balcony

S11 Wreck meeting: story vignette at the landing after signaling.
S12 Lantern festival: ending overlay on S01/S02, not a new travel node.
```

The map becomes available after the keeper explains the route. Harbor scenes remain reachable throughout. Opening the lighthouse unlocks its three interior scenes together. The wreck is a visible landmark, not an explorable island; the worker comes to the player.

## Story clues to repeat

- No beam, no lantern launch: the festival is waiting safely, not approaching a deadline.
- Moving flashes, a polishing sound, and the worker's silhouette foreshadow the wreck explanation.
- The keeper's missing toy description, little sucker prints, and a glimpse of tentacles establish the visitor before the reveal.
- The octopus reaches for its toy and seeks cover: the final puzzle is about comfort.

Use short exchanges at each discovery. Repeated clicks replay the relevant clue instead of the entire conversation. The shrimp suggests and solves useful things as often as he makes dramatic guesses.

## Production scope

Build the expanded design in this folder as the eventual title. First validate a compact playable using S03, S06, and a combined S09/S10 screen: clamp repair, cooperative broom puzzle, and the orange/green signal puzzle. Supply the chart automatically after the clamp; place the batten on the landing; have the worker bring the lamp, toy, and prepared den for a short ending. That slice deliberately bypasses P01, P03, P07, and P08 from the full dependency graph. It has its own fixed content configuration and must not be mixed with full-game variants.

No final visual style has been selected. The [existing art exploration](../art/README.md) supplies alternatives; the asset manifest describes a provisional production approach and the decisions required before parallel generation.
