# Rehearsal: Onzio homepage demos

Filmed with the Stageshow skill's `film.mjs --gate` on a temporary route, since removed, because the staff tabs need a click the film tool cannot make. Widths 1280 and 390. Light theme only; the site has no dark mode.

| Demo | Section | Gold | Beats |
|---|---|---|---|
| `HeroDemo` | Hero | `device-pair` | Type an announcement, Publish confirms on itself, the bar opens on the website |
| `WebsiteDemo` | Staff tools | `form-error` | Publish in the row, the badge settles, a toast names the result |
| `SeasonDemo` | Staff tools | `table-edit` | Enter 3-1, save, Diverse City FC moves to first |
| `StaffDemo` | Staff tools | `share` | Type an email, it becomes a chip, Invite, the person lands at the top of the list |
| `AnalyticsDemo` | Staff tools | `chart-scrub` | Scrub the season, the headline reads out each match |
| `LiveChip` | Club sites | `corner-chip` | Follows the real footage tour's chapter |
| `InvoiceStack` | Pricing | `tilted-stack` | Due becomes Paid |
| FAQ pictures | FAQ | `static-card` | Stills |
| `InquiryPhone` | Contact | `device-pair` | Sent card, connector, notification |

All play once and hold their result; no loops, so nothing competes on a long page.

## Film lines that stand

- `kit override` (six on every stage): false positive. The check reads every stylesheet, and Next bundles the kit's own CSS, so it flags the kit's phone rules as the demo's. No demo CSS touches those selectors. This alone keeps `--gate` from reporting `rehearsal passed`.
- Hydration `incomplete`: film injects `data-ss-verification-stage` before hydration. The page shows no console errors without film.
- `InquiryPhone` wide, phone off center: deliberate. Card and phone are two columns on one gutter, and centering the phone would put the card over it.
- `InquiryPhone` compact, notification time at 8.2px: iOS's true proportion on a phone sized to fit the column.
- `jump`, `settle snap`, `steps in its box` on Field text: per-character typing and the chip commit, both kit behavior.

## Review

An independent reviewer's findings, all acted on except:

- The four staff demos share one window composition. Kept: they are tabs of one workspace, shown one at a time, and the page wants one figure language.
- The caret before the placeholder on focus. Kept: that is how text fields behave.

## Assumptions

Season data is illustrative and the clubs other than Diverse City FC are invented. The section footer already labels these as illustrative product views.

## Not checked

Real touch devices, Safari and Firefox (Chrome only), and a 550px article-width host.
