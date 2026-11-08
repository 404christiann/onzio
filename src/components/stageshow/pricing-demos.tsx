"use client";

import { Badge, Check, Collapse, Count, Roll, Row, Segmented, Stage, States, Toggle, Window, type Act } from "@/stageshow/kit";
import { CentralIcon } from "@/components/icons/central/icon";
import "./onzio-look.css";
import "./pricing-demos.css";

// Three pricing pictures with no monthly figure, for clubs, leagues and
// tournaments. Module names are illustrative until Onzio's real add-on list
// is settled.

const ESSENTIALS = ["Website", "Hosting", "Admin portal", "Updates"];

/* ---- 1. Plan builder: pick what you run, then what it needs ---- */

const KINDS = ["Club", "League", "Tournament"];
const OWNER = ["club", "league", "tournament"];
const BUILDER_ADDONS = ["Team registration & waivers", "Online payments", "Schedules & standings", "Tournament brackets", "Staff accounts"];

type BuilderState = { kind: number; on: boolean[]; quote: "idle" | "busy" | "done" };

const builderInitial: BuilderState = { kind: 0, on: [false, false, false, false, false], quote: "idle" };
const builderPoster: BuilderState = { kind: 1, on: [true, false, true, false, false], quote: "done" };

const turnOn = (index: number) => (s: BuilderState) => ({ on: s.on.map((v, i) => (i === index ? true : v)) });

async function builderScript(a: Act<BuilderState>) {
  await a.wait(900);
  a.mark("kind");
  await a.click({ at: "kind-1", x: 0.5, y: 0.55 });
  a.put({ kind: 1 });
  await a.wait(650);
  a.mark("first");
  await a.click({ at: "addon-0", x: 0.5, y: 0.5 });
  a.set(turnOn(0));
  await a.wait(500);
  a.mark("second");
  await a.click({ at: "addon-2", x: 0.5, y: 0.5 });
  a.set(turnOn(2));
  await a.wait(650);
  a.mark("quote");
  await a.click({ at: "quote", x: 0.82, y: 0.6 });
  a.put({ quote: "busy" });
  await a.wait(900);
  a.put({ quote: "done" });
  await a.wait(2400);
}

function addonLabel(count: number) {
  if (count === 0) return "Essentials";
  return `Essentials + ${count} add-on${count === 1 ? "" : "s"}`;
}

export function PlanBuilder() {
  return (
    <div role="img" aria-label="Illustration: a league picks team registration and schedules and standings, and requests a quote for that plan.">
      <Stage<BuilderState>
        width={520}
        height={600}
        compact={{ below: 500, width: 358, height: 600 }}
        initial={builderInitial}
        poster={builderPoster}
        script={builderScript}
        play="once"
        cursor={{ at: { at: "quote", x: 0.7, y: 2.2 }, style: "real" }}
        className="onzio-look pb"
      >
        {s => {
          const count = s.on.filter(Boolean).length;
          return (
            <div className="pb-stack">
              <section className="pb-card pb-summary">
                <Segmented className="pb-kind" items={KINDS} value={s.kind} targets={KINDS.map((_, i) => `kind-${i}`)} cursor="pointer" />
                <div className="pb-who">
                  <div>
                    <strong>Your <Roll variant="fade">{OWNER[s.kind]}</Roll>&rsquo;s plan</strong>
                    <span><Roll variant="fade">{addonLabel(count)}</Roll></span>
                  </div>
                  <Badge className="pb-term">Month-to-month</Badge>
                </div>
                <span className="pb-quote" data-target="quote" data-done={s.quote === "done" || undefined}>
                  <States
                    value={s.quote}
                    states={{
                      idle: <span className="pb-quote-label">Request a quote<CentralIcon name="arrow" width={16} height={16} /></span>,
                      busy: <span className="pb-quote-label"><Check on={false} pending size={16} />Sending</span>,
                      done: <span className="pb-quote-label"><Check on size={16} />Quote requested</span>,
                    }}
                  />
                </span>
              </section>

              <section className="pb-card pb-modules">
                <div className="pb-label">In every plan</div>
                <div className="pb-chips">
                  {ESSENTIALS.map(item => (
                    <span key={item}><CentralIcon name="check" width={14} height={14} />{item}</span>
                  ))}
                </div>
                <div className="pb-label pb-label-gap">Add what you need</div>
                <div className="pb-list">
                  {BUILDER_ADDONS.map((item, i) => (
                    <Row key={item} pad={10} className="pb-row" title={item}>
                      <Toggle on={s.on[i]} data-target={`addon-${i}`} data-cursor="pointer" />
                    </Row>
                  ))}
                </div>
              </section>
            </div>
          );
        }}
      </Stage>
    </div>
  );
}

/* ---- 2. Three organizations: the same platform, three different plans ---- */

