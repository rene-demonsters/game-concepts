# Exit Wound (working title)

A turn-based physics puzzle game about clearing rooms full of goons without throwing a single punch. Each level is a side-view cross-section of one floor of a crime family's tower. You carry a pair of stolen doors: slap the **IN** door on one surface and the **OUT** door on another, and whatever goes in one comes out the other, just as fast. Drop four storeys into a door in the floor, shoot out of a door in the wall, smash into a goon, send him into a bookcase, and watch the bookcase tip over onto the two men behind it.

It keeps the core of [Happy Trails](../happy-trails/README.md) and [Red Line](../red-line/README.md): a small, exact grid, a plan you work out in your head, and a moment where you let go and watch it play out. The difference is that you're not planning a route. You're planning a chain reaction. Every room is a Rube Goldberg machine made of people, furniture and gravity, and your two doors are how you build it.

**Player promise:** stare at a room, see the domino line nobody else sees, place two doors, take one step, and watch everyone in it die in the right order.

**Concept art:** Last Orders, mid-chain. [Image prompt](art/01-key-art-prompt.md).

![Last Orders concept art: Hinge launches through the OUT door and starts a bottle-bookcase chain reaction.](art/01-key-art.png)

Title availability has not been checked. Alternatives: *Through and Through*, *Knock-On*, *Doorman*.

## Pillars

- **The room does the killing.** Hinge never kills anyone with his hands. He's a bouncer: he moves people. Gravity, furniture and other people's bullets do the rest. Every kill is a consequence.
- **Ultra violence on top.** Bodies fly through glass, bookcases flatten people, gunmen shoot their friends in the back. Blood stays where it lands. The tone is loud, fast and gleefully excessive, like the rest of the family of concepts in this repo.
- **Exact rules, no physics engine.** Everything runs on a tile grid with a handful of integer rules. A chain is always predictable, so failing always means a bad plan, never a weird bounce. That's also what makes levels solver-checkable.
- **Plan slowly, watch quickly.** Nothing happens until you act. Then the whole chain resolves in a second or two, with a slow-motion replay of the best part.

## Why this works

Hotline Miami-style rooms are already puzzles: the player dies, restarts and slowly works out the order to clear the room. Portal-style puzzles are about getting something to the right place with enough speed. Put those together and the question every level asks is: *how do I get enough speed into the right person, pointed at the right thing?*

The best moments in both genres are the same moment: the plan clicks and a whole sequence goes off exactly as imagined. Exit Wound is built to deliver that moment in every room.

## Premise

**Hinge** (nickname, never explained) was the doorman at **Revolving**, a nightclub on the ground floor of a sixty-storey tower owned by **Ludo Szabó**. Szabó's people used a pair of prototype doors to move things around the building that shouldn't be moved around the building. One night they decided Hinge had seen too much, and threw him out through a fourth-floor window.

He landed on his feet. He also landed holding the doors.

Now he's going back in, one floor at a time, all the way up to the penthouse. Throwing people out is the only thing he's ever been good at, and now he can throw them anywhere.

## Core mechanics

### The grid

Every level is one floor of the tower in cross-section, like a dollhouse with the front wall removed: usually 6×5 to 9×8 tiles. People and small objects take one tile. Furniture can be taller (a bookcase is 3 tiles high).

The view is side-on so gravity works. That matters: falling is the only way to build speed, and doors in floors and ceilings are half the fun. A top-down view loses both.

### Hinge's turn

1. **Place doors (free).** Put the IN and OUT doors on any plaster surface: a wall, a floor or a ceiling. Moving a door costs nothing, but you can only do it between actions, never while a chain is running.
2. **Take one action:**
   - **Step** one tile left or right. Stepping off a ledge means falling.
   - **Climb** one tile up or down a ladder or staircase.
   - **Barge:** charge left or right until you hit something, and shove it. A barge hits at momentum 1.
   - **Wait.**
