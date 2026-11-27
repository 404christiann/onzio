"use client";

/* eslint-disable @next/next/no-img-element -- The stage scales these with the scene; next/image would fight its transform. */
import { useRef, type ReactNode } from "react";
import { Avatar, Chart, Check, Collapse, Count, Field, Roll, Row, Stage, States, Toast, Window, chartPoints, useLook, type Act, type Layout } from "@/stageshow/kit";
import { AdminIcon, type AdminIconName } from "./admin-icons";
import "./onzio-look.css";
import "./staff-demos.css";

// One demo per staff tool, in Rose City FC's classic admin. Each plays once when
// it is opened and holds its result: a page published, a result that moves the
// table, a coach invited, a player's season read back match by match. Screens,
// labels and pills follow onzio-platform's classic admin; people, clubs and
// numbers are made up.

const STAGE = { width: 560, height: 500, compact: { below: 460, width: 358, height: 490 } };

function Workspace({ route, crumb, title, description, children }: { route: string; crumb: string; title: string; description: string; children: ReactNode }) {
  const crest = <span className="onzio-crest"><img src="/images/rose-city/crest.webp" alt="" />Rose City FC</span>;
  const context = <span className="sd-context">{route}</span>;
  const head = (
    <header className="sd-head">
      <p className="sd-crumb">{crumb}</p>
      <h3 className="sd-title">{title}</h3>
      <p className="sd-sub">{description}</p>
    </header>
  );
  // On a phone column this is the admin's phone layout, not a squeezed desktop window.
  if (useLook().layout === "compact") {
    return <div className="sd-sheet"><header className="sd-sheet-head">{crest}{context}</header><div className="sd-body" data-crop>{head}{children}</div></div>;
  }
  return <Window className="sd-window" lead={crest} toolbar={context} body={{ className: "sd-body", "data-crop": true }}>{head}{children}</Window>;
}

function Tile({ name }: { name: AdminIconName }) {
  return <span className="sd-tile"><AdminIcon name={name} size={18} /></span>;
}

/** The admin's status pill: rounded-full, a 10% tint, semibold text. */
function Pill({ tone, children }: { tone: "success" | "muted"; children: ReactNode }) {
  return <span className="sd-pill" data-tone={tone}>{children}</span>;
}

/* ---- Website: a draft page goes live ---- */

type WebsiteState = { publish: "idle" | "busy" | "done"; toast: boolean };
const PAGES: { title: string; copy: string; icon: AdminIconName; draft?: boolean }[] = [
  { title: "Homepage", copy: "Hero, next home match, partners", icon: "Homepage" },
  { title: "Tryouts", copy: "Dates, ages and sign-up", icon: "Website", draft: true },
  { title: "Tickets", copy: "Prices, stadium and map", icon: "Website" },
  { title: "Schedule", copy: "Fixtures and results", icon: "Schedule" },
  { title: "Roster", copy: "Players and staff", icon: "Roster" },
  { title: "Shop", copy: "Kits and merchandise", icon: "Website" },
];

async function websiteScript(a: Act<WebsiteState>) {
  await a.wait(800);
  a.mark("publish");
  await a.click({ at: "publish", x: 0.7, y: 0.55 });
  a.put({ publish: "busy" });
  await a.wait(600);
  a.put({ publish: "done" });
  await a.wait(420);
  a.mark("live");
  a.put({ toast: true });
  await a.move(a.layout === "wide" ? { x: 470, y: 150 } : { x: 300, y: 140 }, { duration: 500 });
  await a.wait(2400);
}

export function WebsiteDemo() {
  return (
    <Stage<WebsiteState> {...STAGE} initial={{ publish: "idle", toast: false }} poster={{ publish: "done", toast: true }} script={websiteScript} play="once" cursor={{ at: { x: 500, y: 470 } }} className="onzio-look onzio-panel sd">
      {s => (
        <>
          <Workspace route="Website" crumb="Website" title="All website pages" description="Every page on rosecityfutbolclub.com.">
            <div className="sd-list">
              {PAGES.map(page => (
                <Row key={page.title} pad={12} className="sd-row" lead={<Tile name={page.icon} />} title={page.title} subtitle={page.copy}>
                  {page.draft ? (
                    <span className="sd-publish" data-target="publish" data-done={s.publish === "done" || undefined}>
                      <States
                        align="end"
                        value={s.publish}
                        states={{
                          idle: <span className="sd-publish-go">Publish</span>,
                          busy: <span className="sd-publish-go"><span className="sd-ring" />Publishing…</span>,
                          done: <Pill tone="success">Published</Pill>,
                        }}
                      />
                    </span>
                  ) : <Pill tone="success">Published</Pill>}
                </Row>
              ))}
            </div>
          </Workspace>
          <Toast show={s.toast} icon={<Check on={s.toast} size={15} />} className="sd-toast">Tryouts is live on rosecityfutbolclub.com</Toast>
        </>
      )}
    </Stage>
  );
}

/* ---- Competition: a result moves the table ---- */

