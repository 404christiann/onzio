# Rehearsal: the admin tour

`AdminTour` (`admin-tour.tsx`) is the homepage's product demo: Rose City FC's Onzio admin beside its public site, in four chapters on one persistent stage.

## Sources

- **Story and pacing:** the Rose City editor ad (`onzio-rose-city-editor-v1`, render r8). One action per beat, a visible cursor, real typing, a save, the site changing next to the editor. Taps about 1 s apart, 83 ms a character, 900 ms glides, the 117 ms swap and 167 ms lime highlight wipe on the site. Copied as timings, not code.
- **Admin screens:** rebuilt from onzio-platform's classic admin markup: `AdminShell`, `AdminPage`, `PageFrame`, `PageSaveButton`, `HomepageOverview`, `EditorDialog`, `CinematicEditorKit`, `AdminSwitch`, `ClassicRosterPage`, `ScheduleMatchList`, the Add match form, the Insights `SiteTraffic` card and the Dashboard `MetricCard`. Icons are the admin's own (`admin-icons.tsx`).
- **Site:** captures of rosecityfutbolclub.com's public pages (`public/images/rose-city/`). The changed text is an overlay on the capture. The roster cards are markup in the club's card style, because the real roster shows real players.

## Chapters

| Chapter | Beats | Length |
|---|---|---|
| Edit the homepage | Part 3 opens the Next home match sheet, Heading becomes "Pack the stands", Done, Save, Saved; the site and the admin preview swap the heading under a lime wipe | 12.0 s |
| Update the roster | Edit Sam Example, jersey 14 becomes 9, Save player, Saved; the row and the site card roll to 9 | 11.0 s |
| Add a match | Add match, date April 10 from the calendar, opponent "Example United", venue "Championship Stadium", Save changes; the match slides into the list and onto the public schedule | 13.5 s |
| Read the numbers | Time range to November 2026; page views, visitor-days and paid registrations count up, the daily bars grow in | 9.5 s |

## Behavior

- One stage, never remounted. State changes only at beats; tweens are CSS transitions on transform and opacity.
- Autoplay starts once 60 % of the stage is in view. It pauses while a mouse is over it, while anything inside has focus, off screen and in a hidden tab. A tab click plays that chapter even while paused, then holds.
- Reduced motion: no autoplay and no movement. Each tab shows its chapter's result as a still; screens still cross-fade.
- Below 680 px: one device at a time. The admin, in its phone layout, plays the beats, then fades to the site phone for the result.
- The box's height is CSS (`aspect-ratio` per breakpoint), so measuring the scale never shifts the page.

## Assumptions

- Chapter 4 composes two real components the admin shows on different pages: Insights' "Your website in …" card and the Dashboard's "Paid registrations" card. Rose City's own admin hides Registrations.
- All names, emails and numbers are made up and captioned as such. The fixtures beside the new match are Rose City's public results.

## Not checked

Real touch devices, Safari and Firefox (headless Chrome only).
