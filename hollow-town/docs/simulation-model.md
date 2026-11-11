# Simulation model

Proposed rules from the studio systems-design review. Keep everything simple enough to tune by feel, and verify with the headless balance harness before building any rendering.

## Opinion update (Friedkin-Johnsen with bounded confidence)

Per agent `i` each tick:

```
o_i <- (1 - lambda_i) * o_i0 + lambda_i * [ (1 - alpha) * o_i + alpha * (sum_j w_ij * o_j) / (sum_j w_ij) ]
w_ij = trust_ij * recency * 1[ |o_i - o_j| < epsilon_i ]
```

- `o_i0` is the agent's prior opinion (the anchor, so nobody drifts without limit).
- Starting values: epsilon about 0.3-0.4, step size about 0.1-0.2, anchor weight (1 - lambda) about 0.3-0.5.
- Only low-confidence agents lean on the perceived norm. For confident agents the norm effect shrinks.

## Perceived norm

`N_i = sum of seen posts weighted by trust * recency`, with a **visibility bias**: loud posters are overrepresented. This is the realistic version and the one bots exploit.

## Willingness to speak (spiral of silence)

```
P(speak) = sigmoid( k * ( c_i - gamma * max(0, |o_i - N_i| - theta) ) )
```

Use a **hardcore floor**: about 10% of agents have a speaking probability that cannot drop below 0.5 (Noelle-Neumann's hard core). Without it, silencing is a runaway loop: silence removes dissent from the feed, which pushes the norm further, which silences more.

## Turnout and vote

`P(vote) = base + beta * engagement - delta * (1 - trust)`. Opinion maps to the vote deterministically, but abstention is where the effect size lives.

## Trust

`trust_feed <- trust_feed - a * tells_noticed + b * verified_true_posts`, with a slow recovery rate so the exposure phase has a floor to hit.

## Resources

- **Credibility** is an account-level asset (age, diversity of behavior). It decides which tells fire.
- **Heat** is a content-level hazard, tracked per tell type. It decides detection probability.
- This merges what the concept originally treated as overlapping resources. Credibility needs a recovery rule so one bad early day cannot end a run.

## Costs that keep tactics varied

- Per-channel fatigue: effectiveness x `(1 - 0.2 * uses_in_last_3_days)`.
- Chain risk: exposure of a whole chain is about `1 - product(1 - h_k)`, so it grows with chain length. Layering is a multiplier but a fragile one.
- Audience matching: each channel only reaches a subset of citizens.
- Pile-ons are the strongest tool with the spiral loop and nearly free in Heat, so they need a real cost (their own tells and a backlash term).

## Liar's dividend as a mechanism

`P(dismiss real post) = base + kappa * global_suspicion * (1 - literacy_i)`. A dismissed real post does not shift norms. Track it as a separate counter so it can be charted; otherwise it looks like a trust slider falling.

## Defender epilogue as a system

The same sim with a controller swapped. A false-positive removal deletes a real node and adds `+delta` anger to that node's neighbors, which gives "every false positive hurts a real person" for free. The exposure phase needs agency-bearing events for the player, otherwise it is several days of watching a trust bar fall.

## Tuning targets

- Per-run effect about 3-6 points of vote share, with RNG standard deviation about 3-4 points.
- Tune the town so bot-free vote share sits near 50% in most seeds; otherwise bots never matter.
- Run about 5,000 headless batch runs per parameter set, with paired seeds (with and without bots).

## Ghost-run distribution: pitfalls

- Use **common random numbers**: draw randomness from per-agent / per-subsystem streams, not one global stream, so an extra bot action does not shift every later draw.
- With a small effect size and 60 agents, 200 runs gives a wide, flat distribution. Report the effect size and confidence, not just a headline like "78% of bot-free versions fail", which can be noise.
- The end screen must not imply "your effort was futile". The town-damage number is the real result.

## Metrics for Prototype 0

- Mean and variance of the effect size (vote share delta) across paired seeds.
- Win flip rate as a function of bot-free margin: a smooth sigmoid, near 50% flip at zero margin, near 0% beyond 10 points.
- Perceived-vs-actual gap over time, and its maximum.
- Cluster count and opinion variance at day 14 (catches freezing and polarization collapse).
- Fraction of agents silent at day 7 and day 14.
- Strategy diversity: win rate of "bot discussions only" vs "article only" vs a mix. If any single strategy is above 80% of the best, tactic variety is not needed.
- Seed sensitivity: rerun the same seed twice, and with a trivially different action, to confirm determinism and detect chaotic divergence.
- Dominant-play check: random-policy vs greedy vs simple heuristic, to see whether the sim rewards thinking at all.
