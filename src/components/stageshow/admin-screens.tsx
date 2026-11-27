/* eslint-disable @next/next/no-img-element -- Captures inside a scaled stage; next/image's wrapper fights the transform. */
// The classic admin, rebuilt from onzio-platform's markup for the tour:
// AdminShell (sidebar, header), PageFrame and PageSaveButton (Homepage),
// EditorDialog (every edit sheet), ClassicRosterPage rows, ScheduleMatchList
// rows and the Add match form, the Insights SiteTraffic card and the
// Dashboard's MetricCard. Class names follow the source modules; values are
// copied from them. Names, emails and numbers are made up.
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AdminIcon, type AdminIconName } from "./admin-icons";
import type { Save, TourState } from "./tour-script";

export type Layout = "wide" | "compact";
type Props = { s: TourState; layout: Layout; still: boolean };

const CREST = "/images/rose-city/crest.webp";

/* ---------- Shared pieces ---------- */

function SaveButton({ state, label = "Save", target }: { state: Save; label?: string; target: string }) {
  const text = state === "saving" ? "Saving…" : state === "saved" ? "Saved" : label;
  return (
    <span className="ps-button" data-state={state} data-target={target}>
      {state === "saving" ? <span className="ps-ring" /> : null}
      {state === "saved" ? <svg className="ps-check" viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} /></svg> : null}
      <span>{text}</span>
    </span>
  );
}

function Field({ label, value, focus, selected, target, placeholder, help, required }: { label: string; value: string; focus: boolean; selected?: boolean; target: string; placeholder?: string; help?: string; required?: boolean }) {
  return (
    <label className="ck-field">
      <span className="ck-label">{label}{required ? <span className="ck-req">*</span> : null}</span>
      <span className="ck-input" data-focus={focus || undefined} data-target={target}>
        {value ? <span className={selected ? "ck-selected" : undefined}>{value}</span> : <span className="ck-placeholder">{placeholder}</span>}
        {focus && !selected ? <span className="ck-caret" /> : null}
      </span>
      {help ? <span className="ck-help">{help}</span> : null}
    </label>
  );
}

/** Two copies of a value stacked in one cell: the old one leaves upward as the new one arrives from below. */
export function Roll({ from, to, on, className }: { from: string; to: string; on: boolean; className?: string }) {
  return (
    <span className={`roll ${className ?? ""}`} data-on={on || undefined}>
      <span className="roll-from" aria-hidden={on}>{from}</span>
      <span className="roll-to" aria-hidden={!on}>{to}</span>
    </span>
  );
}

/** Counts up once when `on` turns true, easing out over 900 ms. Tabular figures keep the width still. */
function Count({ value, on, still, format = (n: number) => n.toLocaleString("en-US") }: { value: number; on: boolean; still: boolean; format?: (n: number) => string }) {
  const [shown, setShown] = useState(still && on ? value : 0);
  useEffect(() => {
    if (!on) return;
    if (still) { const id = requestAnimationFrame(() => setShown(value)); return () => cancelAnimationFrame(id); }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, still, value]);
  return <>{on ? format(shown) : "—"}</>;
}

/* ---------- AdminShell ---------- */

const NAV: { label: string; icon: AdminIconName; chapter?: number; group?: { label: string; icon: AdminIconName; items: { label: string; icon: AdminIconName; chapter?: number }[] } }[] = [
  { label: "Dashboard", icon: "Dashboard" },
  { label: "Website", icon: "Website", group: { label: "Website", icon: "Website", items: [{ label: "Homepage", icon: "Homepage", chapter: 0 }] } },
  { label: "Competition", icon: "Competition", group: { label: "Competition", icon: "Competition", items: [{ label: "Roster", icon: "Roster", chapter: 1 }, { label: "Schedule", icon: "Schedule", chapter: 2 }] } },
  { label: "Insights", icon: "MatchStats", chapter: 3 },
];

