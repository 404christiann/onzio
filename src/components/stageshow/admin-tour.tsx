"use client";

// One persistent stage, four chapters. The stage never remounts: a chapter
// change resets the scene's state and the screens cross-fade. State changes
// only at beats; every tween is a CSS transition on transform or opacity.
// Autoplay starts once the stage is mostly in view and pauses while the
// pointer is over it, while anything in it has focus, off screen and in a
// hidden tab. A chapter tab plays that chapter even while paused, then holds.
// With reduced motion there is no autoplay: each tab shows its chapter's still.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Phone } from "@/stageshow/kit/phone";
import { AdminIcon } from "./admin-icons";
import { AdminWindow, SiteScreen, type Layout } from "./admin-screens";
import { beatsFor, CHAPTERS, initialState, posterState, type TourState } from "./tour-script";
import "./onzio-look.css";
import "./admin-tour.css";

const SIZE: Record<Layout, { w: number; h: number; phone: number }> = {
  wide: { w: 1120, h: 640, phone: 280 },
  compact: { w: 380, h: 720, phone: 300 },
};
const COMPACT = "(max-width: 680px)";
const REST: Record<Layout, { x: number; y: number }> = { wide: { x: 640, y: 560 }, compact: { x: 300, y: 640 } };

type Cursor = { x: number; y: number; duration: number; presses: number };

export function AdminTour() {
  const fitRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>("wide");
  const [scale, setScale] = useState(0);
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);
  const [s, setS] = useState<TourState>(() => initialState(0));
  const [cursor, setCursor] = useState<Cursor>({ ...REST.wide, duration: 0, presses: 0 });
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(0);

  // Playback lives in refs so timers never read a stale render.
  const flags = useRef({ started: false, inView: false, hover: false, focus: false, hidden: false, manual: false, still: false });
  const clock = useRef({ chapter: 0, elapsed: 0, startedAt: 0, timers: [] as number[] });
  const layoutRef = useRef<Layout>("wide");
  const scaleRef = useRef(1);

  const place = useCallback((target: string, fx: number, fy: number) => {
    const stage = stageRef.current;
    const el = stage?.querySelector<HTMLElement>(`[data-target="${target}"]`);
    if (!stage || !el) return REST[layoutRef.current];
    const a = stage.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const k = scaleRef.current || 1;
    return { x: (b.left - a.left) / k + (b.width / k) * fx, y: (b.top - a.top) / k + (b.height / k) * fy };
  }, []);

  const stop = useCallback(() => {
    const c = clock.current;
    c.timers.forEach(clearTimeout);
    if (c.timers.length) c.elapsed += performance.now() - c.startedAt;
    c.timers = [];
    setRunning(false);
  }, []);

  const shouldRun = () => {
    const f = flags.current;
    return f.started && f.inView && !f.hidden && !f.still && (f.manual || (!f.hover && !f.focus));
  };

  const goChapter = useCallback((next: number) => {
    const c = clock.current;
    c.timers.forEach(clearTimeout);
    c.timers = [];
    c.chapter = next;
    c.elapsed = 0;
    setRunning(false);
    setCycle(n => n + 1);
    setS(flags.current.still ? posterState(next) : initialState(next));
    setCursor(cur => ({ ...REST[layoutRef.current], duration: 0, presses: cur.presses }));
  }, []);

  // `run` and `reconcile` call each other through refs to stay stable.
  const reconcileRef = useRef<() => void>(() => {});
  const run = useCallback(() => {
    const c = clock.current;
    if (c.timers.length) return;
    c.startedAt = performance.now();
    const from = c.elapsed;
    for (const beat of beatsFor(c.chapter)) {
      if (beat.at < from) continue;
      c.timers.push(window.setTimeout(() => {
        const { action } = beat;
        if (action.kind === "set") setS(prev => ({ ...prev, ...action.patch }));
        else if (action.kind === "move") {
          const to = place(action.target, action.fx ?? 0.5, action.fy ?? 0.5);
          setCursor(cur => ({ ...cur, ...to, duration: action.duration }));
        } else if (action.kind === "press") setCursor(cur => ({ ...cur, presses: cur.presses + 1 }));
        else {
          c.timers = [];
          const f = flags.current;
          if (f.manual && (f.hover || f.focus)) { f.manual = false; setRunning(false); return; }
          f.manual = false;
          goChapter((c.chapter + 1) % CHAPTERS.length);
          reconcileRef.current();
        }
      }, beat.at - from));
    }
    setRunning(true);
  }, [goChapter, place]);

  const reconcile = useCallback(() => {
    const busy = clock.current.timers.length > 0;
    if (shouldRun() && !busy) run();
    else if (!shouldRun() && busy) stop();
  }, [run, stop]);
  useEffect(() => { reconcileRef.current = reconcile; }, [reconcile]);

  // Layout and scale, measured before paint. The box's height comes from CSS
  // (aspect-ratio per breakpoint), so measuring never moves the page.
  useLayoutEffect(() => {
    const fit = fitRef.current!;
    const media = matchMedia(COMPACT);
    const measure = () => {
      const next: Layout = media.matches ? "compact" : "wide";
      if (next !== layoutRef.current) {
        layoutRef.current = next;
        setLayout(next);
        setCursor(cur => ({ ...REST[next], duration: 0, presses: cur.presses }));
      }
      const k = fit.clientWidth / SIZE[next].w;
      scaleRef.current = k;
      setScale(k);
    };
    measure();
    // Transitions switch on a frame after the first layout is painted.
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => setReady(true)); });
    const observer = new ResizeObserver(measure);
    observer.observe(fit);
    media.addEventListener("change", measure);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); media.removeEventListener("change", measure); };
  }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => {
      flags.current.still = motion.matches;
      setStill(motion.matches);
      if (motion.matches) { stop(); setS(posterState(clock.current.chapter)); }
      else reconcileRef.current();
    };
    applyMotion();
    motion.addEventListener("change", applyMotion);

    const fit = fitRef.current!;
    const observer = new IntersectionObserver(([entry]) => {
      flags.current.inView = entry.intersectionRatio >= 0.25;
      if (entry.intersectionRatio >= 0.6) flags.current.started = true;
      reconcileRef.current();
    }, { threshold: [0, 0.25, 0.6] });
    observer.observe(fit);

    const visibility = () => { flags.current.hidden = document.hidden; reconcileRef.current(); };
    document.addEventListener("visibilitychange", visibility);
    const timers = clock.current;
    return () => {
      motion.removeEventListener("change", applyMotion);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      timers.timers.forEach(clearTimeout);
    };
  }, [stop]);

  const select = (index: number) => {
    flags.current.started = true;
    if (flags.current.still) { clock.current.chapter = index; setS(posterState(index)); return; }
    flags.current.manual = true;
    goChapter(index);
    reconcileRef.current();
  };

  const setFlag = (name: "hover" | "focus", value: boolean) => { flags.current[name] = value; reconcile(); };

  const size = SIZE[layout];
  const chapter = CHAPTERS[s.chapter];
  return (
    <div
      className="at"
      onPointerEnter={event => { if (event.pointerType === "mouse") setFlag("hover", true); }}
      onPointerLeave={event => { if (event.pointerType === "mouse") setFlag("hover", false); }}
      onFocus={() => setFlag("focus", true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFlag("focus", false); }}
    >
      <div className="at-fit onzio-look" ref={fitRef}>
        <div
          ref={stageRef}
          className="ss-stage at-stage"
          data-layout={layout}
          data-view={s.view}
          data-still={still || undefined}
          data-ready={ready || undefined}
          role="img"
          aria-label={`Illustration: Rose City FC's Onzio admin next to its public website. ${chapter.label}. Names and numbers are made up.`}
          style={{ width: size.w, height: size.h, transform: `scale(${scale || 1})`, visibility: scale ? "visible" : "hidden" }}
        >
          <div className="at-admin"><AdminWindow s={s} layout={layout} still={still} /></div>
          <div className="at-phone">
            <Phone width={size.phone} frame="pro"><SiteScreen s={s} /></Phone>
          </div>
          <TourCursor cursor={cursor} shown={s.cursorShown && !still} />
        </div>
      </div>

      <div className="at-tabs" role="group" aria-label="Admin tour chapters">
        {CHAPTERS.map((item, index) => (
          <button key={item.id} type="button" className="at-tab" aria-pressed={index === s.chapter} onClick={() => select(index)}>
            <AdminIcon name={item.icon} size={18} />
            <span>{item.label}</span>
            {index === s.chapter && !still ? (
              <span key={cycle} className="at-progress" data-running={running || undefined} style={{ "--d": `${item.duration}ms` } as CSSProperties} aria-hidden="true" />
            ) : null}
          </button>
        ))}
      </div>
      <p className="at-note">Rose City FC&apos;s public site. Names, emails and numbers in the admin are made up for illustration.</p>
    </div>
  );
}

