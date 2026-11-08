# Rehearsal: Onzio homepage demos

Filmed with the Stageshow skill's `film.mjs --gate` on the production build. Widths 1280 and 390 for `HeroDemo`, on the page itself; the other demos were filmed earlier on a temporary route, since removed, because the staff tabs need a click the film tool cannot make. Light theme only; the site has no dark mode.

| Demo | Section | Gold | Beats |
|---|---|---|---|
| `HeroDemo` | Hero (and the Club sites nav link) | `device-pair` | Type an announcement, Publish confirms on itself, the bar opens on the real site capture; then tap About and Programs and the site scrolls to each; comes home and holds |
| `WebsiteDemo` | Staff tools | `form-error` | Publish in the row, the badge settles, a toast names the result |
| `SeasonDemo` | Staff tools | `table-edit` | Enter 3-1, save, Diverse City FC moves to first |
| `StaffDemo` | Staff tools | `share` | Type an email, it becomes a chip, Invite, the person lands at the top of the list |
| `AnalyticsDemo` | Staff tools | `chart-scrub` | Scrub the season, the headline reads out each match |
| `ClubPlans` | Pricing | `stacked-cards` | Three plans; the academy's and league's add-ons fill in, counts roll |
| FAQ pictures | FAQ | `static-card` | Stills |
| `InquiryPhone` | Contact | `device-pair` | Sent card, connector, notification |

All play once and hold their result; no loops, so nothing competes on a long page. `HeroDemo` is one stage per chapter, so film reports up to four stages for one tour.

## Film lines that stand

- `kit override` (six on every stage): false positive. The check reads every stylesheet, and Next bundles the kit's own CSS, so it flags the kit's phone rules as the demo's. No demo CSS touches those selectors. This alone keeps `--gate` from reporting `rehearsal passed`.
- Hydration `incomplete`: film injects `data-ss-verification-stage` before hydration. The page shows no console errors without film.
- `HeroDemo` compact, `div.ss-window shows 326x556, narrower than tall`: deliberate. The box runs on behind the phone; what shows is the top 216px of a normal window, with the site's headline above the phone.
- `HeroDemo` wide, window `off center` and phone `14px from the right edge`: deliberate. Window and phone share one 14px gutter as a device pair; film reads the window alone.
- `HeroDemo`, `jump` on Field text at a page tap: the field changes with its page; the kit's Field takes a string, so it cannot roll.
- `HeroDemo`, `hard edge` on the capture: a page scrolling inside its window, cut by the window as a real page is.
- `InquiryPhone` wide, phone off center: deliberate. Card and phone are two columns on one gutter, and centering the phone would put the card over it.
- `InquiryPhone` compact, notification time at 8.2px: iOS's true proportion on a phone sized to fit the column.
- `jump`, `settle snap`, `steps in its box` on Field text: per-character typing and the chip commit, both kit behavior.

## Review

An independent reviewer's findings, all acted on except:

- The four staff demos share one window composition. Kept: they are tabs of one workspace, shown one at a time, and the page wants one figure language.
- The caret before the placeholder on focus. Kept: that is how text fields behave.
- `HeroDemo` remounts its stage per chapter (`key`). Kept: each chapter's state carries over from the last, so no frame shows the swap, and a tab clicked mid-typing now opens the bar with its entrance.

`HeroDemo` starts at 70% in view, not the kit's first pixel, because the hero's fold would otherwise play the story out of sight.

## Assumptions

Season data is illustrative and the clubs other than Diverse City FC are invented. The section footer already labels these as illustrative product views.

## Not checked

Real touch devices, Safari and Firefox (Chrome only), a 550px article-width host, and beats under 80ms (film reported sampling gaps).
