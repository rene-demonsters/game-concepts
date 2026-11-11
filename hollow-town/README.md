# Hollow Town (working title)

A dark, satirical simulation game about how bots and AI-generated content reshape what people believe, and how that spills into the real world. You play the villain so you learn to recognize the playbook.

Detail lives in `docs/`:

- [`docs/research.md`](docs/research.md): comparable games and evidence on whether they work
- [`docs/simulation-model.md`](docs/simulation-model.md): opinion model rules, resources, tuning targets
- [`docs/narrative-and-safety.md`](docs/narrative-and-safety.md): tone, hero citizens, fictional-world rules, safety guardrails, sample copy
- [`docs/prototype-0.md`](docs/prototype-0.md): UX, art, tech architecture and build plan

## Pillars

- **Tone:** dark and satirical, a cynical "villain simulator" voice. The satire is aimed at the operator's mindset and the machinery, never at victims. Funny first, uncomfortable second. Winning must feel hollow.
- **Setting:** a fully fictional town and fictional, hyperlocal issues (a parking structure, a bridge toll, library hours). No real places, people, parties, platforms or events, and no left/right or red/blue coding.
- **Audience:** game-literate players who want deeper systems. The simulation is exposed: players can inspect citizens, see why an opinion changed, and plan around the model.
- **Honesty:** effect sizes stay modest and plausible. Bots shift perceived norms, silence dissent and erode trust; they do not mind-control a town. Close races swing, landslides don't.
- **Safety:** tools are stylized and platform-agnostic, nothing models real evasion techniques, every tactic is paired with its tell, and the game never works as a tuned playbook. The opening screen states that you're playing the antagonist. See the safety guardrails in `docs/narrative-and-safety.md`.
- **Don't teach cynicism:** the goal of the attack is "nothing is true". Every campaign ends with what *still worked*, such as a neighbor who checked the source.

## Premise

Watch a small fictional town argue about a local issue in the run-up to an election. Two layers are shown at once:

- **Feed layer:** vector circles are citizens, links light up only when a post travels along them, speech/chat bubbles carry posts and replies.
- **Real-world layer:** simple shapes for houses, a café, a town hall. Citizens move between them, meet, talk and vote.

The point of the game is the **gap between the two layers**: what people see online vs. what the town actually believes.

## Where this sits among existing games

Browser games like *Bad News* and *Harmony Square* teach tactics through scripted choices, and commercial sims like *Influence, Inc.* and *Social Warfare* cover the "play the manipulator" premise. None model perceived norms or show the aftermath on named people. Our differentiator is the **simulation and the consequences**, not the premise. Research also says to train recognition of *specific tells*, not general distrust. Details in `docs/research.md`.

## Core loop: the day tick

Each campaign runs about 14 in-game days. A day has three phases:

1. **Read:** inspect the town: who's wavering, who's loud, who's isolated, what each citizen currently sees. Lens toggles re-skin the same nodes (opinion, loudness, isolation, wavering).
2. **Act:** spend the day's budget on 2-3 operations, with a preview of predicted audience and Heat.
3. **Watch:** the day plays out at 4x speed, with **one or two interrupt moments per day**: a hero citizen starts asking questions, a tell starts trending. The player spends a small reserve to cover up, deny, or sacrifice an account. The player can pause and tap anything to ask "why did this change?".

**Receipts:** every action ends with a one-line causal log ("Bot thread reached 11 citizens. Marta's perceived norm moved 0.12. She stopped posting."). Every number change needs a legible cause.

**Town Trust** is a visible meter throughout. Winning with trust at 12% should feel hollow because the number says so, not a lecture.

### First five minutes

The first five minutes are the "aha", not a tutorial. A pre-run town starts with the bars already visibly diverged. The player places one bot thread on day 1 and watches one named person go quiet. Heat and Credibility are introduced around day 4, one resource at a time. A ~30-second campaign 0 plays from the defender's chair so players know what normal looks like.

## Resources

- **Reach:** how many accounts and how much content you can deploy.
- **Credibility:** an account-level asset (age, diversity of behavior). It decides which tells fire, and it has a recovery rule so one bad early day can't end a run.
- **Heat:** a content-level hazard tracked **per tell type** (timing, phrasing, account age, source circularity, visual glitches). It decides detection probability.

Citizens have a **literacy** stat. Each tell they notice gets shared socially, which is how exposure cascades. Hiding one tell must expose another, so there's no dominant strategy.

## Simulation model

Full rules in `docs/simulation-model.md`. In short, each citizen has an **opinion** anchored to a prior (Friedkin-Johnsen), **bounded confidence**, a **perceived norm** built from the posts *they see* (loud posters overrepresented), and a **willingness to speak** that drops when they feel in the minority (spiral of silence), with a ~10% hardcore floor of dissenters who keep speaking. Trust in the feed erodes as tells are noticed, and the liar's dividend is its own mechanism: the chance a real post is dismissed rises with global suspicion and falls with literacy.

