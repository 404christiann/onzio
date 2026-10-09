"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties } from "react";
import { CentralIcon, type CentralIconName } from "@/components/icons/central/icon";
import styles from "./staff-tools.module.css";

const tools = [
  { id: "website", title: "Update your website", subtitle: "Publish without a developer.", copy: "Keep your homepage, programs, tryouts, sponsors, and club details current.", label: "Website" },
  { id: "competition", title: "Run the season", subtitle: "Keep every match in order.", copy: "Manage rosters, schedules, results, standings, and season stats together.", label: "Competition" },
  { id: "staff", title: "Bring your staff together", subtitle: "Give the right people access.", copy: "Invite approved club staff to a workspace separate from the public site.", label: "Staff access" },
  { id: "analytics", title: "Understand the season", subtitle: "See how your club is progressing.", copy: "Review match and player performance in one clear view.", label: "Analytics" },
] as const;

type ToolId = (typeof tools)[number]["id"];

function Icon({ name }: { name: CentralIconName }) {
  return <CentralIcon name={name} className={styles.icon} />;
}

function ViewHeading({ title, description }: { title: string; description: string }) {
  return <div className={styles["view-head"]}><h4>{title}</h4><p>{description}</p></div>;
}

function WebsiteView() {
  const pages = [
    ["Homepage", "Club news and what’s next", "website"],
    ["Programs", "A place for every player", "calendar"],
    ["Tryouts", "Dates, details, and what to expect", "competition"],
    ["Sponsors", "The partners behind your club", "staff"],
  ] as const;
  return <>
    <ViewHeading title="Your club website" description="The pages your community comes to find." />
    <ul className={styles["page-list"]}>{pages.map(([title, copy, icon]) => <li className={styles["page-row"]} key={title}>
      <Icon name={icon} /><div><strong>{title}</strong><small>{copy}</small></div><span className={styles.badge}>Published</span>
    </li>)}</ul>
  </>;
}

function Metrics({ values }: { values: readonly (readonly [string, string])[] }) {
  return <div className={styles["metric-row"]}>{values.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function CompetitionView() {
  const standings = [["Diverse City FC", 8, 2, 1, 26], ["Club two", 7, 2, 2, 23], ["Club three", 6, 3, 2, 21]] as const;
  return <>
    <ViewHeading title="The season so far" description="First team · 2026 season" />
    <Metrics values={[["Roster", "24"], ["Matches played", "11"], ["Points", "26"]]} />
    <table className={styles.standings}><caption>League standings</caption><thead><tr>{["Club", "W", "D", "L", "Pts"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
      <tbody>{standings.map(([club, ...stats]) => <tr key={club}><th scope="row">{club}</th>{stats.map((stat, index) => <td key={index}>{stat}</td>)}</tr>)}</tbody>
    </table>
  </>;
}

function StaffView() {
  const staff = [["CA", "Christian Alcala", "Club administrator"], ["JR", "Jamie Rivera", "Club staff"], ["AM", "Alex Morgan", "Club staff"]];
  return <>
    <ViewHeading title="Your club staff" description="A shared workspace for approved people." />
    <ul className={styles["staff-list"]}>{staff.map(([initials, name, role]) => <li className={styles["staff-row"]} key={name}>
      <span className={styles.avatar} aria-hidden="true">{initials}</span><div><strong>{name}</strong><small>{role}</small></div><span className={styles.badge}>Active</span>
    </li>)}</ul>
  </>;
}

function AnalyticsView() {
  const goals = [1, 2, 2, 3, 1, 4, 2, 4, 3, 4];
  return <>
    <ViewHeading title="Your season in numbers" description="A clearer view of match and player performance." />
    <Metrics values={[["Goals scored", "26"], ["Clean sheets", "5"], ["Position", "1st"]]} />
    <h5 className={styles["chart-title"]}>Goals per match</h5>
    <div className={styles.bars} role="img" aria-label="Illustrative goals across ten matches: 1, 2, 2, 3, 1, 4, 2, 4, 3, 4.">{goals.map((value, index) => <span key={index} style={{ "--bar-height": `${value * 22}%` } as CSSProperties} />)}</div>
    <div className={styles["bar-labels"]}><span>First match</span><span>Latest match</span></div>
  </>;
}

const views = { website: WebsiteView, competition: CompetitionView, staff: StaffView, analytics: AnalyticsView };

function Preview({ active, labelId }: { active: ToolId; labelId: string }) {
  const View = views[active];
  const tool = tools.find(tool => tool.id === active)!;
  return <div className={styles.stage} role="region" aria-labelledby={labelId}>
    <div className={styles["workspace-card"]}>
      <header className={styles["workspace-chrome"]}>
        <div><Image src="/diverse-city-fc-logo.png" alt="" width={28} height={28} unoptimized /><span>Diverse City FC</span></div>
        <span className={styles["chrome-context"]}>{tool.label}</span>
      </header>
      <div className={styles["workspace-body"]}><View /></div>
      <footer className={styles["workspace-footer"]}><span>Illustrative Onzio workspace</span><Icon name={active} /></footer>
    </div>
  </div>;
}

export function StaffTools() {
  const [active, setActive] = useState<ToolId>("website");
  const id = useId();
  return <section className={styles.section} id="staff-tools" aria-labelledby={`${id}-title`}>
    <div className="shell">
    <header className={styles["section-head"]}>
      <h2 id={`${id}-title`}>The tools your staff<br />will actually use.</h2>
      <p>The everyday work behind a great club.<br />All in one place. Easy to keep moving.</p>
    </header>
    <div className={styles["tool-layout"]}>
      <div className={styles["tool-index"]}>{tools.map(tool => {
        const expanded = active === tool.id;
        const labelId = `${id}-${tool.id}-button`;
        return <article className={`${styles["tool-entry"]}${expanded ? ` ${styles["is-open"]}` : ""}`} key={tool.id}>
          <h3><button className={styles["tool-trigger"]} type="button" id={labelId} aria-expanded={expanded} aria-controls={`${id}-${tool.id}-detail`} onClick={() => setActive(tool.id)}>
            <Icon name={tool.id} /><span>{tool.title}</span><CentralIcon className={styles.toggle} name={expanded ? "minus" : "plus"} width={24} height={24} />
          </button></h3>
          <div id={`${id}-${tool.id}-detail`} className={styles["tool-detail"]} hidden={!expanded}>
            <div className={styles["tool-copy"]}><p>{tool.copy}</p><span className={styles["text-label"]}>{tool.subtitle}</span></div>
            {expanded ? <div className={styles["mobile-preview"]}><Preview active={active} labelId={labelId} /></div> : null}
          </div>
        </article>;
      })}</div>
      <div className={styles["desktop-preview"]}><Preview active={active} labelId={`${id}-${active}-button`} /></div>
    </div>
    <footer className={styles["section-foot"]}><span>Built for the work behind the club.</span><span>Illustrative product views · Diverse City FC</span></footer>
    </div>
  </section>;
}
