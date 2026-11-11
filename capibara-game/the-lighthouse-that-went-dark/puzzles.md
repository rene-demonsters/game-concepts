# Puzzles, placements, and authored variants

All entries below are **designed, not implemented or playtested**. “Authored variant” means a supported design alternative with specified clues and assets. “Future idea” means excluded from the initial production configuration. Stable IDs should survive wording changes.

## Full-game dependency graph

```text
P01 nest exchange ─┐
P02 foghorn repair ┴→ P03 navigate → island accessible
                                      |
                       find patch → crab trade → P04 open door
                                                      |
                                        P05 interpret flashes
                                                      |
                                        P06 signal → inspection lamp
                                                      |
                                        P07 recover toy
                                                      |
                           bucket + towel → P08 comfort den
                                                      |
                                        P09 restart → festival
```

P01 and P02 can be solved in either order. The patch, bucket, towel, and screen can be collected before they are needed. P05's target color can be learned only after P04, but the harbor remains reachable. No requested item is behind the obstacle that consumes it.

## Puzzle cards

| ID | Goal, clue, and action | Item flow and result | Hints: reminder → observation → explicit action |
| --- | --- | --- | --- |
| P01 | Gull needs soft nest lining. Offer the visible cloth offcut. Gull brings down the chart. | I01 offcut → gull; receive I02 chart. Chart stays in map/reference UI permanently. | “The keeper needs her chart.” → “The gull wants a softer nest.” → “Take the cloth from [configured scene] to the gull.” |
| P02 | Test horn; hose visibly flaps. Find clamp and apply it to hose socket. Captain seats hose and closes clamp. | I03 clamp → horn; keeper sounds horn and confirms repair. | “That horn only wheezes.” → “The hose won't stay attached.” → “Find the clamp in [configured scene] and use it on the loose hose.” |
| P03 | Keeper boards when P01 and P02 complete. Follow the chart's three buoy symbols, one choice per row. | Read I02; consume nothing; unlock repeatable travel to S06. | “The chart shows the safe way.” → “Match the first/next shape.” → Highlight correct current buoy and say its shape. |
| P04 | Shrimp inspects drain and identifies broom. Crab requests sail patch, trades it for batten. Use batten at door; shrimp guides while captain pushes. | I04 patch → crab; receive I05 batten → door. Broom becomes scenery; batten remains leaning beside door. Unlock S08–S10. | “Something is behind the door.” → “Our first mate can inspect the drain; the crab has a thin tool.” → Name patch location, then crab, then batten target according to current substep. |
| P05 | Inspect window flashes and matching signal-card row. Record the requested color and symbol. | No inventory consumption. Unlock correct signal response and map reminder. | “Someone across the water is flashing.” → “The card matches that pattern.” → Point to the active matching card row. |
| P06 | Take screen at craft quay; use pictured recipe to mix orange or green, then use colored screen on S06 lamp. | I06 screen changes state; correct signal brings seal and I07 inspection lamp. Wrong screen stays recoverable; remix freely. | “We need a landing signal.” → “The [sun/leaf] recipe uses two dyes.” → Name exact pair, then landing lamp. |
| P07 | Use lamp on service slots while drive is disconnected. Lit toy tells shrimp which passage to use. Click revealed toy for joint action. | I07 reusable; receive I08 shell toy. Toy cannot be retrieved blind. | “Our visitor is missing something.” → “The slots are too dark.” → “Shine the lamp into [configured slot], then click the toy.” |
| P08 | Offering toy alone makes octopus reach and retreat. Build bucket den with towel, put den on clear floor and toy inside. | I09 bucket + I10 towel → I11 den; add I08 toy; octopus settles and releases bunting. | “It wants somewhere cozy.” → “A towel could make that bucket soft.” → Name missing ingredient's scene, then combine and place den/toy. |
| P09 | Click loose bunting to gather it; turn test crank; keeper checks; activate drive. | No new item. Clear → test → keeper approval → restart. Trigger finale availability. | “The wheel needs to turn freely.” → “Gather the fabric, then test the crank.” → Highlight next allowed step. |

If the player places a den without its toy, it remains on the floor with a visible empty center. It can receive the toy later. If the toy is offered directly first, it returns to inventory. P09's switch explains the next incomplete safety step instead of changing state.

## Authored variant matrix

