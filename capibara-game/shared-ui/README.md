# Shared UI for the Capibara games

Series-wide design specification. Every title uses the same inventory, controls, interaction rules, and UI assets. The reference is the familiar bottom-of-screen inventory approach requested for the series, with a friendly bubble-like presentation. This is a proposed original design, not a reproduction of another game's artwork. UI assets and implementation do not exist yet.

## Persistent bottom inventory

A row of softly rounded, translucent sea-glass bubbles sits near the bottom of the screen. Each bubble holds one large item illustration. A quiet curved backing keeps items readable over different backgrounds. The visual language fits the harbor adventures while remaining usable in every title and location.

For the proposed 1920×1080 canvas, reserve the bottom 180 pixels for this shared UI. Scene exits, essential clues, and puzzle targets must sit above it. Scale the whole layout to the available viewport and respect device safe areas. This reserved space belongs to the UI, not the painted scene.

Place the map button at the left, item bubbles across the center, and the hint shell and menu controls at the right. Keep these positions consistent between games. Subtitles appear immediately above the inventory in their own readable band; background compositions must leave that area free of essential clues as well.

Start with six visible item bubbles. If a title needs more carried items, show large previous/next arrows and a page indicator; never silently discard items, shrink them to unreadable sizes, or require precise swiping. Keep inventory order stable after pickup, fill available slots, and reveal the page containing a newly collected item. Final slot count and dimensions need testing at actual touch size.

## One interaction language

- Click or tap a world item to inspect or collect it. Collected items visibly travel into their bubble and receive a short spoken identification.
- Click or tap an inventory bubble to select its item. Show a clear outline and raised bubble shape, so selection does not depend only on color. Speak the item name on selection.
- Click or tap a scene target to use the selected item. The appropriate hero acts automatically. Dragging is optional convenience, never required.
- Click the selected bubble again, press Escape, or use a visible cancel control to clear selection. Selecting a different bubble changes the active item.
- To combine items, select one bubble and then the other. Valid combinations show both objects becoming the result; invalid combinations keep both and give friendly feedback.
- Wrong uses never consume essential objects. After a failed use, keep the item selected so the child can try another target. Clear selection after a successful use, including use of a reusable item.
- Opening the map, menu, or changing scenes clears active selection while preserving inventory. A scene exit remains a travel action even when an item is selected.

During a short scripted action, keep the inventory visible but temporarily inactive with clear feedback. Restore input as soon as the action ends. Opening a menu pauses interaction. Never make a clue or inventory state depend on clicking during dialogue or animation.

## Shared controls

**Map:** opens the title's illustrated travel map inside the same frame. Destinations and unlocked routes vary by story. Charts and remembered picture clues have a consistent reference area, separate from usable inventory objects.

**Hint shell:** speaks a hint for the current puzzle substep. Further requests provide more detail, ending in an explicit suggestion. The control and behavior stay the same; each title supplies its own goal, clue, and variant-aware hints.

**Speech replay:** a consistent speech icon repeats the most recent relevant line. Subtitles, voice, music, and effects have independent settings where applicable. Spoken clues must also have a visual equivalent.

**Menu:** resume, sound/subtitle settings, and return to title. New game and actions that replace progress require an explicit choice. Autosave feedback uses a small consistent icon without blocking play.

Keyboard focus must be visible and able to reach items, controls, exits, and scene targets. Touch targets must be comfortably large. Do not rely on hover, color, sound, or written instructions alone. Respect reduced-motion preferences for bubble movement and pickup effects.

## Ownership across titles

The series owns the UI layout, interaction code, bubble frames, control icons, focus/selection states, fonts, subtitle treatment, and UI sounds. Titles provide item illustrations and names, map destinations, remembered clues, puzzle hints, and story-specific buttons such as the festival's Ready action. A title must not generate a replacement inventory frame or change the location of standard controls.

Ship one shared UI package with configurable story data. Save each title's inventory, references, and puzzle state separately. A shared UI does not mean that items carry over between adventures.

## Shared asset prompt inventory

Generate these once after choosing the series art direction. Use stable IDs across every title. Match the approved palette and cutout treatment; keep text and item pictures out of frame masters. Deliver transparent PNGs plus editable/vector sources where practical, state names, dimensions, pivots, and nine-slice margins if used. Author exact icon geometry consistently rather than accepting unrelated generated versions.

| ID | Prompt subject | Required states |
| --- | --- | --- |
| SHUI-BAR | Quiet curved sea-glass backing for a bottom inventory, readable against light and dark scenes. | Standard and compact layout, scalable edges. |
| SHUI-BUBBLE | Broad rounded translucent inventory bubble, soft outline, spacious empty center for an item. | Empty, occupied, selected, keyboard focus, pressed, temporarily inactive; outline and shape distinguish selection. |
| SHUI-PAGING | Large friendly previous/next arrows and pictorial page indicator. | Available, focused, pressed, unavailable. |
| SHUI-MAP | Simple folded chart control icon inside the shared button frame. | Normal, focused, pressed, unavailable before travel introduction. |
| SHUI-HINT | Friendly shell hint control, recognizable at small size. | Normal, focused, pressed. |
| SHUI-MENU | Simple menu control and matching close/back/cancel controls. | Normal, focused, pressed. |
| SHUI-SPEECH | Speech replay icon and readable subtitle panel. | Available, focused, pressed; panel scales with localized text. |
| SHUI-REFERENCE | Shared map/reference overlay frame with large clue-card area and close control. | Destination available/unavailable/current; clue selected. Story pictures supplied separately. |
| SHUI-SAVE | Small unobtrusive autosave indicator. | Saving and complete; reduced-motion alternative. |
| SHUI-SOUNDS | Soft pickup, selection, cancel, page-change, and successful-use sounds. | Distinct gentle cues; visual feedback accompanies each. |

Validate the shared package with one light scene, one dark scene, six items, overflow pages, a long localized subtitle, mouse, keyboard, and touch before producing title-specific UI content. Future asset agents should consume the approved shared masters rather than reinterpret this document independently.
