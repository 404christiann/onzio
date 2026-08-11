"use client";

import { KeyboardEvent, useState } from "react";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "website", label: "Website" },
  { id: "competition", label: "Competition" },
  { id: "analytics", label: "Analytics" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Icon = ({ name }: { name: "home" | "globe" | "trophy" | "chart" | "users" | "calendar" | "image" | "settings" | "check" | "ball" | "goal" | "shield" }) => {
  const paths = {
    home: <><path d="m4 11 8-7 8 7"/><path d="M6 10v10h12V10M10 20v-6h4v6"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.3 3 14.7 0 18M12 3c-3 3.3-3 14.7 0 18"/></>,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM9 19h6M12 13v6M7.5 6H5v2a4 4 0 0 0 4 4M16.5 6H19v2a4 4 0 0 1-4 4"/></>,
    chart: <><path d="M5 20V9M12 20V4M19 20v-7M3 20h18"/></>,
    users: <><circle cx="9" cy="9" r="3"/><path d="M3.5 19c.7-3.2 2.5-5 5.5-5s4.8 1.8 5.5 5M16 10.5a2.5 2.5 0 1 0 0-5M16 14c2.5.1 4 1.5 4.5 4"/></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/></>,
    image: <><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.5"/><path d="m5 17 5-5 3 3 2-2 4 4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.6a7 7 0 0 0-.7-1.7l1-1.8-2.1-2.1-1.8 1a7 7 0 0 0-1.7-.7L11 3H8l-.6 2a7 7 0 0 0-1.7.7l-1.8-1-2.1 2.1 1 1.8a7 7 0 0 0-.7 1.7L0 11v3l2 .6a7 7 0 0 0 .7 1.7l-1 1.8 2.1 2.1 1.8-1a7 7 0 0 0 1.7.7L8 22h3l.6-2a7 7 0 0 0 1.7-.7l1.8 1 2.1-2.1-1-1.8a7 7 0 0 0 .7-1.7l2.1-.7Z" transform="scale(.9) translate(1.3 1.3)"/></>,
    check: <path d="m5 12 4 4 10-10"/>,
    ball: <><circle cx="12" cy="12" r="9"/><path d="M12 7.4 16.4 10.6 14.7 15.8H9.3L7.6 10.6Z"/><path d="M12 3v4.4M3.4 9.2l4.2 1.4M20.6 9.2l-4.2 1.4M6.7 19.3l2.6-3.5M17.3 19.3l-2.6-3.5"/></>,
    goal: <><path d="M4 19V6.5h16V19"/><path d="M8 6.5V19M12 6.5V19M16 6.5V19M4 12.5h16"/><path d="M2 19h20"/></>,
    shield: <><path d="M12 3.5 19 6v5.5c0 4.6-2.9 7.6-7 9.2-4.1-1.6-7-4.6-7-9.2V6Z"/><path d="m9.2 11.8 2 2 3.8-3.8"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
};

function AppChrome({ children, active }: { children: React.ReactNode; active: TabId }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "home" as const },
    { id: "website", label: "Website", icon: "globe" as const },
    { id: "competition", label: "Competition", icon: "trophy" as const },
    { id: "analytics", label: "Analytics", icon: "chart" as const },
  ];

  return (
    <div className="product-window">
      <aside className="product-sidebar" aria-hidden="true">
        <div className="demo-club-mark"><span>O</span><div><strong>Onzio Demo Club</strong><small>Club admin</small></div></div>
        <div className="product-side-nav">
          {nav.map((item) => <div className={item.id === active ? "active" : ""} key={item.id}><Icon name={item.icon} /><span>{item.label}</span></div>)}
        </div>
        <div className="product-side-bottom"><Icon name="settings" /><span>Club settings</span></div>
      </aside>
      <div className="product-main">
        <div className="product-topbar" aria-hidden="true">
          <span className="mobile-demo-mark">O</span>
          <div className="product-search">Search the club</div>
          <div className="product-user"><span>CA</span><div><strong>Christian A.</strong><small>Owner</small></div></div>
        </div>
        {children}
      </div>
    </div>
  );
}

