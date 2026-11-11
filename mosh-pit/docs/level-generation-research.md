# Level generation and difficulty: how the big match-3 games do it, and what Mosh Pit should build

Research notes for [Mosh Pit](../README.md). Researched November 2026.

**How to read this:** **[Confirmed]** means a primary source says it: a paper by the studio's own staff, an on-record interview, or a talk. **[Reported]** means trade press or anonymous sources, with no primary confirmation. **[Inferred]** means it's my reading of the evidence, or something you can see in the shipped games but the studio hasn't explained.

---

## TL;DR

- The big studios don't run one master algorithm that spits out finished levels. What we can see is a **hybrid**. Humans design levels against a planned difficulty curve. **Bots play every level thousands of times** to estimate the pass rate before release. Live telemetry and A/B tests then re-tune or replace levels after release. More and more, AI also drafts or tweaks levels for designers to approve.
- The headline number is **pass rate** (wins per attempt), or its inverse, attempts per win. Bots are good at *ranking* levels by difficulty but don't play like humans, so studios **calibrate bot results against real player data** with a regression model.
- The curve isn't a smooth ramp. It's a **sawtooth**: mostly comfortable levels, with marked "hard" and "super hard" spikes and easy relief levels after them. Studios A/B test individual levels and constantly fix the worst ones.
- **Dynamic difficulty adjustment (DDA) exists in match-3.** EA published a live system that picks the *random seed* of the board to make levels easier for players who are about to quit. King denies tuning difficulty to individual spending. The ethics line we should hold: adapt only toward *easier*, never based on spending.
- For a small team, the pipeline that works is: **a deterministic headless simulator, then a parameterised generator, then heuristic/MCTS bots at a few skill levels, then a difficulty estimate (later calibrated on real players), then automatic move-limit tuning against a target curve, then human curation.** Hand-make the tutorials, the mechanic introductions and the spike levels. Generate and curate the filler.

---

## 1. How the big studios actually do it

### King (Candy Crush Saga, Soda Saga)