Bots are **triangles disguised as circles**. An X-ray toggle reveals them. The sim is **deterministic from a seed** with per-subsystem RNG streams, and renders nothing itself.

## Channels (the player's tools)

| Channel | What it does | The tell |
|---|---|---|
| **Faceless video channels** | Cheap AI-voiced explainers that build authority and slip in framing | Stock footage, no named creator, hundreds of uploads in a week, same script structure |
| **Fake news articles** | Seeded on junk sites, then cited by other junk sites (citation laundering) | Brand-new domain, no bylines, circular sourcing |
| **Fake news video** | High impact, high exposure risk if glitches are noticed | Odd lip-sync, recycled footage, no original source |
| **Bot discussions** | Bots argue with each other in public so the "debate" looks real and the preferred side wins | Replies seconds apart, same phrasing, accounts created the same week |
| **Review bombing** | Swarm a target (a shop, a book, an endorser) with 1-star reviews, or fake praise for allies | Sudden spike, no purchase history, copied phrasing |
| **Astroturf groups** | Fake grassroots that make a fringe view look mainstream | Identical talking points, no local roots |
| **Pile-ons** | Silence dissenters (rendered as withdrawal, never as harassment text) | Coordinated timing |
| **Wedge issues** | Split the opposing coalition | Out-of-nowhere outrage about an unrelated topic |

Also: *Seed* (create and age accounts), *Amplify* (boost real posts that already help your side), *Flood* (drown a topic in noise).

Costs that keep tactics varied: per-channel fatigue, chain exposure that grows with chain length (layering is a multiplier but fragile), audience matching (each channel reaches a subset), and a real backlash cost on pile-ons.

## Campaigns

Each campaign has one map, one objective, a new mechanic, and a twist beyond the new tool.

