# Asset generation manifest

Use this as a prompt inventory and handoff contract. No assets have been generated for this expanded title. Asset IDs refer to logical deliverables; variations and animation parts are separate files beneath each ID.

## Shared contract before generation

Use the [series UI specification and SHUI asset IDs](../shared-ui/README.md). Bubble inventory frames, standard controls, subtitle panels, and UI sounds are generated once for the series and reused here. This title owns its item icons, map content, clue cards, and Ready action. The UI-CONTROLS row below is an integration checklist, not permission to generate another UI skin.

First choose one of the [series art directions](../art/README.md), approve a duo model sheet, and lock palette, costume, scale, and camera. For planning, use the textured cutout direction as a provisional candidate, not an approved final style. Do not let independent agents choose different styles. Existing flattened examples are references, not layered production assets.

Proposed production canvas: 1920×1080, fixed three-quarter side view, with a clear bottom 180-pixel inventory zone. Keep indispensable interactions above that zone. Export backgrounds at canvas size; export props as tight transparent PNGs with recorded canvas positions and pivot coordinates. Author character masters large enough for close-ups, then test the shrimp's readability at actual screen size. Use consistent relative scale; dialogue portraits can enlarge him independently.

Every delivered package needs: source prompt, reference filenames, asset ID, variant ID if applicable, dimensions, placement/pivot, state, transparent/opaque designation, and preview composite. No UI labels or puzzle symbols baked into generative backgrounds; add consistent symbols as authored overlays. Generated outputs require review and cleanup for silhouettes, joints, text artifacts, and exact state alignment.

### Reusable prompt templates

**Background:** “Create [scene description from table], matching the approved style and palette reference. Fixed three-quarter side view, 16:9 children's point-and-click adventure, friendly dusk, clear silhouettes and broad navigation areas. Preserve [specified character/prop zones]. Clean environment plate without characters, collectible objects, UI, written text, or interactive mechanisms that need separate states. Leave bottom inventory area visually quiet.”

**Prop:** “Create [subject and required state], matching approved reference and fixed scene camera. One clearly readable object, generous silhouette, suitable for ages 4–8. Transparent background, no text, no cast baked-in scenery. Match the approved master exactly across listed alternate states.”

**Character:** “Create [role/species/outfit from approved model sheet], [pose/expression], matching approved proportions, palette, and camera. Transparent background. Keep identity and costume identical across poses; separate animation parts with generous joint overlap.”

Use these templates with the exact row subjects below. Backgrounds must not include required pickups; otherwise taking an item would leave a duplicate painted into the scenery. Static landmarks may remain baked in unless their state changes.

## Background and scene-layer work packages

| Package / IDs | Prompt subjects and framing | Separate state/foreground layers required |
| --- | --- | --- |
| BG-S01 | Small home ship left, broad jetty center, distant lighthouse right, overhead festival line; match S01 composition. | Ship lantern unlit/lit; lighthouse beam dark/turning; finale flotilla; water foreground masks. |
| BG-S02 | Harbor market semicircle, anchor center, low gull awning, three distinct exits. | Nest/chart exchange; toolbox; festival waiting/celebration decoration overlays. Chart/offcut remain separate props. |
| BG-S03 | Open repair shed, horn staging center, tray left, spare rack right. | Horn body, hose loose/attached, horn puff, tray and rack foreground occlusion. |
| BG-S04 | Sheltered craft stall, rinse basin, broad drying rack, harbor beyond. | Dye controls and recipes, wet screen rack mount, basket foreground. Collectibles separate. |
| BG-S05 | Calm buoy channel with three navigable rows and distant lighthouse. | Ship, buoy shape set, row positions for V03-A/B, selected-route markers. Reuse ship master. |
| BG-S06 | Stone lighthouse landing, door left, rack and cove path right, ship exit lower left. | Door ajar/open, drain foreground mask, broom interior view, lamp pedestal, moored seal boat, patch rack mask. |
| BG-S07 | Cove workshop with supported sailboat left, low workbench center, batten rack right. | Sail torn/patched, rack front. Patch and batten separate. |
| BG-S08 | Cozy circular keeper room, stairs right, outside door left, chair and laundry basket center. | Towel rail mask, sucker-print clue, rug/den placement guide if needed. |
| BG-S09 | Stopped lighthouse wheel left-center, two service slots below, clear den floor right, two exits. | Wheel static/turning, bunting tangled/loose/removed, dark slot masks, left/right toy reveals, thread reveal, crank, switch disconnected/ready/on, den and octopus overlays. |
| BG-S10 | Enclosed balcony, distant wreck left, card right, fixed telescope center. | Signal card A/B, telescope close-up, wreck flashes A/B, worker silhouette/polishing/rowing/absent. |
| OVERLAY-S11 | Seal's modest rowboat carrying reflector and equipment basket, matching S06 docking perspective. | Boat, basket, reflector/glint, takeable lamp, water occlusion. No new background. |
| OVERLAY-S12 | Warm floating paper lanterns and harbor party decorations matched to S01/S02. | Flotilla, restored beam, party cast placements, den/octopus. Reuse approved props and characters. |

