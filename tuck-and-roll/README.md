# Tuck & Roll (working title)

A turn-based physics puzzle game about putting a whole hotel of hibernating animals to bed. Each level is a side-view cross-section of one room of **Hotel Torpor**, where animals check in for the winter and absolutely refuse to go to sleep. You play the night porter, a very small, very serious mole who can dig two linked holes into any soft surface. Whatever drops into one hole pops out of the other, just as fast. Drop down the laundry chute into a hole in the floor, shoot out of a hole in the wall, bump a dormouse into a giggling ball, roll him into the linen cupboard, and watch the cupboard tip over and tuck in the two hamsters behind it.

It's the cute twin of [Exit Wound](../exit-wound/README.md), in the same way [Happy Trails](../happy-trails/README.md) is the cute twin of [Red Line](../red-line/README.md). The doors, the momentum numbers and the chain reactions are the same. Every kill has become a tuck-in, and every body has become a sleeping animal you can land on.

**Player promise:** stare at a room full of wide-awake animals, see the one bump that sends them all to sleep, and watch the whole room go quiet in the right order.

**Concept art:** Room 4, Lights Out, mid-chain. [Image prompt](art/01-key-art-prompt.md).

![Room 4, Lights Out concept art: Tiberius emerges from THERE and rolls a dormouse into a linen cupboard, spilling quilts over a hamster and raccoon kit.](art/01-key-art.png)

Title availability has not been checked. Alternatives: *Bedlam*, *Lights Out*, *Hotel Torpor*.

## Pillars

- **Cuddly all the way through.** Nobody gets hurt, not even on a failed run. Animals curl into balls and roll, they don't get hit. Failing is funny: the mole gets hugged by a toddler badger and can't escape, or takes a pillow to the face.
- **Soft things put you to sleep.** One rule replaces all the violence: an animal that comes to rest against something soft falls asleep. Something hard wakes it right back up. The whole game is about routing tumbling animals into soft things.
- **Sleepers are furniture.** A sleeping animal is the softest thing in the room. The more of them you put down, the more landing spots you have, and the best levels end in one big cuddle pile.
- **Cute look, adult difficulty.** Like Happy Trails, the audience is grown-up puzzle players. The chains are exactly as hard as in Exit Wound.

## Premise

**Hotel Torpor** is the only hibernation hotel in the valley. Every autumn, every animal in the area checks in to sleep until spring. Every night, none of them do.

The night porter is **Tiberius**, a mole about the size of a thumb who takes his job extremely seriously. He wears a tiny waistcoat with a brass name badge and carries a lantern he doesn't need, being a mole. He can't lift anyone and he certainly can't tell anyone off. What he *can* do is dig. Two holes, anywhere the walls are soft enough, connected underground faster than anyone can follow.

The guests don't need to be told to go to sleep. They need to be gently, precisely and repeatedly bumped into a pillow.

## Core mechanics

### The grid

Every level is one room of the hotel in cross-section, like a dollhouse with the front wall removed: bedrooms, dormitories, the laundry, the kitchen, the attic. Usually 6×5 to 9×8 tiles. Animals and small objects take one tile; furniture can be taller.

### Tiberius's turn

1. **Dig holes (free).** Put the **HERE** hole and the **THERE** hole on any soft surface: earth walls, floors or ceilings. Moving a hole costs nothing, but only between actions.
2. **Take one action:**
   - **Step** one tile left or right. Stepping off a ledge means falling.
   - **Climb** one tile up or down a ladder or root.
   - **Nudge:** scurry left or right until you bump into something. A nudge hits at **whee** 1.
   - **Wait.**