Select all values once at new-game creation. Save the configuration, item ownership, revealed clues, and solved substeps. Reloading or revisiting must never reroll anything. Each placement pool chooses exactly one origin; collection removes that origin's prop and never spawns a replacement elsewhere.

| Configuration key / variant ID | Designed alternatives | Required presentation changes | Dependencies and asset references |
| --- | --- | --- | --- |
| `cloth_origin` / V01 | A: S04 offcut basket. B: S03 spare rack. | Gull's final hint and host/keeper directions name actual source; only chosen scene displays I01. | Both accessible immediately. PROP-I01 and corresponding scene overlay. |
| `clamp_origin` / V02 | A: S03 open tray. B: S02 open toolbox. | Keeper says she left clamp at selected source; hints and pickup hotspot follow placement. | Both accessible immediately. PROP-I03; S02 toolbox exists in both variants. |
| `buoy_route` / V03 | A: circle → triangle → star. B: star → circle → triangle. | Chart pictograms, buoy row layout, spoken order, progress markers, and hints change together. | P01 supplies matching chart. UI-CHART-A/B and S05 buoy layers. No color-only distinction. |
| `patch_origin` / V04 | A: S04 drying rack. B: S06 repair rack. | Crab and craft host name correct destination; the chosen rack displays crescent patch. | Both reachable before P04. PROP-I04. |
| `signal_request` / V05 | A: orange/sun, two long flashes. B: green/leaf, three short flashes. | Wreck loop, card active row, map reminder, spoken color/symbol, recipe hint, signal acceptance all match. | Orange = red + yellow; green = blue + yellow. FX-FLASH-A/B, UI-SIGNAL-A/B, PROP-I06 states. |
| `toy_slot` / V06 | A: left service slot. B: right service slot. | Lit reveal, shrimp entrance/exit, pointing pose, and hints use selected side. Wrong slot contains only a harmless spool of thread. | Both slots reachable after P04; both require I07. PROP-I08 and S09 reveal overlays. |

Six independent binary choices give **64 proposed full-game configurations**. Independence is a design claim to verify during implementation. Changes to locations or gates must recheck the full matrix. The compact playable has its own configuration and does not count among these 64.

### Proposed initial defaults

V01-A, V02-A, V03-A, V04-A, V05-A, V06-A. Implement and playtest this configuration first. Add the other alternatives only once all associated clue, voice, state, and asset changes exist. Do not advertise random variants while only object placement has been implemented.

### Future ideas — not enabled

- Alternate nest request: ribbon strips instead of cloth. Requires a new silhouette, pickup pool, trade dialogue, and asset; could be confused with machine bunting, so needs testing.
- Alternate final comfort need: quiet shade instead of towel lining. Changes the emotional clue and solution graph, so treat as a separate authored branch rather than a cosmetic swap.
- A different horn fault. Would require different diagnosis, tool, repair animation, and hints; do not randomly swap the clamp for an arbitrary object.

## Item ownership and interaction rules

I01, I03, and I04 leave inventory only at their correct trade/repair. I02 is promoted to a permanent reference. I05 is retired only after the door is open. I06 is reusable and can be rinsed from any color at S04; the signal lamp returns it on click. After successful signaling its target is locked as solved, even if the screen is removed. I07 remains reusable. I08 can only be committed to the final den; incorrect use returns it. I09 and I10 combine reversibly until den placement; the finished den remains accessible and cannot be discarded. Nothing can be sold, dropped into the sea, or consumed at a decorative hotspot.

Before P05, any colored screen may be tried, with a reminder to check the card; it cannot summon the worker by chance. After P05 a wrong signal produces a friendly “check your card” flash, never departure or a penalty. The recipe station offers fresh, unlimited batches; mixing more than two dyes makes a muddy screen with an immediate rinse option. Dyes remain station controls rather than cluttering inventory.

## Hint and validation requirements

Hints use current substep and actual variant; never refer to an item already collected or a task already solved. Give spoken location names plus a scene thumbnail for explicit hints. All essential clues use shape, position, sound, and words as appropriate; sound and color are never the sole channels. No hint delay is mandatory.

Before shipping variants, automatically walk all 64 starting configurations and check: each required item is reachable before its gate; all scenes retain return routes; every allowed consumption preserves completion; wrong dye choices reset; correct signaling guarantees lamp access; both slot reveals work; save/load preserves variants and intermediate states. Include early item collection, toy-before-den, den-before-toy, leaving during a request, and repeated solved interactions. These are implementation acceptance cases, not tests already performed.
