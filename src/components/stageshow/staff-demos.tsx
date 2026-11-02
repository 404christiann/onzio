"use client";

/* eslint-disable @next/next/no-img-element -- The stage scales these with the scene; next/image would fight its transform. */
import { useRef, type ReactNode } from "react";
import { Avatar, Badge, Chart, Check, Collapse, Count, Field, Roll, Row, Stage, States, Toast, Window, chartPoints, useLook, type Act, type Layout } from "@/stageshow/kit";
import { CentralIcon, type CentralIconName } from "@/components/icons/central/icon";
import "./onzio-look.css";
import "./staff-demos.css";

// One demo per staff tool. Each plays once when it is opened and holds its
// result: a page published, a result that moves the table, a person invited,
// a season read back match by match. All data is illustrative.

const STAGE = { width: 560, height: 500, compact: { below: 460, width: 358, height: 490 } };

function Workspace({ label, children }: { label: string; children: ReactNode }) {
  const crest = <span className="onzio-crest"><img src="/diverse-city-fc-logo.png" alt="" />Diverse City FC</span>;
  const context = <span className="sd-context">{label}</span>;
  // On a phone column this is the workspace's mobile view, not a squeezed desktop window.
  if (useLook().layout === "compact") {
    return <div className="sd-sheet"><header className="sd-sheet-head">{crest}{context}</header><div className="sd-body" data-crop>{children}</div></div>;
  }
  return <Window className="sd-window" lead={crest} toolbar={context} body={{ className: "sd-body", "data-crop": true }}>{children}</Window>;
}

function Tile({ name }: { name: CentralIconName }) {
  return <span className="sd-tile"><CentralIcon name={name} width={16} height={16} /></span>;
}

/* ---- Website: a draft goes live ---- */

type WebsiteState = { publish: "idle" | "busy" | "done"; toast: boolean };
const PAGES: { title: string; copy: string; icon: CentralIconName }[] = [
  { title: "Homepage", copy: "Club news and what’s next", icon: "website" },
  { title: "Programs", copy: "A place for every player", icon: "calendar" },
  { title: "Tryouts", copy: "Dates and details", icon: "competition" },
  { title: "Roster", copy: "The players and coaches", icon: "staff" },
  { title: "Schedule", copy: "Fixtures and results", icon: "calendar" },
  { title: "Sponsors", copy: "The partners behind your club", icon: "website" },
];

async function websiteScript(a: Act<WebsiteState>) {
  await a.wait(800);
  a.mark("publish");
  await a.click({ at: "publish", x: 0.82, y: 0.55 });
  a.put({ publish: "busy" });
  await a.wait(850);
  a.put({ publish: "done" });
  await a.wait(420);
  a.mark("live");
  a.put({ toast: true });
  await a.move(a.layout === "wide" ? { x: 470, y: 118 } : { x: 300, y: 112 }, { duration: 500 });
  await a.wait(2400);
}

export function WebsiteDemo() {
  return (
    <Stage<WebsiteState> {...STAGE} initial={{ publish: "idle", toast: false }} poster={{ publish: "done", toast: true }} script={websiteScript} play="once" cursor={{ at: { x: 500, y: 470 } }} className="onzio-look onzio-panel sd">
      {s => (
        <>
          <Workspace label="Website">
            <div className="sd-title">Your club website</div>
            <div className="sd-sub">The pages your community comes to find.</div>
            <div className="sd-list">
              {PAGES.map(page => (
                <Row key={page.title} pad={12} className="sd-row" lead={<Tile name={page.icon} />} title={page.title} subtitle={page.copy}>
                  {page.title === "Tryouts" ? (
                    <span className="sd-publish" data-target="publish" data-done={s.publish === "done" || undefined}>
                      <States
                        align="end"
                        value={s.publish}
                        states={{
                          idle: <span className="sd-publish-label sd-publish-go">Publish</span>,
                          busy: <span className="sd-publish-label sd-publish-go"><Check on={false} pending size={13} />Publishing</span>,
                          done: <Badge tone="success">Published</Badge>,
                        }}
                      />
                    </span>
                  ) : <Badge tone="success">Published</Badge>}
                </Row>
              ))}
            </div>
          </Workspace>
          <Toast show={s.toast} icon={<Check on={s.toast} size={15} />} className="sd-toast">Tryouts is live on diversecityfc.com</Toast>
        </>
      )}
    </Stage>
  );
}

/* ---- Competition: a result moves the table ---- */

type SeasonState = { home: string; away: string; field: "none" | "home" | "away"; saved: boolean };
const seasonInitial: SeasonState = { home: "", away: "", field: "none", saved: false };

