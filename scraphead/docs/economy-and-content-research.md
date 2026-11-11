# Economy and content pipeline: how merge-2 games pace months of play, and what Scraphead should build

Research notes for [Scraphead](../README.md). Researched November 2026. Sister doc: [Mosh Pit level generation research](../../mosh-pit/docs/level-generation-research.md), which covers match-3 bots, dynamic difficulty adjustment (DDA) and generate-and-test. This doc doesn't repeat that material.

**How to read this:** **[Confirmed]** means a primary source says it: the studio itself, an on-record talk, or something anyone can check in the shipped game. **[Reported]** means a deconstruction, analyst or community source, with no confirmation from the studio. **[Inferred]** means it's my reading of the evidence.

---

## TL;DR

- **Merge studios say almost nothing in public about their tooling.** I found no talk, paper or postmortem from Metacore, Magmatic, Microfun, Trailmix, Big Fish or Gram that describes how they generate orders or tune drop tables. Nothing like King's bot papers exists for merge. Most of what's known comes from deconstructions and from one economist's models. The honest summary is that *the structure is visible, and the tooling is inferred*.
- **What's visible:** progression is a **scripted spine** (story tasks per area, which are the same for everyone) wrapped in **semi-random repeatable orders**. The repeatable orders are drawn from tables gated by player level and shaped by fixed slot rules, such as "one hard, one easy, two medium." Challenge comes from the **2^(L−1) cost of each tier**, from **board space**, and from **energy**, not from failing.
- **Do orders read your board?** There's no evidence that the big games do it. One economist argues they don't, and calls board-aware order rolls "the most pressing area merge-2 games need to explore". This is an open opportunity, not an industry standard.
- **The maths is simple and fits in a spreadsheet:** the energy an order costs equals its demand in level-1 items divided by the level-1 items each unit of energy produces. The hard parts are **board clutter** and **randomness**, and those need a Monte Carlo simulator. The best public example is a third-party simulation showing that a Merge Mansion event was effectively impossible to finish without spending about $460.
- **For Scraphead:** a small team can build a largely systemic pipeline: a data-driven economy model, a headless simulator with a simple greedy bot, a budgeted order generator (with a light board-aware bias), and a target pacing curve per camp chapter. Hand-author the story orders, chain reveals and chapter beats. Generate the filler orders and the event boards. Simulate every event before it ships.

---

## 1. How merge-2 games are structured

### The spine: scripted tasks

