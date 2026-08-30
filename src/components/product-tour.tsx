"use client";

import Image from "next/image";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { useState } from "react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "website", label: "Website", icon: "website" },
  { id: "competition", label: "Competition", icon: "competition" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
] as const;

type TabId = (typeof tabs)[number]["id"];
type IconName =
  | "dashboard"
  | "website"
  | "competition"
  | "analytics"
  | "registrations"
  | "settings"
  | "payments"
  | "search"
  | "sun"
  | "chevron"
  | "users"
  | "calendar"
  | "file"
  | "card"
  | "arrow";

const Icon = ({ name }: { name: IconName }) => {
  const paths: Record<IconName, ReactNode> = {
    dashboard: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
    website: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.3 3 14.7 0 18M12 3c-3 3.3-3 14.7 0 18" /></>,
    competition: <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM9 19h6M12 13v6M7.5 6H5v2a4 4 0 0 0 4 4M16.5 6H19v2a4 4 0 0 1-4 4" />,
    analytics: <path d="M5 20V10M12 20V4M19 20v-7M3 20h18" />,
    registrations: <path d="M7 3h10v4H7zM5 6h14v15H5zM8 11h8M8 15h5" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 13.5v-3l-2-.6-.7-1.7 1-1.8-2.1-2.1-1.8 1-1.7-.7L11 3H8l-.6 2-1.7.7-1.8-1-2.1 2.1 1 1.8-.7 1.7L0 11v3l2 .6.7 1.7-1 1.8 2.1 2.1 1.8-1 1.7.7L8 22h3l.6-2 1.7-.7 1.8 1 2.1-2.1-1-1.8.7-1.7z" transform="scale(.9) translate(1.3 1.3)" /></>,
    payments: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h4" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    users: <><circle cx="9" cy="9" r="3" /><path d="M3.5 19c.7-3.2 2.5-5 5.5-5s4.8 1.8 5.5 5M16 10.5a2.5 2.5 0 1 0 0-5M16 14c2.5.1 4 1.5 4.5 4" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
    file: <><path d="M6 3h8l4 4v14H6zM14 3v5h5M9 12h6M9 16h6" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
};

const tabLabel: Record<TabId, string> = {
  dashboard: "Dashboard",
  website: "Website",
  competition: "Competition",
  analytics: "Analytics",
};

function SidebarLink({ icon, label, active, onClick }: { icon: IconName; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button type="button" className={`admin-demo-nav-link${active ? " active" : ""}`} onClick={onClick} tabIndex={onClick ? 0 : -1}>
      <Icon name={icon} />
      <span>{label}</span>
      {(label === "Website" || label === "Competition" || label === "Club Settings") && <Icon name="chevron" />}
    </button>
  );
}

function AppChrome({ children, active, onSelect }: { children: ReactNode; active: TabId; onSelect: (tab: TabId) => void }) {
  return (
    <div className="product-window">
      <aside className="product-sidebar" aria-label="Demo admin navigation">
        <div className="demo-club-mark"><Image className="demo-club-logo" src="/diverse-city-fc-logo.png" alt="" width={750} height={750} /><div><strong>Diverse City FC</strong><small>Club administration</small></div></div>
        <nav className="product-side-nav">
          <SidebarLink icon="dashboard" label="Dashboard" active={active === "dashboard"} onClick={() => onSelect("dashboard")} />
          <SidebarLink icon="website" label="Website" active={active === "website"} onClick={() => onSelect("website")} />
          {active === "website" && <div className="admin-demo-subnav" aria-hidden="true"><span className="active">Homepage</span><span>Programs</span><span>Tryouts</span><span>Sponsors</span></div>}
          <SidebarLink icon="competition" label="Competition" active={active === "competition"} onClick={() => onSelect("competition")} />
          {active === "competition" && <div className="admin-demo-subnav" aria-hidden="true"><span>Seasons</span><span className="active">Roster</span><span>Schedule</span><span>Standings</span></div>}
          <SidebarLink icon="registrations" label="Registrations" />
          <SidebarLink icon="analytics" label="Analytics" active={active === "analytics"} onClick={() => onSelect("analytics")} />
          <SidebarLink icon="settings" label="Club Settings" />
          <SidebarLink icon="payments" label="Payments" />
        </nav>
        <div className="product-side-bottom"><span>Powered by</span><strong>ONZIO</strong></div>
      </aside>
      <div className="product-main">
        <header className="product-topbar">
          <Image className="mobile-demo-mark" src="/diverse-city-fc-logo.png" alt="" width={750} height={750} />
          <strong className="admin-demo-current-route">{tabLabel[active]}</strong>
          <button type="button" className="product-search" tabIndex={-1} aria-hidden="true"><Icon name="search" /><span>Search admin</span><kbd>⌘ K</kbd></button>
          <button type="button" className="admin-demo-icon-button" tabIndex={-1} aria-hidden="true"><Icon name="sun" /></button>
          <span className="product-user" aria-hidden="true">CA</span>
        </header>
        {children}
      </div>
    </div>
  );
}

function PageHeading({ title, description }: { title: string; description: string }) {
  return <header className="admin-demo-page-heading"><div><h3>{title}</h3><p>{description}</p></div></header>;
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return <article className="admin-demo-card admin-demo-metric"><span>{label}</span><strong>{value}</strong></article>;
}

function DashboardPanel() {
  const actions = [["registrations", "Registrations", "Build and review forms"], ["users", "Manage Roster", "Players and staff"], ["calendar", "Manage Schedule", "Fixtures and events"], ["card", "Payments", "Plan and billing"]] as const;
  return (
    <div className="product-panel-content">
      <PageHeading title="Dashboard" description="2026 season overview" />
      <section className="admin-demo-metrics" aria-label="Club statistics"><MetricCard label="Active Players" value="24" /><MetricCard label="Active Staff" value="6" /><MetricCard label="Season Matches" value="18" /><MetricCard label="Paid Registrations" value="42" /></section>
      <section className="admin-demo-section">
        <h4>Quick Actions</h4>
        <div className="admin-demo-actions">{actions.map(([icon, title, detail]) => <article className="admin-demo-action" key={title}><span><Icon name={icon} /></span><div><strong>{title}</strong><small>{detail}</small></div></article>)}</div>
      </section>
      <div className="admin-demo-two-column">
        <section className="admin-demo-card admin-demo-list-card">
          <div className="admin-demo-card-heading"><div><h4>Registration Forms</h4></div><span>View all</span></div>
          <ul><li><div><strong>UPSL Open Tryouts</strong><small>Created Aug 24, 2026</small></div><span className="admin-demo-status">Open</span></li><li><div><strong>Special Kickers</strong><small>Created Aug 20, 2026</small></div><span className="admin-demo-status muted">Draft</span></li><li><div><strong>Fall Youth Program</strong><small>Created Aug 14, 2026</small></div><span className="admin-demo-status">Open</span></li></ul>
        </section>
        <section className="admin-demo-card admin-demo-list-card">
          <div className="admin-demo-card-heading"><div><h4>Upcoming Fixtures &amp; Events</h4></div><span>View schedule</span></div>
          <ul><li><time><small>SEP</small><strong>06</strong></time><div><strong>vs. Chicago Nation</strong><small>7:00 PM · Home</small></div><span className="admin-demo-event-type">Match</span></li><li><time><small>SEP</small><strong>12</strong></time><div><strong>UPSL Open Tryouts</strong><small>6:30 PM · Training Center</small></div><span className="admin-demo-event-type">Tryout</span></li><li><time><small>SEP</small><strong>19</strong></time><div><strong>at Edgewater Castle</strong><small>8:00 PM · Away</small></div><span className="admin-demo-event-type">Match</span></li></ul>
        </section>
      </div>
    </div>
  );
}

function WebsitePanel() {
  const pages = ["Homepage", "Programs", "Tryouts", "Shop", "About", "Sponsors", "Contact"];
  return (
    <div className="product-panel-content">
      <PageHeading title="Website" description="Manage the pages and content your supporters see." />
      <div className="admin-demo-page-grid">{pages.map((page, index) => <article className="admin-demo-card admin-demo-page-card" key={page}><span><Icon name={index === 0 ? "dashboard" : index < 3 ? "calendar" : "file"} /></span><div><h4>{page}</h4><p>{index === 0 ? "Hero, announcements, and featured content" : "Published content and page settings"}</p></div><Icon name="arrow" /></article>)}</div>
      <section className="admin-demo-card admin-demo-publish-card"><div><span className="admin-demo-live-dot" /><div><h4>Public website is live</h4><p>diversecityfc.com · Updated 2 hours ago</p></div></div><span className="admin-demo-outline-button">View live site ↗</span></section>
    </div>
  );
}

function CompetitionPanel() {
  const standings = [["1", "Diverse City FC", "8", "2", "1", "26"], ["2", "Chicago Nation", "7", "2", "2", "23"], ["3", "Edgewater Castle", "6", "3", "2", "21"], ["4", "Rockford United", "5", "2", "4", "17"]];
  return (
    <div className="product-panel-content">
      <PageHeading title="Competition" description="Roster, schedule, results, and standings." />
      <section className="admin-demo-metrics admin-demo-metrics-three" aria-label="Season statistics"><MetricCard label="Rostered Players" value="24" /><MetricCard label="Matches Played" value="11" /><MetricCard label="League Position" value="1st" /></section>
      <div className="admin-demo-two-column competition">
        <section className="admin-demo-card admin-demo-standings"><div className="admin-demo-card-heading"><div><h4>League Standings</h4><p>Premier Division · Matchday 11</p></div><span>View all</span></div><div className="admin-demo-table-row header"><span>#</span><span>Club</span><span>W</span><span>D</span><span>L</span><span>Pts</span></div>{standings.map((row) => <div className={`admin-demo-table-row${row[0] === "1" ? " current" : ""}`} key={row[0]}>{row.map((cell, index) => <span key={`${row[0]}-${index}`}>{cell}</span>)}</div>)}</section>
        <section className="admin-demo-card admin-demo-list-card"><div className="admin-demo-card-heading"><div><h4>Active Roster</h4><p>First team</p></div><span>Manage</span></div><ul>{[["01", "Mateo Cruz", "Goalkeeper"], ["04", "Elias Romero", "Defender"], ["08", "Noah Bennett", "Midfielder"], ["11", "Julian Torres", "Forward"]].map(([number, name, position]) => <li key={number}><b className="admin-demo-number">{number}</b><div><strong>{name}</strong><small>{position}</small></div><Icon name="arrow" /></li>)}</ul></section>
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const bars = [44, 72, 55, 88, 66, 92, 76, 100, 82, 96, 90, 100];
  return (
    <div className="product-panel-content">
      <PageHeading title="Analytics" description="Understand club activity and season performance." />
      <section className="admin-demo-metrics" aria-label="Performance statistics"><MetricCard label="Site Visits" value="8,426" /><MetricCard label="Goals Scored" value="26" /><MetricCard label="Clean Sheets" value="5" /><MetricCard label="League Points" value="26" /></section>
      <div className="admin-demo-two-column analytics">
        <section className="admin-demo-card admin-demo-chart-card"><div className="admin-demo-card-heading"><div><h4>Website Activity</h4><p>Last 12 months</p></div><span>+18.4%</span></div><div className="admin-demo-chart" aria-label="Decorative website activity chart">{bars.map((height, index) => <span key={index} style={{ "--bar-height": `${height}%` } as CSSProperties} />)}</div><div className="admin-demo-chart-labels"><span>Sep</span><span>Dec</span><span>Mar</span><span>Jun</span><span>Aug</span></div></section>
        <section className="admin-demo-card admin-demo-list-card"><div className="admin-demo-card-heading"><div><h4>Top Performers</h4><p>2026 season</p></div></div><ul><li><b className="admin-demo-rank">1</b><div><strong>Julian Torres</strong><small>Forward</small></div><span className="admin-demo-stat">9 goals</span></li><li><b className="admin-demo-rank">2</b><div><strong>Noah Bennett</strong><small>Midfielder</small></div><span className="admin-demo-stat">7 assists</span></li><li><b className="admin-demo-rank">3</b><div><strong>Mateo Cruz</strong><small>Goalkeeper</small></div><span className="admin-demo-stat">5 clean sheets</span></li></ul></section>
      </div>
    </div>
  );
}

const panels: Record<TabId, ReactNode> = { dashboard: <DashboardPanel />, website: <WebsitePanel />, competition: <CompetitionPanel />, analytics: <AnalyticsPanel /> };

export function ProductTour() {
  const [active, setActive] = useState<TabId>("dashboard");
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    setActive(tabs[nextIndex].id);
    document.getElementById(`product-tab-${tabs[nextIndex].id}`)?.focus();
  };
  return (
    <div className="product-tour">
      <div className="product-tabs" role="tablist" aria-label="Onzio admin portal areas">{tabs.map((tab, index) => <button id={`product-tab-${tab.id}`} type="button" role="tab" aria-selected={active === tab.id} aria-controls={`product-panel-${tab.id}`} tabIndex={active === tab.id ? 0 : -1} className={active === tab.id ? "active" : ""} onClick={() => setActive(tab.id)} onKeyDown={(event) => handleKeyDown(event, index)} key={tab.id}><Icon name={tab.icon} />{tab.label}</button>)}</div>
      <div className="product-stage"><div id={`product-panel-${active}`} role="tabpanel" aria-labelledby={`product-tab-${active}`} className="product-panel" key={active}><AppChrome active={active} onSelect={setActive}>{panels[active]}</AppChrome></div></div>
    </div>
  );
}