type SeasonState = { home: string; away: string; field: "none" | "home" | "away"; saved: boolean };
const seasonInitial: SeasonState = { home: "", away: "", field: "none", saved: false };
const US = "Rose City FC";

const table = (saved: boolean) => [
  { club: US, w: saved ? 8 : 7, d: 2, l: 1, pts: saved ? 26 : 23, rank: saved ? 0 : 1 },
  { club: "Example United", w: 7, d: 2, l: saved ? 2 : 1, pts: 23, rank: saved ? 1 : 0 },
  { club: "Sample FC", w: 6, d: 3, l: 2, pts: 21, rank: 2 },
  { club: "Demo Athletic", w: 5, d: 3, l: 3, pts: 18, rank: 3 },
  { club: "Placeholder SC", w: 4, d: 3, l: 4, pts: 15, rank: 4 },
];

async function seasonScript(a: Act<SeasonState>) {
  await a.wait(800);
  a.mark("score");
  await a.click({ at: "home", x: 0.82, y: 0.78 });
  a.put({ field: "home" });
  await a.wait(220);
  a.put({ home: "3" });
  await a.wait(380);
  await a.click({ at: "away", x: 0.82, y: 0.78 });
  a.put({ field: "away" });
  await a.wait(220);
  a.put({ away: "1" });
  await a.wait(420);
  a.mark("save");
  await a.click({ at: "save", x: 0.75, y: 0.55 });
  a.put({ field: "none", saved: true });
  await a.move(a.layout === "wide" ? { x: 420, y: 120 } : { x: 300, y: 104 }, { duration: 500 });
  a.mark("table");
  await a.wait(2600);
}

export function SeasonDemo() {
  return (
    <Stage<SeasonState> {...STAGE} initial={seasonInitial} poster={{ home: "3", away: "1", field: "none", saved: true }} script={seasonScript} play="once" cursor={{ at: { x: 500, y: 300 } }} className="onzio-look onzio-panel sd">
      {s => (
        <Workspace route="Competition" crumb="Competition" title="Schedule" description="Add, edit, or remove matches.">
          <div className="sd-match">
            <span className="sd-club">{US}</span>
            <span className="sd-score" data-target="home" data-cursor="ibeam" data-on={s.field === "home" || undefined}>{s.home}</span>
            <span className="sd-dash" />
            <span className="sd-score" data-target="away" data-cursor="ibeam" data-on={s.field === "away" || undefined}>{s.away}</span>
            <span className="sd-club sd-club-end">Example United</span>
          </div>
          <span className="sd-save" data-target="save" data-done={s.saved || undefined}>
            <States
              value={s.saved ? "saved" : "save"}
              states={{
                save: <span className="sd-save-label">Save result</span>,
                saved: <span className="sd-save-label"><Check on size={14} />Saved</span>,
              }}
            />
          </span>
          <div className="sd-table">
            <div className="sd-table-row sd-table-head"><span>Standings</span><span>W</span><span>D</span><span>L</span><span>Pts</span></div>
            <div className="sd-table-rows">
              {table(s.saved).map(row => (
                <div key={row.club} className="sd-table-row sd-table-body" data-us={row.club === US || undefined} style={{ transform: `translateY(${row.rank * 44}px)` }}>
                  <span>{row.club}</span>
                  <span><Count value={row.w} /></span>
                  <span>{row.d}</span>
                  <span><Count value={row.l} /></span>
                  <span className="sd-pts"><Count value={row.pts} /></span>
                </div>
              ))}
            </div>
          </div>
        </Workspace>
      )}
    </Stage>
  );
}

/* ---- Team Access: a coach is invited ---- */

type StaffState = { email: string; typing: boolean; chip: boolean; added: boolean };
const EMAIL = "coach@example.com";

async function staffScript(a: Act<StaffState>) {
  await a.wait(700);
  a.mark("type");
  await a.click({ at: "invite-field", x: 0.9, y: 0.5 });
  a.put({ typing: true });
  await a.wait(150);
  await a.type("email", EMAIL, { interval: 60 });
  a.put({ typing: false });
  await a.wait(320);
  a.put({ chip: true });
  await a.wait(600);
  a.mark("invite");
  await a.click({ at: "invite", x: 0.5, y: 0.6 });
  a.put({ added: true });
  await a.wait(340);
  a.put({ chip: false, email: "" });
  await a.move(a.layout === "wide" ? { x: 470, y: 150 } : { x: 300, y: 140 }, { duration: 500 });
  await a.wait(2600);
}

function Person({ name, role, invited }: { name: string; role: string; invited?: boolean }) {
  return (
    <Row pad={12} className="sd-row" lead={<Avatar name={name} size={34} />} title={name} subtitle={role}>
      <Pill tone={invited ? "muted" : "success"}>{invited ? "Invited" : "Active"}</Pill>
    </Row>
  );
}