3. **Everything resolves.** Falls, flights, impacts and topples play out until nothing is moving.
4. **Enemies act.** See [Enemies](#enemies).

Undo is free and unlimited. Restart is instant.

### The doors

- **IN** is red lacquer with a brass push plate. **OUT** is cream with a round porthole window. They look like the swing doors of a restaurant kitchen, and the shapes read without colour.
- They only stick to **plaster**. Brick, tile, glass and metal reject them. Which surfaces are plaster is the main way level layouts constrain you.
- Anything that enters IN comes out of OUT with **the same momentum**, travelling straight out of OUT's face. A door in the floor sends things down into it; a door in a wall fires them out sideways; a door in a ceiling drops them.
- People, bodies, furniture, bullets and sight lines all pass through.
- **Enemies use your doors too.** A goon who sees a shorter way to you through your doors will take it. This is a weakness and a tool.

### Momentum

Everything that moves carries one number, its **momentum**. All the physics in the game is these rules:

- **Falling adds 1 per tile.** It is the only thing that adds momentum.
- **A barge hits at 1.** Hinge is strong, not fast.
- **Doors keep it.** Momentum goes through unchanged.
- **Flight keeps it.** Anything launched sideways flies in a straight line until it hits something, then drops. Cartoon physics: nothing arcs.
- **Impacts pass it on.** When a moving thing hits something, it stops dead, and the thing it hit is launched in the same direction with **1 less** momentum (2 less for a Heavy).
- **Maximum 9.**

What an impact does depends on the momentum it arrives with:

| Momentum | People | Bookcases, cabinets, vending machines | Glass |
|---|---|---|---|
| **1** | Stumble one tile and survive (unless that tile is a ledge) | Wobble | Nothing |
| **2+** | Die, and fly on as a body | Wobble | Shatters; the object flies through with 1 less |
| **3+** | Die, and fly on as a body | **Topple** away from the hit, crushing every tile they fall across | Shatters |

- A person who hits a wall, a floor or a ceiling at 2+ also dies.
- **Bodies are objects.** They can be launched again, pile up, block bullets, and serve as steps.
- **Hinge never takes fall damage** (steel toecaps). Whatever he lands on takes the hit instead.
- **Hinge dies to one hit:** a goon's punch, a bullet, a falling bookcase, a fryer. He can be killed by his own chain.

### Loops

Put IN in a floor and OUT in the ceiling directly above it, and whatever drops in falls forever, gaining speed until it reaches 9. A loop holds whatever is in it between turns, so it works like a battery: drop a goon in, wait, then move the OUT door to a wall and fire him across the room at full speed.

Things in a loop are in transit. They can't act, can't be shot, and don't count as dead.

### Enemies

Each rule is simple on its own. Levels get hard when two of them pull in different directions.

| Enemy | Rule |
|---|---|
| **Goon** | Walks one tile toward Hinge per turn, through your doors if that's shorter. If he starts the enemy phase next to Hinge, he hits him. The basic unit. |
| **Gunman** | Faces one way. Looks over people's heads, so only walls and furniture block his sight (doors don't). If he can see Hinge at the end of a turn, he fires. The bullet kills **the first person in the line**, which is often not Hinge. |
| **Heavy** | Needs 4+ to kill. Absorbs 2 momentum when hit instead of 1. A barge doesn't move him. |
| **Riot shield** | Anything that hits the shield bounces straight back with the same momentum. Hit him from behind, or from above. |
| **Dog** | Moves two tiles per turn and loves going through doors. |
| **Phone guy** | Has a countdown. If he's still alive when it hits zero, reinforcements arrive through the lift and every door in the floor locks. |

### Environment

- **Bookcases, filing cabinets, vending machines:** topple at 3+ and crush everything they land across. The signature kill.
- **Chandeliers and disco balls:** hang from a chain. Anything hitting the chain snaps it, and they fall like anything else.
- **Glass:** breaks at 2+ and slows whatever goes through by 1. Sight lines pass through intact glass.
- **Lift shafts and stairwells:** long drops, so this is where big momentum comes from.
- **Gas bottles:** explode when hit at 2+, launching everything next to them outward at 3.
- **Fryers, ceiling fans, meat slicers:** anyone who ends up in their tile dies, including Hinge.
- **Pianos and safes:** heavy, barge them off ledges. They crush whatever they land on.

### Clearing a level

**Everyone on the floor must be dead.** If you can't make that happen any more, or Hinge dies, the level resets. On death there's a one-second freeze frame of exactly what got him, then you're back in planning.

### Stars

1. **Cleared:** everyone dead (required).
2. **Par:** finish within the par number of actions. Many early rooms have a par of 1.
3. **Style:** a level-specific challenge, such as "the gunman dies to his own bullet", "nobody is killed by Hinge landing on them" or "one chain, every kill".

### Planning aids

While planning, the game shows door placements, gunmen's sight lines (through doors) and goons' next step. It also previews Hinge's own move **up to the first impact**, with the momentum number it will arrive at. Everything after that first impact is for the player to work out. That's the puzzle.

### Worked example: "Last Orders"