function DashboardPanel() {
  return (
    <div className="product-panel-content">
      <div className="panel-heading"><div><p>Monday, August 10</p><h3>Good morning, Christian.</h3></div><span className="mock-button">Quick publish <span>+</span></span></div>
      <article className="preview-card match-hero">
        <div className="match-hero-top"><small>Next match · Premier Division</small><div><span className="tag">HOME</span><span className="days-chip">In 5 days</span></div></div>
        <div className="match-hero-teams">
          <div className="match-hero-team"><span className="mini-crest onzio">O</span><strong>Onzio Demo Club</strong><small>1st · 24 pts</small></div>
          <div className="match-hero-kickoff"><strong>7:00 PM</strong><small>Sat, Aug 15</small></div>
          <div className="match-hero-team"><span className="mini-crest harbor">H</span><strong>Harbor United</strong><small>2nd · 21 pts</small></div>
        </div>
        <div className="match-hero-meta"><span>Onzio Community Stadium</span><span>Matchday 12</span></div>
      </article>
      <div className="status-strip">
        <span className="status-chip"><span className="status-dot" />Site live</span>
        <span className="status-chip"><Icon name="users" />24 players rostered</span>
        <span className="status-chip"><Icon name="check" />3 updates ready</span>
      </div>
      <div className="dashboard-grid">
        <article className="preview-card tasks-card">
          <div className="card-title-row"><div><small>Ready to publish</small><h4>Club updates</h4></div><span className="task-count">3</span></div>
          <ul><li><span><Icon name="check" /></span><div><strong>Summer tryout details</strong><small>Homepage</small></div></li><li><span><Icon name="check" /></span><div><strong>New sponsor logo</strong><small>Sponsors</small></div></li><li><span><Icon name="check" /></span><div><strong>August fixtures</strong><small>Schedule</small></div></li></ul>
        </article>
        <article className="preview-card result-card">
          <div className="card-title-row"><div><small>Last result</small><h4>Premier Division</h4></div><span className="tag green-tag">FINAL</span></div>
          <div className="result-score"><div><span className="mini-crest onzio">O</span><small>ONZIO</small></div><strong>3 <i>—</i> 1</strong><div><span className="mini-crest harbor">W</span><small>WESTSIDE</small></div></div>
        </article>
      </div>
    </div>
  );
}

function WebsitePanel() {
  return (
    <div className="product-panel-content">
      <div className="panel-heading"><div><p>Website</p><h3>Keep the public site current.</h3></div><span className="mock-button">View live site ↗</span></div>
      <div className="website-grid">
        <article className="preview-card page-list-card">
          <div className="card-title-row"><div><small>Pages</small><h4>Website content</h4></div><div className="publish-status"><span className="live-pill"><span className="status-dot" />Live</span><small>Updated 2h ago</small></div></div>
          <div className="page-list"><div className="selected"><Icon name="home" /><span><strong>Homepage</strong><small>Updated today</small></span><b>›</b></div><div><Icon name="trophy" /><span><strong>Programs</strong><small>3 active programs</small></span><b>›</b></div><div><Icon name="users" /><span><strong>About the club</strong><small>Club history and staff</small></span><b>›</b></div><div><Icon name="image" /><span><strong>Sponsors</strong><small>8 partners</small></span><b>›</b></div></div>
        </article>
        <article className="site-editor-card">
          <div className="site-preview-top"><span /><span /><span /><div>onzio-demo.club</div></div>
          <div className="site-preview-hero"><span className="site-preview-kicker">ONZIO DEMO CLUB</span><h4>One club.<br/>One community.</h4><p>Soccer built with purpose.</p><span className="site-preview-button">Explore the club</span></div>
          <div className="site-preview-sections">{["Programs", "Roster", "Sponsors", "Contact"].map((section) => <div key={section}><span className="section-thumb"><i /><i /><i /></span><small>{section}</small></div>)}</div>
          <div className="site-preview-bottom"><div><small>NEXT MATCH</small><strong>Saturday · 7:00 PM</strong></div><div className="site-score"><span>ONZ</span><b>VS</b><span>HBR</span></div></div>
        </article>
      </div>
    </div>
  );
}

const formLastFive = ["W", "W", "L", "W", "W"];

const FormPills = () => (
  <div className="form-pills">{formLastFive.map((result, index) => <span key={index} className={`form-pill ${result === "W" ? "win" : result === "D" ? "draw" : "loss"}`}>{result}</span>)}</div>
);