export function StaffDemo() {
  return (
    <Stage<StaffState> {...STAGE} initial={{ email: "", typing: false, chip: false, added: false }} poster={{ email: "", typing: false, chip: false, added: true }} script={staffScript} play="once" cursor={{ at: { x: 500, y: 460 } }} className="onzio-look onzio-panel sd">
      {s => (
        <Workspace route="Club Settings" crumb="Club Settings" title="Team Access" description="The people who can sign in to this admin.">
          <div className="sd-invite">
            <Field value={s.email} chip={s.chip} focused={s.typing || s.chip} placeholder="Invite by email" box={{ "data-target": "invite-field" }} />
            <span className="sd-invite-go" data-target="invite" data-ready={s.chip || undefined}>Invite</span>
          </div>
          <div className="sd-list">
            <Collapse open={s.added} reveal="drop"><Person name={EMAIL} role="Coach" invited /></Collapse>
            <Person name="Riley Demo" role="Club administrator" />
            <Person name="Jordan Sample" role="Coach" />
            <Person name="Casey Placeholder" role="Team manager" />
            <Person name="Taylor Test" role="Club staff" />
          </div>
        </Workspace>
      )}
    </Stage>
  );
}

/* ---- Analytics: a player's season, read back match by match ---- */

type SeasonReadState = { match: number | null; x: number | null };
// Goal contributions per match: 11 goals and 5 assists over 11 matches.
const PER_MATCH = [1, 0, 2, 1, 3, 1, 0, 2, 2, 1, 3];
const PLOT: Record<Layout, { width: number; height: number }> = { wide: { width: 444, height: 140 }, compact: { width: 294, height: 120 } };

function yOn(path: SVGPathElement | null | undefined, x: number) {
  if (!path) return null;
  let lo = 0, hi = path.getTotalLength();
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).x < x) lo = mid; else hi = mid;
  }
  return path.getPointAtLength(hi).y;
}

async function analyticsScript(a: Act<SeasonReadState>) {
  await a.wait(800);
  const box = a.rect("plot");
  const pts = chartPoints({ data: PER_MATCH, ...PLOT[a.layout], dot: false });
  const at = (i: number) => ({ x: box.x + pts[i]!.x, y: box.y + pts[i]!.y + 16 });
  a.mark("hover");
  await a.move(at(2), { duration: 700 });
  a.put({ match: 2, x: pts[2]!.x });
  await a.wait(600);
  a.mark("scrub");
  await a.move(at(PER_MATCH.length - 1), {
    duration: 1800,
    path: (e, from, to) => ({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e }),
    onMove: pt => {
      const x = Math.max(0, Math.min(box.width, pt.x - box.x));
      let near = 0;
      for (let i = 1; i < pts.length; i++) if (Math.abs(pts[i]!.x - x) < Math.abs(pts[near]!.x - x)) near = i;
      a.put({ match: near, x });
    },
  });
  a.put({ match: PER_MATCH.length - 1, x: pts[PER_MATCH.length - 1]!.x });
  await a.wait(500);
  await a.move({ x: box.x + box.width - 40, y: box.y - 44 }, { duration: 500 });
  await a.wait(2000);
}

export function AnalyticsDemo() {
  const plot = useRef<HTMLDivElement>(null);
  return (
    <Stage<SeasonReadState> {...STAGE} initial={{ match: null, x: null }} poster={{ match: PER_MATCH.length - 1, x: null }} script={analyticsScript} play="once" cursor={{ at: { x: 500, y: 470 } }} className="onzio-look onzio-panel sd">
      {(s, _rect, layout) => {
        const size = PLOT[layout];
        const pts = chartPoints({ data: PER_MATCH, ...size, dot: false });
        const hx = s.x ?? (s.match === null ? null : pts[s.match]!.x);
        const hy = hx === null ? null : (yOn(plot.current?.querySelector<SVGPathElement>(".ss-chart__line"), hx) ?? pts[s.match ?? 0]!.y);
        const on = s.match !== null && hx !== null && hy !== null;
        return (
          <Workspace route="Analytics" crumb="Performance" title="Analytics" description="2025–26 season · Sam Example · #9 · FW">
            <div className="sd-kpis">
              <div><span>Goals</span><strong>11</strong><em>+2 vs avg</em></div>
              <div><span>Assists</span><strong>5</strong><em>Team high</em></div>
            </div>
            <div className="sd-readout">
              <span className="sd-readout-label"><Roll variant="fade">{s.match === null ? "Goal contributions per match" : `Match ${s.match + 1}`}</Roll></span>
              <span className="sd-readout-value"><Roll stagger={25}>{String(s.match === null ? PER_MATCH[PER_MATCH.length - 1] : PER_MATCH[s.match])}</Roll></span>
            </div>
            <div ref={plot} className="sd-plot" data-target="plot" data-cursor="crosshair" style={size}>
              <Chart data={PER_MATCH} {...size} dot={false} />
              <span className="sd-hair" data-on={on || undefined} style={on ? { left: hx! } : undefined} />
              <span className="sd-dot" data-on={on || undefined} style={on ? { left: hx!, top: hy! } : undefined} />
            </div>
            <div className="sd-axis" style={{ width: size.width }}><span>Match 1</span><span>Match 11</span></div>
          </Workspace>
        );
      }}
    </Stage>
  );
}