const ORGS = [
  { name: "Community club", kind: "A few teams, one season", addons: ["Tryout sign-ups"] },
  { name: "Multi-program academy", kind: "Several programs, year-round", addons: ["Registration & waivers", "Online payments", "Season results"] },
  {
    name: "League or tournament",
    kind: "Many clubs, one schedule",
    addons: ["Team registration & waivers", "Online payments", "Schedules & standings", "Tournament brackets", "Club accounts", "Staff accounts"],
  },
];

const MOST = Math.max(...ORGS.map(org => org.addons.length));

type OrgsState = { shown: number };

async function orgsScript(a: Act<OrgsState>) {
  await a.wait(900);
  for (let i = 3; i <= MOST; i++) {
    a.put({ shown: i });
    await a.wait(300);
  }
  await a.wait(2400);
}

function PlanCard({ org, shown }: { org: (typeof ORGS)[number]; shown: number }) {
  const count = Math.min(shown, org.addons.length);
  const plural = org.addons.length > 1;
  return (
    <section className="cp-card">
      <header className="cp-head">
        <strong>{org.name}</strong>
        <span>{org.kind}</span>
      </header>
      <div className="cp-list">
        <div className="cp-line cp-essentials">
          <Check on size={16} />
          <div><strong>Essentials</strong><span>{ESSENTIALS.join(" · ")}</span></div>
        </div>
        {org.addons.map((item, i) => (
          <Collapse key={item} open={i < shown}>
            <div className="cp-line"><Check on size={16} /><span>{item}</span></div>
          </Collapse>
        ))}
      </div>
      <footer className="cp-foot">
        <span>Monthly plan</span>
        <strong>{plural ? <Count value={count} /> : count} add-on{plural ? "s" : ""}</strong>
      </footer>
    </section>
  );
}

export function ClubPlans() {
  return (
    <div role="img" aria-label="Illustration: a community club's plan has the essentials and one add-on, an academy's has three, and a league or tournament's has six.">
      <Stage<OrgsState>
        width={1052}
        height={468}
        compact={{ below: 900, width: 358, height: 990 }}
        initial={{ shown: 2 }}
        poster={{ shown: MOST }}
        script={orgsScript}
        play="once"
        className="onzio-look cp"
      >
        {s => (
          <div className="cp-row">
            {ORGS.map(org => <PlanCard key={org.name} org={org} shown={s.shown} />)}
          </div>
        )}
      </Stage>
    </div>
  );
}

/* ---- 3. Proposal: the scoped plan, accepted from the page ---- */

const PROPOSAL = ["Team registration & waivers", "Online payments", "Schedules & standings", "Tournament brackets"];

type ProposalState = { accept: "idle" | "busy" | "done" };

async function proposalScript(a: Act<ProposalState>) {
  await a.wait(1200);
  a.mark("accept");
  await a.click({ at: "accept", x: 0.8, y: 0.62 });
  a.put({ accept: "busy" });
  await a.wait(850);
  a.put({ accept: "done" });
  await a.wait(2600);
}

export function ProposalDemo() {
  return (
    <div role="img" aria-label="Illustration: a league's scoped Onzio plan, month-to-month, accepted from the proposal page.">
      <Stage<ProposalState>
        width={560}
        height={552}
        compact={{ below: 520, width: 358, height: 560 }}
        initial={{ accept: "idle" }}
        poster={{ accept: "done" }}
        script={proposalScript}
        play="once"
        cursor={{ at: { at: "accept", x: 0.3, y: 3.2 }, style: "real" }}
        className="onzio-look pp"
      >
        {s => <ProposalScene accept={s.accept} />}
      </Stage>
    </div>
  );
}

function ProposalScene({ accept }: { accept: ProposalState["accept"] }) {
  return (
    <Window url="onzio.com/plan" urlShape="pill" className="pp-window" body={{ className: "pp-doc" }}>
      <div className="pp-head">
        <div className="pp-title">
          <strong>Plan for your league</strong>
          <Badge tone={accept === "done" ? "success" : "neutral"}><Roll variant="fade">{accept === "done" ? "Plan active" : "Ready to review"}</Roll></Badge>
        </div>
        <span className="pp-accept" data-target="accept" data-done={accept === "done" || undefined}>
          <States
            value={accept}
            states={{
              idle: <span className="pp-accept-label">Accept plan</span>,
              busy: <span className="pp-accept-label"><Check on={false} pending size={16} />Accepting</span>,
              done: <span className="pp-accept-label"><Check on size={16} />Accepted</span>,
            }}
          />
        </span>
      </div>
      <div className="pp-label">Scoped with your staff</div>
      <div className="pp-list">
        <div className="pp-line"><Check on size={16} /><div><strong>Essentials</strong><span>{ESSENTIALS.join(" · ")}</span></div></div>
        {PROPOSAL.map(item => (
          <div className="pp-line" key={item}><Check on size={16} /><div><strong>{item}</strong></div></div>
        ))}
      </div>
      <div className="pp-terms">
        <div><span>Billing</span><strong>Month-to-month</strong></div>
        <div><span>Website setup</span><strong>Quoted in this plan</strong></div>
      </div>
    </Window>
  );
}