## Collectible and usable item prompts

Each PROP-I ID needs both an in-world transparent sprite and a matching inventory icon. Keep silhouette/color consistent between them; produce UI icons from approved masters rather than regenerating unrelated versions.

| ID | Exact prompt subject | States, origins, targets |
| --- | --- | --- |
| PROP-I01 | Soft broad cloth offcut, rounded irregular edge, pale peach, distinct from long striped bunting and blue towel. | Folded pickup; gull nest lining. S03 or S04 → S02. |
| PROP-I02 | Oversized parchment picture chart with three empty symbol spaces and a lighthouse illustration. | Add authored circle/triangle/star overlays for V03-A/B. Nest pickup and permanent map reference. |
| PROP-I03 | Oversized rounded brass hose clamp, visible clasp, no sharp points. | Open pickup / closed on hose. S02 or S03 → S03. |
| PROP-I04 | Crescent-shaped cream sail patch with bold blue stitching, broad recognizable silhouette. | Loose pickup / sewn onto sail. S04 or S06 → S07. |
| PROP-I05 | Thin smooth wooden batten with rounded ends, visibly long enough to reach beneath door. | Rack / carried / slid under door / leaning beside opened door. S07 → S06. |
| PROP-I06 | Handheld rectangular translucent cloth signal screen with chunky wooden frame. | Undyed, orange with sun tag, green with leaf tag, muddy; same geometry. S04 → S06 lamp. |
| PROP-I07 | Little rounded inspection lamp with large handle and warm light, visually distinct from fixed signal lamp. | Unlit / lit, held by captain / set down. S11 → S09. Light cone separate. |
| PROP-I08 | Soft shell-shaped comfort toy with stitched smile and broad scalloped edge. | Left/right slot pickup, inventory, inside den. One master at different placements. |
| PROP-I09 | Wide squat wooden bucket, smooth rim, large enough for young octopus, friendly and clean. | Empty / towel-lined; preserve opening perspective. S06 → den assembly. |
| PROP-I10 | Soft blue folded towel with simple wave border. | Folded on rail / draped inside bucket. S08 → den assembly. |
| PROP-I11 | Assembled bucket den using exact I09 and I10 masters. | Empty lined den / toy inside / octopus settled with toy. Compose layers; do not invent a new bucket. |

## Character sheets and action prompts

All characters need front/three-quarter reference, consistent proportions, palette swatches, neutral silhouette, and expression sheet before poses. Reuse poses across scenes. Keep outfits unspecified until the series model sheet is approved.

| ID | Subject | Required poses and expressions |
| --- | --- | --- |
| CHAR-CAPTAIN | Female capybara pirate captain, large calm silhouette, kind observant face. | Idle, talk, walk, inspect, point left/right, hold batten, push steadily, hold lamp left/right, carry bucket, turn crank, gather fabric, celebrate. |
| CHAR-SHRIMP | Tiny enthusiastic shrimp first mate, expressive antennae, proud posture. | Idle, talk, scuttle, salute, worried/curious/delighted, point left/right, enter/exit low drain and both slots, guide batten, carry toy. |
| CHAR-KEEPER | Patient turtle lighthouse keeper. | Talk, point at horn/chart, wait at landing, disconnect/check mechanism, watch octopus, celebrate. |
| CHAR-COORDINATOR | Pelican festival coordinator with approachable broad silhouette. | Talk, explain delay, invite launch, celebrate. |
| CHAR-GULL | Gull in low nest, fussy about comfort but helpful. | Talk, hold chart, accept cloth, line nest, deliver chart. |
| CHAR-HOST | Sea-otter craft host. | Talk, demonstrate recipe/rinse, point at rack. |
| CHAR-BUILDER | Crab boatbuilder with broad readable claws. | Talk, indicate torn sail, accept patch, hand over batten, admire repair. |
| CHAR-SEAL | Seal salvage worker, matching telescope silhouette and landing appearance. | Polish reflector, row, talk, offer lamp, celebrate. |
| CHAR-OCTOPUS | Small young octopus, shy and soft, compatible size with bucket master. | Eyes/tentacle behind wheel, hold bunting, reach/retreat, crawl out, settle with toy, sleepy/happy. Avoid scary facial expressions. |

