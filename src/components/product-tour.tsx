"use client";

import Image from "next/image";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

const tabs = [
  {
    id: "website",
    label: "Website",
    title: <>Keep your website<br />as current as your club.</>,
    description: "Update the pages your community sees from one focused workspace.",
    benefits: ["Homepage, programs, and tryouts", "Club details and sponsors", "Updates without a developer"],
  },
  {
    id: "competition",
    label: "Competition",
    title: <>All the details.<br />One organized season.</>,
    description: "Keep your roster, schedule, results, and standings close at hand.",
    benefits: ["Players and staff in one roster", "Fixtures and match results", "Standings and season stats"],
  },
  {
    id: "staff",
    label: "Staff access",
    title: <>The right people.<br />The right access.</>,
    description: "Give approved club staff a shared place to keep the club moving.",
    benefits: ["Approved staff invitations", "Clear administrative access", "Public and staff spaces kept separate"],
  },
  {
    id: "analytics",
    label: "Analytics",
    title: <>A clearer view<br />of your club’s progress.</>,
    description: "See website activity alongside the numbers that tell your season’s story.",
    benefits: ["Website activity at a glance", "Match and player performance", "A clear season overview"],
  },
] as const;

type TabId = (typeof tabs)[number]["id"];
type IconName = TabId | "grid" | "check" | "arrow" | "calendar" | "lock";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    website: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18" /></>,
    competition: <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM12 13v6M8 21h8M8 6H5v2a4 4 0 0 0 4 4M16 6h3v2a4 4 0 0 1-4 4" />,
    staff: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2-6 6-6s6 2 6 6M16 5a3 3 0 0 1 0 6M18 15c2 1 3 2 3 5" /></>,
    analytics: <path d="M5 20V10M12 20V4M19 20v-7M3 20h18" />,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
  };
  return <svg className="tour-icon" aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function PreviewFrame({ children, icon, footer }: { children: ReactNode; icon: IconName; footer: string }) {
  return (
    <div className="focused-preview">
      <header className="focused-preview-chrome">
        <div className="focused-club-mark">
          <Image src="/diverse-city-fc-logo.png" alt="" width={28} height={28} unoptimized />
          <div><strong>Diverse City FC</strong><small>Onzio workspace</small></div>
        </div>
        <span>Sample view</span>
      </header>
      <div className="focused-preview-body">{children}</div>
      <div className="focused-preview-footer"><Icon name={icon} />{footer}</div>
    </div>
  );
}

function PreviewHeading({ title, status, description }: { title: string; status: string; description: string }) {
  return <><div className="focused-preview-heading"><h3>{title}</h3><span className="focused-status">{status}</span></div><p className="focused-preview-description">{description}</p></>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="focused-metric"><span>{label}</span><strong>{value}</strong></div>;
}

function WebsitePreview() {
  const pages = [
    { title: "Homepage", description: "Hero, announcements, and featured content", icon: "grid" },
    { title: "Programs", description: "A place for every player", icon: "calendar" },
    { title: "Tryouts", description: "Dates, details, and what to expect", icon: "competition" },
    { title: "Sponsors", description: "The partners behind your club", icon: "staff" },
  ] as const;
  return (
    <PreviewFrame icon="website" footer="diversecityfc.com · Sample website">
      <PreviewHeading title="Your club website" status="Live" description="Keep the pages your community visits up to date." />
      <ul className="focused-page-list">
        {pages.map(page => <li key={page.title}><span className="focused-page-icon"><Icon name={page.icon} /></span><div><strong>{page.title}</strong><small>{page.description}</small></div><span className="focused-status focused-status-muted">Published</span><span className="focused-page-arrow"><Icon name="arrow" /></span></li>)}
      </ul>
    </PreviewFrame>
  );
}

