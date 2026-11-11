# Hollow Town (working title)

A small simulation game about how bots and AI-generated content reshape what people believe, and how that spills into the real world.

## Premise

Watch a small town of ~150 people argue about a local issue (e.g. a new housing development) in the run-up to an election. The game shows two layers at once:

- **Feed layer (top):** vector circles are citizens, lines are social ties, speech/chat bubbles carry posts and replies.
- **Real-world layer (bottom):** simple shapes for houses, a café, a town hall. Citizens physically move between them, meet, talk, and eventually vote.

The point of the game is the **gap between the two layers**: what people see online vs. what the town actually believes.

Design note: research on influence operations suggests bots rarely change minds directly. They mostly shape *what people think everyone else thinks*, drown out dissent, and erode trust. The simulation models those mechanisms rather than "bot posts, voter flips".

## Core simulation

Each citizen has:

- **Opinion** (a color on a spectrum)
- **Susceptibility** (how much they are swayed by perceived consensus)
- **Trust** (in neighbors, in the feed, in institutions)
- **Willingness to speak** (spiral of silence: people who feel like a minority stop posting)
- **Attention** (limited, so volume wins)

Bots are **triangles disguised as circles**. An "X-ray" toggle reveals them.

## Structure

**Operator mode is the game.** The player runs the bot network, which teaches the playbook from the inside (cf. inoculation games like *Bad News* / *Harmony Square*). The defender perspective is the payoff, not a mode to win:

- After each run, a **ghost replay** shows the same town without bots.
- A **Field Guide** replays the campaign from a citizen's point of view, showing what they saw and where they could have caught it.
- Losing as a defender is the lesson: the always-losing defender role is the reveal, not a design flaw.

Tools stay abstract and stylized (no real platforms, no real tooling), and every tactic is paired with its **tell**.

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

Also: *Seed* (create and age accounts so they look credible), *Amplify* (boost real posts that already help your side), *Flood* (drown a topic in noise).

## Interactions

- **Layering:** a fake article is cited by bot discussions, then summarized by a faceless video. Each layer boosts the previous one's credibility. Chains give a big multiplier but are fragile: one exposed node can unravel the rest.
- **Review bombing in the real world:** hit the café that hosts the opposition's meetups and watch it empty and close, so the opposition loses a place to meet.
- **Heat:** every action adds suspicion. Reusing the same tell (e.g. posting at the same times) raises detection chance. Players must vary tactics, which teaches what variety looks like from outside.
- **Audience matching:** different citizens consume different channels (older neighbors: articles and group posts; younger: video). Targeting is part of the strategy.

## Key visuals

- **Perceived vs. actual opinion:** two live bars. Healthy town: they match. As bots work, perceived consensus drifts from reality.
- **Silence ripple:** real dissenters' bubbles shrink and fade as they stop posting while the bot chorus gets louder.
- **Real-world fallout:** neighbors stop talking, turnout drops, the café empties.
- **Election night:** result plays out next to the bot-free ghost replay.

## The twist: the liar's dividend

Late in the game, once trust is poisoned, *real* posts get dismissed as fake ("that's just a bot"). The lasting damage isn't one swung vote but a town where nobody believes anything.

## Scoring

- Votes swayed vs. the ghost replay
- **Trust lost** in the town (permanent damage even if the vote is lost)
- Real people silenced, businesses closed
- **Detectability score**, and which tells citizens actually caught

## Tech

Plain HTML canvas + JS (or Svelte/Pixi), agent-based model with a simple force-directed graph. Chat bubbles use templated phrase banks tagged by stance and tone.

## Build order

1. Citizen model + perceived vs. actual opinion bars (the heart of it)
2. Three channels first: bot discussions, fake articles, review bombing
3. Ghost replay + election night
4. Faceless video and fake video as an unlock tier
5. Field Guide reveal screen

First playable: one issue, one map, operator mode, ~5 minutes per run, ending in the ghost replay.