function Sidebar({ chapter }: { chapter: number }) {
  const item = (label: string, icon: AdminIconName, active: boolean) => (
    <li key={label} className="sb-item" data-active={active || undefined}>
      <AdminIcon name={icon} size={22} className="sb-icon" />
      <span>{label}</span>
    </li>
  );
  return (
    <aside className="sb">
      <div className="sb-header">
        <img src={CREST} width={40} height={40} alt="" className="sb-crest" />
        <div className="sb-name"><p>Rose City FC</p><p>Club administration</p></div>
      </div>
      <nav className="sb-content" aria-hidden="true">
        <ul className="sb-menu">
          {NAV.map(entry => entry.group ? (
            <li key={entry.label} className="sb-group">
              <span className="sb-item sb-group-label"><AdminIcon name={entry.icon} size={22} className="sb-icon" /><span>{entry.label}</span><AdminIcon name="CaretDown" size={16} className="sb-caret" /></span>
              <ul className="sb-menu sb-sub">{entry.group.items.map(sub => item(sub.label, sub.icon, sub.chapter === chapter))}</ul>
            </li>
          ) : item(entry.label, entry.icon, entry.chapter === chapter))}
        </ul>
      </nav>
      <div className="sb-footer">Powered by <b>ONZIO</b></div>
    </aside>
  );
}

function ShellHeader({ layout }: { layout: Layout }) {
  return (
    <header className="sh">
      {layout === "compact" ? (
        <>
          <span className="sh-icon-button"><AdminIcon name="Menu" size={20} /></span>
          <img src={CREST} width={32} height={32} alt="" className="sh-crest" />
        </>
      ) : null}
      <span className="sh-search"><AdminIcon name="Search" size={16} /><span>Search admin pages</span>{layout === "wide" ? <kbd>⌘K</kbd> : null}</span>
      <span className="sh-icon-button sh-theme"><AdminIcon name="Moon" size={16} /></span>
    </header>
  );
}

/* ---------- Chapter 1: Homepage (PageFrame + HomepageOverview + EditorDialog) ---------- */

function HomepageScreen({ s, layout }: Props) {
  const dirty = s.save === "dirty";
  const saveGroup = (
    <div className="pf-save-group">
      {dirty ? <span className="pf-discard">Discard changes</span> : null}
      <SaveButton state={s.save} target="page-save" />
    </div>
  );
  return (
    <div className="pf-frame">
      <header className="pf-header">
        <div className="pf-heading">
          <ol className="pf-crumbs"><li>Website</li><li>Pages</li><li aria-current="page">Homepage</li></ol>
          <h1 className="pf-title">Homepage</h1>
        </div>
        {layout === "wide" ? <span className="pf-open"><AdminIcon name="ExternalLink" size={16} />Open page</span> : null}
        {layout === "wide" ? saveGroup : null}
      </header>
      <div className="ho-toolbar">
        <div className="ho-zoom"><span data-on>Whole page</span><span>Actual size</span></div>
        {layout === "wide" ? <p className="ho-hint">Click a numbered part to edit it. Changes appear on your website after you save.</p> : null}
      </div>
      <div className="ho-box">
        <div className="ho-page">
          <img src="/images/rose-city/home-desktop-top.webp" width={1280} height={715} alt="" />
          <img src="/images/rose-city/home-desktop-rest.webp" width={1280} height={2918} alt="" />
          <span className="ho-live" data-on={(s.chapter === 0 && s.live) || undefined}><span className="rs-wipe" /><span className="ho-live-text">Pack the stands</span></span>
          <span className="ho-part" style={{ "--top": "0%", "--height": "4.8%" } as CSSProperties}><span className="ho-num">1</span></span>
          <span className="ho-part" style={{ "--top": "4.8%", "--height": "14.9%" } as CSSProperties}><span className="ho-num">2</span></span>
          <span className="ho-part" data-target="part-match" data-hot={s.dialog || undefined} style={{ "--top": "19.7%", "--height": "18.5%" } as CSSProperties}>
            <span className="ho-num">3</span><span className="ho-chip"><AdminIcon name="Edit" size={13} />Next home match</span>
          </span>
        </div>
      </div>
      {layout === "compact" ? <div className="pf-bottom-bar">{saveGroup}</div> : null}
    </div>
  );
}