- **[Confirmed] Bots play every level before release, and they're trained to play like humans.** King's 2018 paper [*Human-Like Playtesting with Deep Learning* (Gudmundsson et al., IEEE CIG 2018)](https://www.gwern.net/doc/reinforcement-learning/imitation-learning/2018-gudmundsson.pdf) trains a convolutional neural network (CNN) on move data from about 1% of players: roughly 12 million state-action pairs over levels 1–2,150. The bot then plays new levels, and a **binomial regression** maps the bot's success rate, plus features of the board (which blockers and goal type), to the predicted human success rate. The paper's own conclusion says they can now "estimate the difficulty of a new level in less than a minute… compared to the previous 7 days needed with human playtesting on each new episode of 15 levels." They had used it "for more than 1,000 new levels" in a year.
- **[Confirmed] Their earlier approach was an MCTS bot**, from [Poromaa's 2017 KTH thesis *Crushing Candy Crush*](https://openaccess.library.uitm.edu.my/Record/ndltd-UPSALLA1-oai-DiVA.org-kth-206595). MCTS (Monte Carlo tree search) plays out many possible futures before choosing each move. It was slower (about 100 attempts × 200 simulations per move) and predicted human difficulty less accurately than the human-imitating CNN.
- **[Confirmed] Bots don't play like humans, so the mapping isn't linear.** The same paper notes that players do relatively *better* than the bot on levels that need strategic thinking, and that bots are far less random than a population of millions. That's why they calibrate rather than trusting the bot's raw win rate.
- **[Confirmed] AI tweaks levels for designers to approve.** In a [2024 interview](https://mobilegamer.biz/how-king-balances-human-and-ai-powered-design-in-candy-crush-saga/), Sahar Asadi (director of AI Labs) said "practically every" level is now made with AI assistance. Bots play each level "thousands of times" and report difficulty, shuffles and more. A separate tool on top *automatically tweaks* levels against criteria the designer sets, and designers' accept/reject labels feed back into it. Her framing is a "co-pilot for designing."
- **[Confirmed] Humans create new boards. AI drafts and reworks.** In an [AP piece (May 2025)](https://wtop.com/national/2025/05/how-candy-crush-uses-ai-to-keep-players-coming-back-to-its-puzzles/), franchise GM Todd Green says Candy Crush has more than 18,000 levels. The team used to work on "several hundred levels per week," and with AI drafting improved versions of old levels they could do thousands. In this account human designers still create new puzzle boards. Green also says levels are deliberately *not* ordered by difficulty: the "up and down" is part of the fun.
- **[Reported] Level designers were cut in mid-2025.** Anonymous sources told [MobileGamer.biz](https://mobilegamer.biz/laid-off-king-staff-set-to-be-replaced-by-the-ai-tools-they-helped-build/) that about 200 King layoffs hit level design hard, with staff "replaced by the AI tools they helped build." There's no on-record confirmation. It does suggest the tools have become strong enough to cut human level-design hours a lot.
- **[Confirmed] They keep pruning the worst levels.** At [GDC 2024](https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/), King's data team said they model difficulty and fun separately. Fun is measured as "time to abandon" versus "time to pass." They rank the **100 least-fun levels and fix them**, over and over, which gave "a very significant uplift in engagement." Harder levels should be shorter. Strongly "puzzly" levels were the least engaging type. Their level 65 earned the most revenue ever and also caused the most churn.

### Playrix (Gardenscapes, Homescapes)

[Lead designer Aleksandr Shilyaev's 2019 talk](https://gameworldobserver.com/2019/09/27/playrix-levels-elements-match-3) is the clearest public description of a *human-led* pipeline. **[Confirmed]:**

- A **master document** lists every level's position, target difficulty, goals and element count. A **"projected difficulty curve"** sits in that document. Level designers build to it.
- A **compatibility document** lists which elements may appear together (Ivy and Honey never do). The rules are: at most 3–4 elements per level, one central idea per level, and **every level beatable without boosters**.
- The tuning knobs are move count and spawn/fill rates. Difficulty is defined as **losses ÷ attempts**. They also track a dropout rate (players who haven't passed after 7 days and are inactive), attempts before winning, conversion, and coins spent.
- A dedicated playtest department plays every level. After launch, analysts compare the projected curve with the real one. Runs of consecutive hard levels get flagged.
- **A/B tests run three versions** (current, easier, new) for a few weeks. They openly accept small monetisation losses to reduce dropout.
- Scale: 300 levels and 16 mechanics at soft launch, then 1,300 levels and 29 mechanics six months later.

### Dream Games (Royal Match), Peak (Toon Blast)

- **[Not found]** I found no primary source on Dream Games' level tooling.
- **[Inferred, from analysts and the shipped game]** Royal Match runs a visible sawtooth: levels the UI labels "Hard" and "Super Hard" come roughly every 10 levels, followed by easy "relief" levels ([analysis](https://medium.com/@ekinmelissezer/game-analysis-for-royal-match-and-toon-blast-9c4bff8ef48b), [Deconstructor of Fun](https://www.deconstructoroffun.com/blog/2024/07/01/royal-kingdom-will-it-outgrow-its-big-brothers-influence)).
- **[Inferred]** Showing the difficulty in the UI turns a spike into a promise ("this one's meant to be tough") rather than a betrayal.

### Rovio, Tactile, EA: the same pattern

- **[Confirmed] Rovio + Aalto** ([Roohi et al., 2021](https://arxiv.org/abs/2107.12061); predecessor [2020](https://arxiv.org/abs/2008.12937)) predicted pass *and churn* rates on 168 levels of *Angry Birds Dream Blast* with deep reinforcement learning (DRL) plus MCTS agents. They then fed those predictions into a simulated player population with skill, persistence and boredom. Key finding: the agent's **best-case** performance predicts humans better than its average.
- **[Confirmed] Tactile Games + ITU** ([Kristensen et al., CoG 2020](https://arxiv.org/abs/2306.14626)) found the same thing in *Lily's Garden*. The best predictor of player completion rate was the moves needed by the **best ~5% of agent runs**, even though the agent wasn't human-level.
- **[Confirmed] EA SEED** ([Villanueva Aylagas et al., IEEE ToG 2024](https://arxiv.org/abs/2409.06349)) generates match-3 board layouts with a conditional variational autoencoder (cVAE), a neural network that generates boards on request for a given size, symmetry and difficulty. A scripted bot validates each level by playing it 30 times. They note "levels can exceed ten thousand, and hundreds must be added weekly." Their training set mixes 81 designer levels with 117 rule-based generated ones. Only about half the generated levels were valid, and difficulty control was weak (off by about 10 moves on average). So **end-to-end ML generation isn't production-ready. Generate-and-test is.**

**Bottom line on the question "is there an algorithm?":** partly yes. The algorithm is in **measuring and tuning**: bots, regression and automatic tweaks. Generation is increasingly AI-assisted, but every published account keeps humans choosing what ships.

---

## 2. How difficulty is measured and tuned

| Metric | Definition | Who uses it (source) |
|---|---|---|
| Pass/success rate | wins ÷ attempts per level | King (paper), Playrix, Rovio, EA |
| Attempts per win | 1 ÷ pass rate | EA (DDA paper) |
| Churn / dropout | % who stop playing at this level (7-day window) | Playrix, Rovio |
| Time to pass vs. time to abandon | engagement / "fun" proxy | King GDC 2024 |
| Moves-left / moves-used distribution | how close wins and losses are | King, Tactile, EA SEED |
| Shuffles, booster use, coins spent | spotting bugs and paywalls | King, Playrix |

**Sawtooth curves.**
- **[Confirmed]** King says the up-and-down is deliberate.
- **[Confirmed]** Playrix flags runs of similar hard levels.
- **[Confirmed]** EA's data ([Xue et al., 2017](https://archives.iw3c2.org/www2017/proceedings/companion/p465.pdf)) shows difficulty spikes line up with steep drops in retained players, especially in the mid-game (levels 21–80 in their game).
- **[Confirmed]** Early players churn regardless of difficulty, and late players are very tolerant.
- **[Inferred]** That's why spikes get pushed later and the first ~20–30 levels are nearly free.

**Live tuning.**
- **[Confirmed]** Both King and Playrix A/B test single levels for weeks. Both describe the same trade-off: harder means more conversion and more churn, easier means more retention and less short-term revenue.
- **[Confirmed]** Academic work agrees. [Huang, Jasin & Manchanda (2019)](https://pubsonline.informs.org/doi/10.1287/isre.2019.0839) found challenge *helps* low- and medium-engagement players and *hurts* highly engaged ones. Matching difficulty to engagement state raised play by 4–8%.

### Dynamic difficulty adjustment and the controversy

- **[Confirmed] EA shipped seed-based DDA in a live match-3 game.** In [Xue et al. (WWW 2017)](https://archives.iw3c2.org/www2017/proceedings/companion/p465.pdf), each level had 100 possible starting seeds. On one level the easiest seed had a 0.75 win rate and the hardest 0.15, a 5× difference in attempts needed. A server picked the seed per player, per attempt, to maximise long-term engagement. The lever was chosen *because it's invisible*: changing the goal on a retry would be noticed. Result: **up to 9% more engagement, with a neutral impact on monetisation**. EA also holds [patents](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10286323) on DDA.
- **[Confirmed] King denies tuning difficulty per player based on spending.** Tommy Palm said publicly, and King's SEC filing said, that difficulty is the same for everyone ([GamesBrief, 2014](https://www.gamesbrief.com/2014/02/if-king-fixes-candy-crush-saga-to-make-you-pay-more-based-on-your-behaviour-they-are-going-to-prison)).
- **[Confirmed]** In 2024, though, Asadi said King "weights certain experiences toward certain player profiles," and that this is intentionally fuzzy ([source](https://mobilegamer.biz/how-king-balances-human-and-ai-powered-design-in-candy-crush-saga/)). So some personalisation exists. What it's keyed on isn't public.
- **[Reported / unverified]** Player claims that boards turn "rigged" before a purchase prompt, or that Block Blast deals worse pieces as your score rises, are widespread. They're backed by blogs and forum anecdotes, not evidence ([example](https://www.deceptive.design/articles/candy-crush-saga-impossible-levels)).
- **Takeaway: the technique is real and cheap.** The trust damage comes from *suspected* links to spending.

---

## 3. Procedural generation techniques that work for match-3

1. **Parameterised generators.** A level is a small parameter vector: board mask/shape, colour count (5–6), blocker types/counts/placement pattern, goal type and amount, move limit, spawn weights, special pre-placements. Templates and symmetry rules keep boards looking designed. The EA SEED paper conditions on size and symmetry for exactly this reason.
2. **Generate-and-test (search-based).** Generate many candidates, simulate each with a bot, and keep the ones that hit the target metrics. Make it evolutionary by mutating the best candidates. King's paper explicitly suggests its agent as "a fitness function for an evolutionary algorithm" for procedural content generation. [Mugrai et al. (2019)](https://arxiv.org/abs/1907.06570) evolved MCTS **personas** for match-3 (score maximiser, score minimiser, and others), and those personas *bracketed* the range of human scores. That's a cheap way to simulate a spread of skill.
3. **Constraint-based filtering.** Hard rules reject bad levels before you spend time simulating them:
   - Every goal tile can be reached.
   - Blockers don't seal off spawners.
   - The singer has a path to the stage.
   - Allowed element combinations only (Playrix's compatibility list).
   - Element count ≤ 4.
   - Starting board has no ready-made matches and at least one legal move.
4. **Seeds for reproducibility and variance control.** Store the seed for the initial board and the refills. EA's data shows **seed choice alone can swing the win rate from 15% to 75%** on a level. So:
   - Always evaluate a level over many seeds.
   - Either ship a *curated seed pool* (which cuts variance and unfair outliers) or accept the variance consciously.
5. **Spawn-rule tuning.** Colour weights, "no immediate match on refill" rules and spawn-assist rules (bias refills toward a playable board) are a quieter difficulty lever than move count. **[Inferred]** Most commercial games use some refill smoothing. It's also exactly the lever that turns into "rigging" if it's tied to monetisation.
6. **Guaranteed solvability.** Match-3 with random refills can't be proven solvable in general. In practice, "solvable" means **the expert bot wins ≥ X% over N seeds**, plus a reshuffle rule when no moves remain. Playrix's rule "beatable without boosters" is the bar to copy.
7. **ML difficulty prediction.** Once there's live data, train a regression from (bot statistics + level features) to human pass rate. King's binomial-regression approach is simple and documented. Imitation-learned bots (King) and RL bots ([Shin et al., IEEE Access 2020](https://doaj.org/article/2ab9580c4542494ab96e9a7ee8827101); [Napolitano, 2020](https://arxiv.org/abs/2007.01137)) come later. They need lots of data and engineering.

---

## 4. Lessons from endless puzzle games

- **Tetris: bounded randomness plus a speed ramp.**
  - Difficulty comes from gravity speed. Fairness comes from the randomiser.
  - The modern [7-bag](https://harddrop.com/wiki/Random_Generator) deals each piece once per 7, so the longest wait for an I-piece is 12.
  - [TGM's history randomiser](https://harddrop.com/wiki/TGM_randomizer) rerolls pieces that came up recently.
  - **Lesson:** players forgive difficulty but not "bad luck streaks". Bound the worst case.
- **2048 and Threes: tight spawn rules.**
  - 2048 spawns a 2 most of the time and a 4 occasionally ([source](https://github.com/gabrielecirulli/2048)).
  - Threes, per [community reverse engineering](https://toucharcade.com/community/threads/threes-by-sirvo-llc.218248/page-27), deals from a shuffled 12-card deck (four each of 1/2/3), plus "bonus" cards scaled to your highest tile.
  - Difficulty rises on its own because the board fills with mess the player made. The designer only controls the spawn rules.
- **Block-placement "blast" games: no confirmed algorithm.**
  - Claims that Block Blast adapts pieces to the player are unconfirmed ([blogs](https://playgama.com/blog/game-faqs/why-does-block-blast-randomly-cause-my-defeat/); one [clone's docs](https://sugarmice3de.github.io/BlocKIT-docs/components/logic/) describe a "guarantee a fitting piece, sometimes offer a near-miss" generator).
  - **[Inferred]** Guaranteeing at least one placeable piece is the simplest form of fairness.
- **What transfers to a level-map game:**
  1. Endless difficulty can't keep *rising* forever. Successful endless games ramp and then **plateau with variety**. The EA data shows late-game players tolerate high difficulty, but there's a ceiling.
  2. Novelty (new mechanics, new combinations) keeps late content fresh better than ever-tighter move limits. Playrix adds 1–2 mechanics per update.
  3. Bounded randomness is a fairness tool. Use it on refills and seeds.

---

## 5. Recommendation for Mosh Pit

### Design stance

Mosh Pit's pillars are "no punishing difficulty spikes" and "the store is part of the joke". That argues for a **gentle sawtooth**:
- The same rhythm as Royal Match (hard levels about every 8–10, a relief level after), but with a **floor on the human pass rate per attempt**.
- Visible "Loud"/"Very Loud" badges on spike levels (gig-flyer stamps) instead of hidden spikes.
- No stat progression, which keeps the measurements clean. The concept already gets this right.

### The pipeline

**Step 1: deterministic headless sim (the foundation, roughly 3–6 weeks, mostly game logic you need anyway).**
- The same rules code the game uses, runnable without rendering, with a seeded RNG for the initial board and refills.
- Target ≥ 1,000 full games per second per core with a greedy bot. Every later step depends on this speed.
- Cover every Mosh Pit element: specials (Stage Diver, Crowd Surfer, Wall of Death, Frontman), combos including Riot, and blockers.
- The blockers and goals with the most variance need the most tests, because they drive variance:
  - **amps** (three hits, then a cross blast that can chain)
  - the **sleeping drunk** (moves on its own every turn)
  - **merch tables** (2×2)
  - the **crowd-surf-the-singer** goal

**Step 2: level schema plus a parameterised generator (2–3 weeks).**
- JSON per level: board mask, colours (5–6), per-cell layers (guard 2 HP, barricade, beer, merch 2×2, amp 3 HP, drunk), goals, move limit, spawn weights, spawner cells for singers, and a seed pool.
- Generation from **designer-authored archetypes**: "guard wall", "amp chain", "singer drop through barricades", "beer moat". Each archetype has parameter ranges and symmetry rules. That keeps boards looking designed and gives each level the "central idea" Playrix insists on.
- **Constraint filter** (Section 3, item 3) plus a **compatibility table**. For example, maybe no drunk + singer together early on, because both are moving things that interact.

**Step 3: bots at three skill levels (1–3 weeks).**
- *Casual:* greedy on a hand-weighted score, with softmax noise.
- *Regular:* greedy that prefers making specials and moves toward the goal.
- *Expert:* shallow MCTS or a 2-ply lookahead.
- Optionally evolve persona weights à la Mugrai.
- Later, once there's telemetry, train an imitation policy on real moves (King's approach).

**Step 4: difficulty estimate (1–2 weeks, then ongoing).**
- Play each candidate over ~200–500 seeds per bot.
- Record:
  - win rate
  - the full distribution of **moves needed to finish** (play with an uncapped move limit and record when the goal completes)
  - goal progress on losses (near-miss rate)
  - shuffles
  - specials made
  - longest cascade
  - variance across seeds
- **Move limit becomes a derived value:** take the moves-to-finish distribution and set the limit at the percentile that hits the target pass rate. EA SEED's validator works the same way, with more moves than the cap allows. This is the single most useful trick, because the main knob gets tuned automatically.
- Use **best-x% runs** as a feature (Rovio and Tactile findings).
- Calibrate bot → human with a logistic/binomial regression on playtest data, then soft-launch data. Until then, treat numbers as *relative* rankings, not real pass rates.

**Step 5: target curve.**
- A per-level target human pass rate. Make it a spreadsheet the designers own, like Playrix's master document. **[Inferred starting points, to tune with data]:**
  - levels 1–30: ≥ 85–95%
  - normal levels after that: 40–70%
  - "Loud" levels: ~25–35%
  - "Very Loud" levels: ~15–25%, kept short (King: harder levels should be shorter)
  - never two spikes in a row; always a relief level after a spike
- Introduce new blockers on easy levels and spike them later.
- Each venue (15–20 levels) is one cycle, peaking at a headliner level.

**Step 6: search and curation (1–2 weeks, plus a simple review UI).**
- For each slot on the curve, generate about 50–200 candidates from the right archetypes.
- Hill-climb blocker counts and placement toward the target, with move limit derived as in Step 4.
- Reject near-duplicates using a feature vector (layout hash, element mix, goal), a small MAP-Elites-style diversity grid.
- Show designers the top 5–10 with a replay viewer and the bot statistics. They pick, tweak and stamp.

**Step 7: live ops (ongoing).**
- Ship levels as remote-config data.
- Log every attempt.
- Each month, re-tune the "least fun" 5–10% (King's time-to-pass vs. time-to-abandon).
- A/B test rewrites against the original (Playrix's three-way test).
- Recalibrate the bot→human model.

**Total:** roughly **2–4 months of one engineer** on top of the core game, plus a designer to own archetypes and the curve. **[Inferred estimate.]**

### What to hand-make and what to generate

| Hand-make | Generate + curate | Fully generate (later) |
|---|---|---|
| Levels 1–30 (onboarding) | Normal levels inside a venue | Endless "after-party" mode beyond the authored tour |
| First appearance of every blocker/special | Variants of proven archetypes | Event/daily-gig levels |
| Venue headliners and "Very Loud" levels | Re-tunes of underperforming levels | |
| Mechanic showcase levels (e.g. first Riot setup) | | |

**[Inferred]** A healthy ratio after launch: about 20–30% hand-made, the rest generated and curated. "Endless" means a plateau with variety (new venues and mechanics), not move limits that keep getting tighter.

### Pitfalls

- **Sameness.** Generators produce competent but forgettable boards. Counter with archetypes, a diversity filter, one central idea per level, and a human pick. Repetition is a known risk at hundreds of levels per week (EA SEED paper).
- **Bot ≠ human.** Bots underrate levels that need strategy and overrate chaotic ones. Calibrate on real players as early as possible (closed playtests count), and keep humans playing the spike levels.
- **Variance feels unfair.** Amps chain reactions and refill luck can make the same level a 15% or a 75% win (EA's seed data). Measure variance across seeds, cap it, and consider a curated seed pool for spike levels.
- **Move-limit-only difficulty feels stingy.** If every hard level is "same board, fewer moves", players notice. Vary the difficulty source: blocker layout, goal amount, colour count.
- **Monetisation ethics.**
  - Commit publicly to these rules and stick to them:
    - Every level can be beaten without boosters.
    - Difficulty never depends on whether or what you spend.
    - Any adaptive help only ever makes things *easier* (for example, a hidden easier seed after 5+ failed attempts).
  - Don't engineer near-misses to sell the "+5 moves from the sound engineer" continue.
  - The EA case shows engagement-based easing can be revenue-neutral, so the honest version isn't a sacrifice. Hidden DDA tied to spending is the version that destroys trust if anyone finds out, and players already assume the worst.
  - **[Inferred]** EU consumer-protection scrutiny of F2P is rising, which makes the honest version safer too.