const table = (saved: boolean) => [
  { club: "Diverse City FC", w: saved ? 8 : 7, d: 2, l: 1, pts: saved ? 26 : 23, rank: saved ? 0 : 1 },
  { club: "Lakeshore United", w: 7, d: 2, l: saved ? 2 : 1, pts: 23, rank: saved ? 1 : 0 },
  { club: "Northside SC", w: 6, d: 3, l: 2, pts: 21, rank: 2 },
  { club: "Harbor City", w: 5, d: 3, l: 3, pts: 18, rank: 3 },
  { club: "Westside Athletic", w: 4, d: 3, l: 4, pts: 15, rank: 4 },
  { club: "Riverside FC", w: 3, d: 4, l: 4, pts: 13, rank: 5 },
];

async function seasonScript(a: Act<SeasonState>) {
  await a.wait(800);
  a.mark("score");
  await a.click({ at: "home", x: 0.88, y: 0.84 });
  a.put({ field: "home" });
  await a.wait(220);
  a.put({ home: "3" });
  await a.wait(380);
  await a.click({ at: "away", x: 0.88, y: 0.84 });
  a.put({ field: "away" });
  await a.wait(220);
  a.put({ away: "1" });
  await a.wait(420);
  a.mark("save");
  await a.click({ at: "save", x: 0.8, y: 0.55 });
  a.put({ field: "none", saved: true });
  await a.move(a.layout === "wide" ? { x: 400, y: 80 } : { x: 300, y: 66 }, { duration: 500 });
  a.mark("table");
  await a.wait(2600);
}