| # | Campaign | Objective | New mechanic taught |
|---|---|---|---|
| 0 | Tutorial (defender's chair) | See what a normal town looks like | Baseline (~30 s) |
| 1 | The Zoning Vote | Swing a housing referendum | Perceived consensus, bot discussions |
| 2 | The Café | Close a rival's meeting place | Review bombing, real-world fallout |
| 3 | The Bestseller | Tank a local author's book | Fake news layering, citation laundering; punishes reuse of a source |
| 4 | The Audit | Make an accurate inspector's report not matter | Liar's dividend; flood doubt instead of lying |
| 5 | Election Night | Everything combined, bigger town | Detection cascade |

Campaign 4 is the thesis. The player doesn't lie about a true report; they make "disputed" and "everyone has an agenda" stick. The win condition is trust in **all** sources falling, and the cost is visible: the operator's own genuine-looking claims stop working too. A throwaway "real report called fake" is seeded in campaign 2 or 3 so it pays off.

Replay variety: seeded random events, a different objective modifier per campaign (don't get caught, win without closing a business), and optional hard constraints (a credibility cap).

## Named citizens

Alongside an anonymous crowd, **10 hero citizens** have a name, one concrete detail, and a distinct vector motif. Fates vary: some are silenced, some radicalize, some turn on a neighbor, one is fine. Heroes also **react in real time** (e.g. a message in the feed asking questions). The end screen shows each citizen's last ordinary action, never anything death-adjacent:

> *Last post: a photo of route 9 in the rain. 40 views.*

The full cast and what hits each is in `docs/narrative-and-safety.md`.

## Exposure phase (placeholder name)

Getting caught does **not** end the run. When Heat on enough tells crosses the exposure threshold, the campaign continues into the **exposure phase** (a copywriter will name it properly):

- Citizens who learn bots exist start accusing real people of being bots, share unverified "exposés" of their own, and copycat operators (and your scraped content) flood in.
- Real posts get dismissed as fake (the liar's dividend); real dissent gets silenced by suspicion instead of by your network.
- Trust and turnout keep falling even though you've stopped acting.
- To avoid days of passive watching, the phase includes **agency-bearing events** for the player (damage control, sacrificing accounts, deciding whose blame to deflect).

It is a consequence during the run; the player keeps the operator seat. It is separate from the defender epilogue, which is guaranteed regardless of whether the player was caught.

## Defender epilogue

The epilogue **always plays, starting right after election day**, and it is short (~45-90 seconds). It is a payoff, not a second game. Swapping seats mid-campaign would break the Read / Act / Watch rhythm, so it starts only once the campaign is over.

**It isn't a rigged loss.** An always-losing mode teaches helplessness, not recognition, so it has its own success metrics:

- **Contain the damage:** keep the exposure spread below a threshold.
- **Save one named hero.**
- **Find one tell** before time runs out.

Trust still doesn't return to baseline, and every false positive hits a real person. The player sees their own tactics from the receiving end. Variants:

- **Player was exposed:** you are the platform moderator in the town you broke. Same tools in reverse (label, throttle, ban, publish corrections).
- **Player was never caught (stealth variant):** you have no X-ray. You play a citizen or moderator who senses something is off (a hero went quiet, the café closed, everyone suddenly agrees). The task is a **solvable deduction**, in the style of *Return of the Obra Dinn*: with enough clues, the player can get it right. The scarier lesson stays: the best manipulation is the kind nobody investigates.

Frequency: campaigns 1-3 get a ~45-60 second version; campaigns 4-5 get the full playable one. The first epilogue is skippable.

A full defender game is better treated as its own game; it is out of scope now, and the epilogue is the testbed for whether the defender seat is compelling.

## End screen

- **Town damage first:** trust lost, people silenced, businesses closed. This is the headline result.
- **Ghost distribution:** ~200 silent bot-free runs of the same seeded town, run in a worker with **common random numbers** so the comparison is meaningful. Show the effect size and confidence, not just a headline percentage. Some runs end with *"you didn't change the outcome, but look what you did to the town."* It must never read as "your effort was futile".
- **Detectability:** which tells citizens actually caught.
- **Field Guide:** a short, mandatory walkthrough of hero fates and "what still worked". An opt-in **detective mode** replays the campaign from a citizen's point of view, with a "how many tells did you leave?" score and par. Training recognition of specific tells is the educational goal, not general distrust. Tells and Heat are shown on the same screen so players learn patterns, not how to hide.
- A short real-world "how to spot it" list (check account age, search the same phrase, look for a named author).

## Visual language

Details in `docs/prototype-0.md`. Highlights:

- **~60-80 visible agents** in three soft clusters; the rest are statistical background. Links pulse only when a post travels.
- **Color = opinion** (colorblind-safe blue-orange scale with a redundant tick), **size = influence** in 3 buckets, **outline pulse = just posted**.
- Content shapes: article = rectangle with lines, video = rectangle with a play triangle, review = star cluster. Fake video shows glitch artifacts as visible tells.
- Short bubbles (max ~6 words); at 4x only heroes and player-action bubbles carry text, everyone else gets a glyph.
- Two live bars, **perceived vs. actual**, with a labeled "Illusion gap" and a threshold tick.
- A silence ripple that cascades and a running "voices lost" counter.
- Watch-phase juice with shapes only: slow auto-camera, small hit-stops, WebAudio synth sounds.

## Tech

Canvas 2D (not PixiJS) for the prototype, a pure TypeScript sim core with no DOM dependency, a seeded RNG with per-subsystem streams, a web-worker pool for ghost runs, Vite and Vitest, and a headless balance harness that runs 1000 seeds. Ships as an HTML5 build for itch.io and a web host. Full plan in `docs/prototype-0.md`.

## Prototype 0

Goal: answer one question: **is watching perceived consensus diverge from reality compelling, with modest, honest effect sizes?**

In scope:
- One map, ~60 agents, 3 neighborhoods, 3 hero citizens
- Opinion / perceived-norm / silence model with bots
- Two tools: bot discussions and fake article
- Day-tick loop (Read / Act / Watch with receipts and one interrupt per day), 14 days, the two bars, silence ripple, X-ray
- End screen with a rough ghost distribution

Out of scope: video, review bombing, Field Guide, exposure phase, defender epilogue, audio, campaigns 2-5, real-world movement.

The order of attack is a headless balance harness and a fake-event renderer spike in parallel in week 1, since those two tell us whether the idea works. Metrics to check (effect-size mean/variance, flip rate vs margin, silent fraction, strategy diversity, determinism) are in `docs/simulation-model.md`. Estimated at 4-5 weeks for one person.

## Later milestones

1. Review bombing + real-world layer (campaign 2)
2. Fake news layering and citation laundering (campaign 3)
3. Exposure phase and defender epilogue (short version first, then the stealth variant)
4. Faceless and fake video, liar's dividend (campaign 4)
5. Field Guide, then campaign 5

## Open questions

Genuine tensions between the studio reviews. Proposed resolution in italics; to confirm.

1. **Field Guide: fun vs. leak.** The design director wants a "how many tells did you leave?" score, par and leaderboard so players replay to be sneakier. The ethics advisor warns that rewarding hiding tells risks a tuned playbook. *Proposal: score recognition of tells (for the defender and the detective mode), not stealth optimization; no public stealth leaderboard.*
2. **Field Guide: skippable or not.** The design director says a mandatory Field Guide is "eat your vegetables"; the research says the awareness payoff lives there. *Proposal: a short mandatory part (hero fates and what still worked) plus an opt-in detective mode.*
3. **Educator mode vs. deeper systems.** The ethics advisor wants an educator mode that hides the optimization loop; our audience choice is deeper systems. *Proposal: build the exposed-sim version first; educator mode is a later skin.*
4. **When to introduce Heat and Credibility.** The systems designer treats them as core resources; the design director wants them deferred to around campaign 1 day 4. *Proposal: both; present them late in onboarding but model them from day 1.*
5. **Reach: free web vs. premium depth.** Research suggests a free web build for reach; our audience is game-literate and wants depth. *Proposal: free web build of the early campaigns, paid or full version later, undecided.*
