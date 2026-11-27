"use client";

/* eslint-disable @next/next/no-img-element -- Captures inside a scaled stage; next/image's wrapper fights the transform. */
// Rose City FC's live site, toured page by page on one persistent stage: a
// browser window on wide screens, a phone on narrow ones. Each page enters,
// scrolls once, and names what staff edited. Captures of public pages only.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Phone } from "@/stageshow/kit/phone";
import "./stageshow/onzio-look.css";
import "./club-showcase.css";

type Shot = { src: string; h: number };
const PAGES: { id: string; label: string; path: string; caption: string; desktop: Shot[]; phone: Shot; end: { wide: number; compact: number } }[] = [
  {
    id: "home", label: "Home", path: "", caption: "Hero and next home match edited from the admin.",
    desktop: [{ src: "/images/rose-city/home-desktop-top.webp", h: 715 }, { src: "/images/rose-city/home-desktop-rest.webp", h: 2918 }],
    phone: { src: "/images/rose-city/home-phone.webp", h: 2286 }, end: { wide: 900, compact: 900 },
  },
  {
    id: "schedule", label: "Schedule", path: "/schedule", caption: "Schedule updated from the admin.",
    desktop: [{ src: "/images/rose-city/schedule-desktop.webp", h: 1470 }],
    phone: { src: "/images/rose-city/schedule-phone.webp", h: 1100 }, end: { wide: 560, compact: 520 },
  },
  {
    id: "roster", label: "Roster", path: "/roster", caption: "Players, numbers and photos managed from the admin.",
    desktop: [{ src: "/images/rose-city/roster-desktop.webp", h: 2300 }],
    phone: { src: "/images/rose-city/roster-phone.webp", h: 2200 }, end: { wide: 900, compact: 1000 },
  },
  {
    id: "news", label: "News", path: "/news", caption: "News and sponsor stories published from the admin.",
    desktop: [{ src: "/images/rose-city/news-desktop.webp", h: 1180 }],
    phone: { src: "/images/rose-city/news-phone.webp", h: 1000 }, end: { wide: 240, compact: 260 },
  },
];

type Layout = "wide" | "compact";
const SIZE: Record<Layout, { w: number; h: number }> = { wide: { w: 1120, h: 560 }, compact: { w: 380, h: 640 } };
const VIEW_W: Record<Layout, number> = { wide: 1120, compact: 393 };
/** The visible height of each viewport, so a page never scrolls past its own capture. */
const VIEW_H: Record<Layout, number> = { wide: 524, compact: 802 };
const COMPACT = "(max-width: 680px)";
const PAGE_MS = 5600;
const SCROLL_AT = 600;

