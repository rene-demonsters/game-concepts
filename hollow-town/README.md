# Hollow Town (working title)

A dark, satirical simulation game about how bots and AI-generated content reshape what people believe, and how that spills into the real world. You play the villain so you learn to recognize the playbook.

## Pillars

- **Tone:** dark and satirical, a cynical "villain simulator" voice. Funny first, uncomfortable second. The humor keeps people playing; the consequences are what stay with them.
- **Setting:** a fully fictional town and fictional issues. No real places, people, parties, platforms or events, so the game can't harm anyone real.
- **Audience:** game-literate players who want deeper systems. The simulation is exposed, not hidden: players can inspect citizens, see the opinion model's inputs, and tune strategy around it.
- **Honesty:** effect sizes stay modest and plausible. Bots shift perceived norms, silence dissent and erode trust; they do not mind-control a town. Close races swing, landslides don't.
- **Safety:** tools are stylized and platform-agnostic, every tactic is paired with its tell, and nothing in the game is a real how-to. The opening screen states that you're playing the antagonist.

## Premise

Watch a small fictional town argue about a local issue in the run-up to an election. Two layers are shown at once:

- **Feed layer:** vector circles are citizens, links light up only when a post travels along them, speech/chat bubbles carry posts and replies.
- **Real-world layer:** simple shapes for houses, a café, a town hall. Citizens move between them, meet, talk and vote.

The point of the game is the **gap between the two layers**: what people see online vs. what the town actually believes.

## Core loop: the day tick

Each campaign runs about 14 in-game days (~6-8 minutes). A day has three phases:

1. **Read:** inspect the town: who's wavering, who's loud, who's isolated, what each citizen currently sees.
2. **Act:** spend the day's budget on 2-3 operations.
3. **Watch:** the day plays out at 4x speed. You can't intervene, but you see consequences land.

## Resources

- **Reach:** how many accounts and how much content you can deploy.
- **Credibility:** how believable your network is. Aged accounts and varied behavior build it; reuse and sloppiness drain it.
- **Heat:** suspicion, tracked **per tell type** (timing, phrasing, account age, source circularity, visual glitches), not as a single bar.

Citizens have a **literacy** stat. Each tell they notice gets shared socially ("have you noticed these all say the same thing?"), which is how exposure cascades. Detection works through pattern-noticing and social spread, not a single "bot detected" flag.

## Simulation model

Each citizen has:

- **Opinion** in [-1, 1]
- **Perceived norm:** their estimate of "what most people think", built from the posts *they see* (weighted by trust and recency), not from the true average. This is the key mechanism.
- **Willingness to speak:** drops when their opinion is far from the perceived norm and their confidence is low (spiral of silence)
- **Susceptibility, trust, attention, literacy**

Dynamics:

- Opinions drift slowly toward the perceived norm (conformity) and toward trusted individuals (persuasion), with bounded confidence: nobody is swayed by views too far from their own.
- When trust in the feed falls below a threshold, citizens disengage and stop sharing real information.
- Bots are **triangles disguised as circles**. An X-ray toggle reveals them.

The sim is **deterministic from a seed** and renders nothing itself (pure TypeScript core, runs in a worker), so the same town can be re-run without the bots.

## Channels (the player's tools)

| Channel | What it does | The tell |
|---|---|---|
| **Faceless video channels** | Cheap AI-voiced explainers that build authority and slip in framing | Stock footage, no named creator, hundreds of uploads in a week, same script structure |
| **Fake news articles** | Seeded on junk sites, then cited by other junk sites (citation laundering) | Brand-new domain, no bylines, circular sourcing |
| **Fake news video** | High impact, high exposure risk if glitches are noticed | Odd lip-sync, recycled footage, no original source |
| **Bot discussions** | Bots argue with each other in public so the "debate" looks real and the preferred side wins | Replies seconds apart, same phrasing, accounts created the same week |
| **Review bombing** | Swarm a target (a shop, a book, an endorser) with 1-star reviews, or fake praise for allies | Sudden spike, no purchase history, copied phrasing |
| **Astroturf groups** | Fake grassroots that make a fringe view look mainstream | Identical talking points, no local roots |
| **Pile-ons** | Harass dissenters until they go quiet | Coordinated timing |
| **Wedge issues** | Split the opposing coalition | Out-of-nowhere outrage about an unrelated topic |

Also: *Seed* (create and age accounts), *Amplify* (boost real posts that already help your side), *Flood* (drown a topic in noise).

Interactions:

- **Layering:** a fake article is cited by bot discussions, then summarized by a faceless video. Each layer boosts the previous one's credibility. Chains give a big multiplier but are fragile: one exposed node can unravel the rest.
- **Real-world fallout:** review-bomb the café that hosts the opposition's meetups and it empties and closes.
- **Audience matching:** different citizens consume different channels (older neighbors: articles and group posts; younger: video). Targeting is part of the strategy.

## Campaigns

Each campaign has one map, one objective and one new mechanic.

| # | Campaign | Objective | New mechanic taught |
|---|---|---|---|
| 1 | The Zoning Vote | Swing a housing referendum | Perceived consensus, bot discussions |
| 2 | The Café | Close a rival's meeting place | Review bombing, real-world fallout |
| 3 | The Bestseller | Tank a local author's book | Fake news layering, citation laundering |
| 4 | The Whistleblower | Discredit a real, accurate report | Liar's dividend, fake video |
| 5 | Election Night | Everything combined, bigger town | Detection cascade |