const ARROW = "M9.9292 21.3826C10.2862 22.2551 11.5417 22.1943 11.8126 21.2913L13.8452 14.5157C13.9418 14.1938 14.1937 13.9418 14.5157 13.8453L21.2913 11.8126C22.1943 11.5417 22.2551 10.2862 21.3825 9.92922L4.20705 2.90287C3.38638 2.56714 2.56714 3.38638 2.90287 4.20705L9.9292 21.3826Z";

/** icons.download's cursor-simple. X and Y ease on different curves, so a straight move bows like a hand's. */
function TourCursor({ cursor, shown }: { cursor: Cursor; shown: boolean }) {
  const d = `${cursor.duration}ms`;
  return (
    <div className="cur-x" data-shown={shown || undefined} style={{ transform: `translateX(${cursor.x}px)`, transitionDuration: d }} aria-hidden="true">
      <div className="cur-y" style={{ transform: `translateY(${cursor.y}px)`, transitionDuration: d }}>
        {cursor.presses ? <span key={cursor.presses} className="cur-ripple" /> : null}
        <svg key={`p${cursor.presses}`} className="cur-arrow" data-pressed={cursor.presses > 0 || undefined} width="26" height="26" viewBox="0 0 24 24">
          <path d={ARROW} fill="#101317" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" paintOrder="stroke" />
        </svg>
      </div>
    </div>
  );
}