export function SeasonDemo() {
  return (
    <Stage<SeasonState> {...STAGE} initial={seasonInitial} poster={{ home: "3", away: "1", field: "none", saved: true }} script={seasonScript} play="once" cursor={{ at: { x: 500, y: 300 } }} className="onzio-look onzio-panel sd">
      {s => (
        <Workspace label="Competition">
          <div className="sd-match">
            <span className="sd-club">Diverse City FC</span>
            <span className="sd-score" data-target="home" data-cursor="ibeam" data-on={s.field === "home" || undefined}>{s.home}</span>
            <span className="sd-dash" />
            <span className="sd-score" data-target="away" data-cursor="ibeam" data-on={s.field === "away" || undefined}>{s.away}</span>
            <span className="sd-club sd-club-end">Lakeshore United</span>
          </div>
          <span className="sd-save" data-target="save" data-done={s.saved || undefined}>
            <States
              value={s.saved ? "saved" : "save"}
              states={{
                save: <span className="sd-save-label">Save result</span>,
                saved: <span className="sd-save-label"><Check on size={14} />Result saved</span>,
              }}
            />
          </span>
          <div className="sd-table">
            <div className="sd-table-row sd-table-head"><span>League standings</span><span>W</span><span>D</span><span>L</span><span>Pts</span></div>
            <div className="sd-table-rows">
              {table(s.saved).map(row => (
                <div key={row.club} className="sd-table-row sd-table-body" data-us={row.club === "Diverse City FC" || undefined} style={{ transform: `translateY(${row.rank * 44}px)` }}>
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

/* ---- Staff access: a colleague is invited ---- */

type StaffState = { email: string; typing: boolean; chip: boolean; added: boolean };
const EMAIL = "alex@diversecityfc.com";

async function staffScript(a: Act<StaffState>) {
  await a.wait(700);
  a.mark("type");
  await a.click({ at: "invite-field", x: 0.9, y: 0.5 });
  a.put({ typing: true });
  await a.wait(150);
  await a.type("email", EMAIL, { interval: 45 });
  a.put({ typing: false });
  await a.wait(320);
  a.put({ chip: true });
  await a.wait(600);
  a.mark("invite");
  await a.click({ at: "invite", x: 0.5, y: 0.6 });
  a.put({ added: true });
  await a.wait(340);
  a.put({ chip: false, email: "" });
  await a.move(a.layout === "wide" ? { x: 470, y: 118 } : { x: 300, y: 112 }, { duration: 500 });
  await a.wait(2600);
}

function Person({ name, role, invited }: { name: string; role: string; invited?: boolean }) {
  return (
    <Row pad={12} className="sd-row" lead={<Avatar name={name} size={34} />} title={name} subtitle={role}>
      <Badge tone={invited ? "neutral" : "success"}>{invited ? "Invited" : "Active"}</Badge>
    </Row>
  );
}

export function StaffDemo() {
  return (
    <Stage<StaffState> {...STAGE} initial={{ email: "", typing: false, chip: false, added: false }} poster={{ email: "", typing: false, chip: false, added: true }} script={staffScript} play="once" cursor={{ at: { x: 500, y: 460 } }} className="onzio-look onzio-panel sd">
      {s => (
        <Workspace label="Staff access">
          <div className="sd-title">Your club staff</div>
          <div className="sd-sub">A shared workspace for approved people.</div>
          <div className="sd-invite">
            <Field value={s.email} chip={s.chip} focused={s.typing || s.chip} placeholder="Invite by email" box={{ "data-target": "invite-field" }} />
            <span className="sd-invite-go" data-target="invite" data-ready={s.chip || undefined}>Invite</span>
          </div>
          <div className="sd-list">
            <Collapse open={s.added} reveal="drop"><Person name="Alex Moreno" role="Club staff" invited /></Collapse>
            <Person name="Christian Alcala" role="Club administrator" />
            <Person name="Jamie Rivera" role="Club staff" />
            <Person name="Sam Ortiz" role="Club staff" />
            <Person name="Dana Reed" role="Team manager" />
            <Person name="Priya Nair" role="Club staff" />
          </div>
        </Workspace>
      )}
    </Stage>
  );
}

/* ---- Analytics: the season, read back match by match ---- */

type SeasonReadState = { match: number | null; x: number | null };
const GOALS = [1, 3, 5, 8, 9, 13, 15, 19, 22, 23, 26];
const PLOT: Record<Layout, { width: number; height: number }> = { wide: { width: 444, height: 176 }, compact: { width: 294, height: 150 } };

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
  const pts = chartPoints({ data: GOALS, ...PLOT[a.layout], dot: false });
  const at = (i: number) => ({ x: box.x + pts[i]!.x, y: box.y + pts[i]!.y + 16 });
  a.mark("hover");
  await a.move(at(3), { duration: 700 });
  a.put({ match: 3, x: pts[3]!.x });
  await a.wait(600);
  a.mark("scrub");
  await a.move(at(GOALS.length - 1), {
    duration: 1600,
    path: (e, from, to) => ({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e }),
    onMove: pt => {
      const x = Math.max(0, Math.min(box.width, pt.x - box.x));
      let near = 0;
      for (let i = 1; i < pts.length; i++) if (Math.abs(pts[i]!.x - x) < Math.abs(pts[near]!.x - x)) near = i;
      a.put({ match: near, x });
    },
  });
  await a.wait(500);
  await a.move({ x: box.x + box.width - 40, y: box.y - 44 }, { duration: 500 });
  await a.wait(2000);
}

export function AnalyticsDemo() {
  const plot = useRef<HTMLDivElement>(null);
  return (
    <Stage<SeasonReadState> {...STAGE} initial={{ match: null, x: null }} poster={{ match: GOALS.length - 1, x: null }} script={analyticsScript} play="once" cursor={{ at: { x: 500, y: 470 } }} className="onzio-look onzio-panel sd">
      {(s, _rect, layout) => {
        const size = PLOT[layout];
        const pts = chartPoints({ data: GOALS, ...size, dot: false });
        const hx = s.x ?? (s.match === null ? null : pts[s.match]!.x);
        const hy = hx === null ? null : (yOn(plot.current?.querySelector<SVGPathElement>(".ss-chart__line"), hx) ?? pts[s.match ?? 0]!.y);
        const on = s.match !== null && hx !== null && hy !== null;
        return (
          <Workspace label="Analytics">
            <div className="sd-readout">
              <div className="sd-readout-label"><Roll variant="fade">{s.match === null ? "Goals this season" : `Goals after match ${s.match + 1}`}</Roll></div>
              <div className="sd-readout-value"><Roll stagger={25}>{String(s.match === null ? GOALS[GOALS.length - 1] : GOALS[s.match])}</Roll></div>
            </div>
            <div ref={plot} className="sd-plot" data-target="plot" data-cursor="crosshair" style={size}>
              <Chart data={GOALS} {...size} dot={false} />
              <span className="sd-hair" data-on={on || undefined} style={on ? { left: hx! } : undefined} />
              <span className="sd-dot" data-on={on || undefined} style={on ? { left: hx!, top: hy! } : undefined} />
            </div>
            <div className="sd-axis" style={{ width: size.width }}><span>First match</span><span>Latest match</span></div>
            <div className="sd-stats">
              <div><span>Clean sheets</span><strong>5</strong></div>
              <div><span>Position</span><strong>1st</strong></div>
            </div>
          </Workspace>
        );
      }}
    </Stage>
  );
}
