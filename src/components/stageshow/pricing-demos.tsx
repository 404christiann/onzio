"use client";

import { Badge, Check, Roll, Row, Segmented, Stage, States, Toggle, Window, type Act } from "@/stageshow/kit";
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

/* ---- Homepage: what every plan includes, then what clubs and leagues add ---- */

// No cursor and no prices: the plan's parts tick on, the base first, then
// both kinds of organization's features together, and the full plan holds.
// Three designs so the text never shrinks far or grows: desktop, tablet, and
// a phone stack with clubs first.

const PLAN_INCLUDES = ["Website", "Hosting", "Admin", "Updates"];
const PLAN_GROUPS = [
  {
    title: "For clubs and academies",
    description: "Run your teams, players, and families.",
    features: ["Tryout sign-ups", "Registration & waivers", "Online payments", "Rosters", "Schedules", "Season results"],
  },
  {
    title: "For leagues and tournaments",
    description: "Run many clubs on one schedule.",
    features: ["Team registration & waivers", "Schedules & standings", "Tournament brackets", "Club accounts", "Staff accounts", "Online payments"],
  },
];

const ROWS = Math.max(...PLAN_GROUPS.map(group => group.features.length));
// Steps 1-4 tick the base, then each step ticks one row in both columns.
const LAST_STEP = PLAN_INCLUDES.length + ROWS;

type PlanState = { step: number };

async function planScript(a: Act<PlanState>) {
  await a.wait(500);
  for (let step = 1; step <= LAST_STEP; step++) {
    a.put({ step });
    await a.wait(step <= PLAN_INCLUDES.length ? 110 : 170);
  }
  await a.wait(1200);
}

function PlanParts({ step }: PlanState) {
  return (
    <div className="pl-plan">
      <div className="pl-card pl-includes">
        <strong>Every plan includes</strong>
        <ul>
          {PLAN_INCLUDES.map((item, i) => (
            <li key={item}><Check on={step > i} size={16} />{item}</li>
          ))}
        </ul>
      </div>
      <div className="pl-groups">
        {PLAN_GROUPS.map(group => (
          <div key={group.title} className="pl-card pl-group">
            <strong>{group.title}</strong>
            <span>{group.description}</span>
            <ul>
              {group.features.map((feature, i) => (
                <li key={feature}><Check on={step > PLAN_INCLUDES.length + i} size={16} />{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const PLAN_LABEL = `Every plan includes ${PLAN_INCLUDES.join(", ")}. For clubs and academies: ${PLAN_GROUPS[0]!.features.join(", ")}. For leagues and tournaments: ${PLAN_GROUPS[1]!.features.join(", ")}.`;

/** "desktop" is 1180 wide, with a 720 tablet design below 1000px of column; "phone" is the 358 stack. */
export function PlanFeatures({ size }: { size: "desktop" | "phone" }) {
  const dims = size === "desktop"
    ? { width: 1180, height: 392, compact: { below: 1000, width: 720, height: 412 } }
    : { width: 358, height: 788 };
  return (
    <div role="img" aria-label={PLAN_LABEL}>
      <Stage<PlanState> {...dims} initial={{ step: 0 }} poster={{ step: LAST_STEP }} script={planScript} play="once" className={`onzio-look pl pl-${size}`}>
        {s => <PlanParts step={s.step} />}
      </Stage>
    </div>
  );
}
