"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { CentralIcon } from "@/components/icons/central/icon";
import { AnalyticsDemo, SeasonDemo, StaffDemo, WebsiteDemo } from "@/components/stageshow/staff-demos";
import styles from "./staff-tools.module.css";

// `ms` is how long the tour stays on a tool: the demo plays, then its result
// holds long enough to read before the next tool opens.
const tools = [
  { id: "website", title: "Update your website", subtitle: "Publish without a developer.", copy: "Keep your homepage, programs, tryouts, sponsors, and club details current.", ms: 8000 },
  { id: "competition", title: "Run the season", subtitle: "Keep every match in order.", copy: "Manage rosters, schedules, results, standings, and season stats together.", ms: 10000 },
  { id: "staff", title: "Bring your staff together", subtitle: "Give the right people access.", copy: "Invite approved club staff to a workspace separate from the public site.", ms: 10000 },
  { id: "analytics", title: "Understand the season", subtitle: "See how your club is progressing.", copy: "Review match and player performance in one clear view.", ms: 9500 },
] as const;

type ToolId = (typeof tools)[number]["id"];

const demos = { website: WebsiteDemo, competition: SeasonDemo, staff: StaffDemo, analytics: AnalyticsDemo };

const descriptions: Record<ToolId, string> = {
  website: "Illustration: in Rose City FC's admin, a staff member publishes the Tryouts page, and it goes live on the club website.",
  competition: "Illustration: a staff member enters a 3-1 result, and Rose City FC moves to the top of the standings.",
  staff: "Illustration: in Team Access, a club administrator invites a coach by email, and they join the list as invited.",
  analytics: "Illustration: a player's goal contributions per match, read back match by match. Names and numbers are made up.",
};

/** The tour only runs where it can't move the page: a wide layout, motion allowed. */
function useTourAllowed() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 721px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setAllowed(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return allowed;
}

function Preview({ active, labelId, run, onReplay, tour }: {
  active: ToolId;
  labelId: string;
  run: number;
  onReplay: () => void;
  tour?: { playing: boolean; toggle: () => void };
}) {
  const Demo = demos[active];
  return <div className={styles.preview}>
    <div className={styles.stage} role="region" aria-labelledby={labelId}>
      <div className={styles.demo} key={`${active}-${run}`} role="img" aria-label={descriptions[active]}><Demo /></div>
    </div>
    <div className={styles.controls}>
      <div className={styles["control-buttons"]}>
        <button type="button" className={styles.control} data-replay onClick={onReplay}>Replay</button>
        {tour ? <button type="button" className={styles.control} onClick={tour.toggle} aria-pressed={!tour.playing}>
          <CentralIcon name={tour.playing ? "pause" : "play"} width={14} height={14} aria-hidden="true" />
          {tour.playing ? "Pause tour" : "Play tour"}
        </button> : null}
      </div>
    </div>
  </div>;
}

export function StaffTools() {
  const [active, setActive] = useState<ToolId>("website");
  // Bumped to replay the open demo from the start (and restart its progress).
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const allowed = useTourAllowed();
  const layout = useRef<HTMLDivElement>(null);
  const id = useId();
  const touring = allowed && playing && inView;

  // Out of view (or in a hidden tab) the demo stops; coming back starts the
  // tool over, so the progress bar and the demo never drift apart.
  useEffect(() => {
    const el = layout.current!;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (!entry.isIntersecting) setRun(r => r + 1);
    }, { threshold: 0.35 });
    observer.observe(el);
    const onVisibility = () => { if (document.hidden) setRun(r => r + 1); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  const choose = (tool: ToolId) => {
    // Picking a tool takes over from the tour.
    setPlaying(false);
    if (tool === active) setRun(r => r + 1);
    setActive(tool);
  };
  const advance = () => {
    const next = tools[(tools.findIndex(tool => tool.id === active) + 1) % tools.length]!;
    setActive(next.id);
  };
  const replay = () => setRun(r => r + 1);
  const toggleTour = () => {
    if (!playing) setRun(r => r + 1);
    setPlaying(p => !p);
  };

  return <section className={styles.section} id="staff-tools" aria-labelledby={`${id}-title`}>
    <div className="shell">
    <header className={styles["section-head"]}>
      <h2 id={`${id}-title`}>The tools your staff<br />will actually use.</h2>
      <p>The everyday work behind a great club.<br />All in one place. Easy to keep moving.</p>
    </header>
    <div className={styles["tool-layout"]} ref={layout}>
      <div className={styles["tool-index"]}>{tools.map(tool => {
        const expanded = active === tool.id;
        const labelId = `${id}-${tool.id}-button`;
        return <article className={styles["tool-entry"]} data-open={expanded || undefined} key={tool.id}>
          <h3><button className={styles["tool-trigger"]} type="button" id={labelId} aria-expanded={expanded} aria-controls={`${id}-${tool.id}-detail`} onClick={() => choose(tool.id)}>
            <span className={styles.tile}><CentralIcon name={tool.id} className={styles.icon} /></span>
            <span className={styles["trigger-text"]}>
              <span className={styles["trigger-title"]}>{tool.title}</span>
              <span className={styles["trigger-sub"]}>{tool.subtitle}</span>
            </span>
            <CentralIcon className={styles.toggle} name={expanded ? "minus" : "plus"} width={20} height={20} aria-hidden="true" />
          </button></h3>
          <div id={`${id}-${tool.id}-detail`} className={styles["tool-detail"]} hidden={!expanded}>
            <p className={styles["tool-copy"]}>{tool.copy}</p>
            {expanded ? <div className={styles["mobile-preview"]}><Preview active={active} labelId={labelId} run={run} onReplay={replay} /></div> : null}
          </div>
          {expanded && touring ? <span
            className={styles.progress}
            key={run}
            style={{ "--tour-ms": `${tool.ms}ms` } as CSSProperties}
            onAnimationEnd={advance}
            aria-hidden="true"
          /> : null}
        </article>;
      })}</div>
      <div className={styles["desktop-preview"]}>
        <Preview active={active} labelId={`${id}-${active}-button`} run={run} onReplay={replay} tour={allowed ? { playing, toggle: toggleTour } : undefined} />
      </div>
    </div>
    <footer className={styles["section-foot"]}><span>Built for the work behind the club.</span></footer>
    </div>
  </section>;
}