3. **Everything resolves.** Falls, tumbles, bumps and topples play out until nothing is moving.
4. **Guests act.** See [Guests](#guests).

Undo is free and unlimited. Restart is instant.

### The holes

- **HERE** is ringed with fresh dark soil; **THERE** has a little wooden frame and a lamp. They read as a pair without relying on colour.
- They only go into **soft surfaces**: packed earth and plaster. Stone, tiles, roots and wood can't be dug. Which surfaces are soft is the main way rooms constrain you.
- Anything that falls into HERE pops out of THERE with the **same whee**, travelling straight out of THERE's face.
- Animals, thrown pillows and the guests' line of sight all go through.
- **Guests use your holes too.** Toddlers and puppies love a hole. This is a weakness and a tool.

### Whee

Everything that moves carries one number, its **whee**. These are exactly Exit Wound's momentum rules:

- **Falling adds 1 per tile.** It's the only thing that adds whee.
- **A nudge hits at 1.**
- **Holes keep it.** Whee goes through unchanged.
- **Tumbles keep it.** Anything bumped sideways rolls in a straight line until it hits something, then stops.
- **Bumps pass it on.** When a moving thing bumps something, it stops, and the thing it bumped rolls off in the same direction with **1 less** whee (2 less for a big guest).
- **Maximum 9.** At 9, everything giggles uncontrollably.

What a bump does depends on the whee it arrives with:

| Whee | Guests | Linen cupboards, wardrobes, pillow towers | Paper screens |
|---|---|---|---|
| **1** | Hop one tile and stay awake (unless that tile is a ledge) | Wobble | Nothing |
| **2+** | Curl into a ball and roll on | Wobble | Tear; the ball rolls through with 1 less |
| **3+** | Curl into a ball and roll on | **Topple** away from the bump, spilling quilts over every tile they fall across | Tear |

Then the rule that replaces killing:

- **A ball that stops against something soft falls asleep.** Beds, cushions, quilts, linen cupboards, hammocks and other sleeping guests are soft.
- **A ball that stops against something hard uncurls, wide awake**, and asks to go again.
- **Anyone under a toppled cupboard's quilts falls asleep where they stand.** This is the signature move.
- **Tiberius always lands safely.** Moles are mostly cushion. Whoever he lands on gets a fright and stays awake.

### The spin

Put HERE in a floor and THERE in the ceiling directly above it, and whatever drops in falls round and round, getting faster and gigglier until it reaches 9. The spin holds whatever's in it between turns. Drop a guest in, let them squeal for a turn, then move THERE to a wall and roll them across the room into bed. Every child who sees this will ask for it again.

### Guests

Each guest has one simple habit. Levels get hard when two habits pull in opposite directions.

| Guest | Habit | Exit Wound equivalent |
|---|---|---|
| **Fidgeter** (dormice, hamsters, voles) | Wide awake and wandering. Ordinary guest; one bump at 2+ and a soft landing does it. | Goon |
| **Toddler** (badger cub) | Walks one tile toward Tiberius per turn, through your holes if that's shorter, wanting a cuddle. If he starts the guests' turn next to Tiberius, he hugs him and won't let go. Level over. | Goon (the walking kind) |
| **Pillow fighter** (raccoon kit) | Faces one way, looking over everyone's heads. If he sees Tiberius at the end of a turn, he throws a pillow. It hits **the first guest in the line**, who falls asleep on it. If it reaches Tiberius, he's buried in feathers and the level resets. | Gunman |
| **Big guest** (bear) | Needs whee 4+ to curl up, absorbs 2. A nudge doesn't move him. Very, very soft once asleep. | Heavy |
| **Hedgehog** | Curled up on purpose, and springy: anything that bumps her quills bounces straight back with the same whee. Bump her from behind or above. | Riot shield |
| **Puppy** | Moves two tiles per turn and dives into every hole it sees. | Dog |
| **Night owl** | Has a countdown. If she's still awake when it hits zero, she hoots, and every sleeping guest within three tiles wakes up. | Panic button guy |

### Props

- **Linen cupboards and pillow towers:** topple at 3+, quilting every tile they land across.
- **Hammocks and baskets** hanging from the ceiling: snap the rope with any bump and they drop, catching whatever's below.
- **Beds:** soft. A ball rolling into the side of a bed bounces up and lands in it.
- **Paper screens:** tear at 2+ and slow things down by 1.
- **Laundry chutes and stairwells:** long drops, so this is where big whee comes from.
- **Feather pillows:** burst when bumped at 2+, sending everything next to them rolling outward at 3 and leaving a soft patch of feathers.
- **Squeaky toys, cold puddles, the dinner gong:** anyone who ends up on them is wide awake for the rest of the level, including Tiberius's patience.

### Clearing a room

**Every guest must be asleep.** When the last one drops off, the lights dim, Tiberius tiptoes out, and the snoring starts in harmony.

### Stars

1. **Lights out:** everyone asleep (required).
2. **Par:** finish within the par number of actions.
3. **Snug:** a room-specific challenge, such as "everyone in one cuddle pile", "the pillow fighter puts himself to sleep" or "nobody sleeps on the floor".

## Worked example: "Room 4, Lights Out"

The same layout as Exit Wound's "Last Orders", to show how directly the rules map across. 7×5 grid, columns A-G from left to right, rows 1-5 from bottom to top.

```
        A          B          C          D          E          F          G
  5     .          .          .      Tiberius ══════════════════════════════  (shelf)
  4     .          .          .          .          .          .          .
  3     .          .          .          .       Linen        .          .
  2     .          .          .          .       Linen        .          .
  1     .       Dormouse      .          .       Linen     Hamster   ←Raccoon
      earth                                                                stone
```

- Tiberius is on a high shelf running from D5 to G5. Columns A-C are open from ceiling to floor.
- A **dormouse** (Fidgeter) at B1, a **hamster** (Fidgeter) at F1, and a **raccoon kit** (Pillow fighter) at G1, facing left. The linen cupboard is the only reason he can't see Tiberius.
- **Linen cupboard** at E1-E3, 3 tiles tall.
- Floor, ceiling and left wall are earth. The right wall is stone.
- **Par:** 1 action.

**Tempting ideas that don't work:**

- *"Just hop down."* Tiberius drops four tiles and lands on the floor next to the dormouse, who thinks this is a wonderful new game and is now more awake than ever.
- *"Land on the dormouse."* HERE in the floor, THERE in the ceiling above B. Tiberius drops onto the dormouse, who gets a fright and stays awake, and Tiberius is now on the floor with no way back up.
- *"Fly at the cupboard."* HERE in the floor under C1, THERE in the left wall at row 2. Tiberius shoots across at whee 4, the cupboard topples and quilts the hamster and the raccoon. Lovely, but the dormouse at B1 was one row lower and is still awake, watching.

**The solution:** HERE in the floor under C1, THERE in the left wall at row 1. Step left into C5. Tiberius falls four tiles (whee 4) into the floor, pops out of the wall at A1 and bumps straight into the dormouse. She curls into a ball and rolls on at whee 3, across C1 and D1, into the linen cupboard. She stops against it (soft: asleep), and the cupboard topples right, spilling quilts over F1 and G1. Hamster and raccoon: asleep. One step, three snoring.

The "aha" is the same as Exit Wound's: the dormouse isn't the target, she's the delivery.

## Hotel Torpor

The hotel is the level map: a big cross-section of a hill with a hotel dug into it, scrolling down floor by floor into the warm deep. Every room you finish goes dark, with a little "Do not disturb" sign on the door and a soft snore when you tap it. By the end, the whole hill is quietly breathing.

Each wing adds a surface rule, a signature prop and one guest.

| Wing | Guests | Surfaces | Signature prop | Twist |
|---|---|---|---|---|
| **The Burrows** | Dormice, hamsters, voles | Earth everywhere | Linen cupboards, beds, laundry chute | Tutorial. Fidgeters, then the raccoon. |
| **The Bat Loft** | Bats | Mostly wood: few holes | Ceiling perches | Bats sleep upside down, so their "beds" are on the ceiling. You have to fire them **upward**. |
| **The Otter Baths** | Otters | Tiled: holes only in floors and ceilings | Bathtubs, bubbles | Wet floors: balls keep rolling past things they'd normally stop against. |
| **The Bear Suite** | Bears | Earth, but huge rooms | Hammocks, the long stairwell | Big guests and whee 4+ chains. |
| **The Dormouse Attic** | Dozens of tiny dormice | Plaster and paper screens | Pillow towers | Very long chains: one bump, twenty sleepers. |
| **The Owl Tower** | Owls | Stone, with rare soft patches | Feather pillows | Owls are nocturnal: dawn is coming, and the countdowns are everywhere. |

The final guest is **the Countess**, an elderly hare who has not slept since checking in forty winters ago, and who has her own pair of holes. The last room is a duel of hole placement.

## Progression and meta

- 60 hand-made rooms, new rules every 3-5 rooms.
- **Tiberius's wardrobe:** waistcoats, nightcaps and lanterns. No stats.
- **The guestbook:** every guest you put to sleep leaves a short, dry review of their stay ("Was rolled into bed by a mole. Four stars. Would have been five if he'd knocked.").
- **Nightly room:** one hand-made room per day with a leaderboard for fewest actions.

## Business model

Premium, mobile first, then Switch and PC, for the same reason as Exit Wound: hand-made puzzles with one intended answer don't suit a lives-based model. A free first wing works as the demo. Hints reveal the first hole, then the action, at the cost of the Snug star.

## Art direction

**Felt and fabric.** Where Happy Trails is clay, Tuck & Roll is a stitched felt diorama: every room is a little quilted box, animals are plush toys with button eyes and visible stitching, beds are real fabric. It should look like you could squeeze it.

- **Soft surfaces look soft:** fuzzy earth-coloured felt you can dig. Hard surfaces (stone, tile, wood) are smooth and shiny. Players should spot the diggable walls in a second, the same job plaster does in Exit Wound.
- **The holes** open with a little puff of felt crumbs; THERE gets its tiny wooden frame and lamp.
- **Whee shows as motion:** curled-up balls leave a short trail of stars; at 3+ the stars sparkle; at 9 it's a rainbow.
- **Warm night lighting:** lantern glow, moonlight through round windows, deep blue shadows. Rooms get dimmer and warmer as guests fall asleep, so a finished room literally looks cosier than it started.
- **The finish screen** is a photo of the room asleep, with the chain drawn on as dotted lines, for sharing.

## Audio

- A music-box lullaby that gets fuller as each guest falls asleep; a perfect chain plays it through to the end.
- Every bump in a chain is a soft percussive "pomf" on the beat. The spin has a rising "wheeeee" that gets higher with every loop.
- Snores are tuned to the lullaby's key, so a cleared room is a sleepy little choir.

## Tone and ratings

- 4+ / PEGI 3. No harm, no peril, nobody in pain. Bumping is play, not violence: every guest who gets rolled clearly loves it.
- Like Happy Trails, the writing is for adults: dry hotel signage, passive-aggressive guestbook reviews, Tiberius's deadpan professionalism.

## Relation to Exit Wound

| Exit Wound | Tuck & Roll |
|---|---|
| Hinge the bouncer | Tiberius the night porter |
| IN / OUT doors on plaster | HERE / THERE holes in soft earth |
| Momentum | Whee |
| Kill at 2+ | Curl into a ball at 2+ |
| Bodies are objects | Sleepers are the softest objects |
| Bookcase crushes | Linen cupboard quilts |
| Gunman shoots the first person in line | Pillow fighter hits the first guest in line, who falls asleep |
| Loop | The spin |
| Slam | Not carried over. Nothing gets cut in half. |

The only real rules change is the soft/hard landing rule. In Exit Wound, anyone hit at 2+ is done. Here, they're only done once they stop somewhere soft. That adds a second question to every chain (*where does it end?*) and makes the end of the chain matter as much as the start.

Levels can be shared between the two games with light adjustment, which halves the level-design cost if both are built.

## Open questions

- **Does the soft/hard rule make levels too much harder** than Exit Wound's equivalents? It's an extra condition on every chain. Test whether it reads as a fun second step or as one rule too many.
- **Is "a guest who gets bumped stays awake" readable?** Players may expect any bump to count. The wide-awake reaction needs to be very clear and very funny.
- **Should both games ship?** One engine and shared levels with two skins aimed at very different audiences is a strong production story, but each needs to stand on its own.
- **Does the bat wing's upside-down rule** break the "falling is the only source of whee" model, or is firing bats up through ceiling holes enough? Prototype it early.
