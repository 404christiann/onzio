"use client";

import { KeyboardEvent, useEffect, useState } from "react";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "website", label: "Website" },
  { id: "competition", label: "Competition" },
  { id: "analytics", label: "Analytics" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Icon = ({
  name,
  className,
  strokeWidth = 1.7,
}: {
  name: "home" | "globe" | "trophy" | "chart" | "users" | "calendar" | "image" | "settings" | "check" | "ball" | "goal" | "shield";
  className?: string;
  strokeWidth?: number;
}) => {
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
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      className={className}
    >
      {paths[name]}
    </svg>
  );
};

/* Shared mock-UI class strings */
const card = "min-w-0 rounded-xl bg-white shadow-[0_0_0_1px_#e0e6e1,0_1px_2px_rgba(16,35,26,0.04)]";
const cardTitleRow = "flex items-start justify-between gap-4 px-[18px] pb-3.5 pt-[17px]";
const cardKicker = "mb-[3px] block text-[8px] font-semibold uppercase tracking-[0.08em] text-[#8b978f]";
const cardTitle = "text-[13px] font-semibold tracking-[-0.02em]";
const tagAmber = "inline-flex min-h-[22px] items-center rounded-full bg-[#faf1dc] px-2 text-[7px] font-extrabold tracking-[0.07em] text-[#906e23]";
const tagGreen = "inline-flex min-h-[22px] items-center rounded-full bg-[#e7f6ec] px-2 text-[7px] font-extrabold tracking-[0.07em] text-green-hover";
const panelContent = "px-3.5 pb-[22px] pt-[22px] sm:px-5 sm:pb-[26px] sm:pt-6 lg:px-[30px] lg:pb-8 lg:pt-7";
const panelHeading = "mb-5 flex items-start justify-between gap-6 sm:mb-[25px] sm:items-center";
const panelKicker = "mb-[5px] text-[10px] font-semibold text-[#829087]";
const panelTitle = "text-[22px] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[clamp(20px,2.2vw,28px)]";
const mockButton = "hidden min-h-9 items-center rounded-lg bg-white px-[13px] text-[10px] font-semibold text-[#46534b] shadow-[0_0_0_1px_#dbe2dc,0_5px_14px_rgba(25,43,30,0.05)] sm:inline-flex";
const statusChip = "inline-flex min-h-[26px] items-center gap-1.5 rounded-full bg-white px-[11px] text-[8px] font-semibold tabular-nums text-[#57645b] shadow-[0_0_0_1px_#e0e6e1]";
const miniCrest = "grid flex-none place-items-center rounded-full font-display font-extrabold text-white shadow-[inset_0_0_0_3px_rgba(255,255,255,0.28)]";
const demoMark = "grid size-[34px] flex-none place-items-center rounded-[10px] bg-green font-display text-xl font-extrabold text-white";