function HomepageDialog({ s, layout }: Props) {
  const phone = layout === "compact";
  return (
    <Dialog open={s.dialog} title={phone ? "Next home match" : "Edit homepage"} phone={phone} back="Sections"
      done={<span className="ed-done" data-target="dialog-done">Done</span>}
      sections={["Menu and footer", "Top of the page", "Next home match", "Ticket prices", "Photo slideshow"]} current={2}
      footer={phone ? null : <><p className="ed-note">Edits stay on the page until you press Save.</p><span className="ed-done" data-target="dialog-done">Done</span></>}>
      <div className="ck-stack">
        <div className="ck-switch-row"><span>Show next home match on homepage</span><span className="sw-track" data-on /></div>
        <p className="ck-hint">The next home match, opponent, date, time and venue come from Schedule.</p>
        <Field label="Heading" value={s.heading} focus={s.focus === "heading"} selected={s.selected} target="field-heading" />
        <Field label="Button text" value="Buy tickets" focus={false} target="field-button" />
      </div>
    </Dialog>
  );
}

/* ---------- Chapter 2: Roster (ClassicRosterPage rows + player dialog) ---------- */

const PLAYERS = [
  { number: "8", name: "Riley Demo", meta: "MF · Age 24 · United States", initials: "RD" },
  { number: "14", name: "Sam Example", meta: "MF · Age 22 · Mexico", initials: "SE", focus: true },
  { number: "17", name: "Jordan Sample", meta: "MF · Age 27 · United States", initials: "JS" },
  { number: "21", name: "Casey Placeholder", meta: "MF · Age 19 · El Salvador", initials: "CP" },
];

function RosterScreen({ s }: Props) {
  return (
    <div className="ap-page">
      <AdminPageHeader title="Roster" description="Manage players and staff." action={<span className="btn btn-default"><AdminIcon name="Add" size={16} />Add player</span>} />
      <div className="tabs"><span data-on>Players</span><span>Staff</span></div>
      <section className="acc">
        <header className="acc-head"><span>Midfielders</span><b>4</b><AdminIcon name="CaretDown" size={16} /></header>
        {PLAYERS.map(player => (
          <div className="rr-row" key={player.name} data-flash={(player.focus && s.live) || undefined}>
            <span className="rr-jersey">{player.focus ? <Roll from="14" to="9" on={s.live} /> : player.number}</span>
            <span className="rr-avatar">{player.initials}</span>
            <span className="rr-identity"><span className="rr-name">{player.name}</span><span className="rr-meta">{player.meta}</span></span>
            <span className="rr-edit" data-target={player.focus ? "row-edit" : undefined}><AdminIcon name="Edit" size={16} /></span>
          </div>
        ))}
      </section>
    </div>
  );
}

function PlayerDialog({ s, layout }: Props) {
  const phone = layout === "compact";
  return (
    <Dialog open={s.dialog && s.chapter === 1} title={phone ? "Photo and basics" : "Edit Sam Example"} phone={phone} back="Sections"
      done={null}
      sections={["Photo and basics", "Player details", "Background", "Season stats", "Visibility"]} current={0}
      footer={<div className="ed-footer-bar"><p className="ed-status">{s.save === "dirty" ? "Unsaved changes" : "Saves this player only."}</p><div className="ed-actions">{phone ? null : <span className="ed-cancel">Cancel</span>}<SaveButton state={s.save} label="Save player" target="player-save" /></div></div>}>
      <div className="ck-stack">
        <div className="pl-photo"><span className="rr-avatar pl-avatar">SE</span><span><b>Player photo</b><small>Without one, the roster shows the club crest.</small></span></div>
        <div className="ck-row2">
          <Field label="Name" value="Sam Example" focus={false} target="field-name" required />
          <Field label="Jersey number" value={s.jersey} focus={s.focus === "jersey"} selected={s.selected} target="field-jersey" help="0 to 99" required />
        </div>
        <div className="ck-field">
          <span className="ck-label">Position<span className="ck-req">*</span></span>
          <div className="seg">{["GK", "DF", "MF", "FW"].map(p => <span key={p} data-on={p === "MF" || undefined}>{p}</span>)}</div>
        </div>
      </div>
    </Dialog>
  );
}

/* ---------- Chapter 3: Schedule (ScheduleMatchList + Add match) ---------- */