function CompetitionPreview() {
  const standings = [["Diverse City FC", 8, 2, 1, 26], ["Chicago Nation", 7, 2, 2, 23], ["Edgewater Castle", 6, 3, 2, 21]] as const;
  return (
    <PreviewFrame icon="competition" footer="Illustrative season data">
      <PreviewHeading title="The season so far" status="2026" description="First team · Premier Division" />
      <div className="focused-metrics"><Metric label="Rostered players" value="24" /><Metric label="Matches played" value="11" /><Metric label="League position" value="1st" /></div>
      <table className="focused-standings"><caption>League standings</caption><thead><tr>{["Club", "W", "D", "L", "Pts"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{standings.map(([club, ...stats]) => <tr key={club}><th scope="row">{club}</th>{stats.map((stat, i) => <td key={i}>{stat}</td>)}</tr>)}</tbody></table>
    </PreviewFrame>
  );
}

function StaffPreview() {
  const staff = [["CA", "Christian Alcala", "Club administrator"], ["JR", "Jamie Rivera", "Club staff"], ["AM", "Alex Morgan", "Club staff"]];
  return (
    <PreviewFrame icon="lock" footer="Staff workspace · Sample access view">
      <PreviewHeading title="Your club staff" status="3 members" description="A shared workspace for the people behind the club." />
      <ul className="focused-staff-list">{staff.map(([initials, name, role]) => <li key={name}><span className="focused-avatar" aria-hidden="true">{initials}</span><div><strong>{name}</strong><small>{role}</small></div><span className="focused-status">Active</span></li>)}</ul>
    </PreviewFrame>
  );
}

function AnalyticsPreview() {
  const bars = [32, 49, 43, 63, 55, 81, 70, 95, 84, 100];
  return (
    <PreviewFrame icon="analytics" footer="Illustrative activity and performance data">
      <PreviewHeading title="Your club in numbers" status="2026 season" description="Activity and performance, brought together." />
      <div className="focused-metrics"><Metric label="Website visits" value="8,426" /><Metric label="Goals scored" value="26" /><Metric label="Clean sheets" value="5" /></div>
      <h4 className="focused-chart-title">Website activity</h4>
      <div className="focused-chart" role="img" aria-label="Illustrative website activity chart trending upward across the season">{bars.map((height, index) => <span key={index} style={{ "--bar-height": `${height}%` } as CSSProperties} />)}</div>
      <div className="focused-chart-labels"><span>Start of season</span><span>Now</span></div>
    </PreviewFrame>
  );
}

const previews = { website: WebsitePreview, competition: CompetitionPreview, staff: StaffPreview, analytics: AnalyticsPreview };

export function ProductTour() {
  const [active, setActive] = useState<TabId>("website");
  const activeIndex = tabs.findIndex(tab => tab.id === active);
  const tourId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight": nextIndex = (index + 1) % tabs.length; break;
      case "ArrowLeft": nextIndex = (index + tabs.length - 1) % tabs.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActive(tabs[nextIndex].id);
    buttons.current[nextIndex]?.focus();
  }

  return (
    <div className="focused-tour">
      <div className="focused-tabs" role="tablist" aria-label="Explore Onzio club tools" style={{ "--active-index": activeIndex, "--active-column": activeIndex % 2, "--active-row": Math.floor(activeIndex / 2) } as CSSProperties}>
        <span className="focused-tab-indicator" aria-hidden="true" />
        {tabs.map((tab, index) => <button key={tab.id} type="button" id={`${tourId}-tab-${tab.id}`} role="tab" aria-selected={active === tab.id} aria-controls={`${tourId}-panel-${tab.id}`} tabIndex={active === tab.id ? 0 : -1} ref={node => { buttons.current[index] = node; }} onClick={() => setActive(tab.id)} onKeyDown={event => handleKeyDown(event, index)}><Icon name={tab.id} />{tab.label}</button>)}
      </div>
      {tabs.map(tab => {
        const Preview = previews[tab.id];
        return <div key={tab.id} className="focused-tour-panel" id={`${tourId}-panel-${tab.id}`} role="tabpanel" aria-labelledby={`${tourId}-tab-${tab.id}`} tabIndex={0} hidden={active !== tab.id}>
          <div className="focused-tour-copy"><h3>{tab.title}</h3><p>{tab.description}</p><ul>{tab.benefits.map(benefit => <li key={benefit}><Icon name="check" />{benefit}</li>)}</ul></div>
          <Preview />
        </div>;
      })}
      <div className="focused-tour-caption"><span><Icon name="grid" />Illustrative Onzio workspace · Diverse City FC</span><span><Icon name="check" />One login. A clearer club day.</span></div>
    </div>
  );
}
