# Narrative, tone and safety

Findings from the narrative and ethics review.

## Tone

- Satire is pointed at the operator's mindset (growth-hacker euphemism, KPI language) and at the machinery. **Never at victims.** The joke is on the player or the system; the consequence is never the joke.
- Jokes land in Read and Act. Watch and the end screen go quiet, and the narrator's snark drops whenever a hero citizen is hit.
- Winning must feel hollow. Success banners are faintly wrong ("Engagement is up. Why is no one talking to each other?"). Avoid both a "congrats!" screen and a flat "you are bad" screen.
- References for the register: Papers, Please (complicity through mundane procedure), Cultist Simulator and Frostpunk (grim choices, no winking), Universal Paperclips and Cookie Clicker's grandmapocalypse (numbers going up becomes horror), Dr. Strangelove and Thank You for Smoking (the villain is charming, the work isn't).

## Hero citizens

Rules: no heroes or villains among citizens, ordinary flaws, one concrete detail each (an object, a habit). Harm is indirect and quiet (silence, withdrawal, a missed thing), not melodrama. **Vary the outcomes**: not everyone is silenced; some radicalize, some turn on a neighbor, one is fine.

| Name | Backstory | Hit by |
|---|---|---|
| Tom Aldous | Retired bus driver, posts weather and bus-route trivia | Pile-on after one off-message reply; silenced day 6 |
| Marguerite Osei | Retired teacher, long posts everyone reads | Fake articles cite her; she "corrects" real people with bad sources and loses trust |
| Dev Rangan | Newcomer, undecided, reads everything | Perceived-norm pressure; picks the "majority" and never knows it was staged |
| Lorna Pike | Runs the café, hosts meetups | Review bomb; closes, regulars scatter |
| Yusuf Demir | Teen, makes small videos | Faceless channels crowd him out; he stops believing any video |
| Hal Brenner | Widower, joins groups for company | Astroturf group becomes his only community; the one who gets radicalized |
| Priya Venn | Local reporter, one-person paper | Called a bot after the exposure phase; her real reporting is dismissed |
| Beth Calloway | Nurse, no time, skims | Never sees the correction; shares the fake in good faith |
| Otis Marsh | Author of the local history book | Review-bombed and "debunked" by a laundered article |
| Ines Duarte | Parent, skeptical, high literacy | Catches the tells and is called paranoid by neighbors: the one who is right and pays for it |

End-screen lines show each citizen's last true action, never anything death-adjacent. Never imply suicide or violence. Example: *"Last post: a photo of route 9 in the rain. 40 views."*

Avoid names that code to ethnicity in a stereotyped way, avoid a single group as victim or perpetrator, and avoid copying recognizable real incidents.

## Campaign arc adjustments

- Rename **The Whistleblower** to **The Audit** (or The Inspector's Report): the report is accurate, not a leak, and the name avoids implying real whistleblower cases.
- Seed the thesis earlier: in campaign 2 or 3, have one real report called fake as a throwaway, so campaign 4 pays off.
- Campaign 4 changes the verb. The player doesn't lie about a true report; they flood doubt ("disputed", "everyone has an agenda"). The win condition is trust in *all* sources falling, not belief in a specific lie, and the cost is visible: the operator's own genuine-looking claims stop working too.
- Campaign 5: the detection cascade should hurt the player with the same hysteria they created, not a clean "caught" screen.
- Add a **campaign 0 tutorial from the defender's chair** (~30 seconds) so players know what normal looks like.

## Fictional-world design

- Fictional town, fictional region, invented political labels. No left/right, no red/blue, no party colors, and a neutral opinion palette.
- Hyperlocal, low-identity-stakes issues: zoning of a parking structure, a bridge toll, library hours, a river-front development, a school bus route. Avoid immigration, policing, religion, vaccines, abortion, climate, gender, or anything that maps to a real-world side.
- Make both sides of each issue sympathetic, and have both sides use bots in some campaigns (or one campaign where the player is the "reasonable" side that cheats). This blocks a partisan reading.
- Astroturf talking points should be absurd and local (goose parking), not ideological.
- Don't use "fake news" in-world as a partisan slur. Use "junk" or "slop".

## Safety guardrails

**Main risks:** (1) optimal-playbook leakage, (2) teaching cynicism, (3) the ghost distribution implying bots are weak. Real operators already know the tactics; the new risk is a tuned simulation that rewards an optimal sequence and becomes a strategy guide.

- No platform names, no real tooling. Do **not** model evasion techniques that map to real detection (fingerprint dodging, IP rotation). Credibility and account age stay abstract.
- Hiding one tell must expose another (a tradeoff, no dominant strategy). Pair Heat and tells with the Field Guide on the same screen. Teach patterns, not signatures.
- Pile-ons and harassment render as silence and withdrawal, never as harassment text the player can write. Harasser bubbles stay bland.
- **Cynicism counter:** end every campaign with what *still worked*: a named verification act that rebuilt trust (a neighbor who checked the source, a correction that reached someone). The goal of the attack is the cynicism; the game must not be the cynic.
- Hal's arc must never be played for sympathy toward the group.
- The ghost distribution must not read as "your effort was futile". The town-damage number is the headline.
- Opening screen states that you play the antagonist. Add a content note, a "what's real" summary, and an **educator mode** that hides the optimization loop.

## Sample copy

UI / narrator:

1. "Day 3. Your followers are at record highs. None of them have met."
2. "Credibility: 62. Earned the old-fashioned way, by waiting."
3. "Heat is not guilt. It's attention."
4. "Phrase reuse detected. Consider a thesaurus."
5. "The Café has closed. Reviews called it 'unwelcoming'. It was."
6. "Perceived consensus: 71%. Actual: 38%. Nobody has noticed. Congratulations."
7. "Maintaining trust is hard. Spending it is easy. Please spend responsibly."
8. "Priya Venn has been called a bot. She is not. This is the product working."
9. "Turnout down 9%. Quiet towns are easy to govern."
10. "You didn't win. You just made everyone else smaller."

Chat bubbles:

- Bot: "Honestly, everybody agrees now."
- Bot: "Wake up, this is obvious."
- Bot: "Just asking questions here."
- Real: "Wait, didn't you say the opposite?"
- Real: "My neighbor says it's fine."
- Real: "Hm. Source anyone?"