const MATCHES = [
  { month: "March 2027", count: "1 match", date: "Sat, Mar 13", time: "5:30 PM", opponent: "vs TFT FC", home: true, competition: "UPSL Premier SoCal North", result: <span className="sm-upcoming">Upcoming</span> },
  { month: "June 2026", count: "1 match", date: "Sat, Jun 6", time: "8:00 PM", opponent: "vs Montclair FC", home: true, competition: "UPSL Premier SoCal North", result: <span className="sm-score"><b>D</b>2 – 2</span> },
  { month: "May 2026", count: "2 matches", date: "Sun, May 31", time: "8:00 PM", opponent: "@ AYSD D1", home: false, competition: "UPSL Premier SoCal North", result: <span className="sm-score" data-outcome="W"><b>W</b>5 – 3</span> },
];

function MatchGroup({ month, count, date, time, opponent, home, competition, result }: (typeof MATCHES)[number]) {
  return (
    <section className="sm-group">
      <header className="sm-group-header"><h2>{month}</h2><span>{count}</span></header>
      <div className="sm-group-body">
        <div className="sm-row">
          <div className="sm-date"><strong>{date}</strong><span>{time}</span></div>
          <div className="sm-crest">{opponent.replace(/^(vs|@) /, "").slice(0, 2).toUpperCase()}</div>
          <div className="sm-opponent"><div className="sm-name"><strong>{opponent}</strong><span className="sm-pill" data-home={home || undefined}>{home ? "Home" : "Away"}</span></div><p>{competition}</p></div>
          <div className="sm-result">{result}</div>
        </div>
      </div>
    </section>
  );
}

function ScheduleScreen({ s }: Props) {
  return (
    <div className="ap-page">
      <AdminPageHeader title="Schedule" description="Add, edit, or remove matches." action={<><span className="ns-select">2026–27<AdminIcon name="CaretDown" size={16} /></span><span className="btn btn-add" data-target="add-match"><AdminIcon name="Add" size={14} />Add match</span></>} />
      <div className="sm-list" data-added={s.live || undefined}>
        <div className="sm-new" data-flash={s.live || undefined}>
          <MatchGroup month="April 2027" count="1 match" date="Sat, Apr 10" time="7:00 PM" opponent="vs Example United" home competition="UPSL Premier SoCal North" result={<span className="sm-upcoming">Upcoming</span>} />
        </div>
        <div className="sm-rest">{MATCHES.map(match => <MatchGroup key={match.month} {...match} />)}</div>
      </div>
    </div>
  );
}

const APRIL = [null, null, null, null, ...Array.from({ length: 30 }, (_, i) => i + 1)];

function MatchDialog({ s, layout }: Props) {
  const phone = layout === "compact";
  return (
    <Dialog open={s.dialog && s.chapter === 2} title="Add match" eyebrow="Schedule" phone={phone} back={null} done={null}
      footer={<div className="ed-footer-bar"><p className="ed-status">{s.save === "dirty" ? "Unsaved changes" : ""}</p><div className="ed-actions">{phone ? null : <span className="ed-cancel">Cancel</span>}<SaveButton state={s.save} label="Save changes" target="match-save" /></div></div>}>
      <div className="ck-stack">
        <h3 className="ad-section">Match details</h3>
        <div className="ck-row3">
          <label className="ck-field"><span className="ck-label">Home or away<span className="ck-req">*</span></span><span className="ns-select ns-wide">Home<AdminIcon name="CaretDown" size={16} /></span></label>
          <div className="ck-field ad-date">
            <span className="ck-label">Date<span className="ck-req">*</span></span>
            <span className="ad-date-button" data-focus={s.focus === "date" || undefined} data-target="field-date">{s.date || "Select date"}</span>
            <div className="cal" data-open={s.popover || undefined}>
              <div className="cal-head">April 2027</div>
              <div className="cal-grid">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={`h${i}`} className="cal-dow">{d}</span>)}
                {APRIL.map((day, i) => <span key={i} className="cal-day" data-target={day === 10 ? "day-10" : undefined} data-on={(day === 10 && Boolean(s.date)) || undefined}>{day ?? ""}</span>)}
              </div>
            </div>
          </div>
          {phone ? null : <Field label="Time" value="7:00 PM" focus={false} target="field-time" required />}
        </div>
        <h3 className="ad-section">Opponent</h3>
        <Field label="Opponent name" value={s.opponent} focus={s.focus === "opponent"} target="field-opponent" placeholder="e.g. Portland FC" required />
        <h3 className="ad-section">Venue</h3>
        <Field label="Venue name" value={s.venue} focus={s.focus === "venue"} target="field-venue" placeholder="e.g. Delta Park" required />
      </div>
    </Dialog>
  );
}