An early level in Revolving, the nightclub. 7×5 grid, columns A-G from left to right, rows 1-5 from bottom to top.

```
        A        B        C        D        E        F        G
  5     .        .        .      Hinge ═══════════════════════════  (catwalk)
  4     .        .        .        .        .        .        .
  3     .        .        .        .     Bookcase     .        .
  2     .        .        .        .     Bookcase     .        .
  1     .      Goon       .        .     Bookcase   Goon    ←Gunman
     plaster                                                      brick
```

- Hinge stands on a catwalk that runs from D5 to G5. Columns A-C are open from ceiling to floor.
- **Goon** at B1 and another at F1. **Gunman** at G1 facing left. The bookcase is the only reason he can't see the rest of the room.
- **Bookcase** at E1-E3, 3 tiles tall.
- Floor, ceiling and left wall are plaster. The right wall is brick.
- **Par:** 1 action.

**Tempting ideas that fail:**

- *"Jump down and deal with them."* Stepping into C5 drops Hinge four tiles to the floor at C1, with nobody under him. All that speed is wasted, and he's now standing next to the goon at B1, who punches him at the end of the turn.
- *"Land on the goon."* Put OUT in the ceiling above B. Hinge drops into IN, out of the ceiling, and onto the goon at B1 at full speed. The goon dies, but he dies straight down, so the chain ends there. Hinge is on the floor with nothing to fall from, a bookcase he can't tip with a barge, and two men behind it.
- *"Fire yourself at the bookcase."* IN in the floor under C1, OUT in the left wall at row 2. Hinge shoots across row 2 at momentum 4, the bookcase topples right and flattens the goon and the gunman. Very satisfying, and the goon at B1 is still alive, because he was standing one row lower.

**The solution:** IN in the floor under C1, OUT in the left wall at row 1. Step left into C5. Hinge falls four tiles (momentum 4) into the floor, comes out of the wall at A1 moving right, and immediately hits the goon at B1. The goon dies and flies on at 3, crosses C1 and D1, and hits the bookcase at 3. It topples right and lands across F1 and G1, crushing the second goon and the gunman. One step, three dead.

The "aha" is that the goon isn't a target. He's the bullet.

**The recovery:** the "fire yourself at the bookcase" player isn't stuck. Hinge stops at D2 and drops to D1; the surviving goon walks to C1. Next turn, put IN in the floor under C1 and OUT in the ceiling above it: the goon falls into a loop. Next turn, move OUT to the ceiling above B, and he comes out at momentum 9 and hits the floor. Three actions instead of one: cleared, but no Par star. This is how most levels should feel: the elegant answer is one move, and the messy one still works if you're inventive.

These solutions are hand-checked, not solver-checked. As with Happy Trails, every level should get an automated brute-force check during level design, both to confirm the par and to catch unintended shortcuts.

## Worlds

The tower is the level map: a vertical cross-section you scroll up through, one floor per level. Cleared floors stay as they were left, lights flickering and windows sprayed red, so the tower slowly turns into a painting of everything you've done to it.

Each world is a block of ten floors leased to a different part of Szabó's operation. Each one adds a surface rule, a signature prop and one enemy.