For the duo, export blink and small mouth-shape sets, separate arms/hands and leg parts, and replacement drawings for overlap-heavy cooperative actions. Do not ask a single image generation to produce an entire finished sprite sheet; approve consistent poses and assemble/clean them deliberately.

## UI, clues, effects, and audio briefs

| ID | Prompt or authoring subject | Required coverage |
| --- | --- | --- |
| UI-MAP | Illustrated harbor/lighthouse travel map with prominent destination icons. | Locked/unlocked destinations, chart access, active goal picture, saved signal color/symbol reminder. Author labels separately. |
| UI-CHART-A/B | Three ordered large pictograms on I02 master. | Circle-triangle-star / star-circle-triangle; same matching buoy masters. |
| UI-SIGNAL-A/B | Large picture landing card and matching recipe pictures. | Two long flashes → orange sun → red+yellow; three short → green leaf → blue+yellow. Author timing/symbol layout consistently. |
| UI-CONTROLS | Integrate shared SHUI inventory bubbles, selection states, hint shell, map/menu, replay, and subtitle assets. Supply scene exit arrows and the story-specific Ready icon in the shared style. | Reuse shared control states and layout; symbols readable without text. |
| FX-LIGHT | Lighthouse beam, inspection light cone, reflector glint, signal lamp glow, wreck flash. | Warm non-scary lighting; exact flash timings authored in game; no rapid strobe. |
| FX-WORLD | Small water loops, lantern sway, horn puff, rinse splash, restart glow. | Separate overlays with stable origins and no essential clue hidden by effects. |
| AUDIO-VO | Spoken story, requests, pickups, wrong-use feedback, three hint levels, finale. | Key lines by puzzle/substep/variant/language. Record actual location, shape, and color alternatives from matrix; do not use one misleading generic hint. |
| AUDIO-SFX | Gentle sea/market ambience, wheezing/repaired horn, ship travel, cloth, clamp click, broom slide, bucket, crank, soft machinery, octopus squeak, festival cheer. | Separate loops and one-shots, comfortable levels, no scary impact cue. |
| AUDIO-MUSIC | Gentle harbor theme, curious island theme, warm resolution theme. | Seamless loops and short transition stings; no urgent countdown feeling. |

Optional click jokes in scenes.md form a second-pass package: fish jump, snail salute, spoon chimes, paper fish dance, cork crab, limpet salute, wooden ducks, teapot, toy vane, mustached gull. They must not look like required inventory items. Prompt them only after essential readability is established.

## Parallel work handoffs for later agents

1. **Visual lead:** choose/approve references, duo and supporting cast model sheets, bucket/octopus fit, symbol masters, scale chart, and one composite S06. All other packages depend on this approval.
2. **Harbor environments:** BG-S01–S04 plus finale overlays; consume shared prop/character masters rather than redrawing them.
3. **Island environments:** BG-S06–S10 and OVERLAY-S11; align wheel, service slots, den, and toy placements to both V06 alternatives.
4. **Items and UI:** PROP-I01–I11, map, chart, cards, and controls. Supply shared masters to environment packages; include both signal variants.
5. **Character production:** approved sheets into listed poses and parts; cooperation composites checked against S06/S09 geometry.
6. **Travel, effects, and audio:** BG-S05, effect loops, music/SFX, variant-keyed voice script/recordings. Use approved buoy and ship masters.

Each task should receive this manifest, its relevant scene cards, the puzzle matrix, approved reference files, and an explicit list of asset IDs it owns. Agents may propose changes but should not silently rename IDs, invent costume details, move exits, or alter a clue. Review complete scene composites at gameplay scale before accepting a package. Background, prop, UI, and voice variants must agree before a variant is enabled.