function CompetitionPanel() {
  const standings = [
    ["1", "Onzio Demo Club", "8", "0", "3", "24"],
    ["2", "Harbor United", "6", "3", "2", "21"],
    ["3", "Central Valley", "5", "3", "3", "18"],
    ["4", "Westside Athletic", "5", "1", "5", "16"],
  ];
  const players = [
    ["01", "Mateo Cruz", "Goalkeeper"],
    ["04", "Elias Romero", "Defender"],
    ["08", "Noah Bennett", "Midfielder"],
    ["11", "Julian Torres", "Forward"],
  ];
  return (
    <div className="product-panel-content">
      <div className="panel-heading"><div><p>Competition</p><h3>The season at a glance.</h3></div><span className="mock-button">Add fixture <span>+</span></span></div>
      <div className="competition-grid">
        <article className="preview-card standings-card">
          <div className="card-title-row"><div><small>League table</small><h4>Premier Division</h4></div><span className="tag green-tag">MATCHDAY 11</span></div>
          <div className="form-strip"><small>Onzio · Last 5</small><FormPills /></div>
          <div className="standings-table">
            <div className="standings-header"><span>#</span><span>Club</span><span>W</span><span>D</span><span>L</span><span>Pts</span></div>
            {standings.map(([position, club, wins, draws, losses, points]) => <div className={position === "1" ? "standings-row leader" : "standings-row"} key={position}><b>{position}</b><span>{club}</span><i>{wins}</i><i>{draws}</i><i>{losses}</i><strong>{points}</strong></div>)}
          </div>
        </article>
        <div className="competition-side">
          <article className="preview-card result-card"><div className="card-title-row"><div><small>Last result</small><h4>Premier Division</h4></div><span className="tag green-tag">FINAL</span></div><div className="result-score"><div><span className="mini-crest onzio">O</span><small>ONZIO</small></div><strong>3 <i>—</i> 1</strong><div><span className="mini-crest harbor">W</span><small>WESTSIDE</small></div></div></article>
          <article className="preview-card roster-card">
            <div className="card-title-row"><div><small>First team</small><h4>Active roster</h4></div><span className="tag">24 PLAYERS</span></div>
            <div className="roster-list">{players.map(([number, name, position]) => <div className="roster-line" key={number}><b>{number}</b><i>{name}</i><span>{position}</span></div>)}</div>
          </article>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div className="product-panel-content">
      <div className="panel-heading"><div><p>Analytics · 2026 season</p><h3>Performance you can understand.</h3></div><span className="mock-button">All competitions⌄</span></div>
      <div className="analytics-stats">
        <article><div className="stat-top"><Icon name="ball" /><small>Matches played</small></div><strong>11</strong><span>8 wins</span></article>
        <article><div className="stat-top"><Icon name="goal" /><small>Goals scored</small></div><strong>26</strong><span>2.4 per match</span></article>
        <article><div className="stat-top"><Icon name="shield" /><small>Clean sheets</small></div><strong>5</strong><span>45% of matches</span></article>
        <article><div className="stat-top"><Icon name="trophy" /><small>Points</small></div><strong>24</strong><span>1st in division</span></article>
      </div>
      <div className="analytics-grid">
        <article className="preview-card chart-card"><div className="card-title-row"><div><small>Team form</small><h4>Goals by match</h4></div><div className="chart-legend"><span>Goals for</span><span>Goals against</span></div></div><div className="chart-form"><small>Last 5</small><FormPills /></div><div className="chart-area"><div className="chart-y"><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div><div className="chart-bars">{[[3,1],[2,0],[4,2],[1,1],[3,0],[2,1]].map(([gf,ga],i) => <div className="bar-group" key={i}><div className="bar goal-for" style={{height:`${gf*22}%`}}/><div className="bar goal-against" style={{height:`${Math.max(ga*22,5)}%`}}/><small>M{i+6}</small></div>)}</div></div></article>
        <article className="preview-card leader-card"><div className="card-title-row"><div><small>Player leaders</small><h4>Top performers</h4></div></div><div className="leader-player"><span className="leader-rank">1</span><div><strong>Julian Torres</strong><small>Forward</small></div><b>9 goals</b></div><div className="leader-player"><span className="leader-rank">2</span><div><strong>Noah Bennett</strong><small>Midfielder</small></div><b>7 assists</b></div><div className="leader-player"><span className="leader-rank">3</span><div><strong>Mateo Cruz</strong><small>Goalkeeper</small></div><b>5 clean sheets</b></div></article>
      </div>
    </div>
  );
}

const panels: Record<TabId, React.ReactNode> = {
  dashboard: <DashboardPanel />,
  website: <WebsitePanel />,
  competition: <CompetitionPanel />,
  analytics: <AnalyticsPanel />,
};

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
      <div className="product-tabs" role="tablist" aria-label="Onzio platform areas">
        {tabs.map((tab, index) => (
          <button
            id={`product-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`product-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            className={active === tab.id ? "active" : ""}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            key={tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="product-stage">
        <div className="sample-data-label"><span /> Sample club data</div>
        <div id={`product-panel-${active}`} role="tabpanel" aria-labelledby={`product-tab-${active}`} className="product-panel" key={active}>
          <AppChrome active={active}>{panels[active]}</AppChrome>
        </div>
      </div>
    </div>
  );
}
