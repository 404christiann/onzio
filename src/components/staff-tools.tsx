"use client";

import { useId, useState } from "react";
import { CentralIcon, type CentralIconName } from "@/components/icons/central/icon";
import { AnalyticsDemo, SeasonDemo, StaffDemo, WebsiteDemo } from "@/components/stageshow/staff-demos";
import styles from "./staff-tools.module.css";

const tools = [
  { id: "website", title: "Update your website", subtitle: "Publish without a developer.", copy: "Keep your homepage, programs, tryouts, sponsors, and club details current." },
  { id: "competition", title: "Run the season", subtitle: "Keep every match in order.", copy: "Manage rosters, schedules, results, standings, and season stats together." },
  { id: "staff", title: "Bring your staff together", subtitle: "Give the right people access.", copy: "Invite approved club staff to a workspace separate from the public site." },
  { id: "analytics", title: "Understand the season", subtitle: "See how your club is progressing.", copy: "Review match and player performance in one clear view." },
] as const;

type ToolId = (typeof tools)[number]["id"];

function Icon({ name }: { name: CentralIconName }) {
  return <CentralIcon name={name} className={styles.icon} />;
}

const demos = { website: WebsiteDemo, competition: SeasonDemo, staff: StaffDemo, analytics: AnalyticsDemo };

const descriptions: Record<ToolId, string> = {
  website: "Illustration: a staff member publishes the Tryouts page, and it goes live on the club website.",
  competition: "Illustration: a staff member enters a 3-1 result, and Diverse City FC moves to the top of the league standings.",
  staff: "Illustration: a club administrator invites a new staff member by email, and they join the staff list.",
  analytics: "Illustration: a chart of goals across the season, read back match by match up to 26 goals.",
};

function Preview({ active, labelId }: { active: ToolId; labelId: string }) {
  const Demo = demos[active];
  return <div className={styles.stage} role="region" aria-labelledby={labelId}>
    <div className={styles.demo} key={active} role="img" aria-label={descriptions[active]}><Demo /></div>
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
