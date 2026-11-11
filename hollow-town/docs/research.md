# Research: comparable games and evidence

Findings from the studio researcher pass (web search, Nov 2026). Sales and player numbers were mostly unavailable. Items marked *unverified* could not be confirmed.

## Comparable titles

| Title | What it is | Relevance |
|---|---|---|
| Bad News (2018, Cambridge/DROG) | Free browser game where you run a fake-news empire | Closest in premise (play the villain). Text and choice based, no simulation or aftermath. |
| Harmony Square (2020, Cambridge/DROG, US DHS/CISA) | Free browser game on political division in a fictional town | Same fictional-town setup, choice based. Strongest outcome study (n=681). |
| Go Viral! (Cambridge/DROG, Covid-19) | Short browser game on Covid misinformation | Same family. No separate effect study found. |
| Cranky Uncle (John Cook) | Cartoon game on science-denial techniques | Teaches rhetorical techniques. No outcome study found. |
| Fake It To Make It | Browser game where you write fake stories to make money | Villain framing. Evaluation not found. |
| Influence, Inc. (Curious Bird, 2022, Steam) | Commercial sim of an influence agency | Nearest commercial rival. About 15 Steam reviews (positive): a niche seller. |
| The Westport Independent (2016) | Censorship and newspaper-editing sim | Mostly Positive on 322 Steam reviews. PC Gamer faulted its lack of consequence. |
| Orwell (2016) | Surveillance game | PC Gamer scored it 78/100 but said it lacks the emotional impact of Papers, Please. |
| Social Warfare (Sanuk Games) | Troll-for-hire sim, Steam Next Fest demo Oct 2024, planned 2026 release | Newest direct competitor. |
| CRINGR (itch.io) | Jam-scale game where you play a disinformation bot | Minor; shows the theme is a jam staple. |
| Chaos Corp: Troll Farm Simulator | Lead from a 2025 newsletter (Philippine election) | *Unverified*: no Steam page found. |

## Evidence on whether these games work

- Bad News (Roozenbeek & van der Linden 2019, Palgrave Communications): moderate effect after about 15 minutes.
- Harmony Square: reduced perceived reliability of misinformation by about 16% and sharing intent by about 11% (Harvard Misinformation Review). Both studies come from the developers' own research group.
- Durability is weak: Maertens et al. 2021 found decay over about 2 months in one experiment and a stable effect in another.
- Traberg et al. 2024: protection is weaker against misinformation from political ingroup sources; negligible effect (d=0.11) on perceived reliability of true headlines.
- Criticism: Modirrousta-Galian & Higham (2023, JEPG) reanalyzed five studies with signal detection and argued the games produce skepticism (a conservative response bias), not better discernment. A 2026 preregistered Bad News replication found no significant change in discrimination. The inoculation group replied with a synthesis of 33 experiments. The debate is unresolved.
- Replayability: a 2025 arXiv paper notes choice-based formats limit replay.

## Gaps and differentiators

- Hollow Town models perceived norm, spiral of silence and social spread of detection. The browser games script a narrative; no comparable opinion model was seen in the commercial sims.
- Aftermath is shown through named citizens, ghost distributions of bot-free runs, and the defender epilogue.
- Built for game-literate players who want an inspectable simulation; the browser games target mass reach through short play.
- The thesis (liar's dividend, trust erosion) is rarely the centerpiece elsewhere.
- **Redundancy risk:** Influence, Inc. and Social Warfare cover the "play the manipulator" premise commercially, and Bad News and Harmony Square own the free educational slot. Differentiation must come from the simulation and the consequences, not the premise.

## Lessons for our design

1. **Measure discernment, not suspicion.** If we claim educational value, the Field Guide should train recognition of specific tells, not general distrust. Test with true and false items.
2. **Keep the tell pairing**, and have the end screen show how much of the player's success ran through ingroup trust, where inoculation evidence is weakest.
3. **The aftermath is the differentiator.** Westport was criticized for lacking consequence, so hero-citizen fates and ghost distributions must be in Prototype 0 or very early.
4. **Expect a small commercial niche.** Budget for a free web build for reach, and optionally a paid depth edition. Do not assume Steam alone will carry it.
5. **Replayability and durability need a plan.** Seeded, varied towns address replay; short repeat exposures are more plausible than one session for any lasting effect.