export function ClubShowcase() {
  const fitRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>("wide");
  const [scale, setScale] = useState(0);
  const [still, setStill] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const flags = useRef({ inView: false, hover: false, focus: false, hidden: false, still: false, test: false });
  const timers = useRef<number[]>([]);
  const indexRef = useRef(0);
  // The next page is scheduled through a ref, so `show` never names itself.
  const showRef = useRef<(next: number, play: boolean) => void>(() => {});

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const canRun = () => { const f = flags.current; return f.inView && !f.hover && !f.focus && !f.hidden && !f.still && !f.test; };

  const show = useCallback((next: number, play: boolean) => {
    clear();
    indexRef.current = next;
    setIndex(next);
    setProgress(0);
    if (!play) return;
    timers.current.push(window.setTimeout(() => setProgress(1), SCROLL_AT));
    timers.current.push(window.setTimeout(() => { if (canRun()) showRef.current((next + 1) % PAGES.length, true); }, PAGE_MS));
  }, []);
  useEffect(() => { showRef.current = show; }, [show]);

  const reconcile = useCallback(() => {
    if (canRun() && !timers.current.length) show(indexRef.current, true);
    else if (!canRun()) clear();
  }, [show]);

  useLayoutEffect(() => {
    const fit = fitRef.current!;
    const media = matchMedia(COMPACT);
    const measure = () => {
      const next: Layout = media.matches ? "compact" : "wide";
      setLayout(next);
      setScale(fit.clientWidth / SIZE[next].w);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(fit);
    media.addEventListener("change", measure);
    return () => { observer.disconnect(); media.removeEventListener("change", measure); };
  }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => { flags.current.still = motion.matches; setStill(motion.matches); if (motion.matches) clear(); reconcile(); };
    applyMotion();
    motion.addEventListener("change", applyMotion);
    const observer = new IntersectionObserver(([entry]) => { flags.current.inView = entry.intersectionRatio >= 0.5; reconcile(); }, { threshold: [0, 0.5] });
    observer.observe(fitRef.current!);
    const visibility = () => { flags.current.hidden = document.hidden; reconcile(); };
    document.addEventListener("visibilitychange", visibility);
    // ?tour-test: no autoplay; tests call window.__showcase.seek(page, progress).
    if (new URLSearchParams(location.search).has("tour-test")) {
      flags.current.test = true;
      const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      (window as unknown as { __showcase: unknown }).__showcase = {
        pages: PAGES.length,
        async seek(page: number, at: number) { clear(); setSeeking(true); indexRef.current = page; setIndex(page); setProgress(at); await frame(); },
      };
    }
    return () => { motion.removeEventListener("change", applyMotion); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); clear(); };
  }, [reconcile]);

  const setFlag = (name: "hover" | "focus", value: boolean) => { flags.current[name] = value; reconcile(); };
  const select = (next: number) => { show(next, !flags.current.still && !flags.current.test); };

  const size = SIZE[layout];
  const page = PAGES[index];
  return (
    <section className="cs-section" id="club-sites" aria-labelledby="club-sites-title">
      <div className="shell">
        <header className="cs-header">
          <p className="cs-breadcrumb">Club sites</p>
          <h2 id="club-sites-title" className="cs-title">Rose City FC, a UPSL club in Pasadena, runs its site on Onzio.</h2>
          <p className="cs-description">Staff edit everything here from the same admin.</p>
        </header>

        {still ? (
          <ul className="cs-grid" aria-label="Pages on Rose City FC's site">
            {PAGES.map(item => (
              <li key={item.id} className="cs-grid-item">
                <div className="cs-grid-shot"><img src={(layout === "compact" ? item.phone : item.desktop[0]).src} alt={`Rose City FC ${item.label} page`} loading="lazy" decoding="async" /></div>
                <p><b>{item.label}</b> · {item.caption}</p>
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className="cs"
          hidden={still}
          onPointerEnter={event => { if (event.pointerType === "mouse") setFlag("hover", true); }}
          onPointerLeave={event => { if (event.pointerType === "mouse") setFlag("hover", false); }}
          onFocus={() => setFlag("focus", true)}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFlag("focus", false); }}
        >
          <div className="cs-fit onzio-look" ref={fitRef}>
            <div
              className="ss-stage cs-stage"
              data-layout={layout}
              data-seeking={seeking || undefined}
              role="img"
              aria-label={`Rose City FC's live site, ${page.label} page: ${page.caption}`}
              style={{ width: size.w, height: size.h, transform: `scale(${scale || 1})`, visibility: scale ? "visible" : "hidden" }}
            >
              {layout === "wide" ? (
                <div className="cs-window">
                  <div className="cs-bar" aria-hidden="true">
                    <span className="cs-dots"><i /><i /><i /></span>
                    <span className="cs-url">rosecityfutbolclub.com{page.path}</span>
                  </div>
                  <Viewport layout="wide" index={index} progress={progress} />
                </div>
              ) : (
                <div className="cs-phone"><Phone width={300} frame="pro"><Viewport layout="compact" index={index} progress={progress} /></Phone></div>
              )}
            </div>
          </div>
          <div className="cs-caption">{PAGES.map((item, i) => <p key={item.id} data-on={i === index || undefined} aria-hidden={i !== index}>{item.caption}</p>)}</div>
          <div className="cs-tabs" role="group" aria-label="Rose City FC pages">
            {PAGES.map((item, i) => (
              <button key={item.id} type="button" className="cs-tab" aria-pressed={i === index} onClick={() => select(i)}>{item.label}</button>
            ))}
          </div>
        </div>

        <p className="cs-visit"><a href="https://rosecityfutbolclub.com/" rel="noopener" target="_blank">Visit rosecityfutbolclub.com</a></p>
      </div>
    </section>
  );
}

function Viewport({ layout, index, progress }: { layout: Layout; index: number; progress: number }) {
  const k = VIEW_W[layout] / (layout === "wide" ? 1280 : 390);
  return (
    <div className="cs-viewport">
      {PAGES.map((item, i) => {
        const shots = layout === "wide" ? item.desktop : [item.phone];
        const total = shots.reduce((sum, shot) => sum + shot.h * k, 0);
        const end = Math.max(0, Math.min(item.end[layout] * k, total - VIEW_H[layout]));
        return (
          <div key={item.id} className="cs-page" data-on={i === index || undefined} aria-hidden={i !== index}>
            <div className="cs-scroll" style={{ transform: `translateY(${-(i === index ? progress : 0) * end}px)` } as CSSProperties}>
              {shots.map(shot => <img key={shot.src} src={shot.src} width={VIEW_W[layout]} height={Math.round(shot.h * k)} alt="" loading="lazy" decoding="async" />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