Campaign 4 is the thesis: the goal isn't to convince people of a lie, but to make them unable to trust anything.

## Named citizens

Alongside an anonymous background crowd, **8-10 hero citizens** have a name, a line of backstory and a distinct vector motif (e.g. the café owner, a retired teacher whose long posts everyone reads, a newcomer who's undecided). Player actions hit them specifically, and the end screen walks through what happened to each:

> *Tom stopped posting on day 6. Nobody noticed. His last post had 40 views.*

## Fail state: getting exposed

Getting caught does **not** end the run. When Heat on enough tells crosses the exposure threshold, the campaign continues into the **exposure phase** (placeholder name; a copywriter will name it properly):

- The town goes feral on fake news: citizens who learn bots exist start accusing real people of being bots, share unverified "exposés" of their own, and copycat operators (and your own scraped content) flood in.
- The feed fills with accusations, counter-accusations and rumors. Real posts get dismissed as fake (the liar's dividend); real dissent gets silenced by suspicion instead of by your network.
- The town's trust and turnout keep falling even though you've stopped acting. You've lit the fire; you don't control it.

The exposure phase is a *consequence during the run*: the player keeps the operator seat and watches it unfold. It is separate from the defender epilogue, which is guaranteed regardless of whether the player was caught.

### Defender epilogue

The epilogue **always plays, starting right after election day**, and it is short (~3-4 in-game days, roughly 90 seconds). It is a payoff, not a second game. Swapping seats mid-campaign would break the Read / Act / Watch rhythm, so it only starts once the campaign is over. It is deliberately a losing position: trust never returns to the baseline, and you see your own old tactics from the receiving end. It plays differently depending on how the run went:

- **Player was exposed:** you are the platform moderator in the town you broke. You label, throttle, ban and publish corrections, using the same tools in reverse. Every false positive hits a real person, which makes the town angrier.
- **Player was never caught (stealth variant):** you have no X-ray. You play a citizen or moderator who senses something is off (a hero citizen went quiet, the café closed, everyone suddenly agrees) and tries to work out why. You will likely fail to find it, and then the Field Guide shows what you missed. This rewards stealth with the scarier lesson: the best manipulation is the kind nobody investigates.

Frequency, so it doesn't wear out the point:

- **Campaigns 1-3:** short epilogue (~60 seconds), mostly the Field Guide walkthrough.
- **Campaigns 4-5:** the full playable version, where the liar's dividend and the detection cascade make the defender seat meaningful.

The epilogue can be skipped after the first play, but the Field Guide cannot be skipped, since it carries the awareness payoff.

### Possible separate defender game

A full defender experience is better treated as its own game than as a longer epilogue. Not in scope now; the epilogue is the starting point and a testbed for whether the defender seat is compelling enough to expand.

## End screen

- **Ghost distribution:** ~200 silent bot-free runs of the same town (seeded) in a worker, shown as a distribution, not a single replay: *"In 78% of bot-free versions of this town, the referendum fails; in yours it passed."* Some runs end with *"you didn't change the outcome, but look what you did to the town."*
- **Trust lost** (permanent damage, even if the vote is lost)
- Real people silenced, businesses closed
- **Detectability:** which tells citizens actually caught
- **Field Guide:** replays your campaign from a citizen's point of view, showing what they saw and where they could have caught it, plus a short real-world "how to spot it" list (check account age, search the same phrase, look for a named author)

## Visual language

- **~60-80 visible agents** clustered into neighborhoods; the rest are statistical background.
- Links pulse only when a post travels along them (no permanent hairball).
- **Color = opinion**, **size = influence/reach**, **outline pulse = just posted**.
- Content types have distinct shapes: article = rectangle with lines, video = rectangle with a play triangle, review = star cluster.
- Fake video shows **glitch artifacts** (jittering edges, misaligned mouth line) so the tell is visible.
- Chat bubbles are short (max ~6 words) and fade fast. Tone is conveyed by bubble color and shape (spiky = angry, rounded = friendly).
- Two live bars: **perceived vs. actual opinion**. Healthy town: they match. As bots work, they diverge.

## Tech

Plain HTML canvas + a small TypeScript sim core with no rendering dependencies (testable, runs in a worker), and a thin renderer on top. Chat bubbles use templated phrase banks tagged by stance and tone; the satirical voice lives in those and in the UI copy.

## Prototype 0

Goal: answer one question: **is watching perceived consensus diverge from reality compelling?**

In scope:
- One map, ~60 agents, 3 neighborhoods, 3 hero citizens
- Opinion / perceived-norm / silence model
- Two tools: bot discussions and fake article
- Day-tick loop, 14 days, the two bars, silence ripple
- End screen with a rough bot-free distribution

Out of scope: video, review bombing, Field Guide, the exposure phase and the defender epilogue, audio, campaigns 2-5, real-world movement (static positions first).

## Later milestones

1. Review bombing + real-world layer (campaign 2)
2. Fake news layering and citation laundering (campaign 3)
3. Exposure phase and defender epilogue (short version first, then the stealth variant)
4. Faceless and fake video, liar's dividend (campaign 4)
5. Field Guide, then campaign 5