| Floors | Tenant | Surfaces | Signature prop | New enemy |
|---|---|---|---|---|
| 1-10 | **Revolving** (the nightclub) | Plaster nearly everywhere | Bookcases of bottles, disco balls, glass DJ booth | Goon, Gunman |
| 11-20 | **The laundry** (a dry-cleaning front) | Tiled walls: doors only go on floors and ceilings | Garment rails that carry hanging bodies along a track; tumble dryers that spit things out at 5 | Heavy |
| 21-30 | **The law firm** (Brandt, Okafor & Brandt) | Glass partitions everywhere: lots of sight, few surfaces | Filing cabinets, wheeled office chairs, the lift shaft | Phone guy |
| 31-40 | **Lane Nine** (bowling alley and bar) | Plaster, but the lanes are polished wood | Bowling balls (things that roll and never stop), the pinsetter | Riot shield |
| 41-50 | **The kitchen** (Szabó's rooftop restaurant) | Steel and tile: plaster is rare and precious | Fryers, knife racks, serving trolleys, a walk-in freezer where everyone slides | Dog |
| 51-60 | **The penthouse** | Everything | Everything | Ludo Szabó |

### The boss: Ludo Szabó

Szabó kept the original pair: gold doors, older and heavier. In the final floors he places his own doors on his turn, so both sets are on the board at once and anything can go through any of the four. The last level is a duel of door placement, and the solution sends Szabó out of the window Hinge came in through, forty storeys higher.

### A late ability: Slam

In the kitchen world Hinge learns to **Slam**: remove both doors at once, as your door placement for the turn. Anything standing in a doorway at that moment is cut clean in half. Since goons stop in a doorway for one turn before stepping through, luring them into your doors becomes a way to kill them, not just a risk.

## Progression

- 60 hand-made floors in the main tower, with new rules introduced every 3-5 floors.
- **Hinge's cosmetics:** jackets, shades and door finishes (the doors keep their IN/OUT shapes so they always read). No stats.
- **Daily room:** one hand-made level per day with a global leaderboard for fewest actions, then fewest door moves.
- **Basement floors:** a post-game set of very hard rooms built around loops, Slam and multiple-gunman crossfire.

## Business model

Premium, on PC, Switch and mobile. Unlike Red Line and Kill Grid, every level here is a hand-designed deterministic puzzle with one intended answer, which makes walkthroughs trivial to find and a lives-based model hard to defend (the same question is open for Happy Trails). Puzzle players are used to paying once for this kind of game. A free first world on mobile works as the demo.

No boosters. A hint system that reveals the first door placement, then the action, is free but costs the Style star for that level.

## Art direction

- **Side-on dollhouse cross-sections**, lit in neon: hot pink, cyan and sodium orange against dark interiors. Each floor reads like a set with the fourth wall removed.
- **Crisp low-poly or chunky pixel art.** Readability wins: every tile's contents must be obvious at phone size, especially which surfaces are plaster.
- **Plaster is visibly different.** Rough, pale, slightly cracked. Players should learn to scan a room for it in a second.
- **The doors land with weight:** a slam, a puff of plaster dust, the frame wobbling for a beat.
- **Momentum shows as streaks.** Anything moving at 3+ trails speed lines; at 9 it trails fire. The number appears briefly at every impact.
- **Blood stays.** A cleared floor is a crime-scene photo the player can share, with the chain annotated as numbered arrows.
- **Slow-motion replay** of the longest chain: film grain, freeze frames at each impact, and a counter that ticks up ("KNOCK-ON ×5").

## Audio

- Pounding synthwave with a lounge-music undercurrent from the club and restaurant floors.
- The music drops to a single bass pulse while you plan, and slams back in when you act.
- A falling object's whistle rises in pitch with its momentum, so players can hear speed building in a loop.
- Every impact in a chain is a drum hit on the beat. Long chains build into a fill, and the last kill lands on the downbeat.

## Tone and ratings

- 17+ / PEGI 18. Strong stylised violence, no torture, no sexual content, no real-world groups.
- Absurd, never grim. The crime family is ridiculous, the props are ridiculous, and the deaths are slapstick at high speed.
- A "Splatter level" setting (full, reduced, confetti) for players who want the puzzle without the gore, matching Red Line.

## Relation to the other concepts

- **Red Line** and **Happy Trails:** same plan-then-watch structure and solver-checkable grid. Exit Wound swaps the path for a chain reaction.
- **Slip 'n' Slaughter:** shares the idea that kills change the board. Here bodies become projectiles, steps and cover.
- The momentum and enemy rules map closely onto Red Line's enemy table (Goon, Gunman, Heavy, Shield guy, Dog, Panic button guy), so level ideas can move between the two.

## Open questions

- **Turn-based or real-time?** Turn-based keeps it exact and phone-friendly. A real-time mode where enemies move while you aim would feel more like Hotline Miami but lose the precise chains. Start turn-based.
- **How much should the preview show?** Showing only the first impact keeps the puzzle, but chains of 5+ may be too hard to simulate in your head. Test whether players want an optional full-chain ghost preview, and what it does to satisfaction.
- **Are free door moves too generous?** If late levels become "try every placement", limit door moves per level instead of actions.
- **Can the momentum table stay this small?** Every new prop is tempted to add an exception. Hold the line on "falls add, impacts subtract 1, thresholds at 1, 2 and 3".
- **Do enemies using your doors read clearly?** It's the most Portal-like twist and the easiest to find unfair. Goons should telegraph the doorway route in the planning view.
- **How big can a cross-section get on a phone?** Probably 7 tiles wide in portrait, which suits tall floors with long drops.
- **Is 60 floors of content achievable** with this rule set, at a quality where most levels have a satisfying one-move answer? A level-design sprint of 20 levels with a solver should answer that before anything else is built.