- **[Reported]** Merge Mansion's main progression is a fixed list of tasks per area. The community wiki documents each one with what it requires, what it unlocks and what it rewards. One example is task 42, "Remove wood", which needs a Level 4 Axe ([Merge Mansion wiki, area task pages](https://merge-mansion.fandom.com/wiki/Tranquility_Terrace/Tasks)). Because the wiki can list every task, they're the same for every player, which means they're **hand-authored**.
- **[Confirmed]** Metacore now shows these tasks at the top of the merge board ([Metacore support](https://support.metacoregames.com/hc/en/merge-mansion/articles/changes-in-the-games-interface-538)).
- **[Reported]** Naavik calls Merge Mansion's storyline "the most essential aspect of the game". In its analysis, items are "sunk into various narrative-progression related tasks" ([Naavik, 2022](https://naavik.co/deep-dives/merge-mansion-future-of-merge/)).
- **[Reported]** Love & Pies uses the same pattern: coins pay for café renovations, delivered as a dialogue scene followed by decoration tasks ([Naavik deep dive](https://naavik.co/deep-dives/deep-dive-love-and-pies-merge2/)).

### The filler: repeatable orders

- **[Reported] Travel Town:** players always have four orders: three that pay coins and one that pays Toolboxes. The difficulty mix is fixed: one hard order with a big reward, one very easy order and two medium ones. The author is a Belka Games lead designer, who notes that Travel Town and Merge Mansion "try to solve" the problem of late-game players getting only one or two orders by balancing orders ([PocketGamer.biz, Sept 2023](https://www.pocketgamer.biz/deconstructing-magmatic-games-travel-town/)).
- **[Reported] Gossip Harbor:** new orders appear on cooldowns. Deconstructor of Fun notes that if you end a session with hard orders, easier ones are waiting when you return, so sessions tend to end with goals you can complete ([Deconstructor of Fun](https://www.deconstructoroffun.com/blog/2024/8/19/finding-genre-success-the-case-of-gossip-harbor)).
- **[Reported] Love & Pies:** up to five customer slots, and orders can't be skipped. A lower-tier order for the same chain can block a slot, which Naavik flags as a frustration point ([Naavik](https://naavik.co/deep-dives/deep-dive-love-and-pies-merge2/)).
- **[Reported] Order generation in general:** an economist's analysis says orders come from **global tables segmented by progression**, and the weights change as generators level up. He adds that the standard order queue "does not appear to look at the live board". That second claim is hedged and based on Reddit threads and player research ([Game Economist Consulting, Mar 2026](https://www.gameeconomistconsulting.com/the-economics-of-merge-games/)).
- **[Not found]** I found no primary evidence that any major merge game rolls orders based on what's on your board. One guide mentions Travel Town "auto orders" that appear when certain items exist ([unofficial guide](https://simplegameguideorg.pages.dev/travel-town-beginner-guide-tips)). That's weak evidence, and it could just be a scripted trigger.

### The cost curve: 2^(L−1)

- **[Confirmed by the game's rules]** In merge-2, an item of level L costs 2^(L−1) level-1 items. Raising an order's requested level by one tier doubles its cost. Gossip Harbor's basket chain needs about 16,000 level-1 items to reach level 15 ([DoF](https://www.deconstructoroffun.com/blog/2024/8/19/finding-genre-success-the-case-of-gossip-harbor)).
- **[Reported]** Rarer drops multiply the cost. In Gossip Harbor, potatoes drop about 10% of the time from the basket, so a level-7 potato (64 base items) costs roughly 600+ energy ([same source](https://www.deconstructoroffun.com/blog/2024/8/19/finding-genre-success-the-case-of-gossip-harbor)).
- **[Reported] Generator upgrades are the counterweight.** A higher-level generator shifts its drop table up a tier, which yields more level-1 equivalents per unit of energy. If generator power rises about as fast as order demand, energy per order stays roughly flat while the requested items look grander. If the two curves diverge, "the economy turns punitive fast". This matters even more because "the board doesn't reset like in match-3. *Ever.*" ([Game Economist Consulting](https://www.gameeconomistconsulting.com/more-merge-2-economics/)).

### Energy and the session

- **[Reported]** Merge Mansion's energy bar caps at 100 when it refills on its own, and each tap costs 1 energy ([LevelWinner](https://www.levelwinner.com/merge-mansion-beginners-guide-tips-tricks-strategies/)).
- **[Reported]** Love & Pies: 100 energy refills in about 200 minutes. You also get five ads a day for 15 energy each, and gem refills that get "rapidly" more expensive each time you buy one in a row. Generator cooldowns sit on top of energy, so players are "double-gated" ([Naavik](https://naavik.co/deep-dives/deep-dive-love-and-pies-merge2/)).
- **[Reported]** Travel Town: four ads a day give 25 energy each ([PocketGamer.biz](https://www.pocketgamer.biz/deconstructing-magmatic-games-travel-town/)). Gossip Harbor reportedly gives about 40% less free ad energy than Travel Town and "pinches players hard" on timers ([Naavik, 2025](https://naavik.co/digest/gossip-harbors-meteoric-rise-in-merge/)).
- **[Reported]** Boosted generators (2× or 4× energy per tap for higher-tier drops) became standard around 2023 ([DoF](https://www.deconstructoroffun.com/blog/does-merge-2-monetize-better-than-match-3); [Naavik on Travel Town](https://naavik.co/digest/why-travel-town-is-dominating-mobile-merge/)). Naavik reads them as a way to raise energy spend without making sessions longer.
- **[Reported]** Merge Mansion's supercharge also produces higher-tier items at twice the energy cost ([GoSunoob](https://www.gosunoob.com/?p=286237)).
- **[Reported] Why merge monetises differently from match-3:** running out of energy is a *pause*, not a fail. Unfinished orders are still there when you come back, so "the board itself never finishes" ([DoF, 2026](https://www.deconstructoroffun.com/blog/does-merge-2-monetize-better-than-match-3)). That's the strength of the genre, and also where its ethical problems come from.

### Board space and rubble

- **[Reported]** Love & Pies has a 9×7 board (63 cells). Only the centre is open at first, and merging next to locked cells opens more. Later, items from about 20 chains compete for space, and Naavik calls managing it "the essence of the game's difficulty". The worked example: 32 level-1 items fit in 1 cell once fully merged, while 31 of them need 5 cells ([Naavik](https://naavik.co/deep-dives/deep-dive-love-and-pies-merge2/)).
- **[Reported]** Travel Town players come back to a board that's 20–25% empty, so they can make a first merge within seconds ([Naavik](https://naavik.co/digest/why-travel-town-is-dominating-mobile-merge/)). In Gossip Harbor, items held for orders can take up about 15% of the board, and extra storage is "extremely costly" ([DoF](https://www.deconstructoroffun.com/blog/2024/8/19/finding-genre-success-the-case-of-gossip-harbor)). In EverMerge, after two months, "every inch of it is full" ([DoF, 2020](https://www.deconstructoroffun.com/blog/2020/12/6/how-evermerge-made-50m-in-just-7-months)).
- **[Inferred]** Board space is the real difficulty dial. Energy sets how much you can make. Space sets how much *work in progress* you can hold, and each new chain eats into it. Every chain you add makes the game harder even when no number changes.

### Events

- **[Reported]** Travel Town rotates 3–4-day events: milestone events, side boards with their own energy and chains, and decoration events. On top of that it runs a daily challenge in which the next quest is already **60–90% complete** when you finish the current one ([PocketGamer.biz](https://www.pocketgamer.biz/deconstructing-magmatic-games-travel-town/)).
- **[Reported]** Gossip Harbor runs at least 4–5 events at once, and up to 8–10 ([Naavik](https://naavik.co/digest/gossip-harbors-meteoric-rise-in-merge/)). Its monthly season needs "consistent high activity over 21 days" ([DoF](https://www.deconstructoroffun.com/blog/2024/8/19/finding-genre-success-the-case-of-gossip-harbor)). Balancy cites AppMagic data showing top casual games average more than 100 live-ops events a month. Balancy also warns that "live ops just outgrows the screen" ([PocketGamer.biz, Mar 2026](https://www.pocketgamer.biz/how-gossip-harbor-builds-live-ops-from-day-one/)).
- **[Inferred]** Events keep long-term players busy because they **recycle the same economy in a new skin**: a temporary board, a few new chains, and a fixed energy budget. They're cheap to make and expensive to get wrong (see the Lucky Catch case below).

---

## 2. How progression is measured and tuned

- **[Reported]** Metacore has hired "Game Economy Designer, Merge Mansion" roles to design and balance "the core and feature-level game economy". This comes from job-board mirrors of the listing; the original Metacore posting has expired. **[Confirmed]** Metacore and Supercell gave a GDC 2026 session on economy lessons from merge versus Clash Royale ([GDC schedule](https://schedule.gdconf.com/session/game-economy-lessons-with-supercell-metacore/914988)). I couldn't find a write-up of what was said.
- **[Confirmed]** Metacore tunes live ops by **behavioural segment**, crossing engagement with monetisation, rather than by spender tier or progression stage alone. It also checks how each event lands with each segment ([Mobilegamer.biz, Develop 2023](https://mobilegamer.biz/why-running-merge-mansion-is-like-governing-a-micronation/)). Their framing: "'Taxes' are paid only when and if citizens enjoy the place."
- **[Reported]** Gossip Harbor uses early offers mainly to *measure* price sensitivity. Later it escalates with shorter timers and steeper discounts, which Balancy calls "conversion escalation" ([PocketGamer.biz](https://www.pocketgamer.biz/how-gossip-harbor-builds-live-ops-from-day-one/)). Energy offers drop in price after a player doesn't convert, and ad placements are only shown to some players ([DoF](https://www.deconstructoroffun.com/blog/2024/8/19/finding-genre-success-the-case-of-gossip-harbor); [Naavik](https://naavik.co/digest/gossip-harbors-meteoric-rise-in-merge/)).
- **[Reported] The analytic model.** Game Economist Consulting gives the cleanest public formulas ([part 1](https://www.gameeconomistconsulting.com/the-economics-of-merge-games/), [part 2](https://www.gameeconomistconsulting.com/more-merge-2-economics/)):
  - level-1 equivalents per tap = Σ p(s | generator level) · 2^(s−1)
  - energy per order = (level-1 demand of the order) ÷ (level-1 equivalents per energy)
  - **board efficiency** = the share of production that actually advances an open order. Clutter and unwanted drops push it below 1. More open order slots raise it, then it flattens out.
  - orders per day = board efficiency × min over generators of (supply ÷ demand). **The weakest generator sets the pace, not the average.**
  - meta progress per day = orders per day × coins per order ÷ coins needed for the next step
  - multipliers (boosts) that would push an item above the chain's top tier are "clipped", and the energy spent on them is wasted
- **[Reported] Simulation catches what spreadsheets miss.** Machinations built a Monte Carlo model of Merge Mansion's *Lucky Catch* fishing event. It found about 5,000 taps were needed for a 4-day event. With passive energy, no simulated player finished in under 20 days, and the average was more than two months. Even with very generous drop rates the average was about 32 days. The only route to finishing in time was about **$460 of purchases** ([Machinations, 2025](https://machinations.io/articles/why-the-lucky-catch-event-in-merge-mansion-is-unbeatable)). The authors suspect it was an oversight, not a plan. Either way, it's the clearest public example of an event that was never simulated, or one that was simulated and shipped anyway.
- **[Not found]** No public source describes merge studios using bots or AI playtesters the way King does. **[Inferred]** Merge is less about skill than match-3, so a simple greedy policy (always merge, always fill the closest order) probably gets close to how real players perform. That makes simulation *cheaper* for merge than for match-3.

### Dynamic adjustment and ethics

- **[Reported]** The levers that are actually visible are about pacing and offers, not difficulty:
  - Gossip Harbor's order cooldowns make sure easy orders are waiting when a player returns.
  - Travel Town's daily-challenge pre-fill makes the next goal feel almost done.
  - Personalised offers, prices that drop after a refusal, and ads shown only to some players.
- **[Reported] Controversies:**
  - Lucky Catch (above).
  - Gem energy refills that double in price each time ([Machinations](https://machinations.io/articles/why-the-lucky-catch-event-in-merge-mansion-is-unbeatable)).
  - EverMerge removing hard-currency rewards and unlimited-energy buffs, which hurt community sentiment ([DoF](https://www.deconstructoroffun.com/blog/2020/12/6/how-evermerge-made-50m-in-just-7-months)).
  - Merge Mansion players complaining that ad energy was removed ([AI-generated review summary, low confidence](https://marlvel.ai/apps/merge-mansion-puzzles-story/reviews)).
- **[Confirmed]** In March 2025 the EU's network of consumer protection authorities (CPC) published principles on in-game currencies. Prices must be shown in real money, games must not obscure what content costs, and children get extra protection ([Commission page](https://commission.europa.eu/live-work-travel-eu/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/social-media-online-games-and-search-engines_en); [analysis](https://www.reedsmith.com/articles/qas-on-the-eu-consumer-protection-authorities-joint-guidance-paper/)). These rules apply directly to "nuts" (gems) and Rage Cola.
- **[Confirmed]** A field experiment with about 300,000 players found that making a free-to-play game easier reduced short-term in-app purchases but **raised long-term revenue** through retention ([Ascarza, Netzer & Runge, 2023](https://business.columbia.edu/sites/default/files-efs/citation_file_upload/ascarza_netzer_runge_2023-12-04.pdf)). That supports adapting only toward *easier*, the same line the Mosh Pit doc draws.

---

## 3. Systemic techniques for "endless" merge content

These are mostly **[Inferred]** syntheses built from the models above.

1. **Order generator with a difficulty budget.** Price each candidate order in expected energy, using the drop tables and the player's current generator levels. Then fill each slot with an order whose cost lands inside that slot's budget band (easy, medium or stretch, following Travel Town's mix). Rewards come from cost × a reward rate, plus a small bonus for variety.
2. **Weighted drop tables per generator level.** A generator level *is* a probability vector over tiers. Upgrades move probability upward. Track level-1 equivalents per energy per generator level as a single curve and design it alongside the order-demand curve.
3. **A soft board-aware bias.** When rolling a new order, give extra weight to candidates the board already partly covers (for example, the requested chain is on the board at tier L−1 or L−2), capped so it can't be farmed. This raises board efficiency and makes the player feel the raiders "noticed" their work. It's the open opportunity from section 1. Players see it as generosity, not rigging, as long as it only ever helps.
4. **Simulated players to price everything.** A greedy bot taps the cheapest useful generator, merges any pair, fills the order that's closest to done, and sells or stores the item it values least when the board is full. Run thousands of seeded games and record energy per order, board fill over time, dead-board events (no merges and no free cells), and days to each milestone. Run a sloppy variant too, one that merges late and hoards, to bracket the range of real players.
5. **Procedural event boards.** An event is a set of parameters: board mask, rubble pattern, 2–3 chains (reskinned or new), an event energy pool, a milestone track. Generate candidates, simulate them, and keep the ones where a median free player who plays N sessions a day finishes the main track with about 20% of the time to spare. Lucky Catch is the cautionary tale.
6. **Retired-content recycling.** Old event chains come back as rotation content with new milestone rewards. **[Reported]** This matches what the big games do with event formats; Gossip Harbor's formats are "adapted… rather than copied" ([PocketGamer.biz](https://www.pocketgamer.biz/how-gossip-harbor-builds-live-ops-from-day-one/)).

---

## 4. Recommendation for Scraphead

### Design stance

- **Energy is a pacing tool, not a wall.** The free player's day should end with completable orders on the board, as in Gossip Harbor. Never end a day stuck in front of a single stretch order.
- **Adapt only toward easier, and never based on spending.** The board-aware bias and the "welcome back" easy order are allowed. Spending-keyed drop rates are not.
- **Show nuts (gem) prices in real money** (the CPC principles). No refill pricing that doubles each time. A flat or gently stepped price is enough.
- **Chain length: 8–10 tiers for core chains** (the open question in the README). Orders rarely ask for more than tier 6–7. The top 2–3 tiers are **showcase items**, like the Chainsaw Motorbike with Flamethrower, rewarded through story or camp milestones, so the escalation joke pays off without grinding 512 Bent Nails.

### The pipeline

| # | Piece | What it is | Rough effort |
|---|---|---|---|
| 1 | **Economy data** | A JSON/CSV source of truth: chains (tiers, sell values), generators (energy cost, drop table per level, cooldowns, upgrade recipe), order templates, rewards, camp costs. The game and the tools both read it. | 1–2 weeks |
| 2 | **Analytic model** | A spreadsheet or notebook built on the formulas in section 2: energy per order, orders per day, days per camp chapter, all at free-player energy income. | days |
| 3 | **Headless simulator** | Deterministic, seeded game core (shares code with the client, like Mosh Pit's sim core). Greedy bot plus a sloppy bot. Outputs energy per order, board fill, dead-board rate, and days to each Scrap Star milestone, as percentile bands. | 3–5 weeks |
| 4 | **Order generator** | Slot rules (e.g. 4 slots: 1 easy, 2 medium, 1 stretch, plus a story-order lane), a difficulty budget from the pacing curve, the soft board-aware bias, a cooldown that refills with easy orders after a break, and per-raider flavour text templates. | 2–3 weeks |
| 5 | **Target pacing curve** | Per camp chapter: target days for a free player, sessions per day, Scrap Stars needed. Example shape: chapter 1 in 1 day, chapter 3 in about 3 days, flattening to 5–7 days per chapter by chapter 8, with an easy "breather" chapter after each new generator. | design time |
| 6 | **Auto-tuner** | Searches over Scrap Star costs, the order reward rate and drop-table steps until the simulator's median hits the curve and the 90th percentile (the unlucky player) stays within about 1.5× the target. | 1–2 weeks |
| 7 | **Event board generator** | Parameterised event boards with Chrome Choir reskins, simulated before they ship, with a "finishable by the median free player" gate in CI. | 2–4 weeks |
| 8 | **Telemetry loop** | Log energy spent per order, board fill, dead-board events, and quits within 2 minutes of hitting 0 Rage. Recalibrate the bot against real players, as King does in match-3. | ongoing |

A minimum version is pieces 1–5, roughly **2–3 months for one engineer plus one designer**. Pieces 6–8 come after soft launch.

### What to hand-author and what to generate

| Hand-author | Generate (then curate) |
|---|---|
| Story orders (Big Mama's parade, Sprocket's first bike), the chapter beats and cutscenes | Repeatable raider orders inside the budget bands |
| **Chain reveals**: when each new tier first appears, staged so a new joke lands every session or two early on | Drop-table steps between generator levels (fitted to the curve) |
| When generators and rubble zones unlock (part of the chapter design) | Rubble patterns on event boards |
| Camp chapters and their Scrap Star totals (used as anchors, then tuned) | Exact Scrap Star costs per camp piece, and order rewards |
| Showcase moments for top-tier items | Event board variants, milestone tracks, rotations |
| Per-raider order flavour lines (a template library) | Which line goes with which generated order |

### Pitfalls

- **Grind from doubling.** One extra requested tier doubles the work. Cap requested tiers per chapter in the generator, and let generator upgrades keep pace (section 1). The simulator's energy-per-order curve should stay roughly flat or rise gently. It should never climb steeply.
- **Board clutter.** Five generators × 8–10 tiers will fill a 63-cell board. Unlock chains gradually. Make sure the Lockbox's free slots are enough without paying. Track the dead-board rate as a hard KPI (target: close to 0% for the greedy bot). Give orders a mild bias toward chains the player has a lot of on the board.
- **Energy walls that feel predatory.** End-of-day stretch orders, escalating refill prices and events you can't finish are where the genre's bad reputation comes from. Gate every event in CI on "median free player finishes".
- **Sameness.** Generated orders blur together after a few weeks. The countermeasures are each raider's running storyline, varied order shapes (bundles, "two of the same", themed sets such as "parade kit") and regular chain reveals in events. The joke has to keep escalating.
- **The bot is not the player.** The greedy bot is tidier than real players. Expect real energy per order to run higher, and calibrate against telemetry (the King lesson from the Mosh Pit doc).
- **You can never reset the board.** Changing drop tables after launch affects players' boards in ways you can't undo. Simulate the migration from a saved board before shipping any balance change.