function AppChrome({ children, active }: { children: React.ReactNode; active: TabId }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "home" as const },
    { id: "website", label: "Website", icon: "globe" as const },
    { id: "competition", label: "Competition", icon: "trophy" as const },
    { id: "analytics", label: "Analytics", icon: "chart" as const },
  ];

  return (
    <div className="grid min-h-[675px] overflow-hidden rounded-[18px] bg-[#f4f6f4] text-ink shadow-[0_0_0_1px_rgba(5,22,12,0.14),0_28px_65px_rgba(0,0,0,0.22)] sm:min-h-[610px] md:grid-cols-[188px_minmax(0,1fr)] lg:grid-cols-[208px_minmax(0,1fr)]">
      <aside className="hidden flex-col bg-[#10231a] px-3.5 pb-3.5 pt-5 text-[#c7d4cb] md:flex" aria-hidden="true">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-1.5 pb-5">
          <span className={demoMark}>O</span>
          <div className="min-w-0">
            <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-white">Onzio Demo Club</strong>
            <small className="mt-0.5 block whitespace-nowrap text-[9px] text-[#71897a]">Club admin</small>
          </div>
        </div>
        <div className="mt-[18px] grid gap-1">
          {nav.map((item) => (
            <div
              className={`flex min-h-[39px] items-center gap-2.5 rounded-lg px-2.5 text-[11px] font-medium ${item.id === active ? "bg-green/20 text-white" : ""}`}
              key={item.id}
            >
              <Icon name={item.icon} className="size-4" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex min-h-[39px] items-center gap-2.5 px-2.5 text-[11px] font-medium text-[#82968a]">
          <Icon name="settings" className="size-4" />
          <span>Club settings</span>
        </div>
      </aside>
      <div className="min-w-0 bg-[#f4f6f4]">
        <div className="flex h-[58px] items-center justify-end gap-[18px] border-b border-[#e0e6e1] bg-white/90 px-[18px] sm:px-6 md:h-[67px]" aria-hidden="true">
          <span className={`${demoMark} mr-auto md:hidden`}>O</span>
          <div className="hidden w-[min(230px,30%)] rounded-lg bg-[#f7f8f7] px-[13px] py-[9px] text-[10px] text-[#9aa69e] shadow-[0_0_0_1px_#dfe5e0] md:block">Search the club</div>
          <div className="flex items-center gap-2">
            <span className="grid size-[29px] place-items-center rounded-full bg-green-soft text-[9px] font-extrabold text-green-dark">CA</span>
            <div className="hidden sm:block">
              <strong className="block text-[10px]">Christian A.</strong>
              <small className="mt-px block text-[8px] text-[#8a968e]">Owner</small>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function DashboardPanel() {
  return (
    <div className={panelContent}>
      <div className={panelHeading}>
        <div>
          <p className={panelKicker}>Monday, August 10</p>
          <h3 className={panelTitle}>Good morning, Christian.</h3>
        </div>
        <span className={mockButton}>Quick publish <span className="ml-1.5 text-[15px] text-green">+</span></span>
      </div>
      <article className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 px-[18px] pb-[13px] pt-3.5">
          <small className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#8b978f]">Next match · Premier Division</small>
          <div className="flex items-center gap-1.5">
            <span className={tagAmber}>HOME</span>
            <span className="inline-flex min-h-[22px] items-center rounded-full bg-[#e7f6ec] px-[9px] text-[8px] font-bold tabular-nums text-green-hover">In 5 days</span>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 border-t border-[#edf0ed] px-3 pb-[21px] pt-[17px] sm:gap-[18px] sm:px-[30px] sm:pt-[19px]">
          <div className="flex flex-col items-center gap-[7px] text-center">
            <span className={`${miniCrest} size-11 bg-green-dark text-xl`}>O</span>
            <strong className="text-[10px] tracking-[-0.01em] sm:text-[11px]">Onzio Demo Club</strong>
            <small className="text-[8px] tabular-nums text-[#8a968e]">1st · 24 pts</small>
          </div>
          <div className="grid justify-items-center gap-[3px]">
            <strong className="font-display text-[27px] leading-none tabular-nums tracking-[-0.01em] sm:text-3xl">7:00 PM</strong>
            <small className="text-[8px] font-semibold text-[#7a877e]">Sat, Aug 15</small>
          </div>
          <div className="flex flex-col items-center gap-[7px] text-center">
            <span className={`${miniCrest} size-11 bg-[#2c598b] text-xl`}>H</span>
            <strong className="text-[10px] tracking-[-0.01em] sm:text-[11px]">Harbor United</strong>
            <small className="text-[8px] tabular-nums text-[#8a968e]">2nd · 21 pts</small>
          </div>
        </div>
        <div className="flex items-center justify-between gap-[15px] border-t border-[#edf0ed] px-[18px] py-[11px] text-[8px] tabular-nums text-[#7a877e]">
          <span>Onzio Community Stadium</span>
          <span>Matchday 12</span>
        </div>
      </article>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={statusChip}><span className="size-[5px] rounded-full bg-green" />Site live</span>
        <span className={statusChip}><Icon name="users" className="size-[11px] text-green-hover" strokeWidth={2} />24 players rostered</span>
        <span className={statusChip}><Icon name="check" className="size-[11px] text-green-hover" strokeWidth={2} />3 updates ready</span>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr]">
        <article className={`${card} hidden sm:block`}>
          <div className={cardTitleRow}>
            <div><small className={cardKicker}>Ready to publish</small><h4 className={cardTitle}>Club updates</h4></div>
            <span className="grid size-6 place-items-center rounded-full bg-[#e7f6ec] text-[9px] font-extrabold tabular-nums text-green-hover">3</span>
          </div>
          <ul className="list-none px-[17px] pb-3.5">
            <li className="flex items-center gap-2.5 border-t border-[#edf0ed] py-[11px]"><span className="grid size-6 flex-none place-items-center rounded-[7px] bg-[#ecf8f0] text-green"><Icon name="check" className="size-[13px]" strokeWidth={2} /></span><div><strong className="block text-[9px]">Summer tryout details</strong><small className="mt-0.5 block text-[7px] text-[#929e96]">Homepage</small></div></li>
            <li className="flex items-center gap-2.5 border-t border-[#edf0ed] py-[11px]"><span className="grid size-6 flex-none place-items-center rounded-[7px] bg-[#ecf8f0] text-green"><Icon name="check" className="size-[13px]" strokeWidth={2} /></span><div><strong className="block text-[9px]">New sponsor logo</strong><small className="mt-0.5 block text-[7px] text-[#929e96]">Sponsors</small></div></li>
            <li className="flex items-center gap-2.5 border-t border-[#edf0ed] py-[11px]"><span className="grid size-6 flex-none place-items-center rounded-[7px] bg-[#ecf8f0] text-green"><Icon name="check" className="size-[13px]" strokeWidth={2} /></span><div><strong className="block text-[9px]">August fixtures</strong><small className="mt-0.5 block text-[7px] text-[#929e96]">Schedule</small></div></li>
          </ul>
        </article>
        <article className={card}>
          <div className={cardTitleRow}>
            <div><small className={cardKicker}>Last result</small><h4 className={cardTitle}>Premier Division</h4></div>
            <span className={tagGreen}>FINAL</span>
          </div>
          <ResultScore />
        </article>
      </div>
    </div>
  );
}

function ResultScore() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 border-t border-[#edf0ed] px-[18px] pb-[19px] pt-[15px] text-center">
      <div className="grid justify-items-center gap-[5px]"><span className={`${miniCrest} size-[37px] bg-green-dark text-[17px]`}>O</span><small className="text-[7px] font-bold text-[#737f77]">ONZIO</small></div>
      <strong className="flex items-center gap-2 font-display text-[25px] tabular-nums">3 <i className="text-[13px] font-normal not-italic text-[#a4aea7]">—</i> 1</strong>
      <div className="grid justify-items-center gap-[5px]"><span className={`${miniCrest} size-[37px] bg-[#2c598b] text-[17px]`}>W</span><small className="text-[7px] font-bold text-[#737f77]">WESTSIDE</small></div>
    </div>
  );
}

function WebsitePanel() {
  const pages = [
    { icon: "home" as const, title: "Homepage", note: "Updated today", selected: true },
    { icon: "trophy" as const, title: "Programs", note: "3 active programs", selected: false },
    { icon: "users" as const, title: "About the club", note: "Club history and staff", selected: false },
    { icon: "image" as const, title: "Sponsors", note: "8 partners", selected: false },
  ];
  return (
    <div className={panelContent}>
      <div className={panelHeading}>
        <div>
          <p className={panelKicker}>Website</p>
          <h3 className={panelTitle}>Keep the public site current.</h3>
        </div>
        <span className={mockButton}>View live site ↗</span>
      </div>
      <div className="grid gap-3.5 md:grid-cols-[0.72fr_1.28fr]">
        <article className={`${card} hidden sm:block`}>
          <div className={cardTitleRow}>
            <div><small className={cardKicker}>Pages</small><h4 className={cardTitle}>Website content</h4></div>
            <div className="grid justify-items-end gap-1">
              <span className="inline-flex min-h-5 items-center gap-[5px] rounded-full bg-[#e7f6ec] px-2 text-[7px] font-extrabold uppercase tracking-[0.07em] text-green-hover"><span className="size-1 rounded-full bg-green" />Live</span>
              <small className="whitespace-nowrap text-[7px] text-[#98a299]">Updated 2h ago</small>
            </div>
          </div>
          <div className="px-3 pb-3.5">
            {pages.map((page) => (
              <div className={`grid grid-cols-[27px_1fr_auto] items-center gap-2 rounded-lg p-2.5 ${page.selected ? "bg-[#ebf7ef] text-green-dark" : "text-[#5e6d63]"}`} key={page.title}>
                <Icon name={page.icon} className="size-[15px]" />
                <span><strong className="block text-[9px]">{page.title}</strong><small className="mt-0.5 block text-[7px] text-[#98a299]">{page.note}</small></span>
                <b className="text-sm font-normal text-[#9ca69f]">›</b>
              </div>
            ))}
          </div>
        </article>
        <article className="overflow-hidden rounded-xl bg-[#09130e] text-white shadow-[0_0_0_1px_#d9e0da]">
          <div className="flex h-[30px] items-center gap-1 bg-[#ebeeeb] px-2.5">
            <span className="size-[5px] rounded-full bg-[#bdc5bf]" /><span className="size-[5px] rounded-full bg-[#bdc5bf]" /><span className="size-[5px] rounded-full bg-[#bdc5bf]" />
            <div className="mx-auto w-[45%] rounded bg-white px-2 py-1 text-center text-[6px] text-[#919b93]">onzio-demo.club</div>
          </div>
          <div className="min-h-[185px] bg-[radial-gradient(circle_at_82%_20%,rgba(18,161,64,0.34),transparent_40%),linear-gradient(130deg,#07170e,#103523)] px-[25px] py-7 sm:min-h-[202px] sm:px-9 sm:py-8">
            <span className="text-[7px] font-extrabold tracking-[0.18em] text-[#7cda99]">ONZIO DEMO CLUB</span>
            <h4 className="mb-2 mt-2.5 font-display text-[31px] font-bold uppercase leading-[0.88] tracking-[-0.02em] sm:text-[34px]">One club.<br/>One community.</h4>
            <p className="mb-[18px] text-[8px] text-[#a7bbae]">Soccer built with purpose.</p>
            <span className="inline-flex rounded-[5px] bg-[#64d886] px-2.5 py-[7px] text-[7px] font-extrabold text-[#092315]">Explore the club</span>
          </div>
          <div className="grid grid-cols-4 gap-[7px] border-t border-[#e6eae6] bg-white px-[11px] pb-2.5 pt-[11px] text-ink sm:gap-[9px] sm:px-3.5 sm:pb-[11px] sm:pt-3">
            {["Programs", "Roster", "Sponsors", "Contact"].map((section) => (
              <div className="grid min-w-0 gap-[5px]" key={section}>
                <span className="grid h-[34px] content-center gap-[3px] rounded-md bg-[#f4f6f4] px-2 shadow-[0_0_0_1px_#e4e9e5]">
                  <i className="h-[3px] w-[58%] rounded-[2px] bg-[#b9c6bc]" /><i className="h-[3px] w-[86%] rounded-[2px] bg-[#d6dfd8]" /><i className="h-[3px] w-[42%] rounded-[2px] bg-[#d6dfd8]" />
                </span>
                <small className="overflow-hidden text-ellipsis whitespace-nowrap text-[7px] font-semibold text-[#74816e]">{section}</small>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-5 bg-[#f7f8f7] px-5 py-[13px] text-ink">
            <div><small className="block text-[6px] font-extrabold tracking-[0.1em] text-[#829087]">NEXT MATCH</small><strong className="mt-[3px] block text-[9px]">Saturday · 7:00 PM</strong></div>
            <div className="flex items-center gap-[9px] font-display text-[11px] font-bold"><span>ONZ</span><b className="text-[7px] font-normal text-[#9ba49e]">VS</b><span>HBR</span></div>
          </div>
        </article>
      </div>
    </div>
  );
}

const formLastFive = ["W", "W", "L", "W", "W"];

const FormPills = () => (
  <div className="flex gap-1">
    {formLastFive.map((result, index) => (
      <span
        key={index}
        className={`grid size-[18px] place-items-center rounded-md text-[7px] font-extrabold ${result === "W" ? "bg-green text-white" : result === "D" ? "bg-[#e3e8e4] text-[#66756b]" : "bg-[#f7e5e2] text-[#b0574f]"}`}
      >
        {result}
      </span>
    ))}
  </div>
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
  const rowGrid = "grid grid-cols-[20px_1fr_20px_20px_20px_30px] items-center gap-1.5 px-1.5 sm:grid-cols-[24px_1fr_22px_22px_22px_32px]";
  return (
    <div className={panelContent}>
      <div className={panelHeading}>
        <div>
          <p className={panelKicker}>Competition</p>
          <h3 className={panelTitle}>The season at a glance.</h3>
        </div>
        <span className={mockButton}>Add fixture <span className="ml-1.5 text-[15px] text-green">+</span></span>
      </div>
      <div className="grid gap-3 md:grid-cols-[1.16fr_0.84fr]">
        <article className={card}>
          <div className={cardTitleRow}>
            <div><small className={cardKicker}>League table</small><h4 className={cardTitle}>Premier Division</h4></div>
            <span className={tagGreen}>MATCHDAY 11</span>
          </div>
          <div className="mx-[18px] mb-1.5 flex items-center justify-between gap-2.5 rounded-lg bg-[#f7f9f7] px-[11px] py-2 shadow-[0_0_0_1px_#e7ece8]">
            <small className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#7d8981]">Onzio · Last 5</small>
            <FormPills />
          </div>
          <div className="px-3 pb-3.5">
            <div className={`${rowGrid} py-2 text-[7px] font-bold uppercase tracking-[0.08em] text-[#9ba59e] [&>span:nth-child(n+3)]:text-center`}>
              <span>#</span><span>Club</span><span>W</span><span>D</span><span>L</span><span>Pts</span>
            </div>
            {standings.map(([position, club, wins, draws, losses, points], index) => {
              const leader = index === 0;
              return (
                <div
                  className={`${rowGrid} min-h-[42px] text-[9px] tabular-nums text-[#718078] ${leader ? "rounded-lg bg-[#eefaf2]" : index > 1 ? "border-t border-[#edf0ee]" : ""}`}
                  key={position}
                >
                  <b className={`text-center font-semibold ${leader ? "text-green-hover" : "text-[#9aa49d]"}`}>{position}</b>
                  <span className={`overflow-hidden text-ellipsis whitespace-nowrap font-semibold ${leader ? "text-green-hover" : "text-ink"}`}>{club}</span>
                  <i className="text-center not-italic">{wins}</i>
                  <i className="text-center not-italic">{draws}</i>
                  <i className="text-center not-italic">{losses}</i>
                  <strong className={`text-center text-[10px] ${leader ? "text-green-hover" : "text-ink"}`}>{points}</strong>
                </div>
              );
            })}
          </div>
        </article>
        <div className="grid content-start gap-3">
          <article className={card}>
            <div className={cardTitleRow}>
              <div><small className={cardKicker}>Last result</small><h4 className={cardTitle}>Premier Division</h4></div>
              <span className={tagGreen}>FINAL</span>
            </div>
            <ResultScore />
          </article>
          <article className={`${card} hidden sm:block`}>
            <div className={cardTitleRow}>
              <div><small className={cardKicker}>First team</small><h4 className={cardTitle}>Active roster</h4></div>
              <span className={tagAmber}>24 PLAYERS</span>
            </div>
            <div className="px-[17px] pb-[13px]">
              {players.map(([number, name, position]) => (
                <div className="grid min-h-10 grid-cols-[26px_1fr_auto] items-center gap-[9px] border-t border-[#edf0ee] text-[8px] text-[#718078]" key={number}>
                  <b className="grid size-6 place-items-center rounded-[7px] bg-[#eaf7ee] text-[8px] font-semibold tabular-nums text-green-hover">{number}</b>
                  <i className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold not-italic text-ink">{name}</i>
                  <span>{position}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function LiveStat({ base }: { base: number }) {
  const [value, setValue] = useState(base);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setValue((current) => (current === base ? base + 1 : base));
    }, 3200);
    return () => window.clearInterval(id);
  }, [base]);

  return <>{value}</>;
}

function AnalyticsPanel() {
  const chart: Array<[number, number]> = [[3, 1], [2, 0], [4, 2], [1, 1], [3, 0], [2, 1]];
  const leaders = [
    ["1", "Julian Torres", "Forward", "9 goals"],
    ["2", "Noah Bennett", "Midfielder", "7 assists"],
    ["3", "Mateo Cruz", "Goalkeeper", "5 clean sheets"],
  ];
  const statCard = "rounded-[11px] bg-white px-[15px] py-3.5 shadow-[0_0_0_1px_#e0e6e1]";
  const statValue = "mb-0.5 mt-[7px] block font-display text-[26px] leading-none tabular-nums";
  const statNote = "block text-[7px] font-semibold tabular-nums text-green-hover";
  const statLabel = "block text-[8px] text-[#849087]";
  return (
    <div className={panelContent}>
      <div className={panelHeading}>
        <div>
          <p className={panelKicker}>Analytics · 2026 season</p>
          <h3 className={panelTitle}>Performance you can understand.</h3>
        </div>
        <span className={mockButton}>All competitions⌄</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <article className={statCard}><div className="flex items-center gap-1.5"><Icon name="ball" className="size-[13px] text-green-hover" strokeWidth={1.8} /><small className={statLabel}>Matches played</small></div><strong className={statValue}>11</strong><span className={statNote}>8 wins</span></article>
        <article className={statCard}><div className="flex items-center gap-1.5"><Icon name="goal" className="size-[13px] text-green-hover" strokeWidth={1.8} /><small className={statLabel}>Goals scored</small></div><strong className={statValue}><LiveStat base={26} /></strong><span className={statNote}>2.4 per match</span></article>
        <article className={statCard}><div className="flex items-center gap-1.5"><Icon name="shield" className="size-[13px] text-green-hover" strokeWidth={1.8} /><small className={statLabel}>Clean sheets</small></div><strong className={statValue}>5</strong><span className={statNote}>45% of matches</span></article>
        <article className={statCard}><div className="flex items-center gap-1.5"><Icon name="trophy" className="size-[13px] text-green-hover" strokeWidth={1.8} /><small className={statLabel}>Points</small></div><strong className={statValue}>24</strong><span className={statNote}>1st in division</span></article>
      </div>
      <div className="mt-2.5 grid gap-2.5 md:grid-cols-[1.3fr_0.7fr]">
        <article className={card}>
          <div className={cardTitleRow}>
            <div><small className={cardKicker}>Team form</small><h4 className={cardTitle}>Goals by match</h4></div>
            <div className="flex gap-3 text-[7px] text-[#7d8981]">
              <span className="before:mr-1 before:inline-block before:size-1.5 before:rounded-[2px] before:bg-green before:content-['']">Goals for</span>
              <span className="before:mr-1 before:inline-block before:size-1.5 before:rounded-[2px] before:bg-[#cbd5cd] before:content-['']">Goals against</span>
            </div>
          </div>
          <div className="-mt-1 flex items-center gap-[9px] px-[18px] pb-3">
            <small className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#7d8981]">Last 5</small>
            <FormPills />
          </div>
          <div className="grid h-[200px] grid-cols-[18px_1fr] gap-2.5 px-4 pb-[18px] pt-[3px] sm:h-[185px] sm:pr-5">
            <div className="flex flex-col justify-between pb-[13px] text-right text-[7px] tabular-nums text-[#a0aaa3]"><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div>
            <div className="flex items-end justify-around gap-3 border-b border-[#dfe5e0] bg-[repeating-linear-gradient(to_top,transparent_0,transparent_calc(25%-1px),#edf0ed_25%)]">
              {chart.map(([goalsFor, goalsAgainst], index) => (
                <div className="relative flex h-full items-end gap-[3px] pb-px" key={index}>
                  <div className={`min-h-[5px] w-[9px] rounded-t-[3px] bg-green ${index === chart.length - 1 ? "origin-bottom animate-bar-pulse" : ""}`} style={{ height: `${goalsFor * 22}%` }} />
                  <div className="min-h-[5px] w-[9px] rounded-t-[3px] bg-[#cbd5cd]" style={{ height: `${Math.max(goalsAgainst * 22, 5)}%` }} />
                  <small className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[6px] tabular-nums text-[#9da79f]">M{index + 6}</small>
                </div>
              ))}
            </div>
          </div>
        </article>
        <article className={`${card} hidden pb-3 sm:block`}>
          <div className={cardTitleRow}>
            <div><small className={cardKicker}>Player leaders</small><h4 className={cardTitle}>Top performers</h4></div>
          </div>
          {leaders.map(([rank, name, position, stat]) => (
            <div className="mx-[15px] grid grid-cols-[30px_1fr_auto] items-center gap-2 border-t border-[#edf0ed] py-[11px]" key={rank}>
              <span className="grid size-[26px] place-items-center rounded-full bg-green text-[9px] font-extrabold tabular-nums text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]">{rank}</span>
              <div><strong className="block text-[8px]">{name}</strong><small className="mt-0.5 block text-[7px] text-[#929d95]">{position}</small></div>
              <b className="text-[7px] font-semibold tabular-nums text-[#526057]">{stat}</b>
            </div>
          ))}
        </article>
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
    <div className="-mx-[15px] sm:mx-0">
      <div
        className="mx-auto mb-5 flex w-fit max-w-[calc(100%-30px)] items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur [scrollbar-width:none] sm:mb-6 sm:max-w-full [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Onzio platform areas"
      >
        {tabs.map((tab, index) => (
          <button
            id={`product-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`product-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            className={`min-h-10 flex-none whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-[color,background-color,box-shadow,scale] duration-150 ease-out active:scale-[0.96] sm:min-h-11 sm:min-w-[130px] sm:px-[18px] ${active === tab.id ? "bg-white text-green-deep shadow-[0_8px_24px_rgba(0,0,0,0.18)]" : "text-[#a7bbae] hover:text-white"}`}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            key={tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative z-20 mb-0 rounded-[28px] border border-white/10 bg-white/[0.055] p-2.5 shadow-window sm:mb-[-100px] sm:p-4 md:mb-[-160px] md:p-6">
        <div className="flex items-center justify-end gap-[7px] px-2.5 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9db4a4] sm:pb-2.5 sm:pt-0">
          <span className="size-1.5 rounded-full bg-green shadow-[0_0_0_4px_rgba(18,161,64,0.16)]" /> Sample club data
        </div>
        <div id={`product-panel-${active}`} role="tabpanel" aria-labelledby={`product-tab-${active}`} className="animate-panel-in" key={active}>
          <AppChrome active={active}>{panels[active]}</AppChrome>
        </div>
      </div>
    </div>
  );
}