/* ---------- Chapter 4: Insights (SiteTraffic) and the Dashboard's Paid registrations ---------- */

// 30 days of page views; Saturdays are match days. Illustrative.
const DAYS = [310, 280, 295, 330, 360, 980, 420, 300, 290, 310, 340, 380, 1020, 460, 320, 300, 330, 350, 390, 1204, 510, 330, 310, 340, 360, 410, 1090, 470, 340, 320];

function InsightsScreen({ s, layout, still }: Props) {
  const november = s.range === "November 2026";
  return (
    <div className="ap-page">
      <AdminPageHeader title="Insights" description="How people find and use your website." action={
        <div className="in-range">
          <span className="ck-label">Time range</span>
          <span className="ns-select" data-target="range">{s.range}<AdminIcon name="CaretDown" size={16} /></span>
          <div className="menu" data-open={s.popover || undefined}>
            <span>October 2026</span><span data-target="range-november" data-on={november || undefined}>November 2026</span>
          </div>
        </div>} />
      <div className="in-columns">
        <section className="in-card">
          <h2 className="in-title">Your website in {november ? "November" : "October"}</h2>
          <dl className="in-numbers">
            <div><dt>Page views</dt><dd><Count value={12480} on={november} still={still} /></dd></div>
            <div><dt>Visitor-days</dt><dd><Count value={3906} on={november} still={still} /></dd></div>
            {layout === "wide" ? <div><dt>Avg. time on a page</dt><dd>{november ? "1m 12s" : "—"}</dd></div> : null}
          </dl>
          <figure className="in-figure">
            <div className="in-bars" data-on={november || undefined}>
              {DAYS.map((views, i) => <span key={i} className="in-bar" data-match={views > 900 || undefined} style={{ "--h": views / 1204, "--i": i } as CSSProperties} />)}
            </div>
            <figcaption>Page views per day, most on Nov 20 (1,204)<span className="in-legend"><i />Match day</span></figcaption>
          </figure>
        </section>
        <div className="mc-card">
          <p className="mc-value"><Count value={184} on={november} still={still} /></p>
          <p className="mc-label">Paid registrations</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Frames ---------- */

function AdminPageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <header className="ap-header">
      <div className="ap-heading">
        <div className="ap-breadcrumb">Club admin</div>
        <h1 className="ap-title">{title}</h1>
        <p className="ap-description">{description}</p>
      </div>
      {action ? <div className="ap-actions">{action}</div> : null}
    </header>
  );
}

function Dialog({ open, title, eyebrow, phone, back, done, sections, current, footer, children }: { open: boolean; title: string; eyebrow?: string; phone: boolean; back: string | null; done: ReactNode; sections?: string[]; current?: number; footer: ReactNode; children: ReactNode }) {
  return (
    <div className="ed-layer" data-open={open || undefined} aria-hidden="true">
      <div className="ed-backdrop" />
      <div className="ed-popup" data-phone={phone || undefined}>
        <header className="ed-header">
          {phone && back ? <span className="ed-back"><AdminIcon name="CaretLeft" size={18} /><span>{back}</span></span> : null}
          <div className="ed-titles">{eyebrow ? <p className="ed-eyebrow">{eyebrow}</p> : null}<h2 className="ed-title">{title}</h2></div>
          {phone && done ? done : <span className="ed-close"><AdminIcon name="Close" size={18} /></span>}
        </header>
        <div className="ed-body" data-split={(sections && !phone) || undefined}>
          {sections && !phone ? (
            <nav className="ed-sections"><ul>{sections.map((section, i) => <li key={section} className="ed-section" data-current={i === current || undefined}>{section}</li>)}</ul></nav>
          ) : null}
          <section className="ed-panel">{sections && !phone ? <h3 className="ed-panel-title">{sections[current ?? 0]}</h3> : null}{children}</section>
        </div>
        {footer ? <footer className="ed-footer">{footer}</footer> : null}
      </div>
    </div>
  );
}

export function AdminWindow(props: Props) {
  const { s, layout } = props;
  const screens = [HomepageScreen, RosterScreen, ScheduleScreen, InsightsScreen];
  return (
    <div className="aw" data-layout={layout}>
      <div className="aw-bar" aria-hidden="true">
        <span className="aw-dots"><i /><i /><i /></span>
        <span className="aw-url">Rose City FC · Onzio admin</span>
      </div>
      <div className="aw-shell admin-portal">
        {layout === "wide" ? <Sidebar chapter={s.chapter} /> : null}
        <div className="aw-main">
          <ShellHeader layout={layout} />
          <div className="aw-content">
            {screens.map((Screen, i) => (
              <div key={i} className="aw-screen" data-on={i === s.chapter || undefined} aria-hidden={i !== s.chapter}>
                <Screen {...props} s={i === s.chapter ? s : { ...s, chapter: i, dialog: false, popover: false }} />
              </div>
            ))}
          </div>
        </div>
        <HomepageDialog {...props} s={s.chapter === 0 ? s : { ...s, dialog: false }} />
        <PlayerDialog {...props} />
        <MatchDialog {...props} />
      </div>
    </div>
  );
}

/* ---------- The Rose City site, on a phone ---------- */

export function SiteScreen({ s }: { s: TourState }) {
  return (
    <div className="rs">
      <div className="rs-page" data-on={s.chapter === 0 || s.chapter === 3 || undefined}>
        <div className="rs-scroll" style={{ "--y": s.chapter === 3 ? "0px" : "-330px" } as CSSProperties}>
          <img src="/images/rose-city/home-phone.webp" width={390} height={2286} alt="" />
          <span className="rs-heading" data-on={(s.chapter === 0 && s.live) || undefined}>
            <span className="rs-wipe" />
            <span className="rs-heading-text">Pack the stands</span>
          </span>
        </div>
      </div>
      <div className="rs-page rs-roster" data-on={s.chapter === 1 || undefined}>
        <RoseCityHeader />
        <h2 className="rs-display">Roster</h2>
        <p className="rs-sub">Midfielders</p>
        <ul className="rs-cards">
          {[{ n: "14", name: "Sam Example", town: "Pasadena, CA", focus: true }, { n: "8", name: "Riley Demo", town: "Glendale, CA" }, { n: "17", name: "Jordan Sample", town: "Alhambra, CA" }, { n: "21", name: "Casey Placeholder", town: "Arcadia, CA" }].map(card => (
            <li key={card.name} className="rs-card" data-flash={(card.focus && s.chapter === 1 && s.live) || undefined}>
              <span className="rs-portrait"><img src={CREST} width={96} height={96} alt="" /></span>
              <span className="rs-number">{card.focus ? <><span className="rs-wipe" /><Roll from="14" to="9" on={s.chapter === 1 && s.live} /></> : card.n}</span>
              <span className="rs-name">{card.name}</span>
              <span className="rs-town">MF · {card.town}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rs-page" data-on={s.chapter === 2 || undefined}>
        <div className="rs-schedule" data-added={(s.chapter === 2 && s.live) || undefined}>
          <div className="rs-sched-top"><img src="/images/rose-city/schedule-phone.webp" width={390} height={1100} alt="" loading="lazy" /></div>
          <div className="rs-sched-card">
            <span className="rs-wipe" />
            <p className="rs-sched-date">April 10, 2027</p>
            <p className="rs-sched-team"><span className="rs-sched-crest">EU</span><b>Example United</b><span className="rs-tag">HOME</span></p>
            <p className="rs-sched-venue">Championship Stadium</p>
            <p className="rs-sched-kick"><span>Kickoff</span>7:00PM PT</p>
          </div>
          <div className="rs-sched-list"><img src="/images/rose-city/schedule-phone.webp" width={390} height={1100} alt="" loading="lazy" /></div>
        </div>
      </div>
    </div>
  );
}

function RoseCityHeader() {
  return <div className="rs-header"><img src="/images/rose-city/schedule-phone.webp" width={390} height={1100} alt="" loading="lazy" /></div>;
}
